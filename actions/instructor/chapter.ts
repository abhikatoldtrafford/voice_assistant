// app/actions/chapter.ts
'use server'

import { revalidatePath } from 'next/cache';
import Course from '@/models/Course';
import connectToDatabase from '@/lib/mongodb';
import { getCurrentUser } from '../user';
import { Types } from 'mongoose';

// Type for chapter data
type ChapterData = {
    title: string;
    content?: string;
    videoUrl?: string | null;
};

// Helper function to convert ObjectId to string safely
function toStringId(id: any): string {
    if (!id) return '';
    return id.toString ? id.toString() : String(id);
}

// Helper function to serialize a chapter object
function serializeChapter(chapter: any) {
    if (!chapter) return chapter;
    return {
        _id: toStringId(chapter._id),
        title: chapter.title || '',
        content: chapter.content || '',
        videoUrl: chapter.videoUrl,
        position: chapter.position || 0,
        isPublished: Boolean(chapter.isPublished)
    };
}

// Add a new chapter to a course
export async function addChapter(courseId: string, data: ChapterData, instructorId?: string) {
    try {
        console.log("addChapter", { courseId, data, instructorId });

        let user = await getCurrentUser();
        let id = user._id.toString();
        if (user.roles.includes('admin') && instructorId) {
            id = instructorId;
        }

        await connectToDatabase();

        // First get the current position
        const course = await Course.findOne(
            { _id: courseId, instructorId: id },
            { chapters: 1 }
        ).lean();

        if (!course) {
            throw new Error('Course not found or you do not have permission to update it');
        }

        // Determine the position for the new chapter (at the end)
        let position = 1;
        if (course.chapters && course.chapters.length > 0) {
            position = Math.max(...course.chapters.map((ch: any) => ch.position || 0)) + 1;
        }

        // Create a new chapter object with a new ObjectId
        const newChapterId = new Types.ObjectId();

        // Add the chapter using $push
        const result = await Course.findOneAndUpdate(
            { _id: courseId, instructorId: id },
            {
                $push: {
                    chapters: {
                        _id: newChapterId,
                        title: data.title || `Chapter ${position}`,
                        content: data.content || '',
                        videoUrl: data.videoUrl,
                        position,
                        isPublished: false
                    }
                }
            },
            { new: true, lean: true }
        );

        if (!result) {
            throw new Error('Failed to add chapter');
        }

        revalidatePath(`/instructor/courses/${courseId}`);

        return {
            success: true,
            chapterId: toStringId(newChapterId)
        };
    } catch (error: any) {
        console.error('Error adding chapter:', error);
        return { success: false, error: error.message };
    }
}

// Get a chapter by ID
export async function getChapter(courseId: string, chapterId: string, instructorId?: string) {
    try {
        let user = await getCurrentUser();
        let id = user._id.toString();
        if (user.roles.includes('admin') && instructorId) {
            id = instructorId;
        }

        await connectToDatabase();

        // Use lean() query and projection to get only what we need
        const course = await Course.findOne(
            {
                _id: courseId,
                instructorId: id,
                'chapters._id': chapterId
            },
            { 'chapters.$': 1 } // Only return the matched chapter
        ).lean();

        if (!course || !course.chapters || course.chapters.length === 0) {
            throw new Error('Chapter not found');
        }

        // The first chapter in the array is the one we requested due to the $ projection
        const chapter = course.chapters[0];

        return {
            success: true,
            chapter: serializeChapter(chapter)
        };
    } catch (error: any) {
        console.error('Error getting chapter:', error);
        return { success: false, error: error.message };
    }
}

// Update a chapter
export async function updateChapter(courseId: string, chapterId: string, data: Partial<ChapterData>, instructorId?: string) {
    try {
        let user = await getCurrentUser();
        let id = user._id.toString();
        if (user.roles.includes('admin') && instructorId) {
            id = instructorId;
        }

        await connectToDatabase();

        // Use the MongoDB update operators directly
        const updateQuery: any = {};

        if (data.title !== undefined) {
            updateQuery['chapters.$.title'] = data.title;
        }

        if (data.content !== undefined) {
            updateQuery['chapters.$.content'] = data.content;
        }

        if (data.videoUrl !== undefined) {
            updateQuery['chapters.$.videoUrl'] = data.videoUrl;
        }
        console.log("Update query:", updateQuery);


        // Only proceed if there are fields to update
        if (Object.keys(updateQuery).length === 0) {
            return { success: false, error: 'No fields to update' };
        }

        // Update the specific chapter using the positional $ operator
        const result = await Course.findOneAndUpdate(
            {
                _id: courseId,
                instructorId: id,
                'chapters._id': chapterId
            },
            { $set: updateQuery },
            { new: true, lean: true }
        );

        if (!result) {
            throw new Error('Course or chapter not found or you do not have permission to update it');
        }

        // Find the updated chapter in the result
        const updatedChapter = result.chapters.find((ch: any) =>
            toStringId(ch._id) === chapterId
        );

        if (!updatedChapter) {
            throw new Error('Chapter not found after update');
        }

        revalidatePath(`/instructor/courses/${courseId}`);

        return {
            success: true,
            chapter: serializeChapter(updatedChapter)
        };
    } catch (error: any) {
        console.error('Error updating chapter:', error);
        return { success: false, error: error.message };
    }
}

// Delete a chapter
export async function deleteChapter(courseId: string, chapterId: string, instructorId?: string) {
    try {
        let user = await getCurrentUser();
        let id = user._id.toString();
        if (user.roles.includes('admin') && instructorId) {
            id = instructorId;
        }

        await connectToDatabase();

        // Use $pull to remove the chapter from the array
        const result = await Course.findOneAndUpdate(
            {
                _id: courseId,
                instructorId: id
            },
            { $pull: { chapters: { _id: chapterId } } },
            { new: true, lean: true }
        );

        if (!result) {
            throw new Error('Course not found or you do not have permission to delete it');
        }

        // Reorder the remaining chapters using a separate update
        // First, sort the chapters by position
        const sortedChapters = [...result.chapters].sort((a, b) => a.position - b.position);

        // Update each chapter's position
        const bulkOps = sortedChapters.map((chapter, index) => ({
            updateOne: {
                filter: {
                    _id: courseId,
                    'chapters._id': chapter._id
                },
                update: {
                    $set: { 'chapters.$.position': index + 1 }
                }
            }
        }));

        if (bulkOps.length > 0) {
            await Course.bulkWrite(bulkOps);
        }

        revalidatePath(`/instructor/courses/${courseId}`);

        return { success: true };
    } catch (error: any) {
        console.error('Error deleting chapter:', error);
        return { success: false, error: error.message };
    }
}

// Publish/unpublish a chapter
export async function toggleChapterPublish(courseId: string, chapterId: string, isPublished: boolean, instructorId?: string) {
    try {
        let user = await getCurrentUser();
        let id = user._id.toString();
        if (user.roles.includes('admin') && instructorId) {
            id = instructorId;
        }

        await connectToDatabase();

        // Use direct MongoDB update with positional $ operator
        const result = await Course.findOneAndUpdate(
            {
                _id: courseId,
                instructorId: id,
                'chapters._id': chapterId
            },
            {
                $set: { 'chapters.$.isPublished': isPublished }
            },
            { new: true, lean: true }
        );

        if (!result) {
            throw new Error('Course or chapter not found or you do not have permission to update it');
        }

        // Find the updated chapter in the result
        const updatedChapter = result.chapters.find((ch: any) =>
            toStringId(ch._id) === chapterId
        );

        if (!updatedChapter) {
            throw new Error('Chapter not found after update');
        }

        revalidatePath(`/instructor/courses/${courseId}`);

        return {
            success: true,
            chapter: serializeChapter(updatedChapter)
        };
    } catch (error: any) {
        console.error('Error toggling chapter publish status:', error);
        return { success: false, error: error.message };
    }
}

// Reorder chapters
export async function reorderChapters(courseId: string, orderedChapterIds: string[], instructorId?: string) {
    try {
        let user = await getCurrentUser();
        let id = user._id.toString();
        if (user.roles.includes('admin') && instructorId) {
            id = instructorId;
        }

        await connectToDatabase();

        // First, get the course to validate the chapter IDs
        const course = await Course.findOne(
            { _id: courseId, instructorId: id },
            { 'chapters._id': 1 }
        ).lean();

        if (!course) {
            throw new Error('Course not found or you do not have permission to update it');
        }

        // Validate that all chapter IDs are valid
        const existingIds = course.chapters.map((ch: any) => toStringId(ch._id));
        const isValidOrder = orderedChapterIds.every(id => existingIds.includes(id));

        if (!isValidOrder || orderedChapterIds.length !== course.chapters.length) {
            throw new Error('Invalid chapter order');
        }

        // Update each chapter's position using bulkWrite
        const bulkOps = orderedChapterIds.map((chapterId, index) => ({
            updateOne: {
                filter: {
                    _id: courseId,
                    'chapters._id': chapterId
                },
                update: {
                    $set: { 'chapters.$.position': index + 1 }
                }
            }
        }));

        await Course.bulkWrite(bulkOps);

        revalidatePath(`/instructor/courses/${courseId}`);

        return { success: true };
    } catch (error: any) {
        console.error('Error reordering chapters:', error);
        return { success: false, error: error.message };
    }
}

// Get all chapters for a course
export async function getAllChapters(courseId: string, instructorId?: string) {
    try {
        let user = await getCurrentUser();
        let id = user._id.toString();
        if (user.roles.includes('admin') && instructorId) {
            id = instructorId;
        }

        await connectToDatabase();

        // Use lean() query and projection to get only what we need
        const course = await Course.findOne(
            {
                _id: courseId,
                instructorId: id
            },
            { chapters: 1 }
        ).lean();

        if (!course) {
            throw new Error('Course not found');
        }

        // Ensure chapters exists and is an array
        const chapters = Array.isArray(course.chapters) ? course.chapters : [];

        // Serialize chapters
        const serializedChapters = chapters
            .map(chapter => serializeChapter(chapter))
            .sort((a, b) => a.position - b.position);

        return {
            success: true,
            chapters: serializedChapters
        };
    } catch (error: any) {
        console.error('Error getting chapters:', error);
        return { success: false, error: error.message, chapters: [] };
    }
}