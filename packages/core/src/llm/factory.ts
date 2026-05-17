import type { LLMConfig } from './types';
import { BaseLLMAdapter } from './base';
import { OpenAIAdapter } from './openai';
import { AnthropicAdapter } from './anthropic';
import { MockAdapter } from './mock';

export function createLLMAdapter(config: LLMConfig): BaseLLMAdapter {
  switch (config.provider) {
    case 'openai':
      return new OpenAIAdapter(config);
    case 'anthropic':
      return new AnthropicAdapter(config);
    case 'mock':
      return new MockAdapter(config);
    default:
      throw new Error(`Unknown LLM provider: ${config.provider}`);
  }
}

export function createLLMAdapterFromEnv(): BaseLLMAdapter {
  const provider = (process.env.LLM_PROVIDER as LLMConfig['provider']) || 'mock';
  const apiKey = process.env.LLM_API_KEY || '';

  if (provider !== 'mock' && !apiKey) {
    console.warn(`Warning: No API key found for provider "${provider}". Falling back to mock mode.`);
    console.warn('Set LLM_PROVIDER and LLM_API_KEY environment variables to use real LLM.');
    return new MockAdapter({
      provider: 'mock',
      apiKey: '',
    });
  }

  return createLLMAdapter({
    provider,
    apiKey,
    model: process.env.LLM_MODEL || undefined,
    baseURL: process.env.LLM_BASE_URL || undefined,
    temperature: process.env.LLM_TEMPERATURE ? parseFloat(process.env.LLM_TEMPERATURE) : undefined,
    maxTokens: process.env.LLM_MAX_TOKENS ? parseInt(process.env.LLM_MAX_TOKENS) : undefined,
  });
}

export { BaseLLMAdapter, OpenAIAdapter, AnthropicAdapter, MockAdapter };
export type { LLMConfig };