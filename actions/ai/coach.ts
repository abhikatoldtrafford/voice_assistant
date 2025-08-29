'use server'

import {
    sendMessageToCoach as sendMessage,
    generateChapterKeypoints as generateKeypoints,
    finishCoachingSession
} from './agent';
import {
    getCoachingSessionById,
    getCourseUserProfile,
    getUserLearningProfile
} from './actions';
import { getLiveCourseById } from '../course';
import openai from 'openai';
import { getCurrentUser } from '../user';
import { findSimilarMemories } from '../memory-retrival';

/**
 * Send a message to the AI coach
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
    return await sendMessage({
        chapterId,
        userId,
        courseId,
        message,
        conversationHistory,
        chapterTitle,
        chapterContent
    });
}


/**
 * Generate chapter key points using AI
 */
export async function generateChapterKeypoints(chapterId: string, courseId: string, userId: string) {
    try {
        // Fetch the actual chapter content from the database
        const courseResult = await getLiveCourseById(courseId);
        if (!courseResult.success) {
            throw new Error('Failed to fetch course content');
        }
        if (!courseResult.course) {
            throw new Error('Course not found');
        }
        let chapter = courseResult.course.chapters.find(ch => ch._id.toString() === chapterId);
        if (!chapter) {
            throw new Error('Chapter not found');
        }

        const chapterContent = chapter.content || '';

        let { keyPoints } = await generateKeypoints(chapterContent);
        return keyPoints;
    } catch (error) {
        console.error('Error generating keypoints:', error);
        return [];
    }
}

/**
 * Get personalized learning suggestions for the student
 */
export async function getStudentSuggestions(chapterId: string, userId: string, courseId: string) {
    try {
        // Get the user's learning profile
        const userProfileResult = await getUserLearningProfile(userId);

        // Get the course-specific profile
        const courseProfileResult = await getCourseUserProfile(courseId, userId);

        // Use these profiles to generate personalized suggestions
        // In a real implementation, this would be more sophisticated

        // For now, return mock suggestions
        return {
            success: true,
            suggestions: [
                "Focus on understanding the core concepts before moving to advanced topics",
                "Try explaining these concepts to someone else to reinforce your understanding",
                "Make connections between this material and topics you're already familiar with"
            ]
        };
    } catch (error: any) {
        console.error('Error getting student suggestions:', error);
        return {
            success: false,
            error: error.message,
            suggestions: []
        };
    }
}

/**
 * End a coaching session and trigger analysis
 */
export async function endCoachingSession(sessionId: string, userId: string) {
    return await finishCoachingSession(sessionId, userId);
}
