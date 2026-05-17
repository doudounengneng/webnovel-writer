import { Stage, Agent } from '../types';

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
  };
}

export type LLMProvider = 'openai' | 'anthropic' | 'mock';

export interface LLMConfig {
  provider: LLMProvider;
  apiKey: string;
  model?: string;
  baseURL?: string;
  temperature?: number;
  maxTokens?: number;
  mockResponses?: Record<string, string>;
}

export interface AgentCallContext {
  agentId: Agent;
  agentName: string;
  agentDepartment: string;
  stage: Stage;
  stageName: string;
  qualityGates: string[];
  anchor: Record<string, unknown>;
  task: string;
  artifacts: string[];
}

export interface AgentResult {
  agentId: Agent;
  stage: Stage;
  content: string;
  anchor?: Record<string, unknown>;
  artifacts?: string[];
  tokenUsage?: { prompt: number; completion: number };
  timestamp: Date;
}

export const DEFAULT_MODELS: Record<LLMProvider, string> = {
  openai: 'gpt-4o',
  anthropic: 'claude-sonnet-4-20250514',
  mock: 'mock-v1',
};