import { LLMProvider } from '@/types/brainstorm';

export const LLM_PROVIDERS: Record<string, LLMProvider> = {
  openai: {
    id: 'openai',
    name: 'OpenAI',
    baseURL: 'https://api.openai.com/v1',
    models: ['gpt-4', 'gpt-4.1-nano', 'gpt-3.5-turbo'],
    icon: '🤖',
    requiresApiKey: true,
  },
  groq: {
    id: 'groq',
    name: 'Groq',
    baseURL: 'https://api.groq.com/openai/v1',
    models: ['mixtral-8x7b-32768', 'llama2-70b-4096', 'gemma-7b-it'],
    icon: '⚡',
    requiresApiKey: true,
  },
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    models: ['gemini-2.0-flash', 'gemini-pro', 'gemini-pro-vision'],
    icon: '🔮',
    requiresApiKey: true,
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    baseURL: 'https://api.deepseek.com',
    models: ['deepseek-chat', 'deepseek-coder'],
    icon: '🧠',
    requiresApiKey: true,
  },
};

export const DEFAULT_PROVIDER = 'openai';
export const DEFAULT_MODEL = 'gpt-4';

export function getProvider(providerId: string): LLMProvider | null {
  return LLM_PROVIDERS[providerId] || null;
}

export function getAllProviders(): LLMProvider[] {
  return Object.values(LLM_PROVIDERS);
}

export function getProviderModels(providerId: string): string[] {
  const provider = getProvider(providerId);
  return provider?.models || [];
}

export function validateApiKey(apiKey: string, providerId: string): boolean {
  if (!apiKey || apiKey.trim().length === 0) {
    return false;
  }

  // Basic validation patterns for different providers
  const patterns: Record<string, RegExp> = {
    openai: /^sk-[a-zA-Z0-9]{48,}$/,
    groq: /^gsk_[a-zA-Z0-9]{52}$/,
    gemini: /^[a-zA-Z0-9_-]{39}$/,
    deepseek: /^sk-[a-zA-Z0-9]{48,}$/,
  };

  const pattern = patterns[providerId];
  if (!pattern) {
    // If no specific pattern, just check it's not empty
    return apiKey.trim().length > 10;
  }

  return pattern.test(apiKey);
}

export function getProviderInstructions(providerId: string): string {
  const instructions: Record<string, string> = {
    openai: 'Get your API key from https://platform.openai.com/api-keys',
    groq: 'Get your API key from https://console.groq.com/keys',
    gemini: 'Get your API key from https://makersuite.google.com/app/apikey',
    deepseek: 'Get your API key from https://platform.deepseek.com/api_keys',
  };

  return instructions[providerId] || 'Check the provider\'s documentation for API key instructions.';
}