'use server'

import OpenAI from 'openai';
import { getCurrentUser, getUserById } from '@/actions/user';
import {
    addInsightToSession,
    addMessageToSession,
    getActiveCoachingSession,
    completeCoachingSession,
    getUserLearningProfile,
    getCourseUserProfile,
    updateCourseProfileFromAnalysis
} from './actions';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { generateCoachSystemPrompt } from '@/lib/prompts/coach-prompt';
import UserProfile, { IUserProfileData } from '@/models/UserProfile';
import connectToDatabase from '@/lib/mongodb';
import { CoachingSession, SessionAnalysisReport } from '@/models/ai-coach';
import Course from '@/models/Course';
import { updateUserProfileFromAnalysis } from './actions'
import { performLLMAnalysis } from './analysis';
import { addMemory } from '../memory-retrival';
import { DEFAULT_MODEL } from '@/lib/constants';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Context size limits for different OpenAI models
const MODEL_CONTEXT_LIMITS = {
    'gpt-4-0125-preview': 128000,
    'gpt-4-turbo-preview': 128000,
    'gpt-4': 8192,
    'gpt-3.5-turbo': 16385
};

// Default model to use

/**
 * AI Coach Agent - Converses with the student and gathers insights
 */
export async function coachAgent({
    userId,
    courseId,
    chapterId,
    chapterTitle,
    chapterContent,
    userMessage,
    conversationHistory,
    userName
}: {
    userId: string;
    courseId: string;
    chapterId: string;
    chapterTitle: string;
    chapterContent: string;
    userMessage: string;
    conversationHistory: { role: string; content: string }[];
    userName: string;
}) {
    try {
        // Get or create active coaching session and fetch profiles in parallel
        const [sessionResult, userLearningProfile, userCourseProfile] = await Promise.all([
            getActiveCoachingSession(courseId, chapterId, userId),
            getUserLearningProfile(userId),
            getCourseUserProfile(courseId, userId)
        ]);

        if (!sessionResult.success) {
            throw new Error(sessionResult.error || 'Failed to get coaching session');
        }

        const sessionId = sessionResult.session._id;

        let userProfile = await UserProfile.findById(userId);

        // Add user message to session
        await addMessageToSession(sessionId, 'user', userMessage, userId);

        // Generate the system prompt with all context information
        const systemPrompt = generateCoachSystemPrompt({
            user: userProfile?.toJSON({ flattenObjectIds: true }) as any as IUserProfileData,
            chapterTitle,
            chapterContent,
            userLearningProfile: userLearningProfile.profile,
            userCourseProfile: userCourseProfile.profile
        });

        // Prepare messages for the LLM with a reasonable history limit
        const messages: ChatCompletionMessageParam[] = [
            { role: 'system', content: systemPrompt },
            ...conversationHistory.slice(-10) as ChatCompletionMessageParam[],
            { role: 'user', content: userMessage }
        ];

        // Generate coach response
        const response = await openai.chat.completions.create({
            model: DEFAULT_MODEL,
            messages: messages,
            temperature: 0.7,
            max_tokens: 4096,
        });

        const assistantMessage = response.choices[0]?.message?.content ||
            "I'm sorry, I couldn't generate a response right now.";

        // Add assistant message to session
        await addMessageToSession(sessionId, 'assistant', assistantMessage, userId);

        // Silently capture insights in the background (don't await)
        captureKeyInsights({
            sessionId,
            userMessage,
            assistantMessage,
            conversationHistory,
            userId,
            courseContent: chapterContent
        }).catch(console.error);

        return {
            success: true,
            reply: assistantMessage,
            sessionId
        };
    } catch (error: any) {
        console.error('Error in coachAgent:', error);
        return {
            success: false,
            error: error.message,
        };
    }
}

/**
 * Session Analysis Agent - Runs after session is completed
 * Analyzes the entire session to generate insights
 */
export async function analyzeCoachingSession(sessionId: string, userId?: string) {
    try {
        await connectToDatabase();

        let user;
        if (userId) {
            user = await UserProfile.findById(userId);
        } else {
            user = await getCurrentUser();
        }

        if (!user) {
            return { success: false, error: 'User not found' };
        }

        const userIdObj = user._id;

        // Find the session and verify ownership
        const session = await CoachingSession.findOne({
            _id: sessionId,
            userId: userIdObj
        }).lean();

        if (!session) {
            return { success: false, error: 'Session not found or access denied' };
        }

        if (session.status !== 'completed') {
            return { success: false, error: 'Session must be completed before analysis' };
        }

        // Check if an analysis already exists
        const existingAnalysis = await SessionAnalysisReport.findOne({ sessionId });

        if (existingAnalysis) {
            return { success: false, error: 'Analysis already exists for this session' };
        }

        // Get course information for context
        const course = await Course.findById(session.courseId).lean();

        if (!course) {
            return { success: false, error: 'Associated course not found' };
        }

        // Get course chapter for additional context
        const chapter = course.chapters.find(ch => ch._id.toString() === session.chapterId.toString());

        if (!chapter) {
            return { success: false, error: 'Associated chapter not found' };
        }

        // Get user's learning profile and course profile
        const [userLearningProfileResult, courseUserProfileResult] = await Promise.all([
            getUserLearningProfile(userIdObj.toString()),
            getCourseUserProfile(session.courseId.toString(), userIdObj.toString())
        ]);

        // Prepare the session data for analysis
        const analysisData = {
            session,
            course: {
                title: course.title,
                description: course.description,
                level: course.level
            },
            chapter: {
                title: chapter.title,
                content: chapter.content?.substring(0, 1000) || '' // Limit content size
            },
            userLearningProfile: userLearningProfileResult.success ? userLearningProfileResult.profile : null,
            courseUserProfile: courseUserProfileResult.success ? courseUserProfileResult.profile : null,
            user: {
                name: user.name
            }
        };

        // Analyze the session using the LLM
        const analysisResult = await performLLMAnalysis(analysisData);

        if (!analysisResult.success) {
            return { success: false, error: analysisResult.error || 'Failed to analyze session' };
        }

        // Create the analysis report in the database
        const analysis = await SessionAnalysisReport.create({
            sessionId: session._id,
            userId: session.userId,
            courseId: session.courseId,
            analysisDate: new Date(),
            ...analysisResult.analysis
        });

        // Update the session status
        await CoachingSession.findByIdAndUpdate(
            sessionId,
            { status: 'analyzed' }
        );

        // Update the user learning profile with insights
        await updateUserProfileFromAnalysis(session.userId.toString(), analysis);

        // Update the course user profile with insights
        await updateCourseProfileFromAnalysis(session.userId.toString(), session.courseId.toString(), analysis);

        return {
            success: true,
            analysis: analysis.toJSON({ flattenObjectIds: true }),
            message: 'Session analyzed successfully'
        };
    } catch (error: any) {
        console.error('Error analyzing coaching session:', error);
        return { success: false, error: error.message };
    }
}


/**
 * Captures meaningful insights from student-coach interactions
 * Optimized to only process and store significant insights
 */
export async function captureKeyInsights(options: {
    sessionId: string,
    userMessage: string,
    assistantMessage?: string,
    courseContent: string,
    conversationHistory: { role: string; content: string }[],
    userId: string
}) {
    try {
        const { sessionId, userMessage, assistantMessage, courseContent, conversationHistory, userId } = options;

        let user;
        if (userId) {
            user = await UserProfile.findById(userId);
        } else {
            user = await getCurrentUser();
        }
        // Quick pre-filter: Only analyze if message is substantive
        if (userMessage.length < 15 ||
            userMessage.toLowerCase().match(/^(yes|no|ok|thanks|thank you|i see|got it)$/)) {
            return; // Skip processing for very short or acknowledgment messages
        }

        // Rate limiting - check if we've captured insights recently (within last 3 turns)
        const recentInsightCapture = conversationHistory
            .slice(-6)
            .some(msg =>
                msg.role === 'system' &&
                msg.content.includes('INSIGHT_CAPTURED')
            );

        // if (recentInsightCapture && userMessage.length < 50) {
        //     // Skip frequent captures unless the user message is substantial
        //     return;
        // }

        // Fetch existing student profile with stored insights and personal data
        const userLearningProfile = await getUserLearningProfile(userId);

        // Fetch any existing insights from the session to avoid duplicates
        // Note: You'd need to implement a function to get session insights
        // const existingInsights = await getSessionInsights(sessionId);

        // Prepare the insight extraction prompt
        const insightPrompt = `
# INSIGHT EXTRACTION ANALYSIS

You are analyzing a learning conversation to identify ONLY NEW valuable insights about the student's learning process.
Extract ONLY significant, non-obvious insights that would be useful for personalizing future instruction AND are not already captured in existing data.

## CONTENT CONTEXT
The conversation is about the following course content:

\`\`\`
${courseContent.substring(0, 500)}... [truncated]
\`\`\`

## EXISTING PERSONAL DATA
The system already knows the following about the student:

\`\`\`json
${JSON.stringify(userLearningProfile.profile?.summary || 'Not available yet', null, 2)}
\`\`\`

## RECENT CONVERSATION

---
${conversationHistory.slice(-4).map(m =>
            `${m.role === 'user' ? 'STUDENT' : 'COACH'}: ${m.content.substring(0, 200)}${m.content.length > 200 ? '...' : ''}`
        ).join('\n\n')}

---
## CURRENT EXCHANGE
---
STUDENT: ${userMessage}

COACH: ${assistantMessage ? assistantMessage.substring(0, 200) : ""}${assistantMessage ? assistantMessage.length > 200 ? '...' : '' : ''}
---
## INSIGHT CATEGORIES

1. LEARNING INSIGHTS (about course material):
   - "understanding": Clear evidence student has mastered a specific concept
   - "confusion": Clear evidence student is struggling with a specific concept
   - "question": Student asks a substantive, thoughtful question about content
   - "learning_style": Clear revelation about how the student prefers to learn
   - "challenge": Specific obstacle the student is facing in their learning process

2. PERSONAL DATA (only if NOT already captured):
   - "personal_data": Information that could help personalize teaching or can be used to build rapport
   

## DEFINiTION OF PERSONAL DATA:
    - Anything personal and important to the student in his/her personal life
    - meaningful to the student's personal life
    - Examples: career goals, academic background, interests, families, hobbies, etc.


## REDUNDANCY CHECK: Before finalizing any insight, compare it against ALL existing data and ensure:

1. The specific concept is not already documented in existing data
2. The specific insight provides genuinely new information
3. The insight is not merely a rephrasing of existing knowledge
4. For personal_data, ensure the information is not already captured in the existing personal data

## EVALUATION CRITERIA
- Only extract truly meaningful insights that would help improve coaching
- For personal data, only capture information that's:
  * Not already in the existing personal data (check carefully)
  * Specific enough to be useful for creating relevant examples
  * Has Importance to the student's personal life

- DO NOT capture generic or obvious information
- DO NOT capture the same information multiple times
- DO NOT capture information that is semantically equivalent to existing data, even if phrased differently

Return your analysis in JSON format:

\`\`\`json
{
  "insightType": "one of the categories above or 'none'",
  "concept": "specific concept if applicable (blank for personal_data)",
  "insight": "brief, specific description of the insight",
  "significance": 1-10, // Importance level of the insight to the student
  "confidence": "high/medium/low" 
}
\`\`\`

If there is no meaningful NEW insight to extract, you MUST return:
\`\`\`json
{
  "insightType": "none",
  "concept": "",
  "insight": "",
  "significance": 5,
  "confidence": "high"
}
\`\`\`
`;

        // Call OpenAI for insight extraction
        const response = await openai.chat.completions.create({
            model: DEFAULT_MODEL,
            messages: [{ role: 'system', content: insightPrompt }],
            temperature: 0.1, // Lower temperature for more consistent judgments
            max_tokens: 300,
            response_format: { type: "json_object" }
        });

        const insightText = response.choices[0]?.message?.content || '';

        try {
            const insight = JSON.parse(insightText);

            // Only store non-empty insights with sufficient confidence
            if (insight.insightType !== 'none' &&
                insight.insight &&
                insight.confidence !== 'low') {

                console.log(`Capturing ${insight.insightType} insight with ${insight.confidence} confidence: ${insight.insight}`);

                if (insight.insightType === 'personal_data') {
                    // Add personal data to user profile
                    await addMemory(
                        userId,
                        insight.insight,
                        ['ai-coach', insight.concept], // Tags
                        ['personal'], // Context type
                        insight.significance, // Importance level
                        userMessage
                    );
                    // await addMemory(userId, insight.insight);
                } else {
                    // Add learning insight to the session
                    await addInsightToSession(
                        sessionId,
                        insight.insightType,
                        `Concept: ${insight.concept || 'N/A'} - ${insight.insight}`,
                        userId
                    );
                    await addMemory(
                        userId,
                        insight.insight,
                        ['ai-coach', insight.concept], // Tags
                        ['academic'], // Context type
                        insight.significance, // Importance level
                        userMessage
                    );
                }

                // Add a marker in the conversation history that we captured an insight
                // This could be used for rate limiting later
                conversationHistory.push({
                    role: 'system',
                    content: `INSIGHT_CAPTURED: ${insight.insightType}`
                });
            } else {
                console.log("No significant insight to capture in this exchange");
            }
        } catch (parseError) {
            console.error('Error parsing insight JSON:', parseError);
        }
    } catch (error) {
        console.error('Error capturing insights:', error);
        // Don't re-throw, this is a background process
    }
}

/**
 * API handler for sending a message to the AI coach
 */
export async function sendMessageToCoach({
    chapterId,
    userId,
    courseId,
    message,
    conversationHistory,
    chapterTitle,
    chapterContent
}: {
    chapterId: string;
    userId: string;
    courseId: string;
    message: string;
    conversationHistory: { role: string; content: string }[];
    chapterTitle: string;
    chapterContent: string;
}) {
    try {
        // If user is not provided, get current user
        let actualUserId = userId;
        if (!userId) {
            const user = await getCurrentUser();
            actualUserId = user._id.toString();
        }

        // Get user name for personalization
        const userResult = await getUserById(actualUserId);
        const userName = userResult ? userResult.name : "Student";

        // Get chapter title/content if not provided
        return await coachAgent({
            userId: actualUserId,
            courseId,
            chapterId,
            chapterTitle,
            chapterContent,
            userMessage: message,
            conversationHistory,
            userName
        });
    } catch (error: any) {
        console.error('Error sending message to coach:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Generate chapter key points using AI
 */
export async function generateChapterKeypoints(chapterContent: string) {
    try {
        const prompt = `
      Analyze this chapter content and identify 3-5 key concepts or points that are most important for a student to understand.
      the content is in rich text html format, but student will only the rendered content so dont mention that to the student
      For each key point, provide:
      1. A concise title (2-5 words)
      2. A brief explanation (1-2 sentences)
      
      Format your response as JSON:
      {keyPoints:[
        {
          "id": "1",
          "title": "Key Point Title",
          "description": "Brief explanation of the concept",
          "isHighlighted": false
        },
        ...
    ]}
      
      Chapter content:
      ${chapterContent.slice(0, 4000)}
    `;

        const response = await openai.chat.completions.create({
            model: DEFAULT_MODEL,
            messages: [{ role: 'system', content: prompt }],
            temperature: 0.3,
            max_tokens: 1000,
            response_format: { type: "json_object" }
        });

        const keypointsText = response.choices[0]?.message?.content || '[]';

        try {
            const keypoints = JSON.parse(keypointsText);
            return keypoints as { keyPoints: { id: string; title: string; description: string; isHighlighted: boolean }[] };
        } catch (parseError) {
            console.error('Error parsing keypoints JSON:', parseError);
            return { keyPoints: [] };
        }
    } catch (error) {
        console.error('Error generating keypoints:', error);
        return { keyPoints: [] };
    }
}

/**
 * Complete a coaching session and trigger analysis
 */
export async function finishCoachingSession(sessionId: string, userId: string) {
    try {
        const result = await completeCoachingSession(sessionId, userId);

        if (result.success) {
            // Trigger analysis in the background
            analyzeCoachingSession(sessionId, userId).catch(console.error);
        }

        return result;
    } catch (error: any) {
        console.error('Error finishing coaching session:', error);
        return {
            success: false,
            error: error.message
        };
    }
}