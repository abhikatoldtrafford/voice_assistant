// models/ai-coach/UserMemory.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserMemory extends Document {
    userId: mongoose.Types.ObjectId;  // Reference to UserProfile
    userIdString: string;             // String version of userId
    memory: string;                   // The original memory
    enrichedMemory: string;          // Memory enriched with additional context
    vectorEmbedding: number[];        // Vector embedding for semantic search
    categories: string[];            // Higher-level categories like "hobbies", "skills", etc.
    tags: string[];                   // Tags to categorize memories
    importance: number;               // Score of importance (1-10)
    contextType: string[];            // Array of contexts where this memory is relevant
    createdAt: Date;
    updatedAt: Date;
}

const UserMemorySchema = new Schema<IUserMemory>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'UserProfile',
        required: true,
        index: true
    },
    userIdString: {
        type: String,
        required: true,
        index: true
    },
    memory: {
        type: String,
        required: true
    },
    enrichedMemory: {
        type: String,
        required: true
    },
    vectorEmbedding: [{
        type: Number
    }],
    categories: [{
        type: String,
        index: true
    }],
    tags: [{
        type: String,
        index: true
    }],
    importance: {
        type: Number,
        min: 1,
        max: 10,
        default: 5
    },
    contextType: [{
        type: String,
        enum: ['personal', 'academic', 'career', 'social', 'health', 'interests', 'goals'],
        index: true
    }],
}, {
    timestamps: true
});

// Create compound indexes for efficient queries
UserMemorySchema.index({ userId: 1, tags: 1 });
UserMemorySchema.index({ userId: 1, contextType: 1 });
UserMemorySchema.index({ userId: 1, importance: -1 }); // For retrieving most important memories

// Add text index for basic text search capabilities
UserMemorySchema.index({ memory: 'text' });

// Here we would set up vector search capabilities
// This typically requires a plugin or connection to a vector database
// For example with MongoDB Atlas:
// UserMemorySchema.index({ vectorEmbedding: "vector" }, { 
//   vectorSearchOptions: { numCandidates: 100, similarity: "cosine" } 
// });

let UserMemory: Model<IUserMemory>;

// Check if the model already exists to prevent recompilation error
if (mongoose.models && 'UserMemory' in mongoose.models) {
    UserMemory = mongoose.models.UserMemory as Model<IUserMemory>;
} else {
    UserMemory = mongoose.model<IUserMemory>('UserMemory', UserMemorySchema);
}

export default UserMemory;