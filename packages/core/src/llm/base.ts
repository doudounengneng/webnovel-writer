import type { LLMMessage, LLMResponse, LLMConfig } from './types';

export abstract class BaseLLMAdapter {
  protected config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
  }

  get provider(): string {
    return this.config.provider;
  }

  get model(): string {
    return this.config.model || 'default';
  }

  abstract chat(messages: LLMMessage[]): Promise<LLMResponse>;

  abstract chatStream(messages: LLMMessage[]): AsyncGenerator<string, void, void>;

  abstract listModels(): Promise<string[]>;

  protected formatSystemPrompt(base: string, context?: string): string {
    if (!context) return base;
    return `${base}\n\n---\n当前上下文:\n${context}`;
  }
}