'use server'

import { toolRegistry } from '@/lib/ai/ToolRegistry';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


export async function getRealtimeToken() {
    try {
        const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-4o-realtime-preview-2024-12-17",
                voice: "sage", // You can change to "shimmer", "nova", "echo", "fable", or "onyx" 
                input_audio_transcription: {
                    "model": "gpt-4o-transcribe"
                },
            }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error getting realtime token:', error);
        throw error;
    }
}