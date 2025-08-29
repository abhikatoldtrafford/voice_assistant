import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/user';
import {
    getFile,
    fileExists,
    generateSignedUrl,
    getFileMetadata
} from '@/lib/storage';
import { checkEnrollment } from '@/actions/enrollment';
import { getCourseById } from '@/actions/course';
import FileMetadata from '@/models/FileMetadata';
import connectToDatabase from '@/lib/mongodb';

/**
 * GET handler for file requests with access control
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        let paramsData = await params;
        // Get the file path from URL params
        const filePath = paramsData.path.join('/');

        // 1. Check if the file exists first
        const exists = await fileExists(filePath);
        if (!exists) {
            return NextResponse.json(
                { error: 'File not found' },
                { status: 404 }
            );
        }

        // 2. Get file metadata
        const metadata = await getFileMetadata(filePath);

        // 3. Check access permissions
        const hasAccess = await checkFileAccess(filePath, metadata);

        if (!hasAccess) {
            return NextResponse.json(
                { error: 'You do not have permission to access this file' },
                { status: 403 }
            );
        }

        // 4. Determine how to serve the file
        const url = new URL(request.url);
        const downloadParam = url.searchParams.get('download');
        const isVideo = metadata.contentType?.startsWith('video/');

        // 5. For protected videos, use a streaming approach instead of redirect
        if (isVideo && metadata.visibility === 'restricted') {
            // If download is explicitly requested, check if it's allowed
            if (downloadParam === 'true') {
                const currentUser = await getCurrentUser().catch(() => null);
                if (!currentUser?.roles.includes('admin') && !currentUser?.roles.includes('instructor')) {
                    return NextResponse.json(
                        { error: 'You do not have permission to download this video' },
                        { status: 403 }
                    );
                }
            }

            // Get the file directly instead of redirecting
            const { buffer, contentType } = await getFile(filePath);

            // Create response with streaming headers
            const response = new NextResponse(buffer);

            // Set content type
            response.headers.set('Content-Type', contentType);

            // Set content disposition to inline to force browser to play it
            response.headers.set('Content-Disposition', 'inline');

            // Add security headers
            response.headers.set('X-Content-Type-Options', 'nosniff');
            response.headers.set('Cache-Control', 'private, no-store, no-cache, must-revalidate, proxy-revalidate');
            response.headers.set('Pragma', 'no-cache');
            response.headers.set('Expires', '0');

            // Headers to prevent download
            response.headers.set('X-Frame-Options', 'SAMEORIGIN');
            response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
            response.headers.set('X-Download-Options', 'noopen');

            // Update access statistics
            updateFileAccessStats(filePath).catch(console.error);

            return response;
        }

        // 6. For other files, keep existing logic
        const { buffer, contentType } = await getFile(filePath);

        // Update access statistics
        updateFileAccessStats(filePath).catch(console.error);

        // Create response with appropriate headers
        const response = new NextResponse(buffer);
        response.headers.set('Content-Type', contentType);

        if (downloadParam === 'true' && !isVideo) {
            const filename = filePath.split('/').pop() || 'download';
            response.headers.set('Content-Disposition', `attachment; filename="${filename}"`);
        } else {
            response.headers.set('Content-Disposition', 'inline');
        }

        // Set cache headers based on file visibility
        if (metadata.visibility === 'public') {
            // Cache public files longer (1 week)
            response.headers.set('Cache-Control', 'public, max-age=604800');
        } else {
            // Short cache or no cache for private files
            response.headers.set('Cache-Control', 'private, max-age=3600, no-store');
        }

        return response;
    } catch (error) {
        console.error('Error serving file:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve file' },
            { status: 500 }
        );
    }
}

/**
 * HEAD handler for checking if a file exists without downloading
 */
export async function HEAD(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        let paramsData = await params;
        // Get the file path from URL params
        const filePath = paramsData.path.join('/');

        // Check if file exists
        const exists = await fileExists(filePath);
        if (!exists) {
            return new NextResponse(null, { status: 404 });
        }

        // Get metadata
        const metadata = await getFileMetadata(filePath);

        // Check access permissions
        const hasAccess = await checkFileAccess(filePath, metadata);

        if (!hasAccess) {
            return new NextResponse(null, { status: 403 });
        }

        // Return headers only
        const response = new NextResponse(null, { status: 200 });

        if (metadata.contentType) {
            response.headers.set('Content-Type', metadata.contentType);
        }

        if (metadata.size) {
            response.headers.set('Content-Length', metadata.size.toString());
        }

        return response;
    } catch (error) {
        console.error('Error checking file:', error);
        return new NextResponse(null, { status: 500 });
    }
}

/**
 * Check if the current user has access to the requested file
 */
async function checkFileAccess(filePath: string, metadata: any): Promise<boolean> {
    try {
        // Get current user
        const currentUser = await getCurrentUser().catch(() => null);

        // PUBLIC FILES: Anyone can access public files
        if (metadata?.visibility === 'public' || filePath.startsWith('public/')) {
            return true;
        }

        // Public course assets
        if (filePath.match(/^courses\/[^\/]+\/public\//)) {
            return true;
        }

        // If no user is authenticated, only public files are accessible
        if (!currentUser) {
            return false;
        }

        // ADMIN ACCESS: Admins can access any file
        if (currentUser.roles.includes('admin')) {
            return true;
        }

        // USER'S OWN FILES: Users can access their own files
        if (
            metadata?.ownerId === currentUser._id.toString() ||
            filePath.startsWith(`users/${currentUser._id.toString()}/`)
        ) {
            return true;
        }

        // COURSE FILES: Check course-specific permissions
        if (filePath.startsWith('courses/')) {
            // Extract course ID from path
            const courseIdMatch = filePath.match(/^courses\/([^\/]+)/);
            if (!courseIdMatch) {
                return false;
            }

            const courseId = courseIdMatch[1];

            // Check if user is the course instructor
            const courseResult = await getCourseById(courseId);
            if (
                courseResult.success && courseResult.course &&
                courseResult.course.instructorId === currentUser._id.toString()
            ) {
                return true;
            }

            // For course videos and resources, check enrollment
            if (filePath.includes('/videos/') || filePath.includes('/resources/')) {
                return await checkEnrollment(courseId, currentUser._id.toString());
            }
        }

        // Default: deny access
        return false;
    } catch (error) {
        console.error('Error checking file access:', error);
        return false;
    }
}

/**
 * Update file access statistics
 */
async function updateFileAccessStats(filePath: string): Promise<void> {
    try {
        await connectToDatabase();

        // Update access count and last accessed time
        await FileMetadata.findOneAndUpdate(
            { path: filePath },
            {
                $inc: { accessCount: 1 },
                $set: { lastAccessed: new Date() }
            }
        );
    } catch (error) {
        console.error('Error updating file access stats:', error);
        // Don't throw, this is non-critical
    }
}