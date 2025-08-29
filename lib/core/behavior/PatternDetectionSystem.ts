// Modular Student Behavior Detection System
// Integrating with existing RelationshipConceptDetector and LearningConceptDetector

import { PorterStemmer, SentimentAnalyzer } from "./NLP";

// ============================================================================
// CORE PATTERN DETECTION ENGINE
// ============================================================================

interface PatternRule {
    keywords: string[];
    phrases: string[];
    semanticPatterns: string[];
    negationWords?: string[];
    contextBoosts?: string[];
    minConfidence?: number;
}

interface DetectionResult {
    matched: boolean;
    confidence: number;
    matchedPatterns: string[];
    context: string;
}

export enum Concept {
    TRUST = 'trust',
    RESPECT = 'respect',
    EFFECTIVE_COMMUNICATION = 'effective_communication',
    EMPATHY = 'empathy',
    RECIPROCITY = 'reciprocity',
    HONESTY = 'honesty',
    ATTENTION = 'attention',
    COGNITIVE_LOAD = 'cognitive_load',
    METACOGNITION = 'metacognition'
}


export class RobustPatternDetector {
    private stemmer = new PorterStemmer();
    private sentiment = new SentimentAnalyzer();

    // Pattern definitions organized by concept type
    private readonly TRUST_PATTERNS = {
        VULNERABILITY_SHARING: {
            keywords: ['confused', 'struggling', 'lost', 'worried', 'help', 'understand'],
            phrases: [
                'i don\'t understand', 'i\'m confused', 'i\'m struggling',
                'can you help', 'i need help', 'i\'ve never been good at',
                'i\'m worried about', 'i feel lost', 'this is hard for me',
                'i admit i don\'t know', 'i\'m having trouble with',
                'i\'m not good at this', 'i really need help'
            ],
            semanticPatterns: ['vulnerability_expressions', 'help_seeking', 'struggle_admission'],
            contextBoosts: ['learning', 'difficulty', 'problem'],
            minConfidence: 0.6
        },
        OPENNESS_DEMONSTRATED: {
            keywords: ['tell', 'explain', 'learn', 'show', 'trust', 'more'],
            phrases: [
                'tell me more', 'explain that', 'i want to learn',
                'show me how', 'i trust you', 'you seem to know',
                'help me understand', 'i\'m willing to try',
                'teach me about', 'i\'d like to know more'
            ],
            semanticPatterns: ['learning_willingness', 'trust_indicators', 'engagement_markers'],
            contextBoosts: ['explanation', 'teaching', 'guidance']
        },
        SKEPTICISM_PRESENT: {
            keywords: ['whatever', 'guess', 'wrong', 'pointless', 'doubt', 'sure'],
            phrases: [
                'whatever', 'i guess', 'probably wrong', 'doesn\'t matter',
                'you wouldn\'t understand', 'this is pointless', 'sure, whatever',
                'if you say so', 'i doubt it', 'yeah right',
                'that\'s what they all say', 'i\'ve heard that before'
            ],
            semanticPatterns: ['skepticism_indicators', 'dismissive_language', 'doubt_expressions'],
            negationWords: ['not', 'never', 'don\'t'],
            minConfidence: 0.5
        }
    };

    private readonly RESPECT_PATTERNS = {
        COURTESY_DEMONSTRATED: {
            keywords: ['please', 'thank', 'thanks', 'appreciate', 'sorry', 'excuse'],
            phrases: [
                'please', 'thank you', 'thanks', 'i appreciate',
                'sorry for', 'excuse me', 'if you don\'t mind',
                'would you please', 'i\'d appreciate if', 'thank you for your help'
            ],
            semanticPatterns: ['politeness_markers', 'gratitude_expressions', 'courtesy_indicators'],
            contextBoosts: ['request', 'help', 'explanation']
        },
        DISRESPECT_DETECTED: {
            keywords: ['stupid', 'dumb', 'whatever', 'shut', 'hurry', 'get'],
            phrases: [
                'stupid', 'dumb', 'whatever', 'shut up',
                'hurry up', 'just tell me', 'get on with it',
                'this is stupid', 'you\'re dumb', 'stop wasting time',
                'i don\'t care', 'who cares'
            ],
            semanticPatterns: ['disrespectful_language', 'dismissive_behavior', 'rude_expressions'],
            minConfidence: 0.7
        },
        IMPATIENCE_SHOWN: {
            keywords: ['hurry', 'come', 'faster', 'quick', 'time', 'point'],
            phrases: [
                'hurry up', 'come on', 'faster', 'be quick',
                'i don\'t have time', 'get to the point',
                'speed it up', 'move along', 'let\'s go',
                'i\'m in a hurry', 'make it quick'
            ],
            semanticPatterns: ['impatience_indicators', 'rushing_behavior', 'time_pressure'],
            contextBoosts: ['waiting', 'explanation', 'process']
        }
    };

    private readonly COMMUNICATION_PATTERNS = {
        CLEAR_COMMUNICATION: {
            keywords: ['question', 'explain', 'understand', 'clarify', 'mean', 'help'],
            phrases: [
                'what do you mean', 'can you explain', 'i need clarification',
                'could you clarify', 'help me understand',
                'let me ask you', 'i have a question about',
                'can you break that down', 'walk me through'
            ],
            semanticPatterns: ['clarification_seeking', 'detailed_questions', 'understanding_pursuit'],
            contextBoosts: ['explanation', 'concept', 'problem']
        },
        UNCLEAR_COMMUNICATION: {
            keywords: ['idk', 'dunno', 'meh', 'sure', 'ok', 'fine', 'yeah'],
            phrases: [
                'idk', 'i don\'t know', 'dunno', 'meh', 'sure', 'ok', 'fine', 'yeah',
                'whatever', 'i guess', 'maybe', 'kinda', 'sort of'
            ],
            semanticPatterns: ['minimal_responses', 'vague_expressions', 'disengagement_markers'],
            minConfidence: 0.4
        }
    };

    private readonly EMPATHY_PATTERNS = {
        EMPATHY_SHOWN: {
            keywords: ['understand', 'sense', 'see', 'hard', 'difficult', 'get'],
            phrases: [
                'i understand', 'that makes sense', 'i can see why',
                'that must be hard', 'i get it', 'that\'s difficult',
                'i see your point', 'that\'s understandable',
                'i can relate', 'that sounds challenging'
            ],
            semanticPatterns: ['understanding_expressions', 'empathy_indicators', 'validation_statements'],
            contextBoosts: ['difficulty', 'problem', 'challenge']
        },
        PATIENCE_WITH_AI: {
            keywords: ['time', 'worries', 'okay', 'fine', 'alright'],
            phrases: [
                'take your time', 'no worries', 'it\'s okay',
                'don\'t worry about it', 'that\'s fine',
                'no rush', 'it\'s alright', 'no problem'
            ],
            semanticPatterns: ['patience_indicators', 'understanding_responses', 'supportive_language'],
            contextBoosts: ['waiting', 'processing', 'difficulty']
        },
        IMPATIENCE_WITH_PROCESS: {
            keywords: ['wrong', 'stupid', 'fix', 'understand', 'work'],
            phrases: [
                'you\'re wrong', 'that\'s stupid', 'just fix it',
                'you don\'t understand', 'this should just work',
                'why can\'t you get it', 'this is ridiculous'
            ],
            semanticPatterns: ['frustration_expressions', 'criticism_indicators', 'impatience_markers'],
            minConfidence: 0.6
        }
    };

    private readonly RECIPROCITY_PATTERNS = {
        ACTIVE_CONTRIBUTION: {
            keywords: ['try', 'think', 'idea', 'what', 'noticed', 'found', 'work'],
            phrases: [
                'let me try', 'i think', 'my idea is', 'what if',
                'i noticed', 'here\'s what i found', 'i\'ll work on',
                'let me attempt', 'i have an idea', 'what about',
                'i\'ll give it a shot', 'let me see if'
            ],
            semanticPatterns: ['initiative_taking', 'idea_contribution', 'effort_demonstration'],
            contextBoosts: ['problem', 'solution', 'learning']
        },
        PASSIVE_PARTICIPATION: {
            keywords: ['tell', 'give', 'answer', 'do', 'figure', 'want'],
            phrases: [
                'just tell me', 'give me the answer', 'do it for me',
                'i don\'t want to try', 'you figure it out',
                'just show me the solution', 'what\'s the answer',
                'i don\'t want to think', 'you do the work'
            ],
            semanticPatterns: ['passivity_indicators', 'dependency_markers', 'effort_avoidance'],
            minConfidence: 0.6
        }
    };

    private readonly HONESTY_PATTERNS = {
        HONESTY_DEMONSTRATED: {
            keywords: ['really', 'completely', 'no', 'idea', 'forgot', 'didn\'t'],
            phrases: [
                'i really don\'t know', 'i\'m completely lost', 'i have no idea',
                'i didn\'t do the homework', 'i forgot', 'i\'m totally confused',
                'honestly, i don\'t understand', 'to be honest, i\'m lost',
                'i\'ll admit i don\'t know', 'i really need to confess'
            ],
            semanticPatterns: ['honest_admission', 'authentic_confusion', 'genuine_struggle'],
            contextBoosts: ['homework', 'assignment', 'understanding']
        },
        PRETENSE_DETECTED: {
            keywords: ['yeah', 'sure', 'got', 'makes', 'sense', 'okay'],
            phrases: [
                'yeah, sure', 'got it', 'makes sense', 'okay',
                'uh huh', 'right', 'i see', 'of course'
            ],
            semanticPatterns: ['superficial_agreement', 'non_committal_responses', 'potential_pretense'],
            minConfidence: 0.3 // Lower confidence since these could be genuine
        }
    };

    private readonly ATTENTION_PATTERNS = {
        FOCUSED_ATTENTION: {
            keywords: ['understand', 'see', 'follow', 'clear', 'get', 'track'],
            phrases: [
                'i understand', 'i see what you mean', 'that\'s clear',
                'i\'m following along', 'got it', 'i can track this',
                'this makes sense', 'i\'m with you', 'following so far'
            ],
            semanticPatterns: ['comprehension_indicators', 'engagement_markers', 'tracking_responses'],
            contextBoosts: ['explanation', 'instruction', 'concept']
        },
        DISTRACTION_DETECTED: {
            keywords: ['what', 'huh', 'repeat', 'listening', 'again', 'sorry'],
            phrases: [
                'what?', 'huh?', 'can you repeat', 'i wasn\'t listening',
                'say that again', 'sorry, what?', 'come again?',
                'i missed that', 'didn\'t catch that', 'what did you say'
            ],
            semanticPatterns: ['attention_lapses', 'repetition_requests', 'confusion_indicators'],
            contextBoosts: ['explanation', 'instruction']
        }
    };

    private readonly COGNITIVE_LOAD_PATTERNS = {
        OVERLOAD: {
            keywords: ['much', 'overwhelming', 'fast', 'slow', 'lost', 'confusing', 'complicated'],
            phrases: [
                'too much', 'overwhelming', 'too fast', 'slow down',
                'i\'m lost', 'this is confusing', 'too complicated',
                'my brain hurts', 'i can\'t keep up', 'information overload',
                'going over my head', 'drowning in details'
            ],
            semanticPatterns: ['overload_expressions', 'processing_difficulty', 'pace_complaints'],
            contextBoosts: ['explanation', 'instruction', 'lesson']
        },
        UNDERLOAD: {
            keywords: ['easy', 'boring', 'already', 'know', 'simple', 'challenging'],
            phrases: [
                'too easy', 'boring', 'i already know', 'can we do something harder',
                'this is simple', 'more challenging', 'piece of cake',
                'child\'s play', 'elementary stuff', 'need more challenge'
            ],
            semanticPatterns: ['boredom_indicators', 'mastery_claims', 'challenge_requests'],
            contextBoosts: ['exercise', 'problem', 'task']
        }
    };

    private readonly METACOGNITION_PATTERNS = {
        STRONG: {
            keywords: ['mistake', 'strategy', 'remember', 'better', 'notice', 'think', 'learned'],
            phrases: [
                'i think my mistake was', 'i need to remember', 'my strategy is',
                'i\'m getting better at', 'i notice that', 'let me think about',
                'i should try', 'next time i\'ll', 'i learned that',
                'my approach is', 'i realize now', 'looking back i see'
            ],
            semanticPatterns: ['self_reflection', 'strategy_awareness', 'learning_insights'],
            contextBoosts: ['mistake', 'problem', 'solution', 'learning']
        },
        WEAK: {
            keywords: ['don\'t', 'know', 'why', 'work', 'figure', 'sense', 'impossible'],
            phrases: [
                'i don\'t know why', 'it just doesn\'t work', 'i can\'t figure out',
                'nothing makes sense', 'i give up', 'this is impossible',
                'i\'m completely stuck', 'no clue what\'s happening'
            ],
            semanticPatterns: ['helplessness_indicators', 'confusion_without_analysis', 'strategy_absence'],
            negationWords: ['not', 'never', 'nothing'],
            minConfidence: 0.4
        }
    };

    /**
     * Main pattern detection method
     */
    public detectPattern(
        input: string,
        conceptCategory: string,
        concept: Concept,
        behavior: string,
        context?: string
    ): DetectionResult {
        const normalizedInput = this.normalizeText(input);
        const patterns = this.getPatterns(conceptCategory, concept, behavior);

        if (!patterns) {
            return { matched: false, confidence: 0, matchedPatterns: [], context: '' };
        }

        return this.evaluatePatterns(normalizedInput, patterns, context);
    }

    /**
     * Enhanced pattern evaluation with multiple strategies
     */
    private evaluatePatterns(input: string, patterns: PatternRule, context?: string): DetectionResult {
        let totalConfidence = 0;
        const matchedPatterns: string[] = [];

        // 1. Exact phrase matching (highest weight)
        const phraseMatch = this.matchPhrases(input, patterns.phrases);
        if (phraseMatch.matched) {
            totalConfidence += phraseMatch.confidence * 0.8;
            matchedPatterns.push(...phraseMatch.patterns);
        }

        // 2. Keyword matching with stemming
        const keywordMatch = this.matchKeywords(input, patterns.keywords);
        if (keywordMatch.matched) {
            totalConfidence += keywordMatch.confidence * 0.6;
            matchedPatterns.push(...keywordMatch.patterns);
        }

        // 3. Semantic pattern matching
        const semanticMatch = this.matchSemanticPatterns(input, patterns.semanticPatterns);
        if (semanticMatch.matched) {
            totalConfidence += semanticMatch.confidence * 0.5;
            matchedPatterns.push(...semanticMatch.patterns);
        }

        // 4. Apply negation penalty
        if (patterns.negationWords) {
            const negationPenalty = this.detectNegation(input, patterns.negationWords);
            totalConfidence *= (1 - negationPenalty);
        }

        // 5. Context boost
        if (context && patterns.contextBoosts) {
            const contextBoost = this.calculateContextBoost(context, patterns.contextBoosts);
            totalConfidence *= (1 + contextBoost);
        }

        // 6. Sentiment analysis
        const sentimentBoost = this.calculateSentimentBoost(input, patterns);
        totalConfidence *= (1 + sentimentBoost);

        // Normalize confidence
        totalConfidence = Math.min(totalConfidence, 1);
        const minConfidence = patterns.minConfidence || 0.3;

        return {
            matched: totalConfidence >= minConfidence,
            confidence: totalConfidence,
            matchedPatterns,
            context: context || 'general'
        };
    }

    /**
     * Get pattern configuration by category, concept, and behavior
     */
    private getPatterns(category: string, concept: Concept, behavior: string): PatternRule | null {
        const key = behavior.toUpperCase();

        switch (concept) {
            case Concept.TRUST:
                return this.TRUST_PATTERNS[key as keyof typeof this.TRUST_PATTERNS] || null;
            case Concept.RESPECT:
                return this.RESPECT_PATTERNS[key as keyof typeof this.RESPECT_PATTERNS] || null;
            case Concept.EFFECTIVE_COMMUNICATION:
                return this.COMMUNICATION_PATTERNS[key as keyof typeof this.COMMUNICATION_PATTERNS] || null;
            case Concept.EMPATHY:
                return this.EMPATHY_PATTERNS[key as keyof typeof this.EMPATHY_PATTERNS] || null;
            case Concept.RECIPROCITY:
                return this.RECIPROCITY_PATTERNS[key as keyof typeof this.RECIPROCITY_PATTERNS] || null;
            case Concept.HONESTY:
                return this.HONESTY_PATTERNS[key as keyof typeof this.HONESTY_PATTERNS] || null;
            case Concept.ATTENTION:
                return this.ATTENTION_PATTERNS[key as keyof typeof this.ATTENTION_PATTERNS] || null;
            case Concept.COGNITIVE_LOAD:
                return this.COGNITIVE_LOAD_PATTERNS[key as keyof typeof this.COGNITIVE_LOAD_PATTERNS] || null;
            case Concept.METACOGNITION:
                return this.METACOGNITION_PATTERNS[key as keyof typeof this.METACOGNITION_PATTERNS] || null;
            default:
                return null;
        }
    }

    // Helper methods (implementation details)
    private normalizeText(text: string): string {
        return text.toLowerCase()
            .replace(/[^\w\s']/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    private matchPhrases(text: string, phrases: string[]): { matched: boolean; confidence: number; patterns: string[] } {
        const matchedPatterns: string[] = [];
        let maxConfidence = 0;

        for (const phrase of phrases) {
            if (text.includes(phrase)) {
                matchedPatterns.push(phrase);
                maxConfidence = Math.max(maxConfidence, 1.0);
            }
        }

        return { matched: matchedPatterns.length > 0, confidence: maxConfidence, patterns: matchedPatterns };
    }

    private matchKeywords(text: string, keywords: string[]): { matched: boolean; confidence: number; patterns: string[] } {
        const words = text.split(' ');
        const matchedPatterns: string[] = [];
        let matchCount = 0;

        for (const keyword of keywords) {
            if (words.some(word => this.stemmer.stem(word) === this.stemmer.stem(keyword))) {
                matchedPatterns.push(keyword);
                matchCount++;
            }
        }

        return { matched: matchCount > 0, confidence: matchCount / keywords.length, patterns: matchedPatterns };
    }

    private matchSemanticPatterns(text: string, patterns: string[]): { matched: boolean; confidence: number; patterns: string[] } {
        // Simplified semantic matching - in production use embeddings
        return { matched: false, confidence: 0, patterns: [] };
    }

    private detectNegation(text: string, negationWords: string[]): number {
        const words = text.split(' ');
        let negationCount = 0;

        for (const word of words) {
            if (negationWords.includes(word)) {
                negationCount++;
            }
        }

        return Math.min(negationCount * 0.3, 0.7);
    }

    private calculateContextBoost(context: string, contextBoosts: string[]): number {
        let boost = 0;
        const contextLower = context.toLowerCase();

        for (const boostWord of contextBoosts) {
            if (contextLower.includes(boostWord)) {
                boost += 0.1;
            }
        }

        return Math.min(boost, 0.3);
    }

    private calculateSentimentBoost(text: string, patterns: PatternRule): number {
        const sentiment = this.sentiment.analyze(text);
        // Simple sentiment boost logic
        return 0.1;
    }
}