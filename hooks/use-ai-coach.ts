'use client';

import { useState, useEffect } from 'react';

interface UseAICoachOptions {
    initialMinimized?: boolean;
    autoShowDelay?: number | null; // In milliseconds, null for no auto-show
    localStorageKey?: string;
}

/**
 * Custom hook for managing the AI Coach state
 */
export function useAICoach({
    initialMinimized = true,
    autoShowDelay = 30000, // Default to showing after 30 seconds
    localStorageKey = 'ai_coach_minimized'
}: UseAICoachOptions = {}) {
    // Initialize state from localStorage if available, otherwise use the initialMinimized prop
    const [minimized, setMinimized] = useState<boolean>(() => {

        return initialMinimized;
    });
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(localStorageKey);
            setMinimized(saved !== null ? JSON.parse(saved) : initialMinimized);
        }

    }, []);
    // Auto-show the coach after the specified delay
    useEffect(() => {
        if (autoShowDelay === null || !minimized) return;

        const timer = setTimeout(() => {
            setMinimized(false);
        }, autoShowDelay);

        return () => clearTimeout(timer);
    }, [minimized, autoShowDelay]);

    // Persist minimized state to localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(localStorageKey, JSON.stringify(minimized));
        }
    }, [minimized, localStorageKey]);

    // Toggle minimized state
    const toggleMinimized = () => setMinimized(prev => !prev);

    // Show the coach
    const showCoach = () => setMinimized(false);

    // Hide the coach
    const hideCoach = () => setMinimized(true);

    return {
        minimized,
        toggleMinimized,
        showCoach,
        hideCoach
    };
}