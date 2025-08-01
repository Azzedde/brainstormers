import { PromptTemplate } from '@/types/brainstorm';

export const BRAINSTORMING_PROMPTS: Record<string, PromptTemplate> = {
  'big-mind-mapping': {
    initial: `You are a creative brainstorming assistant specializing in Big Mind Mapping methodology. Your task is to generate 10 diverse, innovative initial ideas based on the user's topic.

User's Topic: {userInput}

Generate 10 initial ideas that:
- Cover different aspects and angles of the topic
- Are specific and actionable
- Show creative and unconventional thinking
- Are diverse and non-redundant
- Each idea should be a complete thought (2-3 sentences)

Format your response as a bullet list with exactly 10 items, each starting with "- ".
Do not include numbers, titles, or bold text.`,

    expansion: `You are an expert at expanding ideas using the Big Mind Mapping technique. Your task is to take one idea and expand it into 5 related but distinct sub-ideas.

Original Idea: {idea}

Generate 5 expanded ideas that:
- Build upon or branch from the original idea
- Explore different dimensions (implementation, impact, variations, applications, challenges)
- Maintain the same level of detail as the original
- Are creative and push boundaries
- Each should be a complete thought (2-3 sentences)

Format your response as a bullet list with exactly 5 items, each starting with "- ".
Do not include numbers, titles, or bold text.`
  },

  'reverse-brainstorming': {
    initial: `You are a strategic thinker specializing in Reverse Brainstorming. Instead of solving the problem, you'll identify ways to CAUSE or WORSEN it.

User's Goal/Problem: {userInput}

Generate 10 ways to:
- Make this problem worse
- Prevent this goal from being achieved
- Create obstacles and barriers
- Cause the opposite of what's desired
- Think like a saboteur

Each point should explain HOW it would cause problems (2-3 sentences).

Format your response as a bullet list with exactly 10 items, each starting with "- ".
Do not include numbers, titles, or bold text.`,

    expansion: `You are now reversing the negative approach to find innovative solutions.

Negative Approach: {idea}

For this negative approach, generate 5 solutions that:
- Directly counter or prevent this negative outcome
- Turn the weakness into a strength
- Create safeguards against this problem
- Find opportunities in addressing this challenge
- Be specific and implementable

Each solution should be actionable (2-3 sentences).

Format your response as a bullet list with exactly 5 items, each starting with "- ".
Do not include numbers, titles, or bold text.`
  },

  'role-storming': {
    initial: `You are a master of perspective-taking in Role Storming brainstorming. You will analyze the topic from 10 different roles/personas.

Topic: {userInput}

Generate ideas from these 10 perspectives:
1. A 5-year-old child
2. A tech entrepreneur
3. An environmental activist
4. A retired teacher
5. A professional athlete
6. An artist/creative
7. A scientist/researcher
8. A politician
9. Someone from 100 years ago
10. Someone from 100 years in the future

For each role, provide their unique take on the topic (2-3 sentences).

Format your response as a bullet list with exactly 10 items, each starting with "- [Role]:" followed by their perspective.`,

    expansion: `You are deeply embodying a specific role to generate detailed insights.

Role: {role}
Topic: {originalTopic}
Initial Perspective: {idea}

As this role, generate 5 detailed ideas that:
- Reflect this role's values, experiences, and worldview
- Use language and concepts this role would use
- Consider resources and constraints this role faces
- Show both opportunities and challenges from this viewpoint
- Be specific to this role's unique position

Each idea should be well-developed (2-3 sentences).

Format your response as a bullet list with exactly 5 items, each starting with "- ".`
  },

  'scamper': {
    initial: `You are a SCAMPER method expert. Analyze the given topic using all 7 SCAMPER techniques.

Topic: {userInput}

Apply each SCAMPER technique:
- SUBSTITUTE: What can be substituted?
- COMBINE: What can be combined or integrated?
- ADAPT: What can be adapted or adjusted?
- MODIFY/MAGNIFY: What can be emphasized or enhanced?
- PUT TO OTHER USES: What other applications are possible?
- ELIMINATE: What can be removed or simplified?
- REVERSE/REARRANGE: What can be reversed or reordered?

Provide 1-2 specific ideas for each technique (2-3 sentences each).

Format as a bullet list with headers like "- SUBSTITUTE:" followed by the ideas.`,

    expansion: `You are exploring one SCAMPER technique in depth.

Technique: {technique}
Original Topic: {originalTopic}
Initial Idea: {idea}

Generate 5 advanced applications of this {technique} approach that:
- Push the boundaries of what's possible
- Consider multiple industries or contexts
- Include both incremental and radical changes
- Address potential implementation challenges
- Show concrete examples or scenarios

Each application should be detailed (2-3 sentences).

Format your response as a bullet list with exactly 5 items, each starting with "- ".`
  },

  'six-thinking-hats': {
    initial: `You are facilitating a Six Thinking Hats brainstorming session. Analyze the topic from all six perspectives.

Topic: {userInput}

Apply each thinking hat:
- WHITE HAT (Facts): What are the facts, data, and information available?
- RED HAT (Emotions): What are the feelings, hunches, and intuitions?
- BLACK HAT (Caution): What are the risks, problems, and why it might not work?
- YELLOW HAT (Benefits): What are the benefits, advantages, and why it will work?
- GREEN HAT (Creativity): What are creative alternatives and new ideas?
- BLUE HAT (Process): How should we think about this? What's the big picture?

Provide 1-2 insights for each hat (2-3 sentences each).

Format as a bullet list with headers like "- WHITE HAT:" followed by the insights.`,

    expansion: `You are conducting deep analysis with one specific thinking hat.

Hat Type: {hatType}
Topic: {originalTopic}
Initial Insight: {idea}

Wearing only the {hatType}, generate 5 detailed observations that:
- Stay strictly within this hat's perspective
- Dig deeper into implications and connections
- Consider short-term and long-term aspects
- Include specific examples or scenarios
- Build upon the initial insight

Each observation should be thorough (2-3 sentences).

Format your response as a bullet list with exactly 5 items, each starting with "- ".`
  },

  'starbursting': {
    initial: `You are a master questioner using the Starbursting technique. Generate comprehensive questions about the topic using the 5W1H framework.

Topic: {userInput}

Generate questions for each category:
- WHO: Questions about people, stakeholders, users, teams
- WHAT: Questions about features, components, outcomes, requirements  
- WHERE: Questions about locations, markets, contexts, environments
- WHEN: Questions about timing, schedules, milestones, deadlines
- WHY: Questions about purpose, motivation, benefits, rationale
- HOW: Questions about methods, processes, implementation, measurement

Provide 2 thought-provoking questions for each category.

Format as a bullet list with headers like "- WHO:" followed by the questions.`,

    expansion: `You are providing comprehensive answers to important questions about the topic.

Original Topic: {originalTopic}
Question Category: {category}
Specific Question: {idea}

Provide 5 detailed answers/perspectives that:
- Address different aspects of the question
- Consider various stakeholder viewpoints  
- Include both conventional and innovative approaches
- Identify potential challenges and opportunities
- Suggest concrete next steps or implications

Each answer should be substantive (2-3 sentences).

Format your response as a bullet list with exactly 5 items, each starting with "- ".`
  }
};

export function getPrompt(methodId: string, type: 'initial' | 'expansion'): string {
  const method = BRAINSTORMING_PROMPTS[methodId];
  if (!method) {
    throw new Error(`Unknown brainstorming method: ${methodId}`);
  }
  
  return method[type];
}

export function formatPrompt(template: string, variables: Record<string, string>): string {
  let formatted = template;
  
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{${key}}`;
    formatted = formatted.replace(new RegExp(placeholder, 'g'), value);
  });
  
  return formatted;
}

export function getMethodSwitchPrompt(previousMethod: string, newMethod: string, context: string, currentInput: string): string {
  return `You are switching from ${previousMethod} to ${newMethod} brainstorming method while maintaining context.

Previous Context: ${context}
User's Current Focus: ${currentInput}

Now apply ${newMethod} to continue the brainstorming session. Acknowledge the switch briefly, then proceed with the new method's approach.

${getPrompt(newMethod, 'initial')}`;
}