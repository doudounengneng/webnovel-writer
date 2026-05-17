import type { LLMConfig } from './types';
import { BaseLLMAdapter } from './base';
import { OpenAIAdapter } from './openai';
import { MockAdapter } from './mock';

export function createLLMAdapter(config: LLMConfig): BaseLLMAdapter {
  switch (config.provider) {
    case 'openai':
      return new OpenAIAdapter(config);
    case 'mock':
      return new MockAdapter(config);
    case 'anthropic':
      throw new Error('Anthropic adapter not yet implemented. Use "openai" or "mock".');
    default:
      throw new Error(`Unknown LLM provider: ${config.provider}`);
  }
}

export { BaseLLMAdapter, OpenAIAdapter, MockAdapter };
export type { LLMConfig };