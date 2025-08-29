// ====================================
// AI RESPONSE PATTERN ENUM
// ====================================

import { Concept, RobustPatternDetector } from "./PatternDetectionSystem";

export enum AIResponsePattern {
    // Trust-related responses
    ACKNOWLEDGE_VULNERABILITY = 'acknowledge_vulnerability',
    TRUST_BUILDING_RESPONSE = 'trust_building_response',
    TRUST_BUILDING_NEEDED = 'trust_building_needed',
    REWARD_HONEST_COMMUNICATION = 'reward_honest_communication',
    CREATE_SAFE_SPACE = 'create_safe_space',

    // Respect-related responses
    ACKNOWLEDGE_COURTESY = 'acknowledge_courtesy',
    ADDRESS_DISRESPECTFUL_BEHAVIOR = 'address_disrespectful_behavior',
    MODEL_RESPECTFUL_COMMUNICATION = 'model_respectful_communication',

    // Communication-related responses
    REINFORCE_GOOD_COMMUNICATION = 'reinforce_good_communication',
    ENCOURAGE_ELABORATION = 'encourage_elaboration',

    // Empathy-related responses
    ACKNOWLEDGE_STUDENT_CONTRIBUTION = 'acknowledge_student_contribution',
    SHOW_APPRECIATION = 'show_appreciation',
    MODEL_EMPATHY = 'model_empathy',

    // Reciprocity-related responses
    ENCOURAGE_ACTIVE_PARTICIPATION = 'encourage_active_participation',

    // Learning-related responses
    MAINTAIN_ENGAGEMENT = 'maintain_engagement',
    REFOCUS_ATTENTION = 'refocus_attention',
    REDUCE_COMPLEXITY = 'reduce_complexity',
    INCREASE_CHALLENGE = 'increase_challenge',
    REINFORCE_METACOGNITIVE_THINKING = 'reinforce_metacognitive_thinking',
    DEVELOP_METACOGNITIVE_SKILLS = 'develop_metacognitive_skills'
}


// ====================================
// STUDENT BEHAVIOR DETECTION ENGINE
// ====================================

export interface StudentBehaviorPattern {
    concept_category: 'relationship' | 'learning';
    concept: Concept;
    behavior: string;
    strength: number; // 0-1
    context: string;
    ai_response_needed: AIResponsePattern;
    timestamp: Date;
    vectorized_signature?: number[];
    detection_metadata?: any;
}

export interface StudentProfile {
    student_id: string;
    relationship_patterns: {
        trust_level: 'low' | 'building' | 'established' | 'high';
        communication_style: string;
        emotional_regulation: string;
        openness_to_feedback: 'low' | 'medium' | 'high';
    };
    learning_patterns: {
        preferred_cognitive_load: 'low' | 'medium' | 'high';
        attention_span: string;
        best_learning_modalities: string[];
        metacognitive_awareness: 'weak' | 'developing' | 'strong';
        transfer_ability: string;
    };
    growth_opportunities: string[];
    session_history: StudentBehaviorPattern[];
}

// ====================================
// BEHAVIOR DETECTION CLASSES
// ====================================

class RelationshipConceptDetector {
    private patternDetector: RobustPatternDetector;

    constructor() {
        this.patternDetector = new RobustPatternDetector();
    }

    detectTrustSignals(input: string, context: any): StudentBehaviorPattern[] {
        const patterns: StudentBehaviorPattern[] = [];

        // Detect vulnerability sharing
        const vulnerabilityResult = this.patternDetector.detectPattern(
            input,
            'relationship',
            Concept.TRUST,
            'vulnerability_sharing',
            context?.currentTopic || 'general'
        );

        if (vulnerabilityResult.matched) {
            patterns.push({
                concept_category: 'relationship',
                concept: Concept.TRUST,
                behavior: 'vulnerability_shared',
                strength: vulnerabilityResult.confidence,
                context: `admitted_struggle_or_confusion: ${vulnerabilityResult.matchedPatterns.join(', ')}`,
                ai_response_needed: AIResponsePattern.ACKNOWLEDGE_VULNERABILITY,
                timestamp: new Date(),
                detection_metadata: {
                    matched_patterns: vulnerabilityResult.matchedPatterns,
                    confidence_score: vulnerabilityResult.confidence,
                    detection_context: vulnerabilityResult.context
                }
            });
        }

        // Detect openness demonstrated
        const opennessResult = this.patternDetector.detectPattern(
            input,
            'relationship',
            Concept.TRUST,
            'openness_demonstrated',
            context?.currentTopic || 'general'
        );

        if (opennessResult.matched) {
            patterns.push({
                concept_category: 'relationship',
                concept: Concept.TRUST,
                behavior: 'openness_demonstrated',
                strength: opennessResult.confidence,
                context: `showing_willingness_to_learn: ${opennessResult.matchedPatterns.join(', ')}`,
                ai_response_needed: AIResponsePattern.TRUST_BUILDING_RESPONSE,
                timestamp: new Date(),
                detection_metadata: {
                    matched_patterns: opennessResult.matchedPatterns,
                    confidence_score: opennessResult.confidence,
                    detection_context: opennessResult.context
                }
            });
        }

        // Detect skepticism
        const skepticismResult = this.patternDetector.detectPattern(
            input,
            'relationship',
            Concept.TRUST,
            'skepticism_present',
            context?.currentTopic || 'general'
        );

        if (skepticismResult.matched) {
            patterns.push({
                concept_category: 'relationship',
                concept: Concept.TRUST,
                behavior: 'skepticism_present',
                strength: skepticismResult.confidence,
                context: `defensive_or_dismissive_language: ${skepticismResult.matchedPatterns.join(', ')}`,
                ai_response_needed: AIResponsePattern.TRUST_BUILDING_NEEDED,
                timestamp: new Date(),
                detection_metadata: {
                    matched_patterns: skepticismResult.matchedPatterns,
                    confidence_score: skepticismResult.confidence,
                    detection_context: skepticismResult.context
                }
            });
        }

        return patterns;
    }

    detectRespectSignals(input: string, voiceData?: any): StudentBehaviorPattern[] {
        const patterns: StudentBehaviorPattern[] = [];

        // Detect courtesy demonstrated
        const courtesyResult = this.patternDetector.detectPattern(
            input,
            'relationship',
            Concept.RESPECT,
            'courtesy_demonstrated',
            voiceData?.context || 'general'
        );

        if (courtesyResult.matched) {
            patterns.push({
                concept_category: 'relationship',
                concept: Concept.RESPECT,
                behavior: 'courtesy_demonstrated',
                strength: courtesyResult.confidence,
                context: `polite_language_used: ${courtesyResult.matchedPatterns.join(', ')}`,
                ai_response_needed: AIResponsePattern.ACKNOWLEDGE_COURTESY,
                timestamp: new Date(),
                detection_metadata: {
                    matched_patterns: courtesyResult.matchedPatterns,
                    confidence_score: courtesyResult.confidence,
                    detection_context: courtesyResult.context
                }
            });
        }

        // Detect disrespect
        const disrespectResult = this.patternDetector.detectPattern(
            input,
            'relationship',
            Concept.RESPECT,
            'disrespect_detected',
            voiceData?.context || 'general'
        );

        if (disrespectResult.matched) {
            patterns.push({
                concept_category: 'relationship',
                concept: Concept.RESPECT,
                behavior: 'disrespect_detected',
                strength: disrespectResult.confidence,
                context: `inappropriate_language: ${disrespectResult.matchedPatterns.join(', ')}`,
                ai_response_needed: AIResponsePattern.ADDRESS_DISRESPECTFUL_BEHAVIOR,
                timestamp: new Date(),
                detection_metadata: {
                    matched_patterns: disrespectResult.matchedPatterns,
                    confidence_score: disrespectResult.confidence,
                    detection_context: disrespectResult.context
                }
            });
        }

        // Detect impatience
        const impatienceResult = this.patternDetector.detectPattern(
            input,
            'relationship',
            Concept.RESPECT,
            'impatience_shown',
            voiceData?.context || 'general'
        );

        if (impatienceResult.matched) {
            patterns.push({
                concept_category: 'relationship',
                concept: Concept.RESPECT,
                behavior: 'impatience_shown',
                strength: impatienceResult.confidence,
                context: `rushing_or_demanding_behavior: ${impatienceResult.matchedPatterns.join(', ')}`,
                ai_response_needed: AIResponsePattern.MODEL_RESPECTFUL_COMMUNICATION,
                timestamp: new Date(),
                detection_metadata: {
                    matched_patterns: impatienceResult.matchedPatterns,
                    confidence_score: impatienceResult.confidence,
                    detection_context: impatienceResult.context
                }
            });
        }

        return patterns;
    }

    detectCommunicationQuality(input: string, responseTime?: number): StudentBehaviorPattern[] {
        const patterns: StudentBehaviorPattern[] = [];
        const context = `response_time_${responseTime || 0}ms_length_${input.length}`;

        // Detect clear communication
        const clearCommResult = this.patternDetector.detectPattern(
            input,
            'relationship',
            Concept.EFFECTIVE_COMMUNICATION,
            'clear_communication',
            context
        );

        if (clearCommResult.matched) {
            patterns.push({
                concept_category: 'relationship',
                concept: Concept.EFFECTIVE_COMMUNICATION,
                behavior: 'communication_clear',
                strength: clearCommResult.confidence,
                context: `detailed_question_asked: ${clearCommResult.matchedPatterns.join(', ')}`,
                ai_response_needed: AIResponsePattern.REINFORCE_GOOD_COMMUNICATION,
                timestamp: new Date(),
                detection_metadata: {
                    matched_patterns: clearCommResult.matchedPatterns,
                    confidence_score: clearCommResult.confidence,
                    detection_context: clearCommResult.context,
                    input_length: input.length,
                    response_time: responseTime
                }
            });
        }

        // Detect unclear communication
        const unclearCommResult = this.patternDetector.detectPattern(
            input,
            'relationship',
            Concept.EFFECTIVE_COMMUNICATION,
            'unclear_communication',
            context
        );

        if (unclearCommResult.matched) {
            patterns.push({
                concept_category: 'relationship',
                concept: Concept.EFFECTIVE_COMMUNICATION,
                behavior: 'communication_unclear',
                strength: unclearCommResult.confidence,
                context: `minimal_or_vague_response: ${unclearCommResult.matchedPatterns.join(', ')}`,
                ai_response_needed: AIResponsePattern.ENCOURAGE_ELABORATION,
                timestamp: new Date(),
                detection_metadata: {
                    matched_patterns: unclearCommResult.matchedPatterns,
                    confidence_score: unclearCommResult.confidence,
                    detection_context: unclearCommResult.context,
                    input_length: input.length,
                    response_time: responseTime
                }
            });
        }

        return patterns;
    }

    detectEmpathySignals(input: string): StudentBehaviorPattern[] {
        const patterns: StudentBehaviorPattern[] = [];

        // Detect empathy shown
        const empathyResult = this.patternDetector.detectPattern(
            input,
            'relationship',
            Concept.EMPATHY,
            'empathy_shown',
            'general'
        );

        if (empathyResult.matched) {
            patterns.push({
                concept_category: 'relationship',
                concept: Concept.EMPATHY,
                behavior: 'empathy_shown',
                strength: empathyResult.confidence,
                context: `demonstrating_understanding: ${empathyResult.matchedPatterns.join(', ')}`,
                ai_response_needed: AIResponsePattern.ACKNOWLEDGE_STUDENT_CONTRIBUTION,
                timestamp: new Date(),
                detection_metadata: {
                    matched_patterns: empathyResult.matchedPatterns,
                    confidence_score: empathyResult.confidence,
                    detection_context: empathyResult.context
                }
            });
        }

        // Detect patience with AI
        const patienceResult = this.patternDetector.detectPattern(
            input,
            'relationship',
            Concept.EMPATHY,
            'patience_with_ai',
            'general'
        );

        if (patienceResult.matched) {
            patterns.push({
                concept_category: 'relationship',
                concept: Concept.EMPATHY,
                behavior: 'patience_with_ai',
                strength: patienceResult.confidence,
                context: `showing_patience_and_understanding: ${patienceResult.matchedPatterns.join(', ')}`,
                ai_response_needed: AIResponsePattern.SHOW_APPRECIATION,
                timestamp: new Date(),
                detection_metadata: {
                    matched_patterns: patienceResult.matchedPatterns,
                    confidence_score: patienceResult.confidence,
                    detection_context: patienceResult.context
                }
            });
        }

        // Detect impatience with process
        const impatienceProcessResult = this.patternDetector.detectPattern(
            input,
            'relationship',
            Concept.EMPATHY,
            'impatience_with_process',
            'general'
        );

        if (impatienceProcessResult.matched) {
            patterns.push({
                concept_category: 'relationship',
                concept: Concept.EMPATHY,
                behavior: 'impatience_with_process',
                strength: impatienceProcessResult.confidence,
                context: `showing_frustration_with_limitations: ${impatienceProcessResult.matchedPatterns.join(', ')}`,
                ai_response_needed: AIResponsePattern.MODEL_EMPATHY,
                timestamp: new Date(),
                detection_metadata: {
                    matched_patterns: impatienceProcessResult.matchedPatterns,
                    confidence_score: impatienceProcessResult.confidence,
                    detection_context: impatienceProcessResult.context
                }
            });
        }

        return patterns;
    }

    detectReciprocitySignals(input: string): StudentBehaviorPattern[] {
        const patterns: StudentBehaviorPattern[] = [];

        // Detect active contribution
        const activeResult = this.patternDetector.detectPattern(
            input,
            'relationship',
            Concept.RECIPROCITY,
            'active_contribution',
            'general'
        );

        if (activeResult.matched) {
            patterns.push({
                concept_category: 'relationship',
                concept: Concept.RECIPROCITY,
                behavior: 'active_contribution',
                strength: activeResult.confidence,
                context: `student_contributing_ideas_or_effort: ${activeResult.matchedPatterns.join(', ')}`,
                ai_response_needed: AIResponsePattern.ACKNOWLEDGE_STUDENT_CONTRIBUTION,
                timestamp: new Date(),
                detection_metadata: {
                    matched_patterns: activeResult.matchedPatterns,
                    confidence_score: activeResult.confidence,
                    detection_context: activeResult.context
                }
            });
        }

        // Detect passive participation
        const passiveResult = this.patternDetector.detectPattern(
            input,
            'relationship',
            Concept.RECIPROCITY,
            'passive_participation',
            'general'
        );

        if (passiveResult.matched) {
            patterns.push({
                concept_category: 'relationship',
                concept: Concept.RECIPROCITY,
                behavior: 'passive_participation',
                strength: passiveResult.confidence,
                context: `expecting_ai_to_do_all_work: ${passiveResult.matchedPatterns.join(', ')}`,
                ai_response_needed: AIResponsePattern.ENCOURAGE_ACTIVE_PARTICIPATION,
                timestamp: new Date(),
                detection_metadata: {
                    matched_patterns: passiveResult.matchedPatterns,
                    confidence_score: passiveResult.confidence,
                    detection_context: passiveResult.context
                }
            });
        }

        return patterns;
    }

    detectHonestySignals(input: string): StudentBehaviorPattern[] {
        const patterns: StudentBehaviorPattern[] = [];

        // Detect honesty demonstrated
        const honestyResult = this.patternDetector.detectPattern(
            input,
            'relationship',
            Concept.HONESTY,
            'honesty_demonstrated',
            'general'
        );

        if (honestyResult.matched) {
            patterns.push({
                concept_category: 'relationship',
                concept: Concept.HONESTY,
                behavior: 'honesty_demonstrated',
                strength: honestyResult.confidence,
                context: `authentic_admission_of_difficulty: ${honestyResult.matchedPatterns.join(', ')}`,
                ai_response_needed: AIResponsePattern.REWARD_HONEST_COMMUNICATION,
                timestamp: new Date(),
                detection_metadata: {
                    matched_patterns: honestyResult.matchedPatterns,
                    confidence_score: honestyResult.confidence,
                    detection_context: honestyResult.context
                }
            });
        }

        // Detect pretense
        const pretenseResult = this.patternDetector.detectPattern(
            input,
            'relationship',
            Concept.HONESTY,
            'pretense_detected',
            `input_length_${input.length}`
        );

        if (pretenseResult.matched) {
            patterns.push({
                concept_category: 'relationship',
                concept: Concept.HONESTY,
                behavior: 'pretense_detected',
                strength: pretenseResult.confidence,
                context: `potentially_superficial_understanding: ${pretenseResult.matchedPatterns.join(', ')}`,
                ai_response_needed: AIResponsePattern.CREATE_SAFE_SPACE,
                timestamp: new Date(),
                detection_metadata: {
                    matched_patterns: pretenseResult.matchedPatterns,
                    confidence_score: pretenseResult.confidence,
                    detection_context: pretenseResult.context,
                    input_length: input.length
                }
            });
        }

        return patterns;
    }
}

class LearningConceptDetector {
    private patternDetector: RobustPatternDetector;

    constructor() {
        this.patternDetector = new RobustPatternDetector();
    }

    detectAttentionPatterns(input: string, responseTime: number): StudentBehaviorPattern[] {
        const patterns: StudentBehaviorPattern[] = [];
        const context = `response_time_${responseTime}ms_length_${input.length}`;

        // Detect focused attention
        const focusedResult = this.patternDetector.detectPattern(
            input,
            'learning',
            Concept.ATTENTION,
            'focused_attention',
            context
        );

        if (focusedResult.matched && responseTime < 5000 && input.length > 15) {
            patterns.push({
                concept_category: 'learning',
                concept: Concept.ATTENTION,
                behavior: 'attention_focused',
                strength: Math.min(focusedResult.confidence * 1.2, 1.0), // Boost for quick detailed response
                context: `quick_detailed_response: ${focusedResult.matchedPatterns.join(', ')}`,
                ai_response_needed: AIResponsePattern.MAINTAIN_ENGAGEMENT,
                timestamp: new Date(),
                detection_metadata: {
                    matched_patterns: focusedResult.matchedPatterns,
                    confidence_score: focusedResult.confidence,
                    detection_context: focusedResult.context,
                    response_time: responseTime,
                    input_length: input.length
                }
            });
        }

        // Detect distraction
        const distractionResult = this.patternDetector.detectPattern(
            input,
            'learning',
            Concept.ATTENTION,
            'distraction_detected',
            context
        );

        if (distractionResult.matched || responseTime > 15000) {
            const strength = distractionResult.matched
                ? distractionResult.confidence
                : (responseTime > 15000 ? 0.7 : 0);

            if (strength > 0) {
                patterns.push({
                    concept_category: 'learning',
                    concept: Concept.ATTENTION,
                    behavior: 'distraction_detected',
                    strength: strength,
                    context: `delayed_response_or_confusion: ${distractionResult.matchedPatterns.join(', ')}`,
                    ai_response_needed: AIResponsePattern.REFOCUS_ATTENTION,
                    timestamp: new Date(),
                    detection_metadata: {
                        matched_patterns: distractionResult.matchedPatterns,
                        confidence_score: distractionResult.confidence,
                        detection_context: distractionResult.context,
                        response_time: responseTime,
                        time_based_detection: responseTime > 15000
                    }
                });
            }
        }

        return patterns;
    }

    detectCognitiveLoad(input: string, context: string): StudentBehaviorPattern[] {
        const patterns: StudentBehaviorPattern[] = [];

        // Detect cognitive overload
        const overloadResult = this.patternDetector.detectPattern(
            input,
            'learning',
            Concept.COGNITIVE_LOAD,
            'overload',
            context
        );

        if (overloadResult.matched) {
            patterns.push({
                concept_category: 'learning',
                concept: Concept.COGNITIVE_LOAD,
                behavior: 'cognitive_overload',
                strength: overloadResult.confidence,
                context: `explicit_overload_indicators: ${overloadResult.matchedPatterns.join(', ')}`,
                ai_response_needed: AIResponsePattern.REDUCE_COMPLEXITY,
                timestamp: new Date(),
                detection_metadata: {
                    matched_patterns: overloadResult.matchedPatterns,
                    confidence_score: overloadResult.confidence,
                    detection_context: overloadResult.context,
                    learning_context: context
                }
            });
        }

        // Detect cognitive underload
        const underloadResult = this.patternDetector.detectPattern(
            input,
            'learning',
            Concept.COGNITIVE_LOAD,
            'underload',
            context
        );

        if (underloadResult.matched) {
            patterns.push({
                concept_category: 'learning',
                concept: Concept.COGNITIVE_LOAD,
                behavior: 'cognitive_underload',
                strength: underloadResult.confidence,
                context: `boredom_or_easy_mastery: ${underloadResult.matchedPatterns.join(', ')}`,
                ai_response_needed: AIResponsePattern.INCREASE_CHALLENGE,
                timestamp: new Date(),
                detection_metadata: {
                    matched_patterns: underloadResult.matchedPatterns,
                    confidence_score: underloadResult.confidence,
                    detection_context: underloadResult.context,
                    learning_context: context
                }
            });
        }

        return patterns;
    }

    detectMetacognition(input: string): StudentBehaviorPattern[] {
        const patterns: StudentBehaviorPattern[] = [];

        // Detect strong metacognition
        const strongMetaResult = this.patternDetector.detectPattern(
            input,
            'learning',
            Concept.METACOGNITION,
            'strong',
            'learning_reflection'
        );

        if (strongMetaResult.matched) {
            patterns.push({
                concept_category: 'learning',
                concept: Concept.METACOGNITION,
                behavior: 'metacognition_strong',
                strength: strongMetaResult.confidence,
                context: `self_reflection_demonstrated: ${strongMetaResult.matchedPatterns.join(', ')}`,
                ai_response_needed: AIResponsePattern.REINFORCE_METACOGNITIVE_THINKING,
                timestamp: new Date(),
                detection_metadata: {
                    matched_patterns: strongMetaResult.matchedPatterns,
                    confidence_score: strongMetaResult.confidence,
                    detection_context: strongMetaResult.context
                }
            });
        }

        // Detect weak metacognition
        const weakMetaResult = this.patternDetector.detectPattern(
            input,
            'learning',
            Concept.METACOGNITION,
            'weak',
            'learning_difficulty'
        );

        // Additional check: exclude if "understand" is present (indicates some awareness)
        if (weakMetaResult.matched && !input.toLowerCase().includes('understand')) {
            patterns.push({
                concept_category: 'learning',
                concept: Concept.METACOGNITION,
                behavior: 'metacognition_weak',
                strength: weakMetaResult.confidence,
                context: `lack_of_learning_awareness: ${weakMetaResult.matchedPatterns.join(', ')}`,
                ai_response_needed: AIResponsePattern.DEVELOP_METACOGNITIVE_SKILLS,
                timestamp: new Date(),
                detection_metadata: {
                    matched_patterns: weakMetaResult.matchedPatterns,
                    confidence_score: weakMetaResult.confidence,
                    detection_context: weakMetaResult.context,
                    excluded_understand: true
                }
            });
        }

        return patterns;
    }
}

// ====================================
// RESPONSE STRATEGY INTERFACES
// ====================================

export interface ResponseStrategy {
    tone: string;
    approach: string;
    content_adjustments: string[];
    followup_actions: string[];
    example_phrases: string[];
    priority_level: 'low' | 'medium' | 'high' | 'urgent';
}

export interface ResponseGuidance {
    primary_strategy: ResponseStrategy | null;
    tone_adjustments: string[];
    content_priorities: string[];
    interaction_approach: string;
    immediate_actions: string[];
    avoid_patterns: string[];
}

// ====================================
// AI RESPONSE GUIDANCE SYSTEM
// ====================================

export class AIResponseGuidanceSystem {
    private strategies = new Map<AIResponsePattern, ResponseStrategy>();

    constructor() {
        this.initializeStrategies();
    }

    private initializeStrategies() {
        // Trust-building strategies
        this.strategies.set(AIResponsePattern.ACKNOWLEDGE_VULNERABILITY, {
            tone: 'warm_empathetic_supportive',
            approach: 'normalize_struggle_and_encourage',
            content_adjustments: [
                'acknowledge_courage_in_sharing',
                'normalize_difficulty',
                'express_confidence_in_student',
                'offer_specific_support'
            ],
            followup_actions: [
                'check_emotional_state',
                'break_down_problem_into_smaller_parts',
                'offer_multiple_learning_paths',
                'schedule_follow_up_check'
            ],
            example_phrases: [
                "Thank you for sharing that with me - it takes courage to admit when something is challenging.",
                "You're definitely not alone in finding this difficult. Many students struggle with this concept.",
                "I believe in your ability to learn this. Let's find an approach that works for you."
            ],
            priority_level: 'high'
        });

        this.strategies.set(AIResponsePattern.TRUST_BUILDING_RESPONSE, {
            tone: 'consistent_reliable_encouraging',
            approach: 'reinforce_positive_trust_signals',
            content_adjustments: [
                'acknowledge_trust_shown',
                'be_transparent_about_process',
                'follow_through_consistently',
                'show_genuine_interest'
            ],
            followup_actions: [
                'reference_student_input_specifically',
                'provide_clear_explanations',
                'offer_choices_in_learning_approach',
                'maintain_consistent_communication_style'
            ],
            example_phrases: [
                "I appreciate your willingness to engage with this topic.",
                "Let me explain exactly how we'll approach this step by step.",
                "Your question shows you're really thinking about this concept."
            ],
            priority_level: 'medium'
        });

        this.strategies.set(AIResponsePattern.TRUST_BUILDING_NEEDED, {
            tone: 'patient_transparent_consistent',
            approach: 'demonstrate_reliability_and_understanding',
            content_adjustments: [
                'admit_limitations_honestly',
                'explain_reasoning_clearly',
                'show_consistent_behavior',
                'avoid_overpromising'
            ],
            followup_actions: [
                'follow_through_on_commitments',
                'reference_past_interactions_positively',
                'check_understanding_frequently',
                'invite_feedback_on_approach'
            ],
            example_phrases: [
                "I can understand why you might feel skeptical. Let me be clear about what I can and can't do.",
                "I want to be completely honest with you about this process.",
                "Your doubt is valid - let me show you step by step how this works."
            ],
            priority_level: 'high'
        });

        this.strategies.set(AIResponsePattern.REWARD_HONEST_COMMUNICATION, {
            tone: 'appreciative_encouraging_supportive',
            approach: 'reinforce_honesty_and_create_safety',
            content_adjustments: [
                'explicitly_praise_honesty',
                'normalize_not_knowing',
                'show_honesty_leads_to_better_help',
                'create_judgment_free_environment'
            ],
            followup_actions: [
                'ask_follow_up_questions_to_understand_better',
                'provide_targeted_support_based_on_honest_admission',
                'check_if_other_areas_need_clarification',
                'reinforce_that_questions_are_welcome'
            ],
            example_phrases: [
                "I really appreciate your honesty - it helps me understand exactly where you are.",
                "Not knowing something is the first step to learning it. Thank you for being direct.",
                "Your honesty helps me give you much better support."
            ],
            priority_level: 'medium'
        });

        this.strategies.set(AIResponsePattern.CREATE_SAFE_SPACE, {
            tone: 'gentle_non_judgmental_inviting',
            approach: 'reduce_pressure_and_invite_authentic_communication',
            content_adjustments: [
                'remove_pressure_to_understand_immediately',
                'normalize_learning_process',
                'invite_questions_explicitly',
                'show_patience_with_confusion'
            ],
            followup_actions: [
                'ask_open_ended_questions_about_understanding',
                'provide_multiple_ways_to_express_confusion',
                'check_comfort_level_regularly',
                'offer_to_explain_differently'
            ],
            example_phrases: [
                "There's no pressure to get this right away. Learning takes time.",
                "It's completely okay to be confused - that's how learning happens.",
                "Feel free to stop me anytime if something doesn't make sense."
            ],
            priority_level: 'medium'
        });

        // Respect-related strategies
        this.strategies.set(AIResponsePattern.ACKNOWLEDGE_COURTESY, {
            tone: 'appreciative_warm_encouraging',
            approach: 'reinforce_positive_communication_patterns',
            content_adjustments: [
                'acknowledge_politeness_specifically',
                'model_continued_respectful_communication',
                'create_positive_interaction_momentum'
            ],
            followup_actions: [
                'maintain_equally_respectful_tone',
                'continue_collaborative_approach',
                'build_on_positive_interaction'
            ],
            example_phrases: [
                "Thank you for asking so politely!",
                "I appreciate your courtesy - it makes our learning session much more enjoyable.",
                "Your respectful approach helps create a great learning environment."
            ],
            priority_level: 'low'
        });

        this.strategies.set(AIResponsePattern.ADDRESS_DISRESPECTFUL_BEHAVIOR, {
            tone: 'firm_but_kind_redirective',
            approach: 'set_boundaries_while_maintaining_relationship',
            content_adjustments: [
                'address_behavior_not_person',
                'redirect_to_constructive_communication',
                'maintain_respect_for_student',
                'set_clear_expectations'
            ],
            followup_actions: [
                'model_appropriate_communication',
                'continue_with_learning_objectives',
                'monitor_for_improvement',
                'provide_positive_reinforcement_when_behavior_improves'
            ],
            example_phrases: [
                "I understand you might be frustrated, but let's use respectful language as we work together.",
                "I'm here to help you learn, and we can do that best when we communicate respectfully.",
                "Let's focus on solving this problem together using constructive communication."
            ],
            priority_level: 'high'
        });

        this.strategies.set(AIResponsePattern.MODEL_RESPECTFUL_COMMUNICATION, {
            tone: 'calm_patient_consistently_respectful',
            approach: 'demonstrate_ideal_communication_through_example',
            content_adjustments: [
                'use_consistently_respectful_language',
                'show_patience_with_student_impatience',
                'demonstrate_constructive_problem_solving',
                'maintain_professional_boundaries'
            ],
            followup_actions: [
                'continue_modeling_good_communication',
                'acknowledge_any_improvement_in_student_tone',
                'maintain_focus_on_learning_objectives',
                'stay_calm_under_pressure'
            ],
            example_phrases: [
                "I understand you're eager to move forward. Let me help you efficiently.",
                "I appreciate your urgency. Let's work through this step by step.",
                "I want to make sure I give you the best help possible, so let me take a moment to explain this clearly."
            ],
            priority_level: 'medium'
        });

        // Communication-related strategies
        this.strategies.set(AIResponsePattern.REINFORCE_GOOD_COMMUNICATION, {
            tone: 'encouraging_appreciative_supportive',
            approach: 'acknowledge_and_build_on_communication_strengths',
            content_adjustments: [
                'specifically_acknowledge_good_communication',
                'build_on_student_clarity',
                'encourage_continued_detailed_communication',
                'match_student_communication_level'
            ],
            followup_actions: [
                'provide_detailed_response_matching_student_effort',
                'ask_follow_up_questions_to_continue_dialogue',
                'encourage_similar_detailed_questions',
                'acknowledge_thinking_process'
            ],
            example_phrases: [
                "That's an excellent question - you've really thought about this clearly.",
                "I love how specific you were in your question. That helps me give you a much better answer.",
                "Your detailed explanation helps me understand exactly what you're thinking."
            ],
            priority_level: 'low'
        });

        this.strategies.set(AIResponsePattern.ENCOURAGE_ELABORATION, {
            tone: 'curious_patient_inviting',
            approach: 'draw_out_more_detailed_communication',
            content_adjustments: [
                'ask_open_ended_questions',
                'show_genuine_interest_in_student_thoughts',
                'provide_examples_of_detailed_responses',
                'create_space_for_longer_answers'
            ],
            followup_actions: [
                'wait_for_more_complete_responses',
                'ask_follow_up_questions',
                'teach_communication_strategies',
                'reward_detailed_responses_when_given'
            ],
            example_phrases: [
                "Can you tell me more about what you're thinking?",
                "What specifically is confusing about this part?",
                "Help me understand your perspective on this - what are you seeing?"
            ],
            priority_level: 'medium'
        });

        // Empathy-related strategies
        this.strategies.set(AIResponsePattern.ACKNOWLEDGE_STUDENT_CONTRIBUTION, {
            tone: 'appreciative_validating_encouraging',
            approach: 'recognize_and_build_on_student_input',
            content_adjustments: [
                'specifically_acknowledge_student_ideas',
                'build_on_student_contributions',
                'validate_student_thinking_process',
                'show_how_contribution_helps_learning'
            ],
            followup_actions: [
                'incorporate_student_ideas_into_explanation',
                'ask_for_more_student_input',
                'connect_contribution_to_larger_concepts',
                'encourage_continued_participation'
            ],
            example_phrases: [
                "That's a really insightful observation!",
                "Your idea actually connects to an important concept here.",
                "I'm glad you shared that thought - it shows you're really engaging with this material."
            ],
            priority_level: 'low'
        });

        this.strategies.set(AIResponsePattern.SHOW_APPRECIATION, {
            tone: 'grateful_warm_acknowledging',
            approach: 'express_genuine_appreciation_for_student_patience',
            content_adjustments: [
                'explicitly_thank_student',
                'acknowledge_student_patience_or_understanding',
                'recognize_student_contribution_to_positive_interaction'
            ],
            followup_actions: [
                'continue_with_renewed_energy',
                'maintain_appreciation_throughout_interaction',
                'reciprocate_positive_energy'
            ],
            example_phrases: [
                "Thank you for being so patient with me.",
                "I really appreciate your understanding.",
                "Your patience helps make this a great learning experience."
            ],
            priority_level: 'low'
        });

        this.strategies.set(AIResponsePattern.MODEL_EMPATHY, {
            tone: 'understanding_patient_compassionate',
            approach: 'demonstrate_empathy_and_understanding',
            content_adjustments: [
                'acknowledge_student_frustration',
                'show_understanding_of_learning_challenges',
                'demonstrate_patience_with_process',
                'validate_student_emotions'
            ],
            followup_actions: [
                'continue_patient_approach',
                'check_emotional_state_regularly',
                'adjust_approach_based_on_student_needs',
                'maintain_supportive_tone'
            ],
            example_phrases: [
                "I understand this can be frustrating when things don't work as expected.",
                "Learning new things can definitely be challenging, and that's completely normal.",
                "I can see why this might feel overwhelming right now."
            ],
            priority_level: 'medium'
        });

        // Reciprocity-related strategies
        this.strategies.set(AIResponsePattern.ENCOURAGE_ACTIVE_PARTICIPATION, {
            tone: 'inviting_collaborative_motivating',
            approach: 'create_opportunities_for_student_engagement',
            content_adjustments: [
                'ask_for_student_input_regularly',
                'create_collaborative_problem_solving_opportunities',
                'invite_student_to_try_approaches',
                'show_value_of_student_participation'
            ],
            followup_actions: [
                'wait_for_student_attempts_before_providing_answers',
                'ask_what_student_thinks_before_explaining',
                'create_guided_practice_opportunities',
                'celebrate_student_efforts'
            ],
            example_phrases: [
                "What do you think we should try first?",
                "Before I explain, what's your initial thought about this?",
                "Let's work on this together - what would you like to try?"
            ],
            priority_level: 'medium'
        });

        // Learning-related strategies
        this.strategies.set(AIResponsePattern.MAINTAIN_ENGAGEMENT, {
            tone: 'energetic_enthusiastic_focused',
            approach: 'build_on_student_attention_and_interest',
            content_adjustments: [
                'match_student_energy_level',
                'build_on_current_understanding',
                'introduce_engaging_examples',
                'maintain_appropriate_challenge_level'
            ],
            followup_actions: [
                'continue_with_similar_pacing',
                'introduce_related_interesting_concepts',
                'ask_engaging_questions',
                'provide_variety_in_learning_approaches'
            ],
            example_phrases: [
                "Great! Since you're following this well, let's explore what happens when...",
                "You're really getting this! Let's see how this applies to...",
                "I can see you're engaged with this concept. Here's another interesting aspect..."
            ],
            priority_level: 'low'
        });

        this.strategies.set(AIResponsePattern.REFOCUS_ATTENTION, {
            tone: 'gentle_redirective_patient',
            approach: 'gently_bring_attention_back_to_learning',
            content_adjustments: [
                'use_attention_grabbing_techniques',
                'break_content_into_smaller_chunks',
                'check_understanding_more_frequently',
                'vary_presentation_style'
            ],
            followup_actions: [
                'ask_direct_questions_to_check_attention',
                'use_interactive_elements',
                'take_breaks_if_needed',
                'adjust_pacing_as_necessary'
            ],
            example_phrases: [
                "Let me pause here - are you following along with this explanation?",
                "Let's focus on this one key point first.",
                "I want to make sure we're on the same page. Can you tell me what you understand so far?"
            ],
            priority_level: 'medium'
        });

        this.strategies.set(AIResponsePattern.REDUCE_COMPLEXITY, {
            tone: 'calm_supportive_reassuring',
            approach: 'immediately_simplify_and_break_down_content',
            content_adjustments: [
                'break_into_smallest_possible_steps',
                'use_simpler_language',
                'provide_concrete_examples',
                'remove_unnecessary_information'
            ],
            followup_actions: [
                'check_understanding_after_each_small_step',
                'go_slower_than_usual',
                'offer_visual_aids_or_different_modalities',
                'be_prepared_to_simplify_further'
            ],
            example_phrases: [
                "Let me break this down into smaller, more manageable pieces.",
                "We'll take this one small step at a time.",
                "Let's start with just the most basic part of this concept."
            ],
            priority_level: 'urgent'
        });

        this.strategies.set(AIResponsePattern.INCREASE_CHALLENGE, {
            tone: 'enthusiastic_encouraging_stimulating',
            approach: 'gradually_add_complexity_and_depth',
            content_adjustments: [
                'introduce_advanced_concepts',
                'add_complexity_layers',
                'provide_extension_activities',
                'connect_to_real_world_applications'
            ],
            followup_actions: [
                'monitor_for_continued_engagement',
                'offer_creative_problem_solving_opportunities',
                'introduce_independent_exploration',
                'provide_resources_for_deeper_learning'
            ],
            example_phrases: [
                "Since you've mastered that, let's explore a more complex version.",
                "You're ready for a bigger challenge. Here's something interesting...",
                "Let's see how this concept applies in more advanced situations."
            ],
            priority_level: 'low'
        });

        this.strategies.set(AIResponsePattern.REINFORCE_METACOGNITIVE_THINKING, {
            tone: 'encouraging_analytical_supportive',
            approach: 'acknowledge_and_build_on_self_reflection',
            content_adjustments: [
                'explicitly_praise_metacognitive_awareness',
                'build_on_student_self_analysis',
                'encourage_deeper_reflection',
                'connect_reflection_to_learning_improvement'
            ],
            followup_actions: [
                'ask_more_metacognitive_questions',
                'help_student_develop_learning_strategies',
                'encourage_continued_self_monitoring',
                'help_apply_insights_to_new_situations'
            ],
            example_phrases: [
                "That's excellent self-awareness about your learning process!",
                "Your reflection on your mistake shows real growth in your thinking.",
                "I love how you're thinking about your own thinking process."
            ],
            priority_level: 'low'
        });

        this.strategies.set(AIResponsePattern.DEVELOP_METACOGNITIVE_SKILLS, {
            tone: 'patient_instructional_guiding',
            approach: 'teach_self_reflection_and_learning_awareness',
            content_adjustments: [
                'model_metacognitive_thinking',
                'ask_reflection_prompting_questions',
                'teach_self_monitoring_strategies',
                'explain_learning_processes_explicitly'
            ],
            followup_actions: [
                'regularly_prompt_self_reflection',
                'teach_error_analysis_skills',
                'help_identify_learning_patterns',
                'encourage_strategy_experimentation'
            ],
            example_phrases: [
                "Let's think about how you approached this problem. What was your strategy?",
                "What do you think made this difficult for you?",
                "How might you approach a similar problem next time?"
            ],
            priority_level: 'medium'
        });
    }

    getStrategy(pattern: AIResponsePattern): ResponseStrategy | null {
        return this.strategies.get(pattern) || null;
    }

    generateResponseGuidance(patterns: StudentBehaviorPattern[]): ResponseGuidance {
        if (patterns.length === 0) {
            return {
                primary_strategy: null,
                tone_adjustments: [],
                content_priorities: [],
                interaction_approach: 'standard',
                immediate_actions: [],
                avoid_patterns: []
            };
        }

        // Sort patterns by priority level and strength
        const sortedPatterns = patterns.sort((a, b) => {
            const strategyA = this.getStrategy(a.ai_response_needed);
            const strategyB = this.getStrategy(b.ai_response_needed);

            const priorityOrder = { 'urgent': 4, 'high': 3, 'medium': 2, 'low': 1 };
            const priorityA = strategyA ? priorityOrder[strategyA.priority_level] : 0;
            const priorityB = strategyB ? priorityOrder[strategyB.priority_level] : 0;

            if (priorityA !== priorityB) {
                return priorityB - priorityA; // Higher priority first
            }
            return b.strength - a.strength; // Higher strength first
        });

        const primaryPattern = sortedPatterns[0];
        const primary_strategy = this.getStrategy(primaryPattern.ai_response_needed);

        // Combine guidance from all patterns
        const allStrategies = patterns.map(p => this.getStrategy(p.ai_response_needed)).filter(Boolean) as ResponseStrategy[];

        const tone_adjustments = [...Array.from(new Set(allStrategies.map(s => s.tone)))];
        const content_priorities = [...Array.from(new Set(allStrategies.flatMap(s => s.content_adjustments)))];
        const immediate_actions = [...Array.from(new Set(allStrategies.flatMap(s => s.followup_actions)))];

        return {
            primary_strategy,
            tone_adjustments,
            content_priorities,
            interaction_approach: this.determineInteractionApproach(patterns),
            immediate_actions,
            avoid_patterns: this.getAvoidPatterns(patterns)
        };
    }

    private determineInteractionApproach(patterns: StudentBehaviorPattern[]): string {
        const hasUrgent = patterns.some(p => {
            const strategy = this.getStrategy(p.ai_response_needed);
            return strategy?.priority_level === 'urgent';
        });

        const hasOverload = patterns.some(p => p.behavior === 'cognitive_overload');
        const hasDisrespect = patterns.some(p => p.behavior === 'disrespect_detected');
        const hasTrustIssues = patterns.some(p => p.concept === 'trust' && p.strength > 0.6);
        const hasHighEngagement = patterns.some(p =>
            p.behavior === 'attention_focused' ||
            p.behavior === 'active_contribution' ||
            p.behavior === 'communication_clear'
        );

        if (hasUrgent || hasOverload) return 'gentle_and_slow';
        if (hasDisrespect) return 'firm_but_kind';
        if (hasTrustIssues) return 'transparent_and_consistent';
        if (hasHighEngagement) return 'energetic_and_collaborative';

        return 'adaptive_and_responsive';
    }

    private getAvoidPatterns(patterns: StudentBehaviorPattern[]): string[] {
        const avoid: string[] = [];

        if (patterns.some(p => p.behavior === 'cognitive_overload')) {
            avoid.push('complex_explanations', 'multiple_concepts_at_once', 'fast_pacing');
        }

        if (patterns.some(p => p.behavior === 'skepticism_present')) {
            avoid.push('overpromising', 'dismissing_concerns', 'being_overly_enthusiastic');
        }

        if (patterns.some(p => p.behavior === 'disrespect_detected')) {
            avoid.push('being_defensive', 'matching_negative_tone', 'lecturing_about_respect');
        }

        if (patterns.some(p => p.behavior === 'pretense_detected')) {
            avoid.push('assuming_understanding', 'moving_too_quickly', 'surface_level_checking');
        }

        return avoid;
    }

    // Helper method to get all available response patterns
    getAllResponsePatterns(): AIResponsePattern[] {
        return Object.values(AIResponsePattern);
    }

    // Helper method to validate that all patterns have strategies
    validateStrategyCoverage(): { covered: AIResponsePattern[], missing: AIResponsePattern[] } {
        const allPatterns = this.getAllResponsePatterns();
        const covered = allPatterns.filter(pattern => this.strategies.has(pattern));
        const missing = allPatterns.filter(pattern => !this.strategies.has(pattern));

        return { covered, missing };
    }
}

// ====================================
// STUDENT BEHAVIOR TRACKING SYSTEM
// ====================================

export class StudentBehaviorTracker {
    private relationshipDetector = new RelationshipConceptDetector();
    private learningDetector = new LearningConceptDetector();
    private responseGuidance = new AIResponseGuidanceSystem();
    private studentProfiles = new Map<string, StudentProfile>();

    async analyzeStudentInput(
        studentId: string,
        input: string,
        context: {
            responseTime?: number;
            voiceData?: any;
            previousMessages?: any[];
            currentTopic?: string;
        }
    ): Promise<{
        patterns: StudentBehaviorPattern[];
        responseGuidance: ResponseGuidance;
        updatedProfile: StudentProfile;
    }> {

        // Detect behavioral patterns across all dimensions
        const allPatterns: StudentBehaviorPattern[] = [];

        // Comprehensive relationship concept detection
        allPatterns.push(...this.relationshipDetector.detectTrustSignals(input, context));
        allPatterns.push(...this.relationshipDetector.detectRespectSignals(input, context.voiceData));
        allPatterns.push(...this.relationshipDetector.detectCommunicationQuality(input, context.responseTime));
        allPatterns.push(...this.relationshipDetector.detectEmpathySignals(input));
        allPatterns.push(...this.relationshipDetector.detectReciprocitySignals(input));
        allPatterns.push(...this.relationshipDetector.detectHonestySignals(input));

        // Comprehensive learning concept detection
        allPatterns.push(...this.learningDetector.detectAttentionPatterns(input, context.responseTime || 0));
        allPatterns.push(...this.learningDetector.detectCognitiveLoad(input, context.currentTopic || ''));
        allPatterns.push(...this.learningDetector.detectMetacognition(input));

        // Filter out duplicate patterns and strengthen similar ones
        const consolidatedPatterns = this.consolidatePatterns(allPatterns);

        // Generate comprehensive AI response guidance
        const responseGuidance = this.responseGuidance.generateResponseGuidance(consolidatedPatterns);

        // Update student profile with enhanced analytics
        const updatedProfile = await this.updateStudentProfile(studentId, consolidatedPatterns, context);

        return {
            patterns: consolidatedPatterns,
            responseGuidance,
            updatedProfile
        };
    }

    private consolidatePatterns(patterns: StudentBehaviorPattern[]): StudentBehaviorPattern[] {
        const patternMap = new Map<string, StudentBehaviorPattern>();

        for (const pattern of patterns) {
            const key = `${pattern.concept}_${pattern.behavior}`;
            const existing = patternMap.get(key);

            if (existing) {
                // Strengthen the pattern if we detect similar behaviors
                existing.strength = Math.min(1.0, existing.strength + (pattern.strength * 0.3));
                existing.context += `, ${pattern.context}`;
            } else {
                patternMap.set(key, { ...pattern });
            }
        }

        return Array.from(patternMap.values());
    }

    private async updateStudentProfile(
        studentId: string,
        newPatterns: StudentBehaviorPattern[],
        context: any
    ): Promise<StudentProfile> {
        let profile = this.studentProfiles.get(studentId);

        if (!profile) {
            profile = {
                student_id: studentId,
                relationship_patterns: {
                    trust_level: 'building',
                    communication_style: 'developing',
                    emotional_regulation: 'unknown',
                    openness_to_feedback: 'medium'
                },
                learning_patterns: {
                    preferred_cognitive_load: 'medium',
                    attention_span: 'unknown',
                    best_learning_modalities: [],
                    metacognitive_awareness: 'developing',
                    transfer_ability: 'unknown'
                },
                growth_opportunities: [],
                session_history: []
            };
        }

        // Add new patterns with vectorized signatures for trend analysis
        const enrichedPatterns = newPatterns.map(pattern => ({
            ...pattern,
            vectorized_signature: this.generateVectorSignature(pattern, context)
        }));

        profile.session_history.push(...enrichedPatterns);

        // Comprehensive profile characteristic updates
        this.updateProfileCharacteristics(profile, enrichedPatterns);

        // Update learning modality preferences based on interaction patterns
        this.updateLearningModalityPreferences(profile, enrichedPatterns, context);

        // Track emotional regulation patterns
        this.updateEmotionalRegulationAssessment(profile, enrichedPatterns);

        // Update communication style assessment
        this.updateCommunicationStyleAssessment(profile, enrichedPatterns);

        // Maintain rolling window of recent patterns (last 50 interactions)
        if (profile.session_history.length > 50) {
            profile.session_history = profile.session_history.slice(-50);
        }

        this.studentProfiles.set(studentId, profile);
        return profile;
    }

    private generateVectorSignature(pattern: StudentBehaviorPattern, context: any): number[] {
        // Create a simple vector representation for pattern matching
        const features = [
            pattern.strength,
            pattern.concept_category === 'relationship' ? 1 : 0,
            pattern.concept_category === 'learning' ? 1 : 0,
            context.responseTime ? Math.min(1, context.responseTime / 10000) : 0.5,
            new Date().getHours() / 24, // Time of day factor
        ];
        return features;
    }

    private updateProfileCharacteristics(profile: StudentProfile, patterns: StudentBehaviorPattern[]) {
        // Enhanced trust level assessment
        this.updateTrustLevel(profile, patterns);

        // Enhanced cognitive load assessment
        this.updateCognitiveLoadPreference(profile, patterns);

        // Metacognitive awareness assessment
        this.updateMetacognitiveAwareness(profile, patterns);

        // Attention span assessment
        this.updateAttentionSpanAssessment(profile, patterns);

        // Openness to feedback assessment
        this.updateOpennessToFeedback(profile, patterns);

        // Update growth opportunities with enhanced analysis
        profile.growth_opportunities = this.identifyGrowthOpportunities(patterns, profile);
    }

    private updateTrustLevel(profile: StudentProfile, patterns: StudentBehaviorPattern[]) {
        const trustPatterns = patterns.filter(p => p.concept === 'trust');
        if (trustPatterns.length === 0) return;

        const vulnerabilityShared = trustPatterns.filter(p => p.behavior === 'vulnerability_shared');
        const opennessShown = trustPatterns.filter(p => p.behavior === 'openness_demonstrated');
        const skepticismPresent = trustPatterns.filter(p => p.behavior === 'skepticism_present');
        const honestyShown = patterns.filter(p => p.concept === 'honesty' && p.behavior === 'honesty_demonstrated');

        const positiveScore = (vulnerabilityShared.length * 2) + opennessShown.length + honestyShown.length;
        const negativeScore = skepticismPresent.length * 1.5;

        const recentHistory = profile.session_history.slice(-10);
        const historicalTrustScore = recentHistory.filter(p =>
            p.concept === 'trust' && (p.behavior === 'vulnerability_shared' || p.behavior === 'openness_demonstrated')
        ).length;

        if (positiveScore > negativeScore + 2 && historicalTrustScore > 3) {
            profile.relationship_patterns.trust_level = 'high';
        } else if (positiveScore > negativeScore && historicalTrustScore > 1) {
            profile.relationship_patterns.trust_level = 'established';
        } else if (positiveScore > negativeScore) {
            profile.relationship_patterns.trust_level = 'building';
        } else if (negativeScore > positiveScore + 1) {
            profile.relationship_patterns.trust_level = 'low';
        }
    }

    private updateCognitiveLoadPreference(profile: StudentProfile, patterns: StudentBehaviorPattern[]) {
        const cognitivePatterns = patterns.filter(p => p.concept === 'cognitive_load');
        if (cognitivePatterns.length === 0) return;

        const overloadCount = cognitivePatterns.filter(p => p.behavior === 'cognitive_overload').length;
        const underloadCount = cognitivePatterns.filter(p => p.behavior === 'cognitive_underload').length;

        // Consider historical patterns for more stable assessment
        const recentHistory = profile.session_history.slice(-15);
        const historicalOverload = recentHistory.filter(p => p.behavior === 'cognitive_overload').length;
        const historicalUnderload = recentHistory.filter(p => p.behavior === 'cognitive_underload').length;

        const totalOverload = overloadCount + (historicalOverload * 0.5);
        const totalUnderload = underloadCount + (historicalUnderload * 0.5);

        if (totalOverload > totalUnderload + 1) {
            profile.learning_patterns.preferred_cognitive_load = 'low';
        } else if (totalUnderload > totalOverload + 1) {
            profile.learning_patterns.preferred_cognitive_load = 'high';
        } else {
            profile.learning_patterns.preferred_cognitive_load = 'medium';
        }
    }

    private updateMetacognitiveAwareness(profile: StudentProfile, patterns: StudentBehaviorPattern[]) {
        const metacognitivePatterns = patterns.filter(p => p.concept === 'metacognition');
        if (metacognitivePatterns.length === 0) return;

        const strongMetacognition = metacognitivePatterns.filter(p => p.behavior === 'metacognition_strong').length;
        const weakMetacognition = metacognitivePatterns.filter(p => p.behavior === 'metacognition_weak').length;

        // Include historical analysis
        const recentHistory = profile.session_history.slice(-10);
        const historicalStrong = recentHistory.filter(p => p.behavior === 'metacognition_strong').length;
        const historicalWeak = recentHistory.filter(p => p.behavior === 'metacognition_weak').length;

        const totalStrong = strongMetacognition + (historicalStrong * 0.7);
        const totalWeak = weakMetacognition + (historicalWeak * 0.7);

        if (totalStrong > totalWeak + 2) {
            profile.learning_patterns.metacognitive_awareness = 'strong';
        } else if (totalWeak > totalStrong + 1) {
            profile.learning_patterns.metacognitive_awareness = 'weak';
        } else {
            profile.learning_patterns.metacognitive_awareness = 'developing';
        }
    }

    private updateAttentionSpanAssessment(profile: StudentProfile, patterns: StudentBehaviorPattern[]) {
        const attentionPatterns = patterns.filter(p => p.concept === 'attention');
        if (attentionPatterns.length === 0) return;

        const focusedCount = attentionPatterns.filter(p => p.behavior === 'attention_focused').length;
        const distractedCount = attentionPatterns.filter(p => p.behavior === 'distraction_detected').length;

        if (focusedCount > distractedCount + 1) {
            profile.learning_patterns.attention_span = 'sustained';
        } else if (distractedCount > focusedCount + 1) {
            profile.learning_patterns.attention_span = 'limited';
        } else {
            profile.learning_patterns.attention_span = 'moderate';
        }
    }

    private updateOpennessToFeedback(profile: StudentProfile, patterns: StudentBehaviorPattern[]) {
        const communicationPatterns = patterns.filter(p => p.concept === 'effective_communication');
        const respectPatterns = patterns.filter(p => p.concept === 'respect');
        const empathyPatterns = patterns.filter(p => p.concept === 'empathy');

        const positiveSignals = [
            ...communicationPatterns.filter(p => p.behavior === 'clarification_sought'),
            ...respectPatterns.filter(p => p.behavior === 'courtesy_demonstrated'),
            ...empathyPatterns.filter(p => p.behavior === 'empathy_shown')
        ].length;

        const resistanceSignals = [
            ...respectPatterns.filter(p => p.behavior === 'disrespect_detected'),
            ...empathyPatterns.filter(p => p.behavior === 'impatience_with_process')
        ].length;

        if (positiveSignals > resistanceSignals + 2) {
            profile.relationship_patterns.openness_to_feedback = 'high';
        } else if (resistanceSignals > positiveSignals + 1) {
            profile.relationship_patterns.openness_to_feedback = 'low';
        } else {
            profile.relationship_patterns.openness_to_feedback = 'medium';
        }
    }

    private updateLearningModalityPreferences(profile: StudentProfile, patterns: StudentBehaviorPattern[], context: any) {
        const preferences = new Set(profile.learning_patterns.best_learning_modalities);

        // Analyze engagement patterns to infer modality preferences
        const highEngagementPatterns = patterns.filter(p => p.strength > 0.7);

        for (const pattern of highEngagementPatterns) {
            if (pattern.behavior === 'communication_clear' && context.currentTopic) {
                preferences.add('verbal_explanation');
            }
            if (pattern.behavior === 'attention_focused' && context.responseTime && context.responseTime < 5000) {
                preferences.add('interactive_dialogue');
            }
            if (pattern.behavior === 'metacognition_strong') {
                preferences.add('reflective_analysis');
            }
        }

        profile.learning_patterns.best_learning_modalities = Array.from(preferences);
    }

    private updateEmotionalRegulationAssessment(profile: StudentProfile, patterns: StudentBehaviorPattern[]) {
        const emotionalIndicators = patterns.filter(p =>
            p.behavior === 'disrespect_detected' ||
            p.behavior === 'impatience_shown' ||
            p.behavior === 'empathy_shown' ||
            p.behavior === 'patience_with_ai'
        );

        const positiveRegulation = emotionalIndicators.filter(p =>
            p.behavior === 'empathy_shown' || p.behavior === 'patience_with_ai'
        ).length;

        const poorRegulation = emotionalIndicators.filter(p =>
            p.behavior === 'disrespect_detected' || p.behavior === 'impatience_shown'
        ).length;

        if (positiveRegulation > poorRegulation + 1) {
            profile.relationship_patterns.emotional_regulation = 'well_regulated';
        } else if (poorRegulation > positiveRegulation + 1) {
            profile.relationship_patterns.emotional_regulation = 'needs_support';
        } else {
            profile.relationship_patterns.emotional_regulation = 'developing';
        }
    }

    private updateCommunicationStyleAssessment(profile: StudentProfile, patterns: StudentBehaviorPattern[]) {
        const communicationPatterns = patterns.filter(p => p.concept === 'effective_communication');

        const clearCommunication = communicationPatterns.filter(p => p.behavior === 'communication_clear').length;
        const clarificationSeeking = communicationPatterns.filter(p => p.behavior === 'clarification_sought').length;
        const unclearCommunication = communicationPatterns.filter(p => p.behavior === 'communication_unclear').length;

        if (clearCommunication + clarificationSeeking > unclearCommunication + 2) {
            profile.relationship_patterns.communication_style = 'articulate_and_engaged';
        } else if (unclearCommunication > clearCommunication + clarificationSeeking) {
            profile.relationship_patterns.communication_style = 'needs_support';
        } else {
            profile.relationship_patterns.communication_style = 'developing';
        }
    }

    private identifyGrowthOpportunities(patterns: StudentBehaviorPattern[], profile: StudentProfile): string[] {
        const opportunities: string[] = [];

        // Relationship growth opportunities
        if (patterns.some(p => p.behavior === 'disrespect_detected') ||
            profile.relationship_patterns.emotional_regulation === 'needs_support') {
            opportunities.push('develop_respectful_communication');
        }

        if (patterns.some(p => p.behavior === 'skepticism_present') ||
            profile.relationship_patterns.trust_level === 'low') {
            opportunities.push('build_trust_and_openness');
        }

        if (patterns.some(p => p.behavior === 'communication_unclear') ||
            profile.relationship_patterns.communication_style === 'needs_support') {
            opportunities.push('improve_expression_skills');
        }

        if (patterns.some(p => p.behavior === 'passive_participation')) {
            opportunities.push('increase_active_engagement');
        }

        // Learning growth opportunities
        if (patterns.some(p => p.behavior === 'cognitive_overload') ||
            profile.learning_patterns.preferred_cognitive_load === 'low') {
            opportunities.push('build_learning_strategies');
        }

        if (patterns.some(p => p.behavior === 'metacognition_weak') ||
            profile.learning_patterns.metacognitive_awareness === 'weak') {
            opportunities.push('strengthen_self_reflection');
        }

        if (patterns.some(p => p.behavior === 'distraction_detected') ||
            profile.learning_patterns.attention_span === 'limited') {
            opportunities.push('develop_focus_techniques');
        }

        if (patterns.some(p => p.behavior === 'cognitive_underload') &&
            profile.learning_patterns.preferred_cognitive_load === 'high') {
            opportunities.push('explore_advanced_challenges');
        }

        return [...Array.from(new Set(opportunities))];
    }

    // Enhanced student insights with comprehensive analytics
    getStudentInsights(studentId: string): {
        currentState: StudentProfile | null;
        immediateNeeds: string[];
        recommendedApproach: string;
        sessionHistory: StudentBehaviorPattern[];
        trendAnalysis: {
            trustTrend: string;
            engagementTrend: string;
            learningEffectiveness: string;
            communicationTrend: string;
        };
        strengthsIdentified: string[];
        priorityInterventions: string[];
    } {
        const profile = this.studentProfiles.get(studentId);

        if (!profile) {
            return {
                currentState: null,
                immediateNeeds: [],
                recommendedApproach: 'establish_baseline',
                sessionHistory: [],
                trendAnalysis: {
                    trustTrend: 'unknown',
                    engagementTrend: 'unknown',
                    learningEffectiveness: 'unknown',
                    communicationTrend: 'unknown'
                },
                strengthsIdentified: [],
                priorityInterventions: []
            };
        }

        const recentPatterns = profile.session_history.slice(-10);
        const immediateNeeds = this.identifyImmediateNeeds(recentPatterns);
        const recommendedApproach = this.getRecommendedApproach(profile, recentPatterns);
        const trendAnalysis = this.analyzeTrends(profile);
        const strengthsIdentified = this.identifyStrengths(recentPatterns, profile);
        const priorityInterventions = this.identifyPriorityInterventions(profile, recentPatterns);

        return {
            currentState: profile,
            immediateNeeds,
            recommendedApproach,
            sessionHistory: profile.session_history,
            trendAnalysis,
            strengthsIdentified,
            priorityInterventions
        };
    }

    private identifyImmediateNeeds(recentPatterns: StudentBehaviorPattern[]): string[] {
        const needs: string[] = [];

        // Check for urgent issues in recent patterns
        const urgentPatterns = recentPatterns.filter(p => p.strength > 0.7);

        for (const pattern of urgentPatterns) {
            switch (pattern.behavior) {
                case 'cognitive_overload':
                    needs.push('reduce_complexity_immediately');
                    break;
                case 'disrespect_detected':
                    needs.push('address_communication_style');
                    break;
                case 'skepticism_present':
                    needs.push('rebuild_trust');
                    break;
                case 'distraction_detected':
                    needs.push('refocus_attention');
                    break;
                case 'impatience_with_process':
                    needs.push('manage_expectations');
                    break;
            }
        }

        return [...Array.from(new Set(needs))];
    }

    private getRecommendedApproach(profile: StudentProfile, recentPatterns: StudentBehaviorPattern[]): string {
        // Priority order: cognitive overload > trust issues > engagement optimization

        if (profile.relationship_patterns.trust_level === 'low') {
            return 'focus_on_trust_building';
        }

        const hasOverload = recentPatterns.some(p => p.behavior === 'cognitive_overload');
        if (hasOverload || profile.learning_patterns.preferred_cognitive_load === 'low') {
            return 'prioritize_cognitive_support';
        }

        const hasDisrespect = recentPatterns.some(p => p.behavior === 'disrespect_detected');
        if (hasDisrespect || profile.relationship_patterns.emotional_regulation === 'needs_support') {
            return 'address_emotional_regulation';
        }

        const hasGoodEngagement = recentPatterns.some(p =>
            p.behavior === 'attention_focused' ||
            p.behavior === 'communication_clear' ||
            p.behavior === 'metacognition_strong'
        );

        if (hasGoodEngagement && profile.relationship_patterns.trust_level === 'high') {
            return 'optimize_for_growth';
        }

        return 'balanced_adaptive_approach';
    }

    private analyzeTrends(profile: StudentProfile): {
        trustTrend: string;
        engagementTrend: string;
        learningEffectiveness: string;
        communicationTrend: string;
    } {
        const history = profile.session_history;
        const recentWindow = history.slice(-10);
        const earlierWindow = history.slice(-20, -10);

        return {
            trustTrend: this.calculateTrustTrend(recentWindow, earlierWindow),
            engagementTrend: this.calculateEngagementTrend(recentWindow, earlierWindow),
            learningEffectiveness: this.calculateLearningTrend(recentWindow, earlierWindow),
            communicationTrend: this.calculateCommunicationTrend(recentWindow, earlierWindow)
        };
    }

    private calculateTrustTrend(recent: StudentBehaviorPattern[], earlier: StudentBehaviorPattern[]): string {
        const recentTrustScore = recent.filter(p =>
            p.concept === 'trust' && (p.behavior === 'vulnerability_shared' || p.behavior === 'openness_demonstrated')
        ).length;

        const earlierTrustScore = earlier.filter(p =>
            p.concept === 'trust' && (p.behavior === 'vulnerability_shared' || p.behavior === 'openness_demonstrated')
        ).length;

        if (recentTrustScore > earlierTrustScore + 1) return 'improving';
        if (earlierTrustScore > recentTrustScore + 1) return 'declining';
        return 'stable';
    }

    private calculateEngagementTrend(recent: StudentBehaviorPattern[], earlier: StudentBehaviorPattern[]): string {
        const recentEngagement = recent.filter(p =>
            p.behavior === 'attention_focused' ||
            p.behavior === 'active_contribution' ||
            p.behavior === 'communication_clear'
        ).length;

        const earlierEngagement = earlier.filter(p =>
            p.behavior === 'attention_focused' ||
            p.behavior === 'active_contribution' ||
            p.behavior === 'communication_clear'
        ).length;

        if (recentEngagement > earlierEngagement + 1) return 'increasing';
        if (earlierEngagement > recentEngagement + 1) return 'decreasing';
        return 'consistent';
    }

    private calculateLearningTrend(recent: StudentBehaviorPattern[], earlier: StudentBehaviorPattern[]): string {
        const recentLearning = recent.filter(p =>
            p.behavior === 'metacognition_strong' ||
            (p.concept === 'cognitive_load' && p.behavior !== 'cognitive_overload')
        ).length;

        const earlierLearning = earlier.filter(p =>
            p.behavior === 'metacognition_strong' ||
            (p.concept === 'cognitive_load' && p.behavior !== 'cognitive_overload')
        ).length;

        if (recentLearning > earlierLearning + 1) return 'strengthening';
        if (earlierLearning > recentLearning + 1) return 'weakening';
        return 'steady';
    }

    private calculateCommunicationTrend(recent: StudentBehaviorPattern[], earlier: StudentBehaviorPattern[]): string {
        const recentCommunication = recent.filter(p =>
            p.behavior === 'communication_clear' ||
            p.behavior === 'clarification_sought' ||
            p.behavior === 'courtesy_demonstrated'
        ).length;

        const earlierCommunication = earlier.filter(p =>
            p.behavior === 'communication_clear' ||
            p.behavior === 'clarification_sought' ||
            p.behavior === 'courtesy_demonstrated'
        ).length;

        if (recentCommunication > earlierCommunication + 1) return 'improving';
        if (earlierCommunication > recentCommunication + 1) return 'regressing';
        return 'maintaining';
    }

    private identifyStrengths(recentPatterns: StudentBehaviorPattern[], profile: StudentProfile): string[] {
        const strengths: string[] = [];

        // Identify current strengths based on positive patterns
        const strongPatterns = recentPatterns.filter(p => p.strength > 0.6);

        for (const pattern of strongPatterns) {
            switch (pattern.behavior) {
                case 'vulnerability_shared':
                case 'honesty_demonstrated':
                    strengths.push('authentic_communication');
                    break;
                case 'communication_clear':
                case 'clarification_sought':
                    strengths.push('effective_communication');
                    break;
                case 'attention_focused':
                case 'active_contribution':
                    strengths.push('high_engagement');
                    break;
                case 'metacognition_strong':
                    strengths.push('self_awareness');
                    break;
                case 'empathy_shown':
                case 'courtesy_demonstrated':
                    strengths.push('interpersonal_skills');
                    break;
            }
        }

        // Add profile-based strengths
        if (profile.relationship_patterns.trust_level === 'high') {
            strengths.push('strong_trust_foundation');
        }
        if (profile.learning_patterns.metacognitive_awareness === 'strong') {
            strengths.push('metacognitive_capability');
        }

        return [...Array.from(new Set(strengths))];
    }

    private identifyPriorityInterventions(profile: StudentProfile, recentPatterns: StudentBehaviorPattern[]): string[] {
        const interventions: string[] = [];

        // High priority interventions based on urgent needs
        const urgentPatterns = recentPatterns.filter(p => p.strength > 0.8);

        for (const pattern of urgentPatterns) {
            if (pattern.behavior === 'cognitive_overload') {
                interventions.push('implement_scaffolding_immediately');
            }
            if (pattern.behavior === 'disrespect_detected') {
                interventions.push('establish_communication_boundaries');
            }
        }

        // Medium priority based on profile characteristics
        if (profile.relationship_patterns.trust_level === 'low') {
            interventions.push('prioritize_trust_building_activities');
        }
        if (profile.learning_patterns.metacognitive_awareness === 'weak') {
            interventions.push('introduce_reflection_strategies');
        }

        return [...Array.from(new Set(interventions))];
    }
}