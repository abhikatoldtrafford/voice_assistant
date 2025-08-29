import { AITool, PatameterType } from '../../AITool';

type NextChapterParams = {

};

type NextChapterResult = {

};

/**
 * Tool for querying user memories using vector search
 */
export class NextChapterTool extends AITool<NextChapterParams, NextChapterResult> {
    readonly name = 'NEXT_CHAPTER';

    readonly description = `Once the chapter is completed, you can move to the next chapter`;

    readonly parameters = {
        properties: {
        },
    };

    async execute(params: NextChapterParams, context: { userId: string, sessionId: string }): Promise<NextChapterResult> {
        const {
        } = params;
        const { userId } = context;

        try {
            // Call the vector service to search for memories

            // Format the result
            return {
                message: "Chapter Ended"
            };
        } catch (error) {
            console.error('Error querying memories:', error);
            throw new Error(`Failed to query memories: ${(error as Error).message}`);
        }
    }
}