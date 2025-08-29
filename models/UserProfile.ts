// models/UserProfile.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

// Learning Preferences Interfaces
interface ILearningPreferences {
    learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
    studyTime: 'early-morning' | 'morning' | 'afternoon' | 'evening' | 'night' | 'flexible';
    difficulty: 'gentle' | 'adaptive' | 'challenging' | 'expert';
    aiPersonality: 'warm' | 'energetic' | 'focused' | 'wise';
    sessionLength: '15' | '25' | '45' | '60' | '90';
    background: 'silent' | 'ambient' | 'nature' | 'focus' | 'binaural';
    motivationStyle: 'encouragement' | 'achievement' | 'competition' | 'progress';
    progressCelebration: 'minimal' | 'moderate' | 'enthusiastic';
    learningPace: 'slow' | 'steady' | 'fast' | 'adaptive';
    breakReminders: boolean;
    focusMode: boolean;
    studyMusic: 'silent' | 'ambient' | 'nature' | 'focus' | 'binaural';
}

interface INotificationSettings {
    emailNotifications: boolean;
    pushNotifications: boolean;
    studyReminders: boolean;
    achievementAlerts: boolean;
    streakNotifications: boolean;
    coachMessages: boolean;
    breakReminders: boolean;
    weeklyProgress: boolean;
    courseUpdates: boolean;
    communityActivity: boolean;
}

interface IPrivacySettings {
    publicProfile: boolean;
    dataSharing: boolean;
    analyticsOptIn: boolean;
    showProgress: boolean;
    showAchievements: boolean;
    allowMessageFromStudents: boolean;
    allowMessageFromInstructors: boolean;
    showOnlineStatus: boolean;
}

interface ISecuritySettings {
    twoFactorEnabled: boolean;
    loginAlerts: boolean;
    sessionTimeout: boolean;
    deviceTracking: boolean;
    suspiciousActivityAlerts: boolean;
}

interface IAccessibilitySettings {
    fontSize: 'small' | 'medium' | 'large' | 'extra-large';
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
    keyboardNavigation: boolean;
    colorBlindnessSupport: 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia';
    audioDescriptions: boolean;
    captionsEnabled: boolean;
}

interface ILearningGoals {
    shortTerm: string[];
    longTerm: string[];
    targetCompletionDate?: Date;
    weeklyHoursGoal: number;
    skillsToLearn: string[];
    certificationGoals: string[];
    careerObjectives: string[];
}

interface ILearningStats {
    totalLearningHours: number;
    currentStreak: number;
    longestStreak: number;
    coursesCompleted: number;
    coursesInProgress: number;
    skillsAcquired: number;
    certificationsEarned: number;
    averageSessionDuration: number;
    preferredLearningDays: string[];
    mostProductiveHour: number;
    totalAIInteractions: number;
    averageQuizScore: number;
    lastActiveDate: Date;
    weeklyProgress: number;
    monthlyProgress: number;
}

interface IPersonalInfo {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    gender?: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
    phoneNumber?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
    };
    emergencyContact?: {
        name?: string;
        relationship?: string;
        phoneNumber?: string;
        email?: string;
    };
    linkedin?: string;
    github?: string;
    portfolio?: string;
    bio?: string;
    interests: string[];
    languages: string[];
    timezone: string;
    occupation?: string;
    education?: {
        degree?: string;
        institution?: string;
        graduationYear?: number;
        fieldOfStudy?: string;
    };
}

export interface IUserProfile extends Document {
    _id: mongoose.Types.ObjectId;
    auth0Id: string;
    email: string;
    name: string;
    picture?: string;
    lastLogin: Date;
    onboardingStatus: 'pending' | 'completed';
    createdAt: Date;
    updatedAt: Date;

    // Enhanced fields
    personalInfo: IPersonalInfo;
    learningPreferences: ILearningPreferences;
    notificationSettings: INotificationSettings;
    privacySettings: IPrivacySettings;
    securitySettings: ISecuritySettings;
    accessibilitySettings: IAccessibilitySettings;
    learningGoals: ILearningGoals;
    learningStats: ILearningStats;

    // Legacy fields (for backward compatibility)
    customData: any;
    roles: string[];
    status: 'active' | 'inactive' | 'suspended' | 'pending_verification';

    // AI Coach relationship
    aiCoachRelationship: {
        coachName: string;
        relationshipStartDate: Date;
        totalInteractions: number;
        satisfactionScore: number;
        preferredCommunicationStyle: string;
        lastInteraction: Date;
        conversationHistory: Array<{
            date: Date;
            topic: string;
            satisfaction: number;
            duration: number;
        }>;
    };

    // Subscription and billing
    subscriptionStatus: 'free' | 'premium' | 'enterprise';
    subscriptionStartDate?: Date;
    subscriptionEndDate?: Date;
    billingInfo?: {
        customerId?: string;
        paymentMethodId?: string;
        lastPaymentDate?: Date;
        nextBillingDate?: Date;
    };
}

export type IUserProfileData = Omit<IUserProfile, '_id'> & { _id: string };

// Schema Definitions
const PersonalInfoSchema = new Schema({
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    gender: {
        type: String,
        enum: ['male', 'female', 'non-binary', 'prefer-not-to-say']
    },
    phoneNumber: String,
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    emergencyContact: {
        name: String,
        relationship: String,
        phoneNumber: String,
        email: String
    },
    linkedin: String,
    github: String,
    portfolio: String,
    bio: String,
    interests: [String],
    languages: [String],
    timezone: {
        type: String,
        default: 'UTC'
    },
    occupation: String,
    education: {
        degree: String,
        institution: String,
        graduationYear: Number,
        fieldOfStudy: String
    }
}, { _id: false });

const LearningPreferencesSchema = new Schema({
    learningStyle: {
        type: String,
        enum: ['visual', 'auditory', 'kinesthetic', 'reading'],
        default: 'visual'
    },
    studyTime: {
        type: String,
        enum: ['early-morning', 'morning', 'afternoon', 'evening', 'night', 'flexible'],
        default: 'morning'
    },
    difficulty: {
        type: String,
        enum: ['gentle', 'adaptive', 'challenging', 'expert'],
        default: 'adaptive'
    },
    aiPersonality: {
        type: String,
        enum: ['warm', 'energetic', 'focused', 'wise'],
        default: 'warm'
    },
    sessionLength: {
        type: String,
        enum: ['15', '25', '45', '60', '90'],
        default: '45'
    },
    background: {
        type: String,
        enum: ['silent', 'ambient', 'nature', 'focus', 'binaural'],
        default: 'ambient'
    },
    motivationStyle: {
        type: String,
        enum: ['encouragement', 'achievement', 'competition', 'progress'],
        default: 'encouragement'
    },
    progressCelebration: {
        type: String,
        enum: ['minimal', 'moderate', 'enthusiastic'],
        default: 'moderate'
    },
    learningPace: {
        type: String,
        enum: ['slow', 'steady', 'fast', 'adaptive'],
        default: 'steady'
    },
    breakReminders: {
        type: Boolean,
        default: true
    },
    focusMode: {
        type: Boolean,
        default: false
    },
    studyMusic: {
        type: String,
        enum: ['silent', 'ambient', 'nature', 'focus', 'binaural'],
        default: 'ambient'
    }
}, { _id: false });

const NotificationSettingsSchema = new Schema({
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    studyReminders: { type: Boolean, default: true },
    achievementAlerts: { type: Boolean, default: true },
    streakNotifications: { type: Boolean, default: true },
    coachMessages: { type: Boolean, default: true },
    breakReminders: { type: Boolean, default: true },
    weeklyProgress: { type: Boolean, default: true },
    courseUpdates: { type: Boolean, default: true },
    communityActivity: { type: Boolean, default: false }
}, { _id: false });

const PrivacySettingsSchema = new Schema({
    publicProfile: { type: Boolean, default: false },
    dataSharing: { type: Boolean, default: false },
    analyticsOptIn: { type: Boolean, default: true },
    showProgress: { type: Boolean, default: true },
    showAchievements: { type: Boolean, default: true },
    allowMessageFromStudents: { type: Boolean, default: true },
    allowMessageFromInstructors: { type: Boolean, default: true },
    showOnlineStatus: { type: Boolean, default: true }
}, { _id: false });

const SecuritySettingsSchema = new Schema({
    twoFactorEnabled: { type: Boolean, default: false },
    loginAlerts: { type: Boolean, default: true },
    sessionTimeout: { type: Boolean, default: true },
    deviceTracking: { type: Boolean, default: true },
    suspiciousActivityAlerts: { type: Boolean, default: true }
}, { _id: false });

const AccessibilitySettingsSchema = new Schema({
    fontSize: {
        type: String,
        enum: ['small', 'medium', 'large', 'extra-large'],
        default: 'medium'
    },
    highContrast: { type: Boolean, default: false },
    reducedMotion: { type: Boolean, default: false },
    screenReader: { type: Boolean, default: false },
    keyboardNavigation: { type: Boolean, default: false },
    colorBlindnessSupport: {
        type: String,
        enum: ['none', 'deuteranopia', 'protanopia', 'tritanopia'],
        default: 'none'
    },
    audioDescriptions: { type: Boolean, default: false },
    captionsEnabled: { type: Boolean, default: false }
}, { _id: false });

const LearningGoalsSchema = new Schema({
    shortTerm: [String],
    longTerm: [String],
    targetCompletionDate: Date,
    weeklyHoursGoal: { type: Number, default: 10 },
    skillsToLearn: [String],
    certificationGoals: [String],
    careerObjectives: [String]
}, { _id: false });

const LearningStatsSchema = new Schema({
    totalLearningHours: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    coursesCompleted: { type: Number, default: 0 },
    coursesInProgress: { type: Number, default: 0 },
    skillsAcquired: { type: Number, default: 0 },
    certificationsEarned: { type: Number, default: 0 },
    averageSessionDuration: { type: Number, default: 45 },
    preferredLearningDays: [String],
    mostProductiveHour: { type: Number, default: 9 },
    totalAIInteractions: { type: Number, default: 0 },
    averageQuizScore: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: Date.now },
    weeklyProgress: { type: Number, default: 0 },
    monthlyProgress: { type: Number, default: 0 }
}, { _id: false });

const AICoachRelationshipSchema = new Schema({
    coachName: { type: String, default: 'Alex' },
    relationshipStartDate: { type: Date, default: Date.now },
    totalInteractions: { type: Number, default: 0 },
    satisfactionScore: { type: Number, default: 5.0, min: 1, max: 5 },
    preferredCommunicationStyle: { type: String, default: 'warm' },
    lastInteraction: { type: Date, default: Date.now },
    conversationHistory: [{
        date: { type: Date, default: Date.now },
        topic: String,
        satisfaction: { type: Number, min: 1, max: 5 },
        duration: Number
    }]
}, { _id: false });

const BillingInfoSchema = new Schema({
    customerId: String,
    paymentMethodId: String,
    lastPaymentDate: Date,
    nextBillingDate: Date
}, { _id: false });

// Main User Profile Schema
const UserProfileSchema: Schema = new Schema({
    auth0Id: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    picture: {
        type: String
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    onboardingStatus: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },

    // Enhanced structured data
    personalInfo: {
        type: PersonalInfoSchema,
        default: () => ({})
    },
    learningPreferences: {
        type: LearningPreferencesSchema,
        default: () => ({})
    },
    notificationSettings: {
        type: NotificationSettingsSchema,
        default: () => ({})
    },
    privacySettings: {
        type: PrivacySettingsSchema,
        default: () => ({})
    },
    securitySettings: {
        type: SecuritySettingsSchema,
        default: () => ({})
    },
    accessibilitySettings: {
        type: AccessibilitySettingsSchema,
        default: () => ({})
    },
    learningGoals: {
        type: LearningGoalsSchema,
        default: () => ({})
    },
    learningStats: {
        type: LearningStatsSchema,
        default: () => ({})
    },
    aiCoachRelationship: {
        type: AICoachRelationshipSchema,
        default: () => ({})
    },

    // Legacy fields
    customData: {
        type: Schema.Types.Mixed,
        default: {}
    },
    roles: {
        type: [String],
        default: ['student']
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended', 'pending_verification'],
        default: 'active'
    },

    // Subscription
    subscriptionStatus: {
        type: String,
        enum: ['free', 'premium', 'enterprise'],
        default: 'free'
    },
    subscriptionStartDate: Date,
    subscriptionEndDate: Date,
    billingInfo: BillingInfoSchema
}, {
    timestamps: true
});

// Indexes for performance
UserProfileSchema.index({ email: 1 });
UserProfileSchema.index({ status: 1 });
UserProfileSchema.index({ subscriptionStatus: 1 });
UserProfileSchema.index({ 'learningPreferences.learningStyle': 1 });
UserProfileSchema.index({ 'learningStats.lastActiveDate': 1 });
UserProfileSchema.index({ createdAt: 1 });

// Virtual for full name
UserProfileSchema.virtual('fullName').get(function (this: IUserProfile): string {
    const { firstName, lastName } = this.personalInfo;
    return firstName && lastName ? `${firstName} ${lastName}` : this.name;
});

// Method to update learning stats
UserProfileSchema.methods.updateLearningStats = function (sessionData: {
    duration: number;
    completion: boolean;
    quizScore?: number;
    aiInteractions?: number;
}) {
    this.learningStats.totalLearningHours += sessionData.duration / 60;
    this.learningStats.lastActiveDate = new Date();
    this.learningStats.averageSessionDuration =
        (this.learningStats.averageSessionDuration + sessionData.duration) / 2;

    if (sessionData.aiInteractions) {
        this.learningStats.totalAIInteractions += sessionData.aiInteractions;
    }

    if (sessionData.quizScore) {
        this.learningStats.averageQuizScore =
            (this.learningStats.averageQuizScore + sessionData.quizScore) / 2;
    }

    return this.save();
};

// Method to update AI coach relationship
UserProfileSchema.methods.updateAICoachRelationship = function (interactionData: {
    topic: string;
    satisfaction: number;
    duration: number;
}) {
    this.aiCoachRelationship.totalInteractions += 1;
    this.aiCoachRelationship.lastInteraction = new Date();
    this.aiCoachRelationship.satisfactionScore =
        (this.aiCoachRelationship.satisfactionScore + interactionData.satisfaction) / 2;

    this.aiCoachRelationship.conversationHistory.push({
        date: new Date(),
        topic: interactionData.topic,
        satisfaction: interactionData.satisfaction,
        duration: interactionData.duration
    });

    // Keep only last 100 conversations
    if (this.aiCoachRelationship.conversationHistory.length > 100) {
        this.aiCoachRelationship.conversationHistory =
            this.aiCoachRelationship.conversationHistory.slice(-100);
    }

    return this.save();
};

// Method to check if user has specific preferences set
UserProfileSchema.methods.hasCompleteProfile = function () {
    return !!(
        this.personalInfo.firstName &&
        this.personalInfo.lastName &&
        this.learningPreferences.learningStyle &&
        this.learningPreferences.studyTime &&
        this.learningGoals.shortTerm.length > 0
    );
};

// Pre-save middleware to update updatedAt
UserProfileSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

let UserProfile: Model<IUserProfile>;

// Check if the model already exists to prevent recompilation error
if (mongoose.models && 'UserProfile' in mongoose.models) {
    UserProfile = mongoose.models.UserProfile as Model<IUserProfile>;
} else {
    UserProfile = mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);
}

export default UserProfile;