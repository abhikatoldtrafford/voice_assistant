export interface DetectedBehaviorPattern {
    concept_category: 'relationship' | 'learning';
    concept: 'trust' | 'respect' | 'effective_communication' | 'empathy' | 'reciprocity' | 'honesty' | 'attention' | 'cognitive_load' | 'metacognition';
    behavior: string;
    confidence: number; // 0.0 - 1.0
    evidence: string;
    context_factors: string[];
    ai_response_needed: AIResponsePattern;
    timestamp?: Date;
    weight: number; // 0.0 - 1.0 (0 = reduce relationship score, 1 = boost relationship score)
}

export interface OverallAssessment {
    engagement_level: 'high' | 'medium' | 'low';
    emotional_state: 'frustrated' | 'confident' | 'confused' | 'excited' | 'neutral' | 'discouraged';
    learning_readiness: 'ready' | 'needs_support' | 'overwhelmed' | 'disengaged';
    relationship_building_opportunity: 'trust_building' | 'respect_modeling' | 'communication_improvement' | 'empathy_development' | 'none';
}

export interface AIBehaviorDetectionOutput {
    detected_patterns: DetectedBehaviorPattern[];
    overall_assessment: OverallAssessment;
    recommended_ai_actions: AIResponsePattern[];
}

// Enum for AI response patterns (as provided)
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
    interaction_approach?: string;
    immediate_actions: string[];
    avoid_patterns?: string[];
}