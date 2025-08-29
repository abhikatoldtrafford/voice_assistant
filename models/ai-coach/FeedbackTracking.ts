import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFeedbackTracking extends Document {
    userId: mongoose.Types.ObjectId;
    sessionId: mongoose.Types.ObjectId;
    feedbackType: 'explicit' | 'implicit';
    rating?: number;                // User provided rating (if explicit)
    sentiment?: 'positive' | 'neutral' | 'negative';
    feedbackText?: string;          // User provided feedback (if explicit)
    implicitIndicators?: {          // Automated detections
        responseTime?: number;      // How quickly they respond
        messageLength?: number;
        sessionDuration?: number;
        completionRate?: number;    // Did they complete planned activities?
    };
    timestamp: Date;
}

const FeedbackTrackingSchema = new Schema<IFeedbackTracking>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'UserProfile',
        required: true
    },
    sessionId: {
        type: Schema.Types.ObjectId,
        ref: 'CoachingSession',
        required: true
    },
    feedbackType: {
        type: String,
        enum: ['explicit', 'implicit'],
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    sentiment: {
        type: String,
        enum: ['positive', 'neutral', 'negative']
    },
    feedbackText: {
        type: String
    },
    implicitIndicators: {
        responseTime: { type: Number },
        messageLength: { type: Number },
        sessionDuration: { type: Number },
        completionRate: { type: Number, min: 0, max: 1 }
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Add compound index for sessionId and userId
FeedbackTrackingSchema.index({ sessionId: 1, userId: 1 });
// Add index for feedbackType for quick filtering
FeedbackTrackingSchema.index({ feedbackType: 1 });

let FeedbackTracking: Model<IFeedbackTracking>;

// Check if the model already exists to prevent recompilation error
if (mongoose.models && 'FeedbackTracking' in mongoose.models) {
    FeedbackTracking = mongoose.models.FeedbackTracking as Model<IFeedbackTracking>;
} else {
    FeedbackTracking = mongoose.model<IFeedbackTracking>('FeedbackTracking', FeedbackTrackingSchema);
}

export default FeedbackTracking;