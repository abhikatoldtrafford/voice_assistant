// lib/nfs.ts
import { promises as fs, Stats } from 'fs';
import path from 'path';

// NFS connection configuration
const NFS_MOUNT_PATH = process.env.NFS_MOUNT_PATH || '/mnt/nfs-storage';
const NFS_USER = process.env.NFS_USER;
const NFS_PASSWORD = process.env.NFS_PASSWORD;

/**
 * Authenticates with the NFS system
 * 
 * In a real implementation, this might involve Kerberos or another authentication mechanism
 * For this example, we're just checking that the environment variables are set
 */
export async function authenticateWithNFS() {
    // if (!NFS_USER || !NFS_PASSWORD) {
    //     throw new Error('NFS credentials not configured');
    // }

    try {
        // Verify the NFS mount is accessible
        await fs.access(NFS_MOUNT_PATH);
        return true;
    } catch (error) {
        console.error('Failed to access NFS mount:', error);
        throw new Error('NFS mount not accessible');
    }
}

/**
 * Checks if a user has access to a specific file
 */
export async function userHasAccessToFile(userId: string, filePath: string): Promise<boolean> {
    try {
        // In a real system, you would check against a database of permissions
        // For this example, we'll implement a simple path-based check

        // Example: Files in user's directory
        if (filePath.startsWith(`/user/${userId}/`)) {
            return true;
        }

        // Example: Course files that the user has access to
        if (filePath.startsWith('/courses/')) {
            // Here you would check if the user has access to the course
            // For simplicity, we'll allow access to all course files
            return true;
        }

        // Example: Shared files that all authenticated users can access
        if (filePath.startsWith('/shared/')) {
            return true;
        }

        // For any other paths, check if there's specific access granted
        // This would typically involve checking a database or ACL system

        return false;
    } catch (error) {
        console.error(`Error checking file access for user ${userId}:`, error);
        return false;
    }
}

/**
 * Gets the full path to a file on the NFS system
 */
export function getNFSFilePath(relativePath: string): string {
    // Sanitize the path to prevent directory traversal attacks
    const sanitizedPath = path.normalize(relativePath).replace(/^(\.\.[\/\\])+/, '');
    return path.join(NFS_MOUNT_PATH, sanitizedPath);
}

/**
 * Retrieves a file from the NFS system if the user has access
 */
export async function getFileFromNFS(relativePath: string): Promise<{
    filePath: string;
    fileExists: boolean;
    mimeType: string;
}> {
    // Authenticate with NFS
    await authenticateWithNFS();

    // Get the full path to the file
    const filePath = getNFSFilePath(relativePath);

    try {
        // Check if the file exists
        await fs.access(filePath);

        // Determine the MIME type based on file extension
        const ext = path.extname(filePath).toLowerCase();
        let mimeType = 'application/octet-stream'; // Default

        // Extended MIME type mapping including video formats
        switch (ext) {
            // Document formats
            case '.pdf':
                mimeType = 'application/pdf';
                break;
            case '.doc':
                mimeType = 'application/msword';
                break;
            case '.docx':
                mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                break;
            case '.xlsx':
                mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                break;
            case '.txt':
                mimeType = 'text/plain';
                break;

            // Image formats
            case '.jpg':
            case '.jpeg':
                mimeType = 'image/jpeg';
                break;
            case '.png':
                mimeType = 'image/png';
                break;
            case '.gif':
                mimeType = 'image/gif';
                break;
            case '.svg':
                mimeType = 'image/svg+xml';
                break;
            case '.webp':
                mimeType = 'image/webp';
                break;

            // Video formats
            case '.mp4':
                mimeType = 'video/mp4';
                break;
            case '.webm':
                mimeType = 'video/webm';
                break;
            case '.ogg':
                mimeType = 'video/ogg';
                break;
            case '.mov':
                mimeType = 'video/quicktime';
                break;
            case '.avi':
                mimeType = 'video/x-msvideo';
                break;
            case '.mkv':
                mimeType = 'video/x-matroska';
                break;
            case '.flv':
                mimeType = 'video/x-flv';
                break;

            // Audio formats
            case '.mp3':
                mimeType = 'audio/mpeg';
                break;
            case '.wav':
                mimeType = 'audio/wav';
                break;

            // Add more types as needed
        }

        return {
            filePath,
            fileExists: true,
            mimeType,
        };
    } catch (error) {
        return {
            filePath,
            fileExists: false,
            mimeType: 'application/octet-stream',
        };
    }
}

/**
 * Uploads a file to the NFS system
 */
export async function uploadFileToNFS(
    buffer: Buffer,
    relativePath: string
): Promise<boolean> {
    try {
        // Authenticate with NFS
        await authenticateWithNFS();

        // Get the full path to save the file
        const filePath = getNFSFilePath(relativePath);

        // Ensure the directory exists
        const directory = path.dirname(filePath);
        await fs.mkdir(directory, { recursive: true });

        // Write the file
        await fs.writeFile(filePath, Uint8Array.from(buffer));

        return true;
    } catch (error) {
        console.error('Error uploading file to NFS:', error);
        return false;
    }
}

/**
 * Lists files in a directory on the NFS system
 */
export async function listFilesInDirectory(relativePath: string): Promise<string[]> {
    try {
        // Authenticate with NFS
        await authenticateWithNFS();

        // Get the full path to the directory
        const dirPath = getNFSFilePath(relativePath);

        // Read the directory
        const files = await fs.readdir(dirPath);

        return files;
    } catch (error) {
        console.error('Error listing files in NFS directory:', error);
        return [];
    }
}

/**
 * Gets stats for a file on the NFS system
 */
export async function getFileStats(relativePath: string): Promise<Stats | null> {
    try {
        // Authenticate with NFS
        await authenticateWithNFS();

        // Get the full path to the file
        const filePath = getNFSFilePath(relativePath);

        // Get file stats
        const stats = await fs.stat(filePath);

        return stats;
    } catch (error) {
        console.error('Error getting file stats:', error);
        return null;
    }
}

/**
 * Streams a file from the NFS system
 * This is useful for large files like videos where you want to
 * stream the content rather than load it all into memory
 */
export async function createFileReadStream(relativePath: string): Promise<NodeJS.ReadableStream | null> {
    try {
        // Authenticate with NFS
        await authenticateWithNFS();

        // Get the full path to the file
        const filePath = getNFSFilePath(relativePath);

        // Create and return a read stream
        const { createReadStream } = require('fs');
        return createReadStream(filePath);
    } catch (error) {
        console.error('Error creating file read stream:', error);
        return null;
    }
}