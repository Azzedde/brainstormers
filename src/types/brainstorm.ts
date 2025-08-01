export interface BrainstormingMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  textGradient: string;
  whenToUse: string;
  examples: string[];
}

export interface TreeNode {
  id: string;
  content: string;
  level: number;
  parentId?: string;
  children: TreeNode[];
  methodUsed: string;
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  methodUsed?: string;
  treeData?: TreeNode;
  isStreaming?: boolean;
}

export interface BrainstormSession {
  id: string;
  title: string;
  currentMethod: string;
  messages: ChatMessage[];
  treeData: TreeNode[];
  createdAt: Date;
  updatedAt: Date;
  provider: LLMProvider;
}

export interface LLMProvider {
  id: string;
  name: string;
  baseURL: string;
  models: string[];
  icon: string;
  requiresApiKey: boolean;
}

export interface UserSettings {
  apiKey: string;
  selectedProvider: string;
  selectedModel: string;
  theme: 'light' | 'dark' | 'system';
  streamingEnabled: boolean;
  autoSave: boolean;
}

export interface BrainstormRequest {
  method: string;
  userInput: string;
  context?: string;
  previousIdea?: string;
  expandLevel?: number;
}

export interface BrainstormResponse {
  ideas: string[];
  treeData: TreeNode;
  method: string;
  timestamp: Date;
}

export type MethodType = 
  | 'big-mind-mapping'
  | 'reverse-brainstorming'
  | 'role-storming'
  | 'scamper'
  | 'six-thinking-hats'
  | 'starbursting';

export interface PromptTemplate {
  initial: string;
  expansion: string;
  methodSpecific?: Record<string, string>;
}

export interface ParsedIdeas {
  ideas: string[];
  rawResponse: string;
  method: string;
}