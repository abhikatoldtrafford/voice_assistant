import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/user';
import { getRealtimeToken } from '@/actions/ai/openai';
import { getActiveCoachingSession, getCourseUserProfile, getUserLearningProfile } from '@/actions/ai/actions';
import { generateCoachSystemPrompt } from '@/lib/prompts/tom-prompt';
import { toStringId } from '@/lib/utils';
import { CoachingSession, UserMemory } from '@/models/ai-coach';
import { toolRegistry } from '@/lib/ai/ToolRegistry';
import { getAllMemoryByUserId } from '@/actions/memory-retrival';
import { generateOnboardingSystemPrompt } from '@/lib/prompts/onboarding-prompt';
import { getActiveOnBoardingSession } from '@/actions/ai/onboarding';

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

        // Generate the system prompt securely on the server
        const systemInstructions = generateOnboardingSystemPrompt();
        let tool = toolRegistry.getTool("END_SESSION")?.getDefinition();
        console.log("Tools:", [tool]);
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
                instructions: `${systemInstructions}`, // Include the system instructions here
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
                tools: [tool]
            }),
        });


        const data = await response.json();
        console.log("Session created:", data);
        const { success, session } = await getActiveOnBoardingSession(toStringId(currentUser.id));
        // Return the token data without exposing the system instructions
        return NextResponse.json({
            success: true,
            client_secret: data.client_secret,
            message: 'Token generated successfully',
            sessionId: data.id || crypto.randomUUID(),
            onboardingSessionId: session?.id ? toStringId(session?.id) : undefined
        });
    } catch (error: any) {
        console.error('Error generating OpenAI token:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to generate token' },
            { status: 500 }
        );
    }
}