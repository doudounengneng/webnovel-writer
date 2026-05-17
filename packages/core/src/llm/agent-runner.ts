import { Stage } from '../types';
import { getStageConfig } from '../stages';
import { getAgentConfig } from '../agents';
import { WorkflowEngine } from '../workflow';
import type { BaseLLMAdapter } from './base';
import type { AgentCallContext, AgentResult, LLMMessage } from './types';
import { buildAgentSystemPrompt, buildUserPrompt } from './agent-prompt';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

async function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

export async function runAgentStage(
  adapter: BaseLLMAdapter,
  engine: WorkflowEngine,
  task: string,
  options?: {
    maxRetries?: number;
    verbose?: boolean;
    stage?: Stage;
  },
): Promise<AgentResult> {
  const maxRetries = options?.maxRetries ?? MAX_RETRIES;
  const stage = options?.stage ?? engine.getCurrentStage();
  const stageConfig = getStageConfig(stage);
  const agentConfig = getAgentConfig(stageConfig.agentId);
  const state = engine.getState();

  const context: AgentCallContext = {
    agentId: stageConfig.agentId,
    agentName: agentConfig.name,
    agentDepartment: agentConfig.department,
    stage,
    stageName: stageConfig.name,
    qualityGates: stageConfig.qualityGates,
    anchor: state.anchor as Record<string, unknown>,
    task,
    artifacts: state.artifacts,
  };

  const systemPrompt = buildAgentSystemPrompt(context);
  const userPrompt = buildUserPrompt(context);

  const messages: LLMMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (options?.verbose) {
        const model = adapter.model;
        const provider = adapter.provider;
        console.log(`\n  ── Agent: ${agentConfig.name} | Stage: ${stageConfig.name} | Model: ${provider}/${model} (attempt ${attempt}/${maxRetries}) ──`);
        console.log(`  Context tokens (est): ~${Math.round(systemPrompt.length / 3)}`);
      }

      const response = await adapter.chat(messages);

      const result: AgentResult = {
        agentId: stageConfig.agentId,
        stage,
        content: response.content,
        tokenUsage: response.usage ? {
          prompt: response.usage.promptTokens,
          completion: response.usage.completionTokens,
        } : undefined,
        timestamp: new Date(),
      };

      if (result.tokenUsage) {
        const info = result.tokenUsage;
        if (options?.verbose) {
          console.log(`  Tokens: ${info.prompt} in / ${info.completion} out`);
        }
      }

      return result;

    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < maxRetries) {
        if (options?.verbose) {
          console.log(`  ⚠️ Attempt ${attempt} failed: ${lastError.message}`);
          console.log(`  Retrying in ${RETRY_DELAY_MS}ms...`);
        }
        await sleep(RETRY_DELAY_MS * attempt);
      }
    }
  }

  throw new Error(
    `Agent ${agentConfig.name} failed after ${maxRetries} attempts at stage ${stageConfig.name}. ` +
    `Last error: ${lastError?.message}`,
  );
}

export async function runPipeline(
  adapter: BaseLLMAdapter,
  engine: WorkflowEngine,
  options?: {
    maxRetries?: number;
    verbose?: boolean;
    stopAtStage?: Stage;
    startAtStage?: Stage;
  },
): Promise<AgentResult[]> {
  const results: AgentResult[] = [];
  const stopAt = options?.stopAtStage ?? Stage.STAGE_5;
  const startAt = options?.startAtStage ?? Stage.STAGE_0;

  const orderedStages: Stage[] = [
    Stage.STAGE_0, Stage.STAGE_1, Stage.STAGE_2, Stage.STAGE_3,
    Stage.STAGE_4, Stage.STAGE_5, Stage.STAGE_6, Stage.STAGE_7,
  ];

  for (const stage of orderedStages) {
    if (stage < startAt) continue;
    if (stage > stopAt) break;

    const stageConfig = getStageConfig(stage);
    const result = await runAgentStage(adapter, engine, stageConfig.name, {
      maxRetries: options?.maxRetries,
      verbose: options?.verbose,
      stage,
    });

    results.push(result);

    if (options?.verbose) {
      const chars = result.content.length;
      const lines = result.content.split('\n').length;
      console.log(`  Content: ${chars} chars / ${lines} lines`);
    }

    await engine.transitionToNextStage();

    if (stage >= stopAt) break;
  }

  return results;
}

export function registerAgentIdForStage(stage: Stage, agentId: string): void {
  // Future: dynamic agent registration per stage
  void stage;
  void agentId;
}