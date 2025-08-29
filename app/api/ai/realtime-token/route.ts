import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/user';
import { getRealtimeToken } from '@/actions/ai/openai';
import { getActiveCoachingSession, getCourseUserProfile, getUserLearningProfile } from '@/actions/ai/actions';
import { generateCoachSystemPrompt, generatePersonalizedExamplesBasedOnProfile } from '@/lib/prompts/tom-prompt';
import { toStringId } from '@/lib/utils';
import { CoachingSession } from '@/models/ai-coach';
import { toolRegistry } from '@/lib/ai/ToolRegistry';
import { getAllMemoryByUserId } from '@/actions/memory-retrival';
import Course from '@/models/Course';
// import { openai } from '@/actions/ai/analysis';
import { DEFAULT_MODEL } from '@/lib/constants';
import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        // Verify user is authenticated
        const currentUser = await getCurrentUser().catch(() => null);

        if (!currentUser) {
            return NextResponse.json(
                { success: false, error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Parse request body to get context needed for instructions
        const body = await req.json();
        console.log("request to create new openAI token:", body);

        const { chapterId, courseId, chapterTitle, chapterContent } = body;

        if (!chapterId || !courseId) {
            return NextResponse.json(
                { success: false, error: 'Missing required parameters' },
                { status: 400 }
            );
        }

        // Get user profiles for personalization
        const [userLearningProfileResult, courseUserProfileResult] = await Promise.all([
            getUserLearningProfile(currentUser._id.toString()),
            getCourseUserProfile(courseId, currentUser._id.toString())
        ]);
        let { memories } = await getAllMemoryByUserId(currentUser._id.toString())

        let course = await Course.findOne({ _id: courseId }).lean();
        if (!course) {
            throw new Error('Course not found');
        }
        // sort recent memoris at the start 
        memories = memories.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

        let lastSession = await CoachingSession.find().where({ userId: currentUser._id }).lean().sort({ _id: -1 }).limit(1)
        let timeSinceLastSession: number | undefined = undefined;
        let lastConversationTail: any[] | undefined = undefined;
        if (lastSession.length > 0) {
            timeSinceLastSession = Math.round((new Date().getTime() - lastSession[0].startTime.getTime()) / 1000);
            lastConversationTail = lastSession[0].messages.slice(-4).map(m => ({ role: m.role, content: m.content }))
            // only take last 10 messages from the last conversation
            if (lastConversationTail.length > 10) {
                let offset = lastConversationTail.length - 10
                lastConversationTail = lastConversationTail.slice(offset)
            }
        }
        // Generate the system prompt securely on the server
        const systemInstructions = generateCoachSystemPrompt({
            user: currentUser as any,
            chapterTitle,
            chapterContent,
            userLearningProfile: userLearningProfileResult.profile || {},
            userCourseProfile: courseUserProfileResult.profile || {},
            timeSinceLastSession,
            lastConversationTail,
            memories: memories.slice(0, 10),
            previousChapters: course.chapters.map(ch => ch.title),
            nextChapters: course.chapters.map(ch => ch.title)
        });
        let personalizedPrompt = await getPersonalizedPrompt(userLearningProfileResult.profile?.summary || '', memories.map(m => m.memory), chapterContent);
        console.log(personalizedPrompt);

        let tools = [
            toolRegistry.getTool('GENERATE_QUIZ')?.getDefinition(),
            toolRegistry.getTool('GENERATE_NOTES')?.getDefinition(),
            toolRegistry.getTool('MEMORY_SEARCH')?.getDefinition(),
            toolRegistry.getTool('NEXT_CHAPTER')?.getDefinition()
        ]
        console.log("Tools:", tools);
        // Get a token from the OpenAI API with pre-configured system instructions
        const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-4o-realtime-preview",
                voice: "coral",
                instructions: `${systemInstructions}
# [Critical]: Always Use Personalization:
# Use similar analogies to the student's interests to help them learn the concepts in the chapter.
These are some example created specifically for the user:
you can use them or create your own similar to this
${personalizedPrompt}
                `, // Include the system instructions here
                "modalities": ["audio", "text"],
                input_audio_transcription: {
                    model: "gpt-4o-transcribe",
                },
                temperature: 0.8,
                "turn_detection": {
                    "type": "server_vad",
                    "threshold": 0.5,
                    "prefix_padding_ms": 300,
                    "silence_duration_ms": 500,
                    "create_response": true
                },
                tools: tools
            }),
        });


        const data = await response.json();
        console.log("Session created:", data);
        const coachingSessionId = await getActiveCoachingSession(courseId, chapterId, toStringId(currentUser.id));
        // Return the token data without exposing the system instructions
        return NextResponse.json({
            success: true,
            client_secret: data.client_secret,
            message: 'Token generated successfully',
            sessionId: data.id || crypto.randomUUID(),
            coachingSessionId: toStringId(coachingSessionId.session._id)
        });
    } catch (error: any) {
        console.error('Error generating OpenAI token:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to generate token' },
            { status: 500 }
        );
    }
}


async function getPersonalizedPrompt(profile: string, memories: string[], chapter: string) {
    let promptGenerator = generatePersonalizedExamplesBasedOnProfile(profile, memories, chapter);
    const response = await openai.chat.completions.create({
        model: DEFAULT_MODEL,
        messages: [{ role: 'system', content: promptGenerator },
        {
            role: 'user',
            content: `
            write a personalized prompt for the user, only write the prompt and nothing else youe entire response will be treated as prompt
            structure the prompt into instructions and examples in markdown format.
            Dig deep into the interests for example: if the student has a tv show that he likes, use try to use the characters of the show as analogies for the concepts in the chapter.

            `
        }
        ],
        temperature: 0.6, // Lower temperature for more consistent analysis
        max_tokens: 8048,
        // response_format: { type: "json_object" }
    });
    const subPrompt = response.choices[0]?.message?.content || '';
    return subPrompt;
}