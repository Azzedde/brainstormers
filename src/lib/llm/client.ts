import OpenAI from 'openai';
import { getProvider } from './providers';
import { UserSettings, BrainstormRequest, BrainstormResponse, TreeNode } from '@/types/brainstorm';
import { getPrompt, formatPrompt } from '../brainstorm/prompts';
import { parseBulletPoints, createTreeNode } from '../utils/parser';

export class BrainstormClient {
  private client: OpenAI | null = null;
  private settings: UserSettings | null = null;

  constructor(settings: UserSettings) {
    this.settings = settings;
    this.initializeClient();
  }

  private initializeClient() {
    if (!this.settings) return;

    const provider = getProvider(this.settings.selectedProvider);
    if (!provider) {
      throw new Error(`Unknown provider: ${this.settings.selectedProvider}`);
    }

    this.client = new OpenAI({
      apiKey: this.settings.apiKey,
      baseURL: provider.baseURL,
      dangerouslyAllowBrowser: true, // Required for client-side usage
    });
  }

  async generateIdeas(request: BrainstormRequest): Promise<BrainstormResponse> {
    if (!this.client || !this.settings) {
      throw new Error('Client not initialized');
    }

    try {
      const prompt = this.buildPrompt(request);
      
      const completion = await this.client.chat.completions.create({
        model: this.settings.selectedModel,
        messages: [
          {
            role: 'system',
            content: 'You are an expert brainstorming facilitator. Always follow the exact format requested and provide high-quality, creative ideas.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000,
        stream: this.settings.streamingEnabled,
      });

      if (this.settings.streamingEnabled) {
        // Handle streaming response
        return this.handleStreamingResponse(completion as AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>, request);
      } else {
        // Handle regular response
        const regularCompletion = completion as OpenAI.Chat.Completions.ChatCompletion;
        const content = regularCompletion.choices[0]?.message?.content || '';
        return this.processResponse(content, request);
      }
    } catch (error) {
      console.error('Error generating ideas:', error);
      throw new Error(`Failed to generate ideas: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private buildPrompt(request: BrainstormRequest): string {
    // Check if this is a conversational request with context
    const hasConversationContext = request.userInput.includes('IMPORTANT CONTEXT - Previous conversation:');
    
    if (hasConversationContext) {
      // For conversational requests, use the userInput as-is since it already contains the full context
      return request.userInput;
    }
    
    // Otherwise, use the structured prompt approach
    const promptType = request.expandLevel && request.expandLevel > 0 ? 'expansion' : 'initial';
    const template = getPrompt(request.method, promptType);
    
    const variables: Record<string, string> = {
      userInput: request.userInput,
      context: request.context || '',
      idea: request.previousIdea || '',
      originalTopic: request.context || request.userInput,
    };

    // Add method-specific variables
    if (request.method === 'role-storming' && request.previousIdea) {
      const roleMatch = request.previousIdea.match(/\[([^\]]+)\]:/);
      if (roleMatch) {
        variables.role = roleMatch[1];
      }
    }

    if (request.method === 'scamper' && request.previousIdea) {
      const techniqueMatch = request.previousIdea.match(/^- ([A-Z/]+):/);
      if (techniqueMatch) {
        variables.technique = techniqueMatch[1];
      }
    }

    if (request.method === 'six-thinking-hats' && request.previousIdea) {
      const hatMatch = request.previousIdea.match(/^- ([A-Z ]+) HAT:/);
      if (hatMatch) {
        variables.hatType = hatMatch[1] + ' HAT';
      }
    }

    if (request.method === 'starbursting' && request.previousIdea) {
      const categoryMatch = request.previousIdea.match(/^- ([A-Z]+):/);
      if (categoryMatch) {
        variables.category = categoryMatch[1];
      }
    }

    return formatPrompt(template, variables);
  }

  private async handleStreamingResponse(stream: AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>, request: BrainstormRequest): Promise<BrainstormResponse> {
    let content = '';
    
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || '';
      content += delta;
    }

    return this.processResponse(content, request);
  }

  private processResponse(content: string, request: BrainstormRequest): BrainstormResponse {
    const ideas = parseBulletPoints(content);
    const treeData = createTreeNode(
      request.userInput,
      ideas,
      request.method,
      request.expandLevel || 0
    );

    return {
      ideas,
      treeData,
      method: request.method,
      timestamp: new Date(),
    };
  }

  async chat(message: string, context?: string): Promise<string> {
    if (!this.client || !this.settings) {
      throw new Error('Client not initialized');
    }

    try {
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: 'You are a helpful AI assistant. Provide clear, informative, and conversational responses. Do not use any brainstorming formats or structures.'
        }
      ];

      if (context) {
        messages.push({
          role: 'user',
          content: context
        });
      }

      messages.push({
        role: 'user',
        content: message
      });

      const completion = await this.client.chat.completions.create({
        model: this.settings.selectedModel,
        messages,
        temperature: 0.7,
        max_tokens: 2000,
        stream: this.settings.streamingEnabled,
      });

      if (this.settings.streamingEnabled) {
        // Handle streaming response
        let content = '';
        const stream = completion as AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>;
        
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content || '';
          content += delta;
        }
        
        return content;
      } else {
        // Handle regular response
        const regularCompletion = completion as OpenAI.Chat.Completions.ChatCompletion;
        return regularCompletion.choices[0]?.message?.content || '';
      }
    } catch (error) {
      console.error('Error in chat:', error);
      throw new Error(`Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async testConnection(): Promise<boolean> {
    if (!this.client) return false;

    try {
      const response = await this.client.chat.completions.create({
        model: this.settings?.selectedModel || 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 5,
      });

      return response.choices.length > 0;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  updateSettings(newSettings: UserSettings) {
    this.settings = newSettings;
    this.initializeClient();
  }

  getSettings(): UserSettings | null {
    return this.settings;
  }
}

// Singleton instance for the app
let clientInstance: BrainstormClient | null = null;

export function getBrainstormClient(settings?: UserSettings): BrainstormClient | null {
  if (settings) {
    clientInstance = new BrainstormClient(settings);
  }
  return clientInstance;
}

export function updateClientSettings(settings: UserSettings) {
  if (clientInstance) {
    clientInstance.updateSettings(settings);
  } else {
    clientInstance = new BrainstormClient(settings);
  }
}