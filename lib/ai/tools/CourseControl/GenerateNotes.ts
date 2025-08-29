// tools/ai/GenerateNotesTool.ts
import { AITool, PatameterType } from '../../AITool';

export type GenerateNotesParams = {
    title: string;
    notes: {
        id: string;
        type: 'heading' | 'term' | 'equation' | 'concept' | 'highlight' | 'tip';
        content: string;
        subtext?: string;
        explanation?: string;
        importance: 'low' | 'medium' | 'high' | 'critical';
        category?: string;
    }[];
    variant?: 'spotlight' | 'notebook' | 'flashcard' | 'bulletin';
    aiPersonality?: 'warm' | 'encouraging' | 'playful';
    interactive?: boolean;
    autoReveal?: boolean;
};

type GenerateNotesResult = {
    message: string;
    notesDisplayed: number;
    interactionType: string;
};

/**
 * Tool for AI to create visual impact notes, terms, equations, and key concepts
 * This tool helps AI tutors present important information in an engaging, memorable way
 */
export class GenerateNotesTool extends AITool<GenerateNotesParams, GenerateNotesResult> {
    readonly name = 'GENERATE_NOTES';

    readonly description = `Create visual impact notes to highlight important terms, equations, concepts, or key information.
    Use this tool to:
    - Present critical equations or formulas with maximum visual impact
    - Highlight important terms and definitions students must remember
    - Show key concepts that need emphasis
    - Create study tips and learning insights
    - Organize information with different importance levels
    
    USAGE GUIDELINES:
    - Use 'critical' importance for must-know concepts, equations, or breakthrough moments
    - Use 'spotlight' variant for dramatic presentation of 1-3 key items
    - Use 'equation' type for mathematical formulas, scientific equations
    - Use 'term' type for vocabulary, definitions, technical terms
    - Use 'concept' type for abstract ideas, theories, principles
    - Use 'highlight' type for key takeaways, important points
    - Use 'tip' type for study advice, learning strategies
    - Always provide explanations for complex terms or equations
    - Match AI personality to the learning context (warm for support, encouraging for challenges, playful for engagement)
    `;

    readonly parameters = {
        properties: {
            title: {
                type: PatameterType.String,
                description: 'Title for the notes collection (e.g., "Key Mathematical Concepts", "Important Terms", "Critical Equations")',
            },
            notes: {
                type: PatameterType.Array,
                description: 'Array of notes to display with visual impact',
                items: {
                    type: PatameterType.Object,
                    properties: {
                        id: {
                            type: PatameterType.String,
                            description: 'Unique identifier for the note',
                        },
                        type: {
                            type: PatameterType.String,
                            enum: ['heading', 'term', 'equation', 'concept', 'highlight', 'tip'],
                            description: 'Type of note content: heading (section titles), term (definitions), equation (formulas), concept (abstract ideas), highlight (key points), tip (study advice)',
                        },
                        content: {
                            type: PatameterType.String,
                            description: 'Main content text - the term, equation, concept, or heading to display prominently',
                        },
                        subtext: {
                            type: PatameterType.String,
                            description: 'Optional subtext or brief description that appears below the main content',
                        },
                        explanation: {
                            type: PatameterType.String,
                            description: 'Detailed explanation that appears when user interacts with the note - highly recommended for equations, terms, and complex concepts',
                        },
                        importance: {
                            type: PatameterType.String,
                            enum: ['low', 'medium', 'high', 'critical'],
                            description: 'Importance level affects visual prominence: critical (pulsing alerts, maximum impact), high (amber highlights), medium (standard), low (subtle)',
                        },
                        category: {
                            type: PatameterType.String,
                            description: 'Optional category for grouping (e.g., "Physics", "Mathematics", "Key Terms")',
                        }
                    },
                    required: ['id', 'type', 'content', 'importance']
                }
            },
            variant: {
                type: PatameterType.String,
                enum: ['spotlight', 'notebook', 'flashcard', 'bulletin'],
                description: 'Display variant: spotlight (cinematic for 1-3 critical items), notebook (organized grid), flashcard (compact cards), bulletin (announcement style)',
                default: 'notebook'
            },
            aiPersonality: {
                type: PatameterType.String,
                enum: ['warm', 'encouraging', 'playful'],
                description: 'AI personality affects colors and messaging: warm (supportive blue), encouraging (motivating green), playful (engaging purple/pink)',
                default: 'warm'
            },
            interactive: {
                type: PatameterType.Boolean,
                description: 'Whether notes are interactive (expandable explanations, bookmarking)',
                default: true
            },
            autoReveal: {
                type: PatameterType.Boolean,
                description: 'Whether to reveal all notes immediately (true) or with staggered animation (false)',
                default: false
            }
        },
        required: ['title', 'notes']
    };

    async execute(
        params: GenerateNotesParams,
        context: {
            userId: string,
            sessionId: string,
            courseId?: string,
            chapterId?: string,
            interactionData?: {
                noteId: string;
                action: 'view' | 'expand' | 'bookmark';
                timestamp: Date;
            }
        }
    ): Promise<GenerateNotesResult> {
        const {
            title,
            notes,
            variant = 'notebook',
            aiPersonality = 'warm',
            interactive = true,
            autoReveal = false
        } = params;

        try {
            // Log the notes creation for analytics
            console.log(`AI creating notes for user ${context.userId}:`, {
                title,
                noteCount: notes.length,
                variant,
                personality: aiPersonality,
                criticalNotes: notes.filter(n => n.importance === 'critical').length,
                types: notes.map(n => n.type)
            });

            // Track note interaction if provided
            if (context.interactionData) {
                console.log(`User interaction with note:`, {
                    userId: context.userId,
                    noteId: context.interactionData.noteId,
                    action: context.interactionData.action,
                    timestamp: context.interactionData.timestamp
                });
            }

            // Validate notes structure
            const validNotes = notes.filter(note => {
                if (!note.id || !note.content || !note.type || !note.importance) {
                    console.warn('Invalid note structure:', note);
                    return false;
                }
                return true;
            });

            if (validNotes.length === 0) {
                throw new Error('No valid notes provided');
            }

            // Determine interaction type based on context
            let interactionType = 'display';
            if (context.interactionData) {
                interactionType = context.interactionData.action;
            } else if (variant === 'spotlight') {
                interactionType = 'spotlight_presentation';
            } else if (interactive) {
                interactionType = 'interactive_display';
            }

            // Generate success message based on content
            const criticalCount = validNotes.filter(n => n.importance === 'critical').length;
            const equationCount = validNotes.filter(n => n.type === 'equation').length;
            const termCount = validNotes.filter(n => n.type === 'term').length;

            let message = `Successfully created ${validNotes.length} notes`;

            if (variant === 'spotlight') {
                message += ` in dramatic spotlight presentation`;
            }

            if (criticalCount > 0) {
                message += ` with ${criticalCount} critical concept${criticalCount > 1 ? 's' : ''}`;
            }

            if (equationCount > 0) {
                message += ` including ${equationCount} equation${equationCount > 1 ? 's' : ''}`;
            }

            if (termCount > 0) {
                message += ` and ${termCount} key term${termCount > 1 ? 's' : ''}`;
            }

            // Add personality-specific message
            switch (aiPersonality) {
                case 'encouraging':
                    message += `. You're making excellent progress understanding these concepts!`;
                    break;
                case 'playful':
                    message += `. Let's explore these exciting ideas together!`;
                    break;
                default:
                    message += `. These concepts will help deepen your understanding.`;
            }

            return {
                message: "Successfully created notes",
                notesDisplayed: validNotes.length,
                interactionType
            };

        } catch (error) {
            console.error('Error generating notes:', error);
            throw new Error(`Failed to generate notes: ${(error as Error).message}`);
        }
    }
}

// Helper functions for common note patterns

/**
 * Helper to create equation notes with proper formatting
 */
export function createEquationNote(
    id: string,
    equation: string,
    description: string,
    explanation: string,
    importance: 'medium' | 'high' | 'critical' = 'high'
) {
    return {
        id,
        type: 'equation' as const,
        content: equation,
        subtext: description,
        explanation,
        importance,
        category: 'Mathematics'
    };
}

/**
 * Helper to create term definition notes
 */
export function createTermNote(
    id: string,
    term: string,
    briefDef: string,
    detailedExplanation: string,
    category?: string,
    importance: 'low' | 'medium' | 'high' = 'medium'
) {
    return {
        id,
        type: 'term' as const,
        content: term,
        subtext: briefDef,
        explanation: detailedExplanation,
        importance,
        category
    };
}

/**
 * Helper to create concept notes for abstract ideas
 */
export function createConceptNote(
    id: string,
    concept: string,
    summary: string,
    fullExplanation: string,
    importance: 'medium' | 'high' | 'critical' = 'high'
) {
    return {
        id,
        type: 'concept' as const,
        content: concept,
        subtext: summary,
        explanation: fullExplanation,
        importance
    };
}

/**
 * Helper to create highlight notes for key takeaways
 */
export function createHighlightNote(
    id: string,
    highlight: string,
    context?: string,
    importance: 'medium' | 'high' = 'high'
) {
    return {
        id,
        type: 'highlight' as const,
        content: highlight,
        subtext: context,
        importance
    };
}

/**
 * Helper to create study tip notes
 */
export function createTipNote(
    id: string,
    tip: string,
    description: string,
    details?: string
) {
    return {
        id,
        type: 'tip' as const,
        content: tip,
        subtext: description,
        explanation: details,
        importance: 'medium' as const
    };
}