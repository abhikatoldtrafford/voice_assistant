// src/lib/ai/tools/MemoryQueryTool.ts
import { findSimilarMemories } from '@/actions/memory-retrival';
import { AITool, PatameterType } from '../AITool';

type MemoryQueryParams = {
    query: string;
    limit?: number;
    minRelevanceScore?: number;
    contextType?: string | string[];
};

type MemoryQueryResult = {
    memories: Array<{
        id: string;
        memory: string;
        tags: string[];
        contextType: string[];
        importance: number;
        relevanceScore: number;
        createdAt: string;
    }>;
    totalFound: number;
    query: string;
    message?: string;
};

/**
 * Tool for querying user memories using vector search
 */
export class MemoryQueryTool extends AITool<MemoryQueryParams, MemoryQueryResult> {
    readonly name = 'MEMORY_SEARCH';

    readonly description = `
    When using 'MEMORY_SEARCH' always give a heads-up before searching and then perform the search. like "let me try to remember...", "Oh let me see what was that..."
    `;

    readonly parameters = {
        properties: {
            query: {
                type: PatameterType.String,
                description: 'The search query to find semantically similar memories'
            },
            limit: {
                type: PatameterType.Number,
                description: 'Maximum number of memories to return. Default is 5.',
                minimum: 1,
                maximum: 20
            },
            minRelevanceScore: {
                type: PatameterType.Number,
                description: 'Minimum relevance score (0.0 to 1.0) for returned memories. Default is 0.7.',
                minimum: 0.0,
                maximum: 1.0
            },
            contextType: {
                type: PatameterType.Array,
                description: 'Filter memories by context type(s)',
                items: {
                    type: PatameterType.String,
                    enum: ['personal', 'academic']
                }
            },
        },

        required: ['query']
    };

    async execute(params: MemoryQueryParams, context: { userId: string }): Promise<MemoryQueryResult> {
        const {
            query,
            limit = 5,
            minRelevanceScore = 0.6,
            contextType,
        } = params;
        const { userId } = context;

        try {
            // Call the vector service to search for memories
            const memories = await findSimilarMemories(
                userId,
                query,
                {
                    limit,
                    minRelevanceScore,
                    contextType: Array.isArray(contextType) ? contextType : contextType ? [contextType] : undefined,
                    // includeTags,
                    // excludeTags
                }
            );

            // Format the result
            return {
                memories: memories.map(memory => ({
                    id: memory._id.toString(),
                    memory: memory.memory,
                    tags: memory.tags || [],
                    contextType: memory.contextType || [],
                    importance: memory.importance || 5,
                    relevanceScore: memory.relevanceScore || 0,  // This would be provided by the vector search
                    createdAt: memory.createdAt.toISOString()
                })),
                totalFound: memories.length,
                query,
                message: memories.length === 0 ?
                    "No memories found. Try a different query or add more memories." :
                    `Found ${memories.length} relevant memories.`
            };
        } catch (error) {
            console.error('Error querying memories:', error);
            throw new Error(`Failed to query memories: ${(error as Error).message}`);
        }
    }
}