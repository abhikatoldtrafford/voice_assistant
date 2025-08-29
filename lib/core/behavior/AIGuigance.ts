import { AIResponsePattern, DetectedBehaviorPattern, ResponseStrategy, ResponseGuidance } from "./types";



// Trust-building strategies
export const STRATEGIES: { [key: string]: ResponseStrategy } = {
    [AIResponsePattern.ACKNOWLEDGE_VULNERABILITY]: {
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
    },

    [AIResponsePattern.TRUST_BUILDING_RESPONSE]: {
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
    },

    [AIResponsePattern.TRUST_BUILDING_NEEDED]: {
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
    },

    [AIResponsePattern.REWARD_HONEST_COMMUNICATION]: {
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
    },

    [AIResponsePattern.CREATE_SAFE_SPACE]: {
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
    },

    // Respect-related strategies
    [AIResponsePattern.ACKNOWLEDGE_COURTESY]: {
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
    }

    , [AIResponsePattern.ADDRESS_DISRESPECTFUL_BEHAVIOR]: {
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
    }

    , [AIResponsePattern.MODEL_RESPECTFUL_COMMUNICATION]: {
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
    }

    // Communication-related strategies
    , [AIResponsePattern.REINFORCE_GOOD_COMMUNICATION]: {
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
    },
    [AIResponsePattern.ENCOURAGE_ELABORATION]: {
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
    }

    // Empathy-related strategies
    , [AIResponsePattern.ACKNOWLEDGE_STUDENT_CONTRIBUTION]: {
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
    }

    , [AIResponsePattern.SHOW_APPRECIATION]: {
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
    }

    , [AIResponsePattern.MODEL_EMPATHY]: {
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
    }

    // Reciprocity-related strategies
    , [AIResponsePattern.ENCOURAGE_ACTIVE_PARTICIPATION]: {
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
    }

    // Learning-related strategies
    , [AIResponsePattern.MAINTAIN_ENGAGEMENT]: {
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
    }, [AIResponsePattern.REFOCUS_ATTENTION]: {
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
    }, [AIResponsePattern.REDUCE_COMPLEXITY]: {
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
    }, [AIResponsePattern.INCREASE_CHALLENGE]: {
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
    }, [AIResponsePattern.REINFORCE_METACOGNITIVE_THINKING]: {
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
    }, [AIResponsePattern.DEVELOP_METACOGNITIVE_SKILLS]: {
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
    }
}

export function consolidatePatterns(patterns: DetectedBehaviorPattern[]): DetectedBehaviorPattern[] {
    const patternMap = new Map<string, DetectedBehaviorPattern>();

    for (const pattern of patterns) {
        const key = `${pattern.concept}_${pattern.behavior}`;
        const existing = patternMap.get(key);

        if (existing) {
            // Strengthen the pattern if we detect similar behaviors
            existing.weight = Math.min(1.0, existing.weight + (pattern.weight * 0.3));
            existing.evidence += `, ${pattern.evidence}`;
        } else {
            patternMap.set(key, { ...pattern });
        }
    }

    return Array.from(patternMap.values());
}

export function generateResponseGuidance(patterns: DetectedBehaviorPattern[]): ResponseGuidance {
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
        const strategyA = STRATEGIES[a.ai_response_needed];
        const strategyB = STRATEGIES[b.ai_response_needed];

        const priorityOrder = { 'urgent': 4, 'high': 3, 'medium': 2, 'low': 1 };
        const priorityA = strategyA ? priorityOrder[strategyA.priority_level] : 0;
        const priorityB = strategyB ? priorityOrder[strategyB.priority_level] : 0;

        if (priorityA !== priorityB) {
            return priorityB - priorityA; // Higher priority first
        }
        return b.weight - a.weight; // Higher strength first
    });

    const primaryPattern = sortedPatterns[0];
    const primary_strategy = STRATEGIES[primaryPattern.ai_response_needed];

    // Combine guidance from all patterns
    const allStrategies = patterns.map(p => STRATEGIES[p.ai_response_needed]).filter(Boolean) as ResponseStrategy[];

    const tone_adjustments = [...Array.from(new Set(allStrategies.map(s => s.tone)))];
    const content_priorities = [...Array.from(new Set(allStrategies.flatMap(s => s.content_adjustments)))];
    const immediate_actions = [...Array.from(new Set(allStrategies.flatMap(s => s.followup_actions)))];

    return {
        primary_strategy,
        tone_adjustments,
        content_priorities,
        // interaction_approach: this.determineInteractionApproach(patterns),
        immediate_actions,
        // avoid_patterns: this.getAvoidPatterns(patterns)
    };
}