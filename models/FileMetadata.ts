// models/FileMetadata.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFileMetadata extends Document {
    path: string;                    // File path/key in storage
    contentType: string;             // MIME type
    size: number;                    // File size in bytes
    visibility: 'public' | 'private' | 'restricted'; // Access control level
    ownerId?: string;                // User ID of owner
    resourceId?: string;             // Related resource ID (course, assignment, etc.)
    resourceType?: string;           // Type of resource (course, assignment, user, etc.)
    accessCount?: number;            // Number of times file was accessed
    lastAccessed?: Date;             // When file was last accessed
    uploadedAt: Date;                // When file was uploaded
    updatedAt?: Date;                // When metadata was last updated
    expiresAt?: Date;                // Optional expiration date
    customMetadata?: any;            // Any additional metadata
}

const FileMetadataSchema = new Schema<IFileMetadata>({
    path: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    contentType: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    visibility: {
        type: String,
        enum: ['public', 'private', 'restricted'],
        default: 'private',
        index: true
    },
    ownerId: {
        type: String,
        index: true
    },
    resourceId: {
        type: String,
        index: true
    },
    resourceType: {
        type: String,
        index: true
    },
    accessCount: {
        type: Number,
        default: 0
    },
    lastAccessed: {
        type: Date
    },
    uploadedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date
    },
    customMetadata: {
        type: Schema.Types.Mixed
    }
}, {
    timestamps: true  // Adds createdAt and updatedAt fields
});

// Create compound indexes for faster queries
FileMetadataSchema.index({ resourceType: 1, resourceId: 1 });
FileMetadataSchema.index({ ownerId: 1, visibility: 1 });

// Check if model exists to prevent recompilation in development
let FileMetadata: Model<IFileMetadata>;

if (mongoose.models && mongoose.models.FileMetadata) {
    FileMetadata = mongoose.models.FileMetadata as Model<IFileMetadata>;
} else {
    FileMetadata = mongoose.model<IFileMetadata>('FileMetadata', FileMetadataSchema);
}

export default FileMetadata;