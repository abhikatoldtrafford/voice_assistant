'use server'
import connectToDatabase from "@/lib/mongodb";
import UserProfile from "@/models/UserProfile";
import { getCurrentUser } from "../user";
import OnboardingSession, { IOnboardingSession } from "@/models/ai-coach/OnboardingSession";
import { OpenAI } from "openai";
import { UserLearningProfile } from "@/models/ai-coach";
import { DEFAULT_MODEL } from "@/lib/constants";

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


/**
 * Create a new Onboarding session
 */
export async function createOnboardingSession(
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


        // Create a new session
        const session = await OnboardingSession.create({
            userId: userIdObj,
            startTime: new Date(),
            messages: [],
            status: 'active'
        });

        return { success: true, session: session.toJSON({ flattenObjectIds: true }) as IOnboardingSession };
    } catch (error: any) {
        console.error('Error creating coaching session:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get active session or create if none exists
 */
export async function getActiveOnBoardingSession(
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
        let session: IOnboardingSession | null = await OnboardingSession.findOne({
            userId: userIdObj,
            status: 'active'
        });

        // If no active session, create one
        if (!session) {
            const createResult = await createOnboardingSession(userId);
            if (!createResult.success) {
                return createResult;
            }
            session = createResult.session as IOnboardingSession;
        } else {
            session = session.toJSON({ flattenObjectIds: true }) as IOnboardingSession;
        }
        return { success: true, session } as { success: true; session: IOnboardingSession };
    } catch (error: any) {
        console.error('Error getting active coaching session:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Analyze an onboarding session and fill user profile using LLM
 * This function extracts personal information, learning preferences, and interests
 * from the onboarding conversation and updates the user's profile accordingly
 */
export async function analyzeOnboardingSession(sessionId: string, userId?: string) {
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

        // Find the onboarding session
        const session = await OnboardingSession.findOne({
            _id: sessionId,
            userId: userIdObj
        });

        if (!session) {
            return { success: false, error: 'Onboarding session not found or access denied' };
        }

        if (session.status === 'analyzed') {
            return { success: false, error: 'Session already analyzed' };
        }

        // Extract conversation from session messages
        const conversation = session.messages.map((msg: any) =>
            `${msg.role.toUpperCase()}: ${msg.content}`
        ).join('\n\n');

        // Build the analysis prompt for user profile extraction
        const prompt = `
# ONBOARDING SESSION ANALYSIS FOR USER PROFILE

## TASK
Analyze this onboarding conversation to extract comprehensive user profile information.
Extract personal details, learning preferences, interests, goals, and any other relevant information
that can be used to personalize the learning experience.

## CONVERSATION TRANSCRIPT
${conversation}

## EXTRACTION REQUIREMENTS

Based on the conversation above, extract information for the user profile in the following JSON structure.
Only include information that was explicitly mentioned or can be reasonably inferred from the conversation.
Use null for any fields where information is not available.

## PROFILE STRUCTURE

Return a JSON object with the following structure:

\`\`\`json
{
  "personalInfo": {
    "firstName": "string or null",
    "lastName": "string or null", 
    "bio": "brief personal bio based on conversation",
    "interests": ["array", "of", "interests", "mentioned"],
    "languages": ["languages", "mentioned"],
    "occupation": "current job/role or null",
    "education": {
      "degree": "degree mentioned or null",
      "institution": "school/university or null",
      "fieldOfStudy": "field of study or null"
    },
    "timezone": "timezone if mentioned or null"
  },
  "learningPreferences": {
    "learningStyle": "visual|auditory|kinesthetic|reading or null",
    "studyTime": "early-morning|morning|afternoon|evening|night|flexible or null", 
    "difficulty": "gentle|adaptive|challenging|expert or null",
    "aiPersonality": "warm|energetic|focused|wise or null",
    "sessionLength": "15|25|45|60|90 or null",
    "motivationStyle": "encouragement|achievement|competition|progress or null",
    "learningPace": "slow|steady|fast|adaptive or null"
  },
  "learningGoals": {
    "shortTerm": ["goals", "mentioned", "for", "near", "future"],
    "longTerm": ["career", "goals", "aspirations"],
    "skillsToLearn": ["specific", "skills", "mentioned"],
    "careerObjectives": ["career", "related", "goals"],
    "weeklyHoursGoal": "number of hours per week they want to study or null"
  },
  "motivationFactors": {
    "primaryMotivation": "main reason for taking courses",
    "learningChallenges": ["challenges", "they", "mentioned"],
    "successFactors": ["what", "helps", "them", "learn", "best"],
    "avoidanceFactors": ["what", "they", "want", "to", "avoid"]
  },
  "backgroundContext": {
    "previousExperience": "relevant experience mentioned",
    "currentSituation": "their current life/work situation", 
    "availableTime": "how much time they have for learning",
    "learningEnvironment": "where/how they prefer to learn"
  },
  "communicationStyle": {
    "preferredTone": "formal|casual|friendly|professional",
    "detailLevel": "high|medium|low",
    "feedbackPreference": "direct|gentle|encouraging|detailed",
    "questionStyle": "they prefer asking lots of questions or not"
  }
}
\`\`\`

## ANALYSIS GUIDELINES

1. **Be Conservative**: Only extract information that is clearly mentioned or strongly implied
2. **Infer Thoughtfully**: Make reasonable inferences based on conversation context
3. **Categorize Accurately**: Place information in the most appropriate category
4. **Extract Interests Comprehensively**: Include hobbies, professional interests, and personal passions
5. **Identify Learning Patterns**: Look for clues about how they prefer to learn
6. **Note Goals and Aspirations**: Extract both explicit and implicit goals
7. **Understand Context**: Consider their life situation and available time for learning

Focus on information that will help personalize their learning experience and create better AI coaching interactions.
`;

        // Call OpenAI to analyze the conversation
        const response = await openai.chat.completions.create({
            model: DEFAULT_MODEL,
            messages: [{ role: 'system', content: prompt }],
            temperature: 0.2, // Lower temperature for more consistent extraction
            max_tokens: 2048,
            response_format: { type: "json_object" }
        });

        const analysisText = response.choices[0]?.message?.content || '';

        let extractedProfile;
        try {
            extractedProfile = JSON.parse(analysisText);
        } catch (parseError) {
            console.error('Error parsing profile extraction JSON:', parseError, analysisText);
            return { success: false, error: 'Failed to parse profile extraction result' };
        }

        // Update the user profile with extracted information
        const updateData: any = {};

        // Update personal info
        if (extractedProfile.personalInfo) {
            const personalInfo = extractedProfile.personalInfo;

            if (personalInfo.firstName) updateData['personalInfo.firstName'] = personalInfo.firstName;
            if (personalInfo.lastName) updateData['personalInfo.lastName'] = personalInfo.lastName;
            if (personalInfo.bio) updateData['personalInfo.bio'] = personalInfo.bio;
            if (personalInfo.interests && personalInfo.interests.length > 0) {
                updateData['personalInfo.interests'] = personalInfo.interests;
            }
            if (personalInfo.languages && personalInfo.languages.length > 0) {
                updateData['personalInfo.languages'] = personalInfo.languages;
            }
            if (personalInfo.occupation) updateData['personalInfo.occupation'] = personalInfo.occupation;
            if (personalInfo.timezone) updateData['personalInfo.timezone'] = personalInfo.timezone;

            // Update education info
            if (personalInfo.education) {
                if (personalInfo.education.degree) updateData['personalInfo.education.degree'] = personalInfo.education.degree;
                if (personalInfo.education.institution) updateData['personalInfo.education.institution'] = personalInfo.education.institution;
                if (personalInfo.education.fieldOfStudy) updateData['personalInfo.education.fieldOfStudy'] = personalInfo.education.fieldOfStudy;
            }
        }

        // Update learning preferences
        if (extractedProfile.learningPreferences) {
            const prefs = extractedProfile.learningPreferences;

            if (prefs.learningStyle) updateData['learningPreferences.learningStyle'] = prefs.learningStyle;
            if (prefs.studyTime) updateData['learningPreferences.studyTime'] = prefs.studyTime;
            if (prefs.difficulty) updateData['learningPreferences.difficulty'] = prefs.difficulty;
            if (prefs.aiPersonality) updateData['learningPreferences.aiPersonality'] = prefs.aiPersonality;
            if (prefs.sessionLength) updateData['learningPreferences.sessionLength'] = prefs.sessionLength;
            if (prefs.motivationStyle) updateData['learningPreferences.motivationStyle'] = prefs.motivationStyle;
            if (prefs.learningPace) updateData['learningPreferences.learningPace'] = prefs.learningPace;
        }

        // Update learning goals
        if (extractedProfile.learningGoals) {
            const goals = extractedProfile.learningGoals;

            if (goals.shortTerm && goals.shortTerm.length > 0) {
                updateData['learningGoals.shortTerm'] = goals.shortTerm;
            }
            if (goals.longTerm && goals.longTerm.length > 0) {
                updateData['learningGoals.longTerm'] = goals.longTerm;
            }
            if (goals.skillsToLearn && goals.skillsToLearn.length > 0) {
                updateData['learningGoals.skillsToLearn'] = goals.skillsToLearn;
            }
            if (goals.careerObjectives && goals.careerObjectives.length > 0) {
                updateData['learningGoals.careerObjectives'] = goals.careerObjectives;
            }
            if (goals.weeklyHoursGoal) updateData['learningGoals.weeklyHoursGoal'] = goals.weeklyHoursGoal;
        }

        // Store additional extracted insights in a custom field for AI coaching
        updateData['onboardingInsights'] = {
            motivationFactors: extractedProfile.motivationFactors || {},
            backgroundContext: extractedProfile.backgroundContext || {},
            communicationStyle: extractedProfile.communicationStyle || {},
            extractedAt: new Date(),
            sessionId: sessionId
        };

        // Update the user profile in database
        await UserProfile.findByIdAndUpdate(
            userIdObj,
            { $set: updateData },
            { new: true, upsert: false }
        );

        // Mark the onboarding session as analyzed
        await OnboardingSession.findByIdAndUpdate(
            sessionId,
            {
                status: 'analyzed',
                analyzedAt: new Date()
            }
        );

        // Get the updated user profile
        const updatedUser = await UserProfile.findById(userIdObj);

        return {
            success: true,
            extractedProfile,
            updatedProfile: updatedUser?.toJSON({ flattenObjectIds: true }),
            message: 'Onboarding session analyzed and user profile updated successfully'
        };

    } catch (error: any) {
        console.error('Error analyzing onboarding session:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Helper function to create or update user learning profile based on onboarding analysis
 */
export async function createUserLearningProfileFromOnboarding(userId: string, extractedProfile: any) {
    try {
        await connectToDatabase();

        // Check if user learning profile exists
        let userLearningProfile = await UserLearningProfile.findOne({ userId });

        const profileData = {
            userId,
            // Map extracted information to learning profile fields
            analyticalAbility: 5, // Default, will be updated through coaching sessions
            criticalThinking: 5,  // Default, will be updated through coaching sessions  
            problemSolving: 5,    // Default, will be updated through coaching sessions

            // Extract interests and preferences
            preferredTopics: extractedProfile.personalInfo?.interests || [],
            generalStrengths: extractedProfile.motivationFactors?.successFactors || [],
            generalWeaknesses: extractedProfile.motivationFactors?.learningChallenges || [],

            // Learning patterns from onboarding
            learningPatterns: {
                preferredTime: extractedProfile.learningPreferences?.studyTime || 'flexible',
                sessionLength: extractedProfile.learningPreferences?.sessionLength || '45',
                engagementLevel: 'medium', // Will be determined through sessions
                progressRate: 'steady'     // Will be determined through sessions
            },

            lastUpdated: new Date()
        };

        if (!userLearningProfile) {
            // Create new profile
            userLearningProfile = await UserLearningProfile.create(profileData);
        } else {
            // Update existing profile with new information
            await UserLearningProfile.findByIdAndUpdate(
                userLearningProfile._id,
                { $set: profileData },
                { new: true }
            );
        }

        return { success: true, profile: userLearningProfile };

    } catch (error: any) {
        console.error('Error creating user learning profile from onboarding:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Complete an onboarding session and trigger profile analysis
 */
export async function completeOnboardingSession(sessionId: string, userId?: string) {
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
        const session = await OnboardingSession.findOne({
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

        // Update session status
        await OnboardingSession.findByIdAndUpdate(
            sessionId,
            {
                status: 'completed',
                endTime: endTime,
                duration: duration
            }
        );

        // Trigger analysis in the background (don't await to avoid blocking the response)
        let analysisResult = await analyzeOnboardingSession(sessionId, userId)

        if (analysisResult.success) {
            console.log('Onboarding session analyzed successfully:', sessionId);

            // Also create the user learning profile based on the analysis
            if (analysisResult.extractedProfile) {
                await createUserLearningProfileFromOnboarding(userId || userIdObj.toString(), analysisResult.extractedProfile);
            }
        } else {
            console.error('Failed to analyze onboarding session:', analysisResult.error);
        }

        await UserProfile.findByIdAndUpdate(
            userIdObj,
            { $set: { onboardingStatus: 'completed' } },
            { new: true, upsert: false }
        );
        return {
            success: true,
            message: 'Onboarding session completed successfully. Profile analysis is running in the background.'
        };

    } catch (error: any) {
        console.error('Error completing onboarding session:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get onboarding session by ID with populated conversation
 */
export async function getOnboardingSessionById(sessionId: string, userId?: string) {
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
        const session = await OnboardingSession.findOne({
            _id: sessionId,
            userId: userIdObj
        });

        if (!session) {
            return { success: false, error: 'Session not found or access denied' };
        }

        return {
            success: true,
            session: session.toJSON({ flattenObjectIds: true })
        };

    } catch (error: any) {
        console.error('Error getting onboarding session:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Manually trigger onboarding analysis (useful for testing or re-analysis)
 */
export async function triggerOnboardingAnalysis(sessionId: string, userId?: string) {
    try {
        const result = await analyzeOnboardingSession(sessionId, userId);

        if (result.success && result.extractedProfile) {
            // Also update the learning profile
            const learningProfileResult = await createUserLearningProfileFromOnboarding(
                userId || result.updatedProfile?.id,
                result.extractedProfile
            );

            return {
                ...result,
                learningProfileCreated: learningProfileResult.success
            };
        }

        return result;
    } catch (error: any) {
        console.error('Error triggering onboarding analysis:', error);
        return { success: false, error: error.message };
    }
}