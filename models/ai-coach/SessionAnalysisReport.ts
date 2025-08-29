import mongoose, { Schema, Document, Model } from 'mongoose';

interface IKeyObservation {
    category: string;  // "strength", "weakness", "insight", etc.
    observation: string;
    importance: number;  // 1-10 scale
}

interface IConcept {
    conceptName: string;
    confidenceLevel?: number;  // 1-10 scale
    struggleLevel?: number;    // 1-10 scale
    evidence: string;          // Reference to parts of conversation
}

interface IRecommendedAction {
    action: string;
    priority: number;  // 1-10 scale
    reasoning: string;
}

export interface ISessionAnalysisReport extends Document {
    sessionId: mongoose.Types.ObjectId;  // Reference to CoachingSessions
    userId: mongoose.Types.ObjectId;     // Reference to Users
    courseId: mongoose.Types.ObjectId;   // Reference to Courses
    analysisDate: Date;
    overallUnderstanding: number;        // 1-10 scale
    keyObservations: IKeyObservation[];
    conceptsUnderstood: IConcept[];
    conceptsStruggling: IConcept[];
    recommendedActions: IRecommendedAction[];
    learningStyleInsights: string;
    communicationStyleInsights: string;
    engagementLevelInsights: string;
}

const KeyObservationSchema = new Schema({
    category: {
        type: String,
        required: true
    },
    observation: {
        type: String,
        required: true
    },
    importance: {
        type: Number,
        min: 1,
        max: 10,
        default: 5
    }
}, { _id: false });

const ConceptSchema = new Schema({
    conceptName: {
        type: String,
        required: true
    },
    confidenceLevel: {
        type: Number,
        min: 1,
        max: 10
    },
    struggleLevel: {
        type: Number,
        min: 1,
        max: 10
    },
    evidence: {
        type: String
    }
}, { _id: false });

const RecommendedActionSchema = new Schema({
    action: {
        type: String,
        required: true
    },
    priority: {
        type: Number,
        min: 1,
        max: 10,
        default: 5
    },
    reasoning: {
        type: String
    }
}, { _id: false });

const SessionAnalysisReportSchema = new Schema<ISessionAnalysisReport>({
    sessionId: {
        type: Schema.Types.ObjectId,
        ref: 'CoachingSession',
        required: true
    },
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
    analysisDate: {
        type: Date,
        default: Date.now
    },
    overallUnderstanding: {
        type: Number,
        min: 1,
        max: 10
    },
    keyObservations: [KeyObservationSchema],
    conceptsUnderstood: [ConceptSchema],
    conceptsStruggling: [ConceptSchema],
    recommendedActions: [RecommendedActionSchema],
    learningStyleInsights: {
        type: String
    },
    communicationStyleInsights: {
        type: String
    },
    engagementLevelInsights: {
        type: String
    }
}, {
    timestamps: true
});

// Add unique index for sessionId to ensure one analysis per session
SessionAnalysisReportSchema.index({ sessionId: 1 }, { unique: true });
// Add compound index for userId and courseId for quick lookups
SessionAnalysisReportSchema.index({ userId: 1, courseId: 1 });

let SessionAnalysisReport: Model<ISessionAnalysisReport>;

// Check if the model already exists to prevent recompilation error
if (mongoose.models && 'SessionAnalysisReport' in mongoose.models) {
    SessionAnalysisReport = mongoose.models.SessionAnalysisReport as Model<ISessionAnalysisReport>;
} else {
    SessionAnalysisReport = mongoose.model<ISessionAnalysisReport>('SessionAnalysisReport', SessionAnalysisReportSchema);
}

export default SessionAnalysisReport;