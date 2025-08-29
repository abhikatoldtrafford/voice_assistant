// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/user';
import { uploadFile } from '@/lib/storage';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import FileMetadata from '@/models/FileMetadata';
import { getCourseById } from '@/actions/course';

// Maximum file size (100MB - to accommodate videos)
const MAX_FILE_SIZE = 100 * 1024 * 1024;

// Allowed file types
const ALLOWED_FILE_TYPES = [
    // Images
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    // Videos
    'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo',
    // Documents
    'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    // Audio
    'audio/mpeg', 'audio/wav',
];

/**
 * POST handler for file uploads with enhanced visibility control
 */
export async function POST(request: NextRequest) {
    try {
        // Get the current user
        const currentUser = await getCurrentUser().catch(() => null);

        if (!currentUser) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Verify the request is multipart/form-data
        const contentType = request.headers.get('content-type') || '';
        if (!contentType.includes('multipart/form-data')) {
            return NextResponse.json(
                { error: 'Content type must be multipart/form-data' },
                { status: 400 }
            );
        }

        // Parse the form data
        const formData = await request.formData();

        // Get the file
        const file = formData.get('file') as File | null;
        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: `File size exceeds the maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB` },
                { status: 400 }
            );
        }

        // Check file type
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: 'File type not allowed' },
                { status: 400 }
            );
        }

        // Extract additional metadata from form
        const directory = formData.get('directory') as string || `users/${currentUser._id.toString()}/uploads`;
        const visibility = formData.get('visibility') as 'public' | 'private' | 'restricted' || 'private';
        const resourceId = formData.get('resourceId') as string;
        const resourceType = formData.get('resourceType') as string;

        // Determine visibility based on path and explicit settings
        let effectiveVisibility = visibility;

        // Override visibility for certain paths
        if (directory.startsWith('public/')) {
            effectiveVisibility = 'public';
        }
        // Course paths logic
        else if (directory.startsWith('courses/')) {
            // Extract course ID
            const courseIdMatch = directory.match(/^courses\/([^\/]+)/);
            if (courseIdMatch) {
                const courseId = courseIdMatch[1];

                // Check permission for course uploads
                const courseResult = await getCourseById(courseId);

                // Only course instructor or admin can upload to course directories
                if (!courseResult.success ||
                    (courseResult.course?.instructorId !== currentUser._id.toString() &&
                        !currentUser.roles.includes('admin'))) {
                    return NextResponse.json(
                        { error: 'You do not have permission to upload files to this course' },
                        { status: 403 }
                    );
                }

                // Course visibility rules
                if (directory.includes('/public/')) {
                    effectiveVisibility = 'public';
                } else if (directory.includes('/videos/') || directory.includes('/resources/')) {
                    effectiveVisibility = 'restricted';
                }
            }
        }

        // Sanitize directory path to prevent directory traversal
        const sanitizedDirectory = path.normalize(directory).replace(/^(\.\.[\/\\])+/, '');

        // Generate a unique filename
        const fileExtension = path.extname(file.name);
        const timestamp = Date.now();
        const uniqueId = uuidv4().substring(0, 8);
        const uniqueFilename = `${path.basename(file.name, fileExtension)}_${timestamp}_${uniqueId}${fileExtension}`;

        // Construct the key (path) for storage
        const key = path.join(sanitizedDirectory, uniqueFilename).replace(/\\/g, '/');

        // Read the file as an ArrayBuffer and convert to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to storage with enhanced metadata
        const fileUrl = await uploadFile(buffer, key, file.type, {
            metadata: {
                originalName: file.name,
                uploadedBy: currentUser._id.toString(),
            },
            visibility: effectiveVisibility,
            ownerId: currentUser._id.toString(),
            resourceId: resourceId || (directory.startsWith('courses/') ? directory.split('/')[1] : undefined),
            resourceType: resourceType || (directory.startsWith('courses/') ? 'course' : undefined),
        });

        // Return success response with the file information
        return NextResponse.json({
            success: true,
            fileKey: key,
            fileUrl: fileUrl,
            fileName: uniqueFilename,
            fileSize: file.size,
            fileType: file.type,
            directory: sanitizedDirectory,
            visibility: effectiveVisibility,
        });
    } catch (error: any) {
        console.error('Error uploading file:', error);

        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}