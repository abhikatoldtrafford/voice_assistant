'use server'
// services/VectorService.ts
import { OpenAI } from 'openai';
import UserMemory, { IUserMemory } from '@/models/ai-coach/UserMemory';
import mongoose, { PipelineStage } from 'mongoose';
import { toStringId } from '@/lib/utils';
import connectToDatabase from '@/lib/mongodb';

// Initialize OpenAI client (you'll need to set up API keys in your env)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function generateEmbedding(text: string): Promise<number[]> {
    try {
        const response = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: text,
        });

        return response.data[0].embedding;
    } catch (error) {
        console.error('Error generating embedding:', error);
        throw error;
    }
}

/**
 * Enhance a search query to improve vector search results
 * @param query The original search query
 * @returns Enhanced query with additional context
 */
export async function enhanceQuery(query: string): Promise<string> {
    try {
        // Use LLM to enhance the query
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: `You expand search queries to improve semantic memory retrieval.
                    
Your task is to take a user's search query and expand it with:
1. Related concepts and alternative phrasing
2. Specific examples that match the query
3. Additional details that help identify relevant memories

IMPORTANT: Your response should be ONLY the expanded query text with no additional explanation or formatting.`
                },
                {
                    role: "user",
                    content: `Original query: "${query}"`
                }
            ]
        });

        const enhancedQuery = response.choices[0].message.content?.trim() || query;
        return enhancedQuery;
    } catch (error) {
        console.error('Error enhancing query:', error);
        // If there's an error, return the original query
        return query;
    }
}



/**
 * Enriches a memory with additional context to improve vector search
 * @param memory The original memory text
 * @returns Enriched memory with additional context
 */
export async function enrichMemory(memory: string, source?: string): Promise<{
    enrichedMemory: string;
    categories: string[];
}> {
    try {
        // Use LLM to generate enriched context for the memory
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are an AI that enriches personal memories with additional context to improve semantic search.
                    
For each memory, you should:
1. Add synonyms for key terms
2. Add broader categories this memory belongs to (hobbies, skills, preferences, etc.)
3. Add related concepts and activities
4. Determine common search phrases that should match this memory

Format your response as JSON with these fields:
- enrichedMemory: The original memory with added context
- categories: Array of high-level categories this memory belongs to (hobbies, work, family, education, skills, preferences, goals, etc.)

Make the enriched memory natural and conversational. The additional context should flow naturally.`
                },
                {
                    role: "user",
                    content: `Original memory: "${memory}"\n\n Original User Message That Generated this Memory: "${source}"`
                }
            ],
            response_format: { type: "json_object" }
        });

        // Parse the enriched memory and categories
        const result = JSON.parse(response.choices[0].message.content || '{}');

        return {
            enrichedMemory: result.enrichedMemory || memory,
            categories: result.categories || []
        };
    } catch (error) {
        console.error('Error enriching memory:', error);
        // If there's an error, return the original memory
        return {
            enrichedMemory: memory,
            categories: []
        };
    }
}

export async function addMemory(userId: string, memory: string, tags: string[] = [], contextType: string[] = [], importance: number = 5, source?: string): Promise<any> {
    try {
        // Enrich the memory with additional context
        const { enrichedMemory, categories } = await enrichMemory(memory);

        // Generate vector embedding for the memory
        const embedding = await generateEmbedding(`content: ${enrichedMemory}\n tags:[${tags}] contextType:[${contextType}]`);

        // Create new memory document
        const newMemory = new UserMemory({
            userId: new mongoose.Types.ObjectId(userId),
            userIdString: userId,
            memory,
            enrichedMemory,
            vectorEmbedding: embedding,
            categories,
            tags,
            contextType,
            importance
        });

        await newMemory.save();
        return newMemory;
    } catch (error) {
        console.error('Error adding memory:', error);
        throw error;
    }
}

/**
 * Options for finding similar memories
 */
export interface FindSimilarMemoriesOptions {
    limit?: number;
    minRelevanceScore?: number;
    contextType?: string[];
    includeTags?: string[];
    excludeTags?: string[];
}

/**
 * Find memories similar to a query using vector search
 * @param userId User ID
 * @param queryText Search query
 * @param options Search options
 * @returns Array of memories with relevance scores
 */
export async function findSimilarMemories(
    userId: string,
    queryText: string,
    options: FindSimilarMemoriesOptions = {}
): Promise<any[]> {
    try {
        const {
            limit = 5,
            minRelevanceScore = 0.3,
            contextType,
            includeTags,
            excludeTags
        } = options;

        // Enhance the query first
        const enhancedQuery = await enhanceQuery(queryText);
        console.log(`Enhanced query: "${enhancedQuery}" (from original: "${queryText}")`);

        // Generate embedding for the enhanced query
        const queryEmbedding = await generateEmbedding(enhancedQuery);

        // Build the match stage for MongoDB aggregation
        const matchStage: any = {
            userIdString: userId
        };

        // Add context type filter if specified
        if (contextType && contextType.length > 0) {
            matchStage.contextType = { $in: contextType };
        }

        // Add tag filters if specified
        if (includeTags && includeTags.length > 0) {
            matchStage.tags = { $in: includeTags };
        }

        if (excludeTags && excludeTags.length > 0) {
            matchStage.tags = { ...(matchStage.tags || {}), $nin: excludeTags };
        }

        // For MongoDB Atlas Vector Search
        try {
            const pipeline: PipelineStage[] = [
                {
                    $vectorSearch: {
                        index: "memory_vector_index",
                        filter: matchStage,
                        path: "vectorEmbedding",
                        queryVector: queryEmbedding,
                        numCandidates: Math.max(100, limit * 2),
                        limit: limit * 2  // Request more than needed to allow for post-filtering
                    }
                },
                {
                    $addFields: {
                        relevanceScore: { $meta: "vectorSearchScore" }
                    }
                },
                {
                    $match: {
                        relevanceScore: { $gte: minRelevanceScore }
                    }
                },
                {
                    $sort: {
                        relevanceScore: -1
                    }
                },
                {
                    $limit: limit
                }
            ];

            const memories = await UserMemory.aggregate(pipeline);
            return memories.map(m => ({
                ...m,
                _id: toStringId(m._id),
                userId: toStringId(m.userId),
                __v: undefined
            }));
        } catch (vectorError) {
            console.warn('Vector search failed, falling back to text search:', vectorError);

            // Fallback to text search if vector search is not available
            const textSearchPipeline: PipelineStage[] = [
                {
                    $match: {
                        ...matchStage,
                        $text: { $search: queryText }
                    }
                },
                {
                    $addFields: {
                        relevanceScore: { $meta: "textScore" }
                    }
                },
                {
                    $sort: {
                        relevanceScore: -1
                    }
                },
                {
                    $limit: limit
                }
            ];

            return UserMemory.aggregate(textSearchPipeline);
        }
    } catch (error) {
        console.error('Error finding similar memories:', error);
        throw error;
    }
}

export async function updateUserSummary(userId: string): Promise<string> {
    try {
        // Get important memories
        const topMemories = await UserMemory.find({
            userId: new mongoose.Types.ObjectId(userId)
        }).sort({ importance: -1 }).limit(20);

        // Get user profile
        const userProfile = await mongoose.model('UserLearningProfile').findOne({
            userId: new mongoose.Types.ObjectId(userId)
        });

        if (!userProfile) {
            throw new Error('User profile not found');
        }

        // Generate summary using OpenAI
        const memoryTexts = topMemories.map(m => m.memory).join('\n');
        const strengths = userProfile.generalStrengths?.join(', ') || '';
        const weaknesses = userProfile.generalWeaknesses?.join(', ') || '';
        const interests = userProfile.preferredTopics?.join(', ') || '';

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `Create a concise markdown summary of a user based on their profile and important memories. 
Include sections for: 
- brief bio with interests
- strengths, weaknesses, 
- interests hobbies
- some list of key insights that is of importance to the user

The summary should be personal, insightful, and helpful to create personal connection and better know the student personally`
                },
                {
                    role: "user",
                    content: `
                    Strengths: ${strengths}
                    Weaknesses: ${weaknesses}
                    Interests: ${interests}
                    Analytics Ability: ${userProfile.analyticalAbility}/10
                    Critical Thinking: ${userProfile.criticalThinking}/10
                    Problem Solving: ${userProfile.problemSolving}/10
                    
                    Important memories:
                    ${memoryTexts}
                    
                    Generate a comprehensive markdown summary highlighting the user's profile, key characteristics, and learning style.
                    `
                }
            ]
        });

        const summary = response.choices[0].message.content || '';

        // Update the user profile with the new summary
        await mongoose.model('UserLearningProfile').findOneAndUpdate(
            { userId: new mongoose.Types.ObjectId(userId) },
            { summary: summary },
            { new: true }
        );

        return summary;
    } catch (error) {
        console.error('Error updating user summary:', error);
        throw error;
    }
}

export async function getAllMemoryByUserId(userId: string) {
    // Connect to MongoDB
    await connectToDatabase();

    let memories = await UserMemory.find({ userId: userId }).lean();
    return {
        success: true,
        memories: memories.map(memory => {
            return {
                ...memory,
                _id: memory._id.toString(),
            };
        }),
        error: null as string | null
    };
}