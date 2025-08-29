'use server'

import { ObjectId, Types } from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import UserProfile from '@/models/UserProfile';
import Course from '@/models/Course';
import {
    UserLearningProfile,
    CourseUserProfile,
    CoachingSession,
    SessionAnalysisReport,
    FeedbackTracking,
    IUserLearningProfile,
    ICourseUserProfile,
    ICoachingSession,
    ISessionAnalysisReport,
    IFeedbackTracking
} from '@/models/ai-coach';
import { getCurrentUser } from '@/actions/user';
import { toStringId } from '@/lib/utils';
import { performLLMAnalysis } from './analysis';

// --------------------------------
// User Learning Profile Actions
// --------------------------------

/**
 * Get or create a user learning profile
 */
export async function getUserLearningProfile(userId?: string) {
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

        // Find or create the learning profile
        let profile = await UserLearningProfile.findOne<IUserLearningProfile>({ userId: userIdObj });

        if (!profile) {
            profile = await UserLearningProfile.create({
                userId: userIdObj,
                generalStrengths: [],
                generalWeaknesses: [],
                preferredTopics: [],
                avoidedTopics: [],
                learningPatterns: {
                    preferredTime: 'any',
                    averageSessionDuration: 0,
                    responseRate: 0,
                    engagementLevel: 'medium'
                },
                analyticalAbility: 5,
                criticalThinking: 5,
                problemSolving: 5,
                lastUpdated: new Date()
            });
        }

        return { success: true, profile: profile.toJSON({ flattenObjectIds: true }) as IUserLearningProfile };
    } catch (error: any) {
        console.error('Error getting user learning profile:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Update a user learning profile
 */
export async function updateUserLearningProfile(profileData: Partial<IUserLearningProfile>, userId?: string) {
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

        // Find the profile
        let profile = await UserLearningProfile.findOne({ userId: userIdObj });

        if (!profile) {
            return { success: false, error: 'Learning profile not found' };
        }

        // Update fields
        Object.assign(profile, {
            ...profileData,
            lastUpdated: new Date()
        });

        await profile.save();

        return { success: true, profile: serializeUserLearningProfile(profile) };
    } catch (error: any) {
        console.error('Error updating user learning profile:', error);
        return { success: false, error: error.message };
    }
}

// --------------------------------
// Course User Profile Actions
// --------------------------------

/**
 * Get or create a course user profile
 */
export async function getCourseUserProfile(courseId: string, userId?: string) {
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

        // Validate course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return { success: false, error: 'Course not found' };
        }

        // Find or create the course profile
        let profile = await CourseUserProfile.findOne<ICourseUserProfile>({
            userId: userIdObj,
            courseId: courseId
        });

        if (!profile) {
            profile = await CourseUserProfile.create({
                userId: userIdObj,
                courseId: courseId,
                strengths: [],
                weaknesses: [],
                misunderstoodConcepts: [],
                masteredConcepts: [],
                comprehensionLevel: 5,
                engagementLevel: 5,
                lastUpdated: new Date()
            });
        }

        return { success: true, profile: profile.toJSON({ flattenObjectIds: true }) as ICourseUserProfile };
    } catch (error: any) {
        console.error('Error getting course user profile:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Update a course user profile
 */
export async function updateCourseUserProfile(
    courseId: string,
    profileData: Partial<ICourseUserProfile>,
    userId?: string
) {
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

        // Find the profile
        let profile = await CourseUserProfile.findOne({
            userId: userIdObj,
            courseId: courseId
        });

        if (!profile) {
            return { success: false, error: 'Course profile not found' };
        }

        // Update fields
        Object.assign(profile, {
            ...profileData,
            lastUpdated: new Date()
        });

        await profile.save();

        return { success: true, profile: serializeCourseUserProfile(profile) };
    } catch (error: any) {
        console.error('Error updating course user profile:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Add a concept to understood or misunderstood list
 */
export async function updateConceptUnderstanding(
    courseId: string,
    conceptName: string,
    understood: boolean,
    level: number,
    notes: string = '',
    userId?: string
) {
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

        // Find the profile
        let profile = await CourseUserProfile.findOne({
            userId: userIdObj,
            courseId: courseId
        });

        if (!profile) {
            return { success: false, error: 'Course profile not found' };
        }

        if (understood) {
            // Add to masteredConcepts or update if exists
            const existingIndex = profile.masteredConcepts.findIndex(
                c => c.conceptName === conceptName
            );

            const conceptObj = {
                conceptName,
                masteryLevel: level,
                notes
            };

            if (existingIndex >= 0) {
                profile.masteredConcepts[existingIndex] = conceptObj;
            } else {
                profile.masteredConcepts.push(conceptObj);
            }

            // Remove from misunderstood if present
            profile.misunderstoodConcepts = profile.misunderstoodConcepts.filter(
                c => c.conceptName !== conceptName
            );
        } else {
            // Add to misunderstoodConcepts or update if exists
            const existingIndex = profile.misunderstoodConcepts.findIndex(
                c => c.conceptName === conceptName
            );

            const conceptObj = {
                conceptName,
                severity: level,
                notes
            };

            if (existingIndex >= 0) {
                profile.misunderstoodConcepts[existingIndex] = conceptObj;
            } else {
                profile.misunderstoodConcepts.push(conceptObj);
            }

            // Remove from mastered if present
            profile.masteredConcepts = profile.masteredConcepts.filter(
                c => c.conceptName !== conceptName
            );
        }

        profile.lastUpdated = new Date();
        await profile.save();

        return { success: true, profile: serializeCourseUserProfile(profile) };
    } catch (error: any) {
        console.error('Error updating concept understanding:', error);
        return { success: false, error: error.message };
    }
}

// --------------------------------
// Coaching Session Actions
// --------------------------------

/**
 * Create a new coaching session
 */
export async function createCoachingSession(
    courseId: string,
    chapterId: string,
    userId?: string
) {
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

        // Validate course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return { success: false, error: 'Course not found' };
        }

        // Create a new session
        const session = await CoachingSession.create({
            userId: userIdObj,
            courseId: courseId,
            chapterId: chapterId,
            startTime: new Date(),
            messages: [],
            keyInsights: [],
            status: 'active'
        });

        return { success: true, session: serializeCoachingSession(session) };
    } catch (error: any) {
        console.error('Error creating coaching session:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get active coaching session or create if none exists
 */
export async function getActiveCoachingSession(
    courseId: string,
    chapterId: string,
    userId?: string
) {
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

        // Find any active session for this user, course, and chapter
        let session: ICoachingSession | null = await CoachingSession.findOne({
            userId: userIdObj,
            courseId: courseId,
            chapterId: chapterId,
            status: 'active'
        });

        // If no active session, create one
        if (!session) {
            const createResult = await createCoachingSession(courseId, chapterId, userId);
            if (!createResult.success) {
                return createResult;
            }
            session = createResult.session as ICoachingSession;
        } else {
            session = serializeCoachingSession(session) as ICoachingSession;;
        }
        return { success: true, session } as { success: true; session: ICoachingSession };
    } catch (error: any) {
        console.error('Error getting active coaching session:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Add a message to a coaching session
 */
export async function addMessageToSession(
    sessionId: string,
    role: 'user' | 'assistant' | 'system',
    content: string,
    userId?: string

) {
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
        });

        if (!session) {
            return { success: false, error: 'Session not found or access denied' };
        }

        if (session.status !== 'active') {
            return { success: false, error: 'Cannot add messages to a closed session' };
        }

        // Add the message
        session.messages.push({
            role,
            content,
            timestamp: new Date()
        });

        await session.save();

        return { success: true, message: 'Message added successfully' };
    } catch (error: any) {
        console.error('Error adding message to session:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Add a key insight to a coaching session
 */
export async function addInsightToSession(
    sessionId: string,
    type: string,
    content: string,
    userId?: string
) {
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
        });

        if (!session) {
            return { success: false, error: 'Session not found or access denied' };
        }

        if (session.status !== 'active') {
            return { success: false, error: 'Cannot add insights to a closed session' };
        }

        // Add the insight
        session.keyInsights.push({
            type,
            content,
            timestamp: new Date()
        });

        await session.save();

        return { success: true, message: 'Insight added successfully' };
    } catch (error: any) {
        console.error('Error adding insight to session:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Complete a coaching session
 */
export async function completeCoachingSession(sessionId: string, userId?: string) {
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
        });

        if (!session) {
            return { success: false, error: 'Session not found or access denied' };
        }

        if (session.status !== 'active') {
            return { success: false, error: 'Session is already completed or analyzed' };
        }

        // Calculate duration
        const endTime = new Date();
        const duration = (endTime.getTime() - session.startTime.getTime()) / (1000 * 60); // in minutes

        // Update session
        session.status = 'completed';
        session.endTime = endTime;
        session.duration = duration;

        await session.save();

        // Trigger analysis (this could also be done asynchronously through a queue)
        try {
            await analyzeCoachingSession(sessionId, userId);
        } catch (analyzeError) {
            console.error('Error during session analysis:', analyzeError);
            // Continue even if analysis fails
        }

        return {
            success: true,
            session: serializeCoachingSession(session),
            message: 'Session completed successfully'
        };
    } catch (error: any) {
        console.error('Error completing coaching session:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Analyze a coaching session
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

        // Get course and chapter information
        const course = await Course.findById(session.courseId);
        if (!course) {
            return { success: false, error: 'Course not found' };
        }

        const chapter = course.chapters?.find(ch => ch._id?.toString() === session.chapterId?.toString());
        if (!chapter) {
            return { success: false, error: 'Chapter not found' };
        }

        // Get user learning profiles
        const userLearningProfileResult = await getUserLearningProfile(session.userId.toString());
        const courseUserProfileResult = await getCourseUserProfile(
            session.userId.toString(),
            session.courseId.toString()
        );

        // Prepare analysis data for LLM
        const analysisData = {
            session: session,
            course: course.toJSON({ flattenObjectIds: true }),
            chapter: chapter.toJSON ? chapter.toJSON({ flattenObjectIds: true }) : chapter,
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
            analysis: serializeSessionAnalysisReport(analysis),
            message: 'Session analyzed successfully'
        };
    } catch (error: any) {
        console.error('Error analyzing coaching session:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get a user's coaching session history for a course
 */
export async function getCourseCoachingSessions(courseId: string, userId?: string) {
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

        // Get all sessions for this user and course
        const sessions = await CoachingSession.find({
            userId: userIdObj,
            courseId: courseId
        }).sort({ startTime: -1 }).lean();

        return {
            success: true,
            sessions: sessions.map(session => serializeCoachingSession(session))
        };
    } catch (error: any) {
        console.error('Error getting coaching sessions:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get a specific coaching session by ID
 */
export async function getCoachingSessionById(sessionId: string, userId?: string) {
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

        if (!session && !user.roles.includes('admin')) {
            return { success: false, error: 'Session not found or access denied' };
        }

        return {
            success: true,
            session: serializeCoachingSession(session)
        };
    } catch (error: any) {
        console.error('Error getting coaching session:', error);
        return { success: false, error: error.message };
    }
}

// --------------------------------
// Analysis Report Actions
// --------------------------------

/**
 * Get analysis report for a session
 */
export async function getSessionAnalysisReport(sessionId: string, userId?: string) {
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

        // Verify the user has access to this session
        const session = await CoachingSession.findOne({
            _id: sessionId,
            userId: userIdObj
        });

        if (!session && !user.roles.includes('admin')) {
            return { success: false, error: 'Session not found or access denied' };
        }

        // Get the analysis report
        const analysis = await SessionAnalysisReport.findOne({ sessionId }).lean();

        if (!analysis) {
            return { success: false, error: 'No analysis report found for this session' };
        }

        return {
            success: true,
            analysis: serializeSessionAnalysisReport(analysis)
        };
    } catch (error: any) {
        console.error('Error getting session analysis report:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get analysis reports for a course
 */
export async function getCourseAnalysisReports(courseId: string, userId?: string) {
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

        // Get all analysis reports for this user and course
        const reports = await SessionAnalysisReport.find({
            userId: userIdObj,
            courseId: courseId
        }).sort({ analysisDate: -1 }).lean();

        return {
            success: true,
            reports: reports.map(report => serializeSessionAnalysisReport(report))
        };
    } catch (error: any) {
        console.error('Error getting course analysis reports:', error);
        return { success: false, error: error.message };
    }
}


/**
 * Update course user profile based on session analysis
 */
export async function updateUserProfileFromAnalysis(
    userId: string | ObjectId,
    analysis: ISessionAnalysisReport
) {
    try {
        // Get the current profile
        const userLearningProfile = await UserLearningProfile.findOne({ userId });

        if (!userLearningProfile) {
            return;
        }

        // Update analytics ability metrics based on LLM analysis
        // Map overall understanding to analytical ability
        userLearningProfile.analyticalAbility = getWeightedUpdate(
            userLearningProfile.analyticalAbility,
            analysis.overallUnderstanding,
            0.3 // Weight factor for smooth updates
        );

        // Map insights from key observations to abilities
        const criticalThinkingObservations = analysis.keyObservations.filter(
            obs => obs.category.includes('critical') || obs.category.includes('analysis')
        );

        if (criticalThinkingObservations.length > 0) {
            const avgImportance = getAverageImportance(criticalThinkingObservations);
            userLearningProfile.criticalThinking = getWeightedUpdate(
                userLearningProfile.criticalThinking,
                avgImportance,
                0.3
            );
        }

        const problemSolvingObservations = analysis.keyObservations.filter(
            obs => obs.category.includes('problem') || obs.observation.includes('problem') ||
                obs.observation.includes('solution')
        );

        if (problemSolvingObservations.length > 0) {
            const avgImportance = getAverageImportance(problemSolvingObservations);
            userLearningProfile.problemSolving = getWeightedUpdate(
                userLearningProfile.problemSolving,
                avgImportance,
                0.3
            );
        }

        // Update strengths and weaknesses based on key observations
        updateStrengthsAndWeaknesses(userLearningProfile, analysis);

        // Update learning patterns based on LLM insights
        updateLearningPatterns(userLearningProfile, analysis);

        userLearningProfile.lastUpdated = new Date();
        await userLearningProfile.save();

    } catch (error) {
        console.error('Error updating user profile from analysis:', error);
        // Don't throw, as this is a background process
    }
}

// Helper function for weighted updates to profile metrics
function getWeightedUpdate(currentValue: number, newValue: number, weight: number): number {
    return Math.min(
        10,
        Math.max(
            1,
            Math.round((currentValue * (1 - weight)) + (newValue * weight))
        )
    );
}

// Calculate average importance from observations
function getAverageImportance(observations: any[]): number {
    if (observations.length === 0) return 5; // Default to middle value

    return Math.round(
        observations.reduce((sum, obs) => sum + obs.importance, 0) / observations.length
    );
}

export async function updateCourseProfileFromAnalysis(
    userId: string | ObjectId,
    courseId: string | ObjectId,
    analysis: ISessionAnalysisReport
) {
    try {
        // Get the current profile
        const courseUserProfile = await CourseUserProfile.findOne({
            userId,
            courseId
        });

        if (!courseUserProfile) {
            return;
        }

        // Update comprehension level based on analysis
        courseUserProfile.comprehensionLevel = Math.min(
            10,
            Math.max(
                1,
                Math.round((courseUserProfile.comprehensionLevel * 0.7) + (analysis.overallUnderstanding * 0.3))
            )
        );

        // Update engagement level
        courseUserProfile.engagementLevel = calculateEngagementLevel(analysis);

        // Update course-specific strengths and weaknesses
        updateCourseStrengthsAndWeaknesses(courseUserProfile, analysis);

        // Update understood concepts
        for (const concept of analysis.conceptsUnderstood) {
            // Check if this concept is already in the mastered list
            const existingConcept = courseUserProfile.masteredConcepts.find(
                c => c.conceptName === concept.conceptName
            );

            if (existingConcept) {
                // Update existing concept
                existingConcept.masteryLevel = concept.confidenceLevel;
                existingConcept.notes = `${existingConcept.notes || ''}\n${concept.evidence || ''}`.trim();
            } else {
                // Add new concept
                courseUserProfile.masteredConcepts.push({
                    conceptName: concept.conceptName,
                    masteryLevel: concept.confidenceLevel,
                    notes: concept.evidence || ''
                });

                // Remove from misunderstood if present
                courseUserProfile.misunderstoodConcepts = courseUserProfile.misunderstoodConcepts.filter(
                    c => c.conceptName !== concept.conceptName
                );
            }
        }

        // Update struggling concepts
        for (const concept of analysis.conceptsStruggling) {
            // Check if this concept is already in the misunderstood list
            const existingConcept = courseUserProfile.misunderstoodConcepts.find(
                c => c.conceptName === concept.conceptName
            );

            if (existingConcept) {
                // Update existing concept
                existingConcept.severity = concept.struggleLevel;
                existingConcept.notes = `${existingConcept.notes || ''}\n${concept.evidence || ''}`.trim();
            } else {
                // Add new concept
                courseUserProfile.misunderstoodConcepts.push({
                    conceptName: concept.conceptName,
                    severity: concept.struggleLevel,
                    notes: concept.evidence || ''
                });

                // Remove from mastered if present
                courseUserProfile.masteredConcepts = courseUserProfile.masteredConcepts.filter(
                    c => c.conceptName !== concept.conceptName
                );
            }
        }

        courseUserProfile.lastUpdated = new Date();
        await courseUserProfile.save();

    } catch (error) {
        console.error('Error updating course profile from analysis:', error);
        // Don't throw, as this is a background process
    }
}

// --------------------------------
// Feedback Actions
// --------------------------------

/**
 * Submit explicit feedback for a coaching session
 */
export async function submitExplicitFeedback(
    sessionId: string,
    rating: number,
    feedbackText?: string,
    userId?: string
) {
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

        // Verify the session exists and belongs to the user
        const session = await CoachingSession.findOne({
            _id: sessionId,
            userId: userIdObj
        });

        if (!session) {
            return { success: false, error: 'Session not found or access denied' };
        }

        // Determine sentiment based on rating
        let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
        if (rating >= 4) sentiment = 'positive';
        else if (rating <= 2) sentiment = 'negative';

        // Create feedback record
        const feedback = await FeedbackTracking.create({
            userId: userIdObj,
            sessionId,
            feedbackType: 'explicit',
            rating,
            sentiment,
            feedbackText,
            timestamp: new Date()
        });

        return {
            success: true,
            feedback: serializeFeedbackTracking(feedback),
            message: 'Feedback submitted successfully'
        };
    } catch (error: any) {
        console.error('Error submitting feedback:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Record implicit feedback for a coaching session
 */
export async function recordImplicitFeedback(
    sessionId: string,
    implicitIndicators: {
        responseTime?: number;
        messageLength?: number;
        sessionDuration?: number;
        completionRate?: number;
    },
    userId?: string
) {
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

        // Verify the session exists and belongs to the user
        const session = await CoachingSession.findOne({
            _id: sessionId,
            userId: userIdObj
        });

        if (!session) {
            return { success: false, error: 'Session not found or access denied' };
        }

        // Determine sentiment based on implicit indicators
        // This is a simplified algorithm and would be more sophisticated in a real implementation
        let sentimentScore = 0;
        let indicatorCount = 0;

        if (implicitIndicators.responseTime !== undefined) {
            // Lower response time is better
            sentimentScore += implicitIndicators.responseTime < 20 ? 1 : implicitIndicators.responseTime < 60 ? 0 : -1;
            indicatorCount++;
        }

        if (implicitIndicators.messageLength !== undefined) {
            // Longer messages usually indicate more engagement
            sentimentScore += implicitIndicators.messageLength > 100 ? 1 : implicitIndicators.messageLength > 20 ? 0 : -1;
            indicatorCount++;
        }

        if (implicitIndicators.sessionDuration !== undefined) {
            // Longer sessions usually indicate more engagement
            sentimentScore += implicitIndicators.sessionDuration > 10 ? 1 : implicitIndicators.sessionDuration > 3 ? 0 : -1;
            indicatorCount++;
        }

        if (implicitIndicators.completionRate !== undefined) {
            // Higher completion rate is better
            sentimentScore += implicitIndicators.completionRate > 0.7 ? 1 : implicitIndicators.completionRate > 0.3 ? 0 : -1;
            indicatorCount++;
        }

        let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
        if (indicatorCount > 0) {
            const avgScore = sentimentScore / indicatorCount;
            if (avgScore > 0.3) sentiment = 'positive';
            else if (avgScore < -0.3) sentiment = 'negative';
        }

        // Create feedback record
        const feedback = await FeedbackTracking.create({
            userId: userIdObj,
            sessionId,
            feedbackType: 'implicit',
            sentiment,
            implicitIndicators,
            timestamp: new Date()
        });

        return {
            success: true,
            feedback: serializeFeedbackTracking(feedback),
            message: 'Implicit feedback recorded successfully'
        };
    } catch (error: any) {
        console.error('Error recording implicit feedback:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get feedback for a specific session
 */
export async function getSessionFeedback(sessionId: string, userId?: string) {
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

        // Verify the user has access to this session
        const session = await CoachingSession.findOne({
            _id: sessionId,
            userId: userIdObj
        });

        if (!session && !user.roles.includes('admin')) {
            return { success: false, error: 'Session not found or access denied' };
        }

        // Get feedback
        const feedback = await FeedbackTracking.find({ sessionId }).lean();

        return {
            success: true,
            feedback: feedback.map(f => serializeFeedbackTracking(f))
        };
    } catch (error: any) {
        console.error('Error getting session feedback:', error);
        return { success: false, error: error.message };
    }
}

// --------------------------------
// Helper Functions
// --------------------------------

// Helper functions for analysis calculations
function calculateAnalyticalUpdate(analysis: ISessionAnalysisReport): number {
    // Simplified example - in a real implementation, this would use NLP analysis
    // of conversation and detected patterns
    return analysis.overallUnderstanding + 1;
}

function calculateCriticalUpdate(analysis: ISessionAnalysisReport): number {
    // Simplified placeholder
    const criticalThinkingObservations = analysis.keyObservations.filter(
        obs => obs.category === 'critical-thinking'
    );

    if (criticalThinkingObservations.length > 0) {
        return Math.round(
            criticalThinkingObservations.reduce((sum, obs) => sum + obs.importance, 0) /
            criticalThinkingObservations.length
        );
    }

    return analysis.overallUnderstanding;
}

function calculateProblemSolvingUpdate(analysis: ISessionAnalysisReport): number {
    // Simplified placeholder
    const problemSolvingObservations = analysis.keyObservations.filter(
        obs => obs.category === 'problem-solving'
    );

    if (problemSolvingObservations.length > 0) {
        return Math.round(
            problemSolvingObservations.reduce((sum, obs) => sum + obs.importance, 0) /
            problemSolvingObservations.length
        );
    }

    return analysis.overallUnderstanding;
}

function calculateEngagementLevel(analysis: ISessionAnalysisReport): number {
    // Placeholder - in a real implementation, this would use more factors
    if (analysis.engagementLevelInsights.toLowerCase().includes('high')) {
        return 8;
    } else if (analysis.engagementLevelInsights.toLowerCase().includes('low')) {
        return 3;
    } else {
        return 5;
    }
}

function updateStrengthsAndWeaknesses(
    userLearningProfile: IUserLearningProfile,
    analysis: ISessionAnalysisReport
) {
    // Extract strengths and weaknesses from the analysis
    const strengthObservations = analysis.keyObservations.filter(
        obs => obs.category === 'strength'
    );

    const weaknessObservations = analysis.keyObservations.filter(
        obs => obs.category === 'weakness'
    );

    // Extract strength descriptions
    strengthObservations.forEach(obs => {
        const strength = obs.observation;
        if (!userLearningProfile.generalStrengths.includes(strength)) {
            userLearningProfile.generalStrengths.push(strength);
        }
    });

    // Extract weakness descriptions
    weaknessObservations.forEach(obs => {
        const weakness = obs.observation;
        if (!userLearningProfile.generalWeaknesses.includes(weakness)) {
            userLearningProfile.generalWeaknesses.push(weakness);
        }
    });
}

function updateCourseStrengthsAndWeaknesses(
    courseUserProfile: ICourseUserProfile,
    analysis: ISessionAnalysisReport
) {
    // Similar to above, but for course-specific strengths and weaknesses
    const strengthObservations = analysis.keyObservations.filter(
        obs => obs.category === 'strength'
    );

    const weaknessObservations = analysis.keyObservations.filter(
        obs => obs.category === 'weakness'
    );

    // Extract strength descriptions
    strengthObservations.forEach(obs => {
        const strength = obs.observation;
        if (!courseUserProfile.strengths.includes(strength)) {
            courseUserProfile.strengths.push(strength);
        }
    });

    // Extract weakness descriptions
    weaknessObservations.forEach(obs => {
        const weakness = obs.observation;
        if (!courseUserProfile.weaknesses.includes(weakness)) {
            courseUserProfile.weaknesses.push(weakness);
        }
    });
}

function updateLearningPatterns(
    userLearningProfile: IUserLearningProfile,
    analysis: ISessionAnalysisReport
) {
    // Parse learning style insights to update learning patterns
    const learningStyleInsights = analysis.learningStyleInsights.toLowerCase();

    // Example mapping of insights to learning patterns
    if (learningStyleInsights.includes('visual')) {
        userLearningProfile.preferredTopics.push('Visual aids');
        if (!userLearningProfile.learningPatterns.preferredTime) {
            userLearningProfile.learningPatterns.preferredTime = 'any';
        }
    }

    if (learningStyleInsights.includes('participat')) {
        userLearningProfile.learningPatterns.engagementLevel = 'high';
    }

    if (learningStyleInsights.includes('reflect')) {
        userLearningProfile.learningPatterns.engagementLevel = 'medium';
    }

    // Parse communication style insights
    const communicationInsights = analysis.communicationStyleInsights.toLowerCase();

    if (communicationInsights.includes('detail')) {
        userLearningProfile.preferredTopics.push('Detailed explanations');
    }

    if (communicationInsights.includes('concise')) {
        userLearningProfile.preferredTopics.push('Concise summaries');
    }
}

// --------------------------------
// Serialization Helpers
// --------------------------------

/**
 * Serialize a UserLearningProfile document for safe return
 */
function serializeUserLearningProfile(profile: IUserLearningProfile): any {
    if (!profile) return null;

    return {
        ...profile.toJSON({ flattenObjectIds: true }),
    };
}

/**
 * Serialize a CourseUserProfile document for safe return
 */
function serializeCourseUserProfile(profile: any): any {
    if (!profile) return null;

    return {
        ...profile._doc || profile,
        _id: toStringId(profile._id),
        userId: toStringId(profile.userId),
        courseId: toStringId(profile.courseId),
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt
    };
}

/**
 * Serialize a CoachingSession document for safe return
 */
function serializeCoachingSession(session: any): any {
    if (!session) return null;

    return {
        ...session._doc || session,
        _id: toStringId(session._id),
        userId: toStringId(session.userId),
        courseId: toStringId(session.courseId),
        chapterId: toStringId(session.chapterId),
        createdAt: session.createdAt,
        updatedAt: session.updatedAt
    };
}

/**
 * Serialize a SessionAnalysisReport document for safe return
 */
function serializeSessionAnalysisReport(report: any): any {
    if (!report) return null;

    return {
        ...report._doc || report,
        _id: toStringId(report._id),
        sessionId: toStringId(report.sessionId),
        userId: toStringId(report.userId),
        courseId: toStringId(report.courseId),
        createdAt: report.createdAt,
        updatedAt: report.updatedAt
    };
}

/**
 * Serialize a FeedbackTracking document for safe return
 */
function serializeFeedbackTracking(feedback: any): any {
    if (!feedback) return null;

    return {
        ...feedback._doc || feedback,
        _id: toStringId(feedback._id),
        userId: toStringId(feedback.userId),
        sessionId: toStringId(feedback.sessionId),
        createdAt: feedback.createdAt,
        updatedAt: feedback.updatedAt
    };
}