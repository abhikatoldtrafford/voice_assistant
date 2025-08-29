import mongoose, { Schema, Document, Model } from 'mongoose';

interface IMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
}

export interface IOnboardingSession extends Document {
    userId: mongoose.Types.ObjectId;      // Reference to Users
    startTime: Date;
    endTime?: Date;
    messages: IMessage[];
    sessionSummary?: string;              // Auto-generated session summary
    status: 'active' | 'completed' | 'analyzed';
}

const MessageSchema = new Schema({
    role: {
        type: String,
        enum: ['user', 'assistant', 'system'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { _id: false });


const OnboardingSessionSchema = new Schema<IOnboardingSession>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'UserProfile',
        required: true
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date
    },
    messages: [MessageSchema],
    sessionSummary: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'analyzed'],
        default: 'active'
    }
}, {
    timestamps: true
});

// Add compound index for userId, courseId, and chapterId
OnboardingSessionSchema.index({ userId: 1 });
// Add index for status to quickly find active sessions
OnboardingSessionSchema.index({ status: 1 });

let OnboardingSession: Model<IOnboardingSession>;

// Check if the model already exists to prevent recompilation error
if (mongoose.models && 'OnboardingSession' in mongoose.models) {
    OnboardingSession = mongoose.models.OnboardingSession as Model<IOnboardingSession>;
} else {
    OnboardingSession = mongoose.model<IOnboardingSession>('OnboardingSession', OnboardingSessionSchema);
}

export default OnboardingSession;