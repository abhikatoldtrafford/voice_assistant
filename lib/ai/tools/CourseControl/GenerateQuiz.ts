import { AITool, PatameterType } from '../../AITool';

export type GenerateQuizParams = {
    question: string;
    options: {
        optionText: string;
        correct: boolean;
        explanation?: string;
    }[];
};

type GenerateQuizResult = {

};

/**
 * Tool for querying user memories using vector search
 */
export class GenerateQuizTool extends AITool<GenerateQuizParams, GenerateQuizResult> {
    readonly name = 'GENERATE_QUIZ';

    readonly description = `Ask the user to answer a question based on the provided options
    THERE SHOULD BE ONLY ONE CORRECT ANSWER YOU CAN HAVE ALL OF THEM as a choice if all the answers are correct,
    `;

    readonly parameters = {
        properties: {
            question: {
                type: PatameterType.String,
                description: 'The question to ask the user',
            },
            options: {
                type: PatameterType.Object,
                description: 'Multiple Choice Options for the question with correct and explanation',
                properties: {
                    optionText: {
                        type: PatameterType.String,
                        description: 'The text of the option',
                    },
                    correct: {
                        type: PatameterType.Boolean,
                        description: 'Whether the option is correct',
                    },
                    explanation: {
                        type: PatameterType.String,
                        description: 'Explanation for the option',
                    }
                },
                required: ['optionText', 'correct']
            }
        },
        required: ['question', 'options', 'multiSelect']
    };

    async execute(params: GenerateQuizParams, context: { userId: string, sessionId: string, selectedOption: string }): Promise<GenerateQuizResult> {
        const {
        } = params;

        try {
            return {
                message: `User has Selected Option \n[${context.selectedOption}]\n for the question: \n[${params.question}]`
            };
            // Format the result
        } catch (error) {
            console.error('Error completeting quiz:', error);
            throw new Error(`Failed to complete quiz: ${(error as Error).message}`);
        }
    }
}