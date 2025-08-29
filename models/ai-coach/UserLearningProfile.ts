// models/ai-coach/UserLearningProfile.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserLearningProfile extends Document {
    userId: mongoose.Types.ObjectId;  // Reference to Users
    generalStrengths: string[];
    generalWeaknesses: string[];
    preferredTopics: string[];
    avoidedTopics: string[];
    learningPatterns: {
        preferredTime: string;
        averageSessionDuration: number;
        responseRate: number;
        engagementLevel: string;
    };
    analyticalAbility: number;  // 1-10 scale
    criticalThinking: number;   // 1-10 scale
    problemSolving: number;     // 1-10 scale
    lastUpdated: Date;

    // New field - summary in markdown format
    summary: string;            // Markdown text for user summary
}

const UserLearningProfileSchema = new Schema<IUserLearningProfile>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'UserProfile',
        required: true
    },
    generalStrengths: [{ type: String }],
    generalWeaknesses: [{ type: String }],
    preferredTopics: [{ type: String }],
    avoidedTopics: [{ type: String }],
    learningPatterns: {
        preferredTime: { type: String },
        averageSessionDuration: { type: Number },
        responseRate: { type: Number },
        engagementLevel: { type: String }
    },
    analyticalAbility: {
        type: Number,
        min: 1,
        max: 10
    },
    criticalThinking: {
        type: Number,
        min: 1,
        max: 10
    },
    problemSolving: {
        type: Number,
        min: 1,
        max: 10
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    // New summary field in markdown format
    summary: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Add an index for quick lookups by userId
UserLearningProfileSchema.index({ userId: 1 }, { unique: true });

let UserLearningProfile: Model<IUserLearningProfile>;

// Check if the model already exists to prevent recompilation error
if (mongoose.models && 'UserLearningProfile' in mongoose.models) {
    UserLearningProfile = mongoose.models.UserLearningProfile as Model<IUserLearningProfile>;
} else {
    UserLearningProfile = mongoose.model<IUserLearningProfile>('UserLearningProfile', UserLearningProfileSchema);
}

export default UserLearningProfile;