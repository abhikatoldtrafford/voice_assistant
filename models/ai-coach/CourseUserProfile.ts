import mongoose, { Schema, Document, Model } from 'mongoose';

interface IConcept {
    conceptName: string;
    severity?: number;      // 1-10 scale
    masteryLevel?: number;  // 1-10 scale
    notes: string;
}

export interface ICourseUserProfile extends Document {
    userId: mongoose.Types.ObjectId;      // Reference to Users
    courseId: mongoose.Types.ObjectId;    // Reference to Courses
    strengths: string[];                  // Course-specific strengths
    weaknesses: string[];                 // Course-specific weaknesses
    misunderstoodConcepts: IConcept[];
    masteredConcepts: IConcept[];
    comprehensionLevel: number;           // Overall course comprehension (1-10)
    engagementLevel: number;              // How engaged with this course (1-10)
    lastUpdated: Date;
}

const ConceptSchema = new Schema({
    conceptName: { type: String, required: true },
    severity: { type: Number, min: 1, max: 10 },
    masteryLevel: { type: Number, min: 1, max: 10 },
    notes: { type: String }
}, { _id: false });

const CourseUserProfileSchema = new Schema<ICourseUserProfile>({
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
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    misunderstoodConcepts: [ConceptSchema],
    masteredConcepts: [ConceptSchema],
    comprehensionLevel: {
        type: Number,
        min: 1,
        max: 10,
        default: 5
    },
    engagementLevel: {
        type: Number,
        min: 1,
        max: 10,
        default: 5
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Add compound index for userId and courseId to ensure uniqueness
CourseUserProfileSchema.index({ userId: 1, courseId: 1 }, { unique: true });

let CourseUserProfile: Model<ICourseUserProfile>;

// Check if the model already exists to prevent recompilation error
if (mongoose.models && 'CourseUserProfile' in mongoose.models) {
    CourseUserProfile = mongoose.models.CourseUserProfile as Model<ICourseUserProfile>;
} else {
    CourseUserProfile = mongoose.model<ICourseUserProfile>('CourseUserProfile', CourseUserProfileSchema);
}

export default CourseUserProfile;