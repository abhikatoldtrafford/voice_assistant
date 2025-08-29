import mongoose, { Schema, Document, Model } from 'mongoose';

interface IMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
}

interface IKeyInsight {
    type: string;  // "question", "confusion", "understanding", etc.
    content: string;
    timestamp: Date;
}

export interface ICoachingSession extends Document {
    userId: mongoose.Types.ObjectId;      // Reference to Users
    courseId: mongoose.Types.ObjectId;    // Reference to Courses
    chapterId: mongoose.Types.ObjectId;   // Reference to course chapter
    startTime: Date;
    endTime?: Date;
    duration?: number;                    // In minutes
    messages: IMessage[];
    keyInsights: IKeyInsight[];
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

const KeyInsightSchema = new Schema({
    type: {
        type: String,
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

const CoachingSessionSchema = new Schema<ICoachingSession>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'UserProfile',
        required: true
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    chapterId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date
    },
    duration: {
        type: Number
    },
    messages: [MessageSchema],
    keyInsights: [KeyInsightSchema],
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
CoachingSessionSchema.index({ userId: 1, courseId: 1, chapterId: 1 });
// Add index for status to quickly find active sessions
CoachingSessionSchema.index({ status: 1 });

let CoachingSession: Model<ICoachingSession>;

// Check if the model already exists to prevent recompilation error
if (mongoose.models && 'CoachingSession' in mongoose.models) {
    CoachingSession = mongoose.models.CoachingSession as Model<ICoachingSession>;
} else {
    CoachingSession = mongoose.model<ICoachingSession>('CoachingSession', CoachingSessionSchema);
}

export default CoachingSession;