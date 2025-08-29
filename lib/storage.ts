// lib/storage.ts
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';
import mongoose from 'mongoose';
import FileMetadata from '@/models/FileMetadata';
import connectToDatabase from '@/lib/mongodb';

// Initialize S3 client (works with both MinIO and AWS S3)
const s3Client = new S3Client({
    region: process.env.STORAGE_REGION || 'us-east-1',
    endpoint: process.env.STORAGE_ENDPOINT, // MinIO endpoint or leave empty for AWS S3
    forcePathStyle: process.env.STORAGE_ENDPOINT ? true : undefined, // Required for MinIO
    credentials: {
        accessKeyId: process.env.STORAGE_ACCESS_KEY || '',
        secretAccessKey: process.env.STORAGE_SECRET_KEY || '',
    },
});

const bucketName = process.env.STORAGE_BUCKET_NAME || 'edumattor';

// File visibility types
export type FileVisibility = 'public' | 'private' | 'restricted';

/**
 * Uploads a file to object storage with enhanced metadata
 */
export async function uploadFile(
    buffer: Buffer,
    key: string,
    contentType: string,
    options: {
        metadata?: Record<string, string>;
        visibility?: FileVisibility;
        ownerId?: string;
        resourceId?: string; // courseId, userId, etc.
        resourceType?: string; // 'course', 'user', etc.
    } = {}
): Promise<string> {
    try {
        const {
            metadata = {},
            visibility = 'private',
            ownerId,
            resourceId,
            resourceType
        } = options;

        // Add visibility to metadata
        const enhancedMetadata = {
            ...metadata,
            visibility,
            ...(ownerId && { ownerId }),
            ...(resourceId && { resourceId }),
            ...(resourceType && { resourceType }),
        };
        if (key.startsWith('/')) {
            key = key.slice(1);
        }
        console.log({ key });

        // Upload file to S3/MinIO
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: buffer,
            ContentType: contentType,
            Metadata: sanitizeMetadata(enhancedMetadata),
        });

        await s3Client.send(command);

        // Store extended metadata in MongoDB
        await saveFileMetadataToDb({
            path: key,
            contentType,
            size: buffer.length,
            visibility,
            ownerId,
            resourceId,
            resourceType,
            uploadedAt: new Date(),
        });

        // Return the file URL
        return getFileUrl(key);
    } catch (error) {
        console.error('Error uploading file to storage:', error);
        throw error;
    }
}

/**
 * Gets a file from object storage
 */
export async function getFile(key: string): Promise<{ buffer: Buffer; contentType: string; metadata: Record<string, string> }> {
    try {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: key,
        });

        const response = await s3Client.send(command);

        // Convert stream to buffer
        const buffer = await streamToBuffer(response.Body as Readable);

        // Extract and parse metadata
        const metadata: Record<string, string> = {};
        if (response.Metadata) {
            Object.entries(response.Metadata).forEach(([key, value]) => {
                metadata[key] = decodeURIComponent(value);
            });
        }

        return {
            buffer,
            contentType: response.ContentType || 'application/octet-stream',
            metadata,
        };
    } catch (error) {
        console.error('Error getting file from storage:', error);
        throw error;
    }
}

/**
 * Gets file metadata without downloading the file
 */
export async function getFileMetadata(key: string): Promise<any> {
    try {
        // First, check our database for extended metadata
        await connectToDatabase();
        const dbMetadata = await FileMetadata.findOne({ path: key }).lean();

        if (dbMetadata) {
            return dbMetadata;
        }

        // If not in database, check S3 metadata
        const command = new HeadObjectCommand({
            Bucket: bucketName,
            Key: key,
        });

        const response = await s3Client.send(command);

        // Parse S3 metadata
        const metadata: Record<string, string> = {};
        if (response.Metadata) {
            Object.entries(response.Metadata).forEach(([key, value]) => {
                if (typeof value === 'string') {
                    metadata[key] = decodeURIComponent(value);
                }
            });
        }

        return {
            path: key,
            contentType: response.ContentType,
            size: response.ContentLength,
            lastModified: response.LastModified,
            metadata,
        };
    } catch (error) {
        // If file doesn't exist or other error
        return null;
    }
}

/**
 * Deletes a file from object storage
 */
export async function deleteFile(key: string): Promise<boolean> {
    try {
        const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key,
        });

        await s3Client.send(command);

        // Also delete metadata from database
        await connectToDatabase();
        await FileMetadata.deleteOne({ path: key });

        return true;
    } catch (error) {
        console.error('Error deleting file from storage:', error);
        return false;
    }
}

/**
 * Generate a pre-signed URL with expiration for secure access
 * Enhanced with additional protection options for restricted content
 */
export async function generateSignedUrl(
    key: string,
    expiresIn: number = 3600, // 1 hour
    operation: 'get' | 'put' = 'get',
    additionalHeaders: Record<string, string> = {}
): Promise<string> {
    try {
        const command = operation === 'put'
            ? new PutObjectCommand({ Bucket: bucketName, Key: key })
            : new GetObjectCommand({
                Bucket: bucketName,
                Key: key,
                // Add any additional headers
                ...Object.entries(additionalHeaders).reduce((acc, [header, value]) => {
                    acc[header] = value;
                    return acc;
                }, {} as Record<string, string>)
            });

        // Add customized options for signed URL
        const options = {
            expiresIn,
            // Optionally add additional security settings based on file type
            ...Object.entries(additionalHeaders).reduce((acc, [header, value]) => {
                if (header.startsWith('Response')) {
                    const headerName = header.replace('Response', '');
                    acc[headerName] = value;
                }
                return acc;
            }, {} as Record<string, string>)
        };

        return await getSignedUrl(s3Client, command, options);
    } catch (error) {
        console.error('Error generating signed URL:', error);
        throw error;
    }
}

/**
 * Check if a file exists in storage
 */
export async function fileExists(key: string): Promise<boolean> {
    try {
        const command = new HeadObjectCommand({
            Bucket: bucketName,
            Key: key,
        });

        await s3Client.send(command);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Get a public URL for the file
 */
export function getFileUrl(key: string): string {
    // Use public URL pattern based on the storage provider
    if (process.env.STORAGE_ENDPOINT) {
        // MinIO URL format
        return `${process.env.STORAGE_ENDPOINT}/${bucketName}/${key}`;
    } else {
        // AWS S3 URL format
        const region = process.env.STORAGE_REGION || 'us-east-1';
        return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
    }
}

/**
 * Helper to save extended file metadata to MongoDB
 */
async function saveFileMetadataToDb(metadata: {
    path: string;
    contentType: string;
    size: number;
    visibility: FileVisibility;
    ownerId?: string;
    resourceId?: string;
    resourceType?: string;
    uploadedAt: Date;
}) {
    try {
        await connectToDatabase();

        // Upsert the metadata (create or update)
        await FileMetadata.findOneAndUpdate(
            { path: metadata.path },
            metadata,
            { upsert: true, new: true }
        );
    } catch (error) {
        console.error('Error saving file metadata to database:', error);
        // Continue even if metadata save fails
    }
}

/**
 * Helper to convert stream to buffer
 */
async function streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: any[] = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
}

/**
 * Helper to sanitize metadata for S3 headers
 */
function sanitizeMetadata(metadata: Record<string, string>): Record<string, string> {
    const sanitized: Record<string, string> = {};
    for (const [key, value] of Object.entries(metadata)) {
        // URI encode the value to make it HTTP-header-safe
        sanitized[key] = encodeURIComponent(String(value));
    }
    return sanitized;
}