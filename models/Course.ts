// models/Course.ts
import { toStringId } from '@/lib/utils';
import mongoose, { Schema, Document, Types, Model } from 'mongoose';

// Define interface for Chapter
export interface IChapter extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    content: string; // Rich text content
    editorData?: string
    videoUrl?: string | null;
    position: number; // To maintain chapter order
    isPublished: boolean;
}
export interface IChapterData {
    _id: string; // String ID instead of ObjectId
    title: string;
    content: string;
    videoUrl?: string | null;
    position: number;
    isPublished: boolean;
}

// Define interface for Chapter snapshot (without Document inheritance)
export type IChapterSnapshot = IChapterData

// Define interface for Course
export interface ICourse extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    category: string;
    level: string;
    price: number;
    imageUrl?: string;
    instructorId: Types.ObjectId; // Reference to UserProfile
    isPublished: boolean;
    chapters: IChapter[];
    // New fields for review system
    reviewStatus: 'draft' | 'pending' | 'approved' | 'rejected';
    reviewComment?: string;
    reviewDate?: Date;
    reviewerId?: Types.ObjectId; // Admin who reviewed the course
    // Public version that's live and available to students
    publicVersion?: {
        title: string;
        description: string;
        category: string;
        level: string;
        price: number;
        imageUrl?: string;
        chapters: IChapterSnapshot[]; // Using snapshot interface
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface CourseData {
    _id: string;
    title: string;
    description: string;
    category: string;
    level: string;
    price: number;
    imageUrl?: string;
    instructorId: string;
    isPublished: boolean;
    chapters: IChapterData[];
    // New fields for review system
    reviewStatus: 'draft' | 'pending' | 'approved' | 'rejected';
    reviewComment?: string;
    reviewDate?: Date;
    reviewerId?: string;
    // Public version that's live and available to students
    publicVersion?: {
        title: string;
        description: string;
        category: string;
        level: string;
        price: number;
        imageUrl?: string;
        chapters: IChapterSnapshot[]; // Using snapshot interface
    };
    createdAt?: Date;
    updatedAt?: Date;
};

// Chapter Schema
const ChapterSchema = new Schema<IChapter>({
    title: { type: String, required: true },
    content: { type: String, default: '' }, // Rich text content
    videoUrl: { type: String },
    position: { type: Number, required: true },
    isPublished: { type: Boolean, default: false }
}, { timestamps: true });

// Define schema for chapter snapshots (without document methods)
const ChapterSnapshotSchema = new Schema({
    _id: { type: String, required: true }, // String ID instead of ObjectId
    title: { type: String, required: true },
    content: { type: String, default: '' },
    videoUrl: { type: String },
    position: { type: Number, required: true },
    isPublished: { type: Boolean, default: false }
}, { _id: false }); // Disable automatic _id generation for snapshots

// Course Schema
const CourseSchema = new Schema<ICourse>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
        level: { type: String, required: true, enum: ['beginner', 'intermediate', 'advanced'] },
        price: { type: Number, required: true },
        imageUrl: { type: String },
        instructorId: { type: Schema.Types.ObjectId, required: true, ref: 'UserProfile' }, // Reference to UserProfile
        isPublished: { type: Boolean, default: false },
        chapters: [ChapterSchema],
        // New fields for review system
        reviewStatus: {
            type: String,
            enum: ['draft', 'pending', 'approved', 'rejected'],
            default: 'draft'
        },
        reviewComment: { type: String },
        reviewDate: { type: Date },
        reviewerId: { type: Schema.Types.ObjectId, ref: 'UserProfile' },
        // Public version that's available to students
        publicVersion: {
            title: { type: String },
            description: { type: String },
            category: { type: String },
            level: { type: String },
            price: { type: Number },
            imageUrl: { type: String },
            chapters: [ChapterSnapshotSchema] // Using snapshot schema instead
        }
    },
    { timestamps: true }
);

let Course: Model<ICourse>;
// Check if the model already exists to prevent recompilation error
if (mongoose.models && 'Course' in mongoose.models) {
    Course = mongoose.models.Course as Model<ICourse>;
} else {
    Course = mongoose.model<ICourse>('Course', CourseSchema);
}

export default Course;

// Helper function to serialize chapter objects
export function serializeChapters(chapters: IChapter[] = []) {
    return chapters.map(chapter => ({
        ...(chapter.toJSON ? chapter.toJSON({ flattenObjectIds: true }) : chapter) as IChapterData,
        _id: toStringId(chapter._id),
    }));
}

// Helper function to serialize chapter snapshots (which already have string IDs)
export function serializeChapterSnapshots(chapters: IChapterSnapshot[] = []) {
    if (!chapters) return [];
    return chapters.map(chapter => ({
        ...chapter,
        _id: chapter._id  // IDs are already strings in snapshots
    }));
}

export function serializeCourse(course: any): CourseData {
    if (!course) return course;

    const result: CourseData = {
        ...course,
        _id: toStringId(course._id),
        instructorId: toStringId(course.instructorId),
        chapters: serializeChapters(course.chapters),
        reviewStatus: course.reviewStatus || 'draft',
        students: course.students,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt
    };

    // Handle reviewer ID if present
    if (course.reviewerId) {
        result.reviewerId = toStringId(course.reviewerId);
    }

    // Handle public version if present
    if (course.publicVersion) {
        result.publicVersion = {
            ...course.publicVersion,
            chapters: serializeChapterSnapshots(course.publicVersion.chapters || [])
        };
    }

    return result;
}