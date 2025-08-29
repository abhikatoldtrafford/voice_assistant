import { toStringId } from '@/lib/utils';
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IEnrollment extends Document {
    userId: string;
    courseId: string;
    enrollmentDate: Date;
    completedChapters: string[];
    isCompleted: boolean;
}

const EnrollmentSchema = new Schema<IEnrollment>(
    {
        userId: { type: String, required: true },
        courseId: { type: String, required: true },
        enrollmentDate: { type: Date, default: Date.now },
        completedChapters: [{ type: String }],
        isCompleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Create a compound index for userId and courseId to ensure a student can only enroll once
EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// Check if model exists before creating a new one (for Next.js hot reloading)
const Enrollment = mongoose.models.Enrollment || mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);

export default Enrollment;

// Helper function to serialize enrollment objects
export function serializeEnrollment(enrollment: any) {
    if (!enrollment) return enrollment;

    return {
        _id: toStringId(enrollment._id),
        userId: toStringId(enrollment.userId),
        courseId: toStringId(enrollment.courseId),
        enrollmentDate: enrollment.enrollmentDate,
        completedChapters: Array.isArray(enrollment.completedChapters)
            ? enrollment.completedChapters.map((id: any) => toStringId(id))
            : [],
        isCompleted: Boolean(enrollment.isCompleted),
        createdAt: enrollment.createdAt,
        updatedAt: enrollment.updatedAt
    };
}