import { BrainstormingMethod } from '@/types/brainstorm';

export const BRAINSTORMING_METHODS: Record<string, BrainstormingMethod> = {
  'big-mind-mapping': {
    id: 'big-mind-mapping',
    name: 'Big Mind Mapping',
    description: 'Explore ideas across a wide scope to gather the maximum number of creative solutions.',
    icon: '🗺️',
    gradient: 'gradient-bg-1',
    textGradient: 'text-gradient-mind',
    whenToUse: 'Perfect when you are lost and want to gather the maximum number of ideas',
    examples: [
      'Brainstorming product features for a new app',
      'Exploring business model possibilities',
      'Generating content ideas for a campaign'
    ]
  },
  'reverse-brainstorming': {
    id: 'reverse-brainstorming',
    name: 'Reverse Brainstorming',
    description: 'Identify ways to cause problems to reveal potential issues and innovative solutions.',
    icon: '🔄',
    gradient: 'gradient-bg-2',
    textGradient: 'text-gradient-reverse',
    whenToUse: 'Great for spotting potential issues and coming up with innovative solutions',
    examples: [
      'Finding ways to improve customer retention',
      'Identifying security vulnerabilities',
      'Preventing project failures'
    ]
  },
  'role-storming': {
    id: 'role-storming',
    name: 'Role Storming',
    description: 'Adopt different perspectives to generate diverse insights and creative solutions.',
    icon: '🎭',
    gradient: 'gradient-bg-3',
    textGradient: 'text-gradient-role',
    whenToUse: 'Excellent for gathering insights from different viewpoints and stakeholders',
    examples: [
      'Designing user experiences from different personas',
      'Solving problems from various stakeholder perspectives',
      'Creating inclusive solutions'
    ]
  },
  'scamper': {
    id: 'scamper',
    name: 'SCAMPER',
    description: 'Transform ideas systematically using Substitute, Combine, Adapt, Modify, Put to other use, Eliminate, Reverse.',
    icon: '🔧',
    gradient: 'gradient-bg-4',
    textGradient: 'text-gradient-scamper',
    whenToUse: 'Ideal for improving existing ideas or products through systematic transformation',
    examples: [
      'Improving existing products or services',
      'Innovating on current processes',
      'Finding new uses for existing resources'
    ]
  },
  'six-thinking-hats': {
    id: 'six-thinking-hats',
    name: 'Six Thinking Hats',
    description: 'Examine problems from six perspectives: Data, Emotions, Risks, Benefits, Creativity, and Process.',
    icon: '🎩',
    gradient: 'gradient-bg-5',
    textGradient: 'text-gradient-hats',
    whenToUse: 'Perfect for comprehensive analysis and balanced decision-making',
    examples: [
      'Making important business decisions',
      'Evaluating project proposals',
      'Analyzing complex problems holistically'
    ]
  },
  'starbursting': {
    id: 'starbursting',
    name: 'Starbursting',
    description: 'Generate comprehensive questions using Who, What, Where, When, Why, and How for thorough exploration.',
    icon: '⭐',
    gradient: 'gradient-bg-6',
    textGradient: 'text-gradient-star',
    whenToUse: 'Excellent for comprehensive topic exploration and understanding requirements',
    examples: [
      'Planning new projects or initiatives',
      'Understanding customer needs deeply',
      'Exploring market opportunities'
    ]
  }
};

export const METHOD_ORDER = [
  'big-mind-mapping',
  'reverse-brainstorming',
  'role-storming',
  'scamper',
  'six-thinking-hats',
  'starbursting'
];

export function getMethod(methodId: string): BrainstormingMethod | null {
  return BRAINSTORMING_METHODS[methodId] || null;
}

export function getAllMethods(): BrainstormingMethod[] {
  return METHOD_ORDER.map(id => BRAINSTORMING_METHODS[id]);
}

export function getMethodByName(name: string): BrainstormingMethod | null {
  return Object.values(BRAINSTORMING_METHODS).find(method => 
    method.name.toLowerCase() === name.toLowerCase()
  ) || null;
}

export function getRandomMethod(): BrainstormingMethod {
  const randomIndex = Math.floor(Math.random() * METHOD_ORDER.length);
  return BRAINSTORMING_METHODS[METHOD_ORDER[randomIndex]];
}

export function getMethodsForSituation(keywords: string[]): BrainstormingMethod[] {
  const situationMap: Record<string, string[]> = {
    'exploration': ['big-mind-mapping', 'starbursting'],
    'problems': ['reverse-brainstorming', 'six-thinking-hats'],
    'perspectives': ['role-storming', 'six-thinking-hats'],
    'improvement': ['scamper', 'reverse-brainstorming'],
    'analysis': ['six-thinking-hats', 'starbursting'],
    'creativity': ['big-mind-mapping', 'scamper', 'role-storming']
  };

  const recommendedMethods = new Set<string>();
  
  keywords.forEach(keyword => {
    const methods = situationMap[keyword.toLowerCase()];
    if (methods) {
      methods.forEach(method => recommendedMethods.add(method));
    }
  });

  return Array.from(recommendedMethods).map(id => BRAINSTORMING_METHODS[id]);
}