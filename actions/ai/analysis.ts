'use server'
import OpenAI from 'openai';
import { ISessionAnalysisReport } from '@/models/ai-coach';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Default model to use for analysis
const DEFAULT_MODEL = 'gpt-4o-mini';

/**
 * Analyze a coaching session using LLM
 */
export async function performLLMAnalysis(analysisData: any): Promise<{ success: boolean, analysis?: Partial<ISessionAnalysisReport>, error?: string }> {
  try {
    // Extract the conversation from the session
    const conversation = analysisData.session.messages.map((msg: any) =>
      `${msg.role.toUpperCase()}: ${msg.content}`
    ).join('\n\n');

    // Build the analysis prompt
    const prompt = `
# COACHING SESSION ANALYSIS

## SESSION DETAILS
- Course: ${analysisData.course.title} (Level: ${analysisData.course.level})
- Chapter: ${analysisData.chapter.title}
- Student: ${analysisData.user.name}

## COURSE CONTENT CONTEXT
${analysisData.chapter.content}

## CONVERSATION TRANSCRIPT
${conversation}

## CURRENT STUDENT PROFILE
${JSON.stringify(analysisData.userLearningProfile || {}, null, 2)}

## CURRENT COURSE PROGRESS
${JSON.stringify(analysisData.courseUserProfile || {}, null, 2)}

## ANALYSIS TASK

Based on the above coaching session, perform a detailed educational assessment of the student's learning progress.
Analyze the conversation to identify:

1. Overall understanding level (1-10 scale)
2. Key observations about the student's learning (strengths, weaknesses, insights)
3. Concepts the student clearly understands
4. Concepts the student struggles with
5. Recommended actions for improvement
6. Insights about learning style, communication style, and engagement level

Return the analysis as a JSON object with the following structure:

\`\`\`json
{
  "overallUnderstanding": 7, // 1-10 scale
  "keyObservations": [
    {
      "category": "strength", // "strength", "weakness", "insight", etc.
      "observation": "Shows good grasp of fundamental principles",
      "importance": 8 // 1-10 scale
    }
    // Add 2-5 more observations
  ],
  "conceptsUnderstood": [
    {
      "conceptName": "Specific concept name",
      "confidenceLevel": 8, // 1-10 scale
      "evidence": "rational behind the judgement, with explaination" // information should be self sufficient with no reference to other parts of conversation
    }
    // Add all identified concepts
  ],
  "conceptsStruggling": [
    {
      "conceptName": "Specific concept name",
      "struggleLevel": 6, // 1-10 scale
      "evidence": "rational behind the judgement, with explaination" //information should be self sufficient with no reference to other parts of conversation
    }
    // Add all identified concepts
  ],
  "recommendedActions": [
    {
      "action": "Specific recommended action",
      "priority": 8, // 1-10 scale
      "reasoning": "Why this action would help"
    }
    // Add 2-4 recommended actions
  ],
  "learningStyleInsights": "Detailed paragraph about learning style preferences",
  "communicationStyleInsights": "Detailed paragraph about communication patterns",
  "engagementLevelInsights": "Detailed paragraph about engagement level observed"
}
\`\`\`

Be specific, thorough and evidence-based in your analysis. Focus on educational insights that would be helpful for personalizing future coaching.
`;

    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [{ role: 'system', content: prompt }],
      temperature: 0.2, // Lower temperature for more consistent analysis
      max_tokens: 2048,
      response_format: { type: "json_object" }
    });

    // Parse the response
    const analysisText = response.choices[0]?.message?.content || '';

    try {
      const analysis = JSON.parse(analysisText);

      // Validate the required fields
      if (!analysis.overallUnderstanding ||
        !Array.isArray(analysis.keyObservations) ||
        !Array.isArray(analysis.conceptsUnderstood) ||
        !Array.isArray(analysis.conceptsStruggling) ||
        !Array.isArray(analysis.recommendedActions)) {
        throw new Error('Incomplete analysis structure');
      }

      return { success: true, analysis };
    } catch (parseError) {
      console.error('Error parsing analysis JSON:', parseError, analysisText);
      return { success: false, error: 'Failed to parse analysis result' };
    }
  } catch (error: any) {
    console.error('Error in LLM analysis:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Generate a concise summary of the coaching session
 */
export async function generateSessionSummary(sessionData: any): Promise<string> {
  try {
    // Extract the conversation from the session
    const conversation = sessionData.messages.map((msg: any) =>
      `${msg.role.toUpperCase()}: ${msg.content.substring(0, 200)}${msg.content.length > 200 ? '...' : ''}`
    ).join('\n\n');

    const prompt = `
Summarize the following coaching session conversation in about 100-150 words.
Focus on the main topics discussed, key questions asked by the student, and main explanations provided.

CONVERSATION:
${conversation}

Provide a concise, informative summary that would be useful for reviewing the session later.
`;

    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Using a smaller model for summaries to save costs
      messages: [{ role: 'system', content: prompt }],
      temperature: 0.3,
      max_tokens: 200
    });

    return response.choices[0]?.message?.content || 'No summary available';
  } catch (error) {
    console.error('Error generating session summary:', error);
    return 'Failed to generate summary. Please review the full conversation.';
  }
}


export async function getLiveUserStateAnalysis(text: string, context: any): Promise<any> {
  try {
    // Build the analysis prompt
    const prompt = `
# Student Behavior Detection Prompt for LLM

## System Role
You are an expert educational psychologist and AI tutor behavior analyst. Your task is to analyze student messages and detect specific behavioral patterns related to relationship building and learning processes. You must provide structured, actionable insights for AI tutoring systems.

## Core Instructions

**INPUT**: You will receive a student message along with optional context (previous conversation, subject matter, response timing, etc.)

**OUTPUT**: You must respond with a JSON object containing detected behavioral patterns. Each pattern must include confidence scores and specific evidence from the student's message.

## AI Response Pattern Selection Guide

Select appropriate AI response patterns from the following enum values based on detected behaviors:

### Trust-Related Responses:
- **acknowledge_vulnerability**: When student shares struggles, confusion, or admits difficulty
- **trust_building_response**: When student shows openness and willingness to learn
- **trust_building_needed**: When student exhibits skepticism or defensive behavior
- **reward_honest_communication**: When student authentically admits confusion or mistakes
- **create_safe_space**: When student may be pretending to understand or hiding confusion

### Respect-Related Responses:
- **acknowledge_courtesy**: When student uses polite language or shows appreciation
- **address_disrespectful_behavior**: When student uses inappropriate or rude language
- **model_respectful_communication**: When student shows impatience or demanding behavior

### Communication-Related Responses:
- **reinforce_good_communication**: When student asks clear, detailed questions or seeks clarification
- **encourage_elaboration**: When student gives minimal, vague, or unclear responses

### Empathy-Related Responses:
- **acknowledge_student_contribution**: When student shows empathy, offers ideas, or contributes actively
- **show_appreciation**: When student shows patience with AI limitations or process
- **model_empathy**: When student shows impatience with AI performance or learning process

### Reciprocity-Related Responses:
- **encourage_active_participation**: When student shows passive participation or expects AI to do all work

### Learning-Related Responses:
- **maintain_engagement**: When student shows focused attention and good engagement
- **refocus_attention**: When student shows distraction or attention lapses
- **reduce_complexity**: When student shows cognitive overload or feeling overwhelmed
- **increase_challenge**: When student shows cognitive underload, boredom, or requests more difficulty
- **reinforce_metacognitive_thinking**: When student demonstrates strong metacognitive awareness
- **develop_metacognitive_skills**: When student shows weak metacognitive awareness or learning strategies

### RELATIONSHIP CONCEPTS

#### 1. TRUST BEHAVIORS
**Vulnerability Sharing** (0.0-1.0 confidence)
- Student admits confusion, struggles, or lack of understanding
- Shares personal learning difficulties or past failures
- Asks for help without defensiveness
- Evidence: Direct quotes showing admission of difficulty

**Openness Demonstrated** (0.0-1.0 confidence)
- Shows willingness to learn and engage
- Asks for more information or clarification
- Expresses interest in explanations
- Evidence: Questions or requests for deeper learning

**Skepticism Present** (0.0-1.0 confidence)
- Dismissive language or doubtful tone
- Questions AI capability or teaching approach
- Shows resistance to engagement
- Evidence: Dismissive phrases or expressions of doubt

#### 2. RESPECT BEHAVIORS
**Courtesy Demonstrated** (0.0-1.0 confidence)
- Uses polite language (please, thank you, etc.)
- Shows appreciation for help or explanations
- Maintains respectful tone throughout interaction
- Evidence: Specific polite phrases or expressions of gratitude

**Disrespect Detected** (0.0-1.0 confidence)
- Uses inappropriate, rude, or dismissive language
- Shows impatience through demanding tone
- Interrupts or dismisses AI responses
- Evidence: Specific disrespectful language or tone indicators

**Impatience Shown** (0.0-1.0 confidence)
- Rushing through explanations
- Demanding quick answers without process
- Shows frustration with learning pace
- Evidence: Time-pressure language or rushing indicators

#### 3. COMMUNICATION QUALITY
**Clear Communication** (0.0-1.0 confidence)
- Asks specific, detailed questions
- Provides context for their confusion
- Builds on previous responses effectively
- Evidence: Question quality and specificity

**Unclear Communication** (0.0-1.0 confidence)
- Vague requests or minimal responses
- Doesn't provide enough context
- Uses unclear or ambiguous language
- Evidence: Vagueness indicators and lack of detail

#### 4. EMPATHY BEHAVIORS
**Empathy Shown** (0.0-1.0 confidence)
- Shows understanding of AI limitations
- Patient with processing or explanation time
- Acknowledges difficulty of teaching/learning process
- Evidence: Understanding or patient language

**Impatience with Process** (0.0-1.0 confidence)
- Frustrated with AI limitations or mistakes
- Expects perfect responses immediately
- Lacks understanding of learning process
- Evidence: Frustration with AI performance

#### 5. RECIPROCITY BEHAVIORS
**Active Contribution** (0.0-1.0 confidence)
- Offers ideas, attempts, or solutions
- Engages actively in problem-solving
- Shares their thinking process
- Evidence: Initiative-taking language

**Passive Participation** (0.0-1.0 confidence)
- Expects AI to do all the work
- Doesn't contribute effort to learning
- Asks for direct answers without engagement
- Evidence: Passive language or demands for solutions

#### 6. HONESTY BEHAVIORS
**Honesty Demonstrated** (0.0-1.0 confidence)
- Authentic admission of confusion or mistakes
- Honest about homework completion or preparation
- Genuine expression of understanding level
- Evidence: Authentic admission language

**Pretense Detected** (0.0-1.0 confidence)
- Claims understanding when likely confused
- Superficial agreement without real comprehension
- Avoids admitting real confusion level
- Evidence: Superficial agreement patterns

### LEARNING CONCEPTS

#### 7. ATTENTION PATTERNS
**Focused Attention** (0.0-1.0 confidence)
- Demonstrates active listening and engagement
- Builds on previous explanations effectively
- Asks relevant follow-up questions
- Evidence: Engagement indicators and relevant responses

**Distraction Detected** (0.0-1.0 confidence)
- Asks for repetition of information
- Responds off-topic or irrelevantly
- Shows signs of divided attention
- Evidence: Repetition requests or off-topic responses

#### 8. COGNITIVE LOAD
**Cognitive Overload** (0.0-1.0 confidence)
- Explicitly states feeling overwhelmed
- Requests to slow down or simplify
- Shows confusion about multiple concepts
- Evidence: Overload language or simplification requests

**Cognitive Underload** (0.0-1.0 confidence)
- States material is too easy or boring
- Requests more challenging content
- Shows signs of disengagement due to simplicity
- Evidence: Boredom indicators or challenge requests

#### 9. METACOGNITIVE AWARENESS
**Strong Metacognition** (0.0-1.0 confidence)
- Reflects on their own learning process
- Identifies their mistakes and learning strategies
- Shows awareness of their understanding level
- Evidence: Self-reflection language

**Weak Metacognition** (0.0-1.0 confidence)
- Cannot identify why they're struggling
- No awareness of learning strategies
- Lacks insight into their understanding gaps
- Evidence: Lack of learning awareness

## Context Factors to Consider
- **Response Timing**: Quick responses may indicate confidence or impulsiveness; slow responses may indicate thoughtfulness or confusion
- **Message Length**: Very short responses may indicate disengagement; very long responses may indicate high engagement
- **Subject Matter**: Math anxiety vs. enthusiasm for creative subjects
- **Previous Interaction History**: Pattern of behavior across multiple exchanges
- **Educational Level**: Age-appropriate expectations for metacognition and communication

## Required TypeScript Interfaces

You MUST follow these exact TypeScript interfaces in your response:

\`\`\`typescript
    interface DetectedBehaviorPattern {
      concept_category: 'relationship' | 'learning';
      concept: 'trust' | 'respect' | 'effective_communication' | 'empathy' | 'reciprocity' | 'honesty' | 'attention' | 'cognitive_load' | 'metacognition';
      behavior: string;
      confidence: number; // 0.0 - 1.0
      evidence: string;
      context_factors: string[];
      ai_response_needed: AIResponsePattern;
      weight: number; // 0.0 - 1.0 (0 = reduce relationship score, 1 = boost relationship score)
    }

    interface OverallAssessment {
      engagement_level: 'high' | 'medium' | 'low';
      emotional_state: 'frustrated' | 'confident' | 'confused' | 'excited' | 'neutral' | 'discouraged';
      learning_readiness: 'ready' | 'needs_support' | 'overwhelmed' | 'disengaged';
      relationship_building_opportunity: 'trust_building' | 'respect_modeling' | 'communication_improvement' | 'empathy_development' | 'none';
    }

    interface AIBehaviorDetectionOutput {
      detected_patterns: DetectedBehaviorPattern[];
      overall_assessment: OverallAssessment;
      recommended_ai_actions: AIResponsePattern[];
    }

    enum AIResponsePattern {
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
    \`\`\`

## Critical Output Requirements

**IMPORTANT**: Your response must be valid JSON that matches the \`AIBehaviorDetectionOutput\` interface exactly. 

### Strict Value Constraints:

**concept_category**: Must be exactly "relationship" OR "learning"

**concept**: Must be exactly one of:
- "trust", "respect", "effective_communication", "empathy", "reciprocity", "honesty" (for relationship)
- "attention", "cognitive_load", "metacognition" (for learning)

**engagement_level**: Must be exactly "high", "medium", OR "low"

**emotional_state**: Must be exactly "frustrated", "confident", "confused", "excited", "neutral", OR "discouraged"

**learning_readiness**: Must be exactly "ready", "needs_support", "overwhelmed", OR "disengaged"

**relationship_building_opportunity**: Must be exactly "trust_building", "respect_modeling", "communication_improvement", "empathy_development", OR "none"

**ai_response_needed** and **recommended_ai_actions**: Must use exact enum string values from AIResponsePattern (e.g., "acknowledge_vulnerability", "reduce_complexity")

**weight**: Must be a number between 0.0 and 1.0, where 0.0 reduces relationship score and 1.0 boosts relationship score

The \`weight\` field (0.0 - 1.0) indicates the relationship impact of each detected pattern:

### Weight Scale:
- **0.0 - 0.3**: Significantly reduces relationship score (negative behaviors)
- **0.3 - 0.5**: Moderately reduces relationship score (concerning behaviors)
- **0.5 - 0.7**: Neutral to slightly positive impact (learning-focused behaviors)
- **0.7 - 0.9**: Moderately boosts relationship score (positive behaviors)
- **0.9 - 1.0**: Significantly boosts relationship score (excellent relationship behaviors)

### Behavior Weight Examples:

**Relationship-Damaging Behaviors (0.0 - 0.3):**
- Disrespectful language or behavior
- Aggressive skepticism or hostility
- Dismissive attitudes toward learning process
- Refusing to engage or participate

**Concerning Behaviors (0.3 - 0.5):**
- Mild disrespect or impatience
- Passive participation patterns
- Pretending to understand when confused
- Showing frustration with AI limitations

**Neutral/Learning-Focused Behaviors (0.5 - 0.7):**
- Cognitive overload or underload (learning state, not relationship issue)
- Attention patterns (focus/distraction)
- Basic metacognitive awareness levels
- Functional communication without strong positive/negative markers

**Positive Relationship Behaviors (0.7 - 0.9):**
- Showing courtesy and politeness
- Demonstrating empathy and patience
- Clear, effective communication
- Active participation and contribution
- Moderate trust-building behaviors

**Excellent Relationship Behaviors (0.9 - 1.0):**
- Vulnerable sharing and openness
- Strong honest communication
- Exceptional empathy and understanding
- High levels of active engagement
- Strong trust demonstration

## Weight Assignment Guidelines

The \`weight\` field (0.0 - 1.0) indicates the relationship impact of each detected pattern:

### Weight Scale:
- **0.0 - 0.3**: Significantly reduces relationship score (negative behaviors)
- **0.3 - 0.5**: Moderately reduces relationship score (concerning behaviors)
- **0.5 - 0.7**: Neutral to slightly positive impact (learning-focused behaviors)
- **0.7 - 0.9**: Moderately boosts relationship score (positive behaviors)
- **0.9 - 1.0**: Significantly boosts relationship score (excellent relationship behaviors)

### Behavior Weight Examples:

**Relationship-Damaging Behaviors (0.0 - 0.3):**
- Disrespectful language or behavior
- Aggressive skepticism or hostility
- Dismissive attitudes toward learning process
- Refusing to engage or participate

**Concerning Behaviors (0.3 - 0.5):**
- Mild disrespect or impatience
- Passive participation patterns
- Pretending to understand when confused
- Showing frustration with AI limitations

**Neutral/Learning-Focused Behaviors (0.5 - 0.7):**
- Cognitive overload or underload (learning state, not relationship issue)
- Attention patterns (focus/distraction)
- Basic metacognitive awareness levels
- Functional communication without strong positive/negative markers

**Positive Relationship Behaviors (0.7 - 0.9):**
- Showing courtesy and politeness
- Demonstrating empathy and patience
- Clear, effective communication
- Active participation and contribution
- Moderate trust-building behaviors

**Excellent Relationship Behaviors (0.9 - 1.0):**
- Vulnerable sharing and openness
- Strong honest communication
- Exceptional empathy and understanding
- High levels of active engagement
- Strong trust demonstration

## Example Output Format:
\`\`\`json
    {
      "detected_patterns": [
        {
          "concept_category": "relationship",
          "concept": "trust",
          "behavior": "vulnerability_shared",
          "confidence": 0.9,
          "evidence": "I don't know... I guess this is just too hard for me",
          "context_factors": ["self_doubt_expression", "subject_specific_anxiety"],
          "ai_response_needed": "acknowledge_vulnerability",
          "weight": 0.85
        }
      ],
        "overall_assessment": {
        "engagement_level": "low",
          "emotional_state": "frustrated",
            "learning_readiness": "needs_support",
              "relationship_building_opportunity": "trust_building"
      },
      "recommended_ai_actions": [
        "acknowledge_vulnerability",
        "create_safe_space",
        "reduce_complexity"
      ]
    }

## Analysis Guidelines

### Confidence Scoring Rules:
- ** 0.9 - 1.0 **: Extremely clear evidence, multiple indicators present
      - ** 0.7 - 0.8 **: Strong evidence, clear behavioral pattern
        - ** 0.5 - 0.6 **: Moderate evidence, some indicators present
          - ** 0.3 - 0.4 **: Weak evidence, subtle indicators
            - ** 0.0 - 0.2 **: Minimal or no evidence

### Multi - Pattern Detection:
    - A single message may exhibit multiple behavioral patterns
      - Prioritize the strongest, most actionable patterns
        - Consider conflicting patterns(e.g., vulnerability + skepticism)

### Context Integration:
    - Weight behavioral detection based on available context
      - Consider cultural and age - appropriate communication styles
        - Account for subject - specific anxieties or preferences

### Evidence Requirements:
    - Always provide specific text evidence for each detection
      - Quote exact phrases that led to the behavioral assessment
        - Explain reasoning for confidence scores

## Example Analysis

      ** Student Message **: "I don't know... I guess this is just too hard for me. Maybe I'm not good at math. Can you just give me the answer?"

        ** Expected Output **:
    \`\`\`json
{
  "detected_patterns": [
    {
      "concept_category": "relationship",
      "concept": "trust", 
      "behavior": "vulnerability_shared",
      "confidence": 0.9,
      "evidence": "I don't know... I guess this is just too hard for me. Maybe I'm not good at math.",
      "context_factors": ["self_doubt_expression", "subject_specific_anxiety"],
      "ai_response_needed": "acknowledge_vulnerability",
      "weight": 0.85
    },
    {
      "concept_category": "relationship",
      "concept": "reciprocity",
      "behavior": "passive_participation", 
      "confidence": 0.8,
      "evidence": "Can you just give me the answer?",
      "context_factors": ["solution_seeking_without_process"],
      "ai_response_needed": "encourage_active_participation",
      "weight": 0.35
    },
    {
      "concept_category": "learning",
      "concept": "cognitive_load",
      "behavior": "cognitive_overload",
      "confidence": 0.7,
      "evidence": "this is just too hard for me",
      "context_factors": ["explicit_difficulty_statement"],
      "ai_response_needed": "reduce_complexity",
      "weight": 0.6
    }
  ],
  "overall_assessment": {
    "engagement_level": "low",
    "emotional_state": "discouraged", 
    "learning_readiness": "needs_support",
    "relationship_building_opportunity": "trust_building"
  },
  "recommended_ai_actions": [
    "acknowledge_vulnerability",
    "create_safe_space",
    "reduce_complexity", 
    "encourage_active_participation",
    "trust_building_response"
  ]
}
\`\`\`

## Important Notes

    1. ** Be Precise **: Only detect patterns with sufficient evidence
    2. ** Avoid Over - interpretation **: Don't read meaning that isn't clearly present
    3. ** Consider Context **: Same words may have different meanings in different contexts
    4. ** Focus on Actionable Insights **: Prioritize detections that lead to specific AI response strategies
    5. ** Multiple Perspectives **: Consider alternative interpretations when confidence is moderate
    6. ** Cultural Sensitivity **: Account for different communication styles and cultural backgrounds

Now analyze the following student message and context for behavioral patterns.
`;

    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [{ role: 'system', content: prompt },
      {
        role: 'user',
        content: `
          **Student Message**: "${text}"
**Context**: ${JSON.stringify(context)}

Analyze this message for behavioral patterns.
          `
      }
      ],
      temperature: 0.2, // Lower temperature for more consistent analysis
      max_tokens: 8048,
      response_format: { type: "json_object" }
    });

    // Parse the response
    const analysisText = response.choices[0]?.message?.content || '';

    try {
      const analysis = JSON.parse(analysisText);

      return { success: true, analysis };
    } catch (parseError) {
      console.error('Error parsing analysis JSON:', parseError, analysisText);
      return { success: false, error: 'Failed to parse analysis result' };
    }
  } catch (error: any) {
    console.error('Error in LLM analysis:', error);
    return { success: false, error: error.message };
  }
}
