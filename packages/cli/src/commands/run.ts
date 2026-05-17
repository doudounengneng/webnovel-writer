import { Stage } from '@webnovel-writer/core';
import {
  createLLMAdapter,
  runPipeline,
} from '@webnovel-writer/core';
import {
  WorkflowEngine,
  AnchorTracker,
} from '@webnovel-writer/core';
import {
  saveProject,
  resumeProject,
} from '@webnovel-writer/core';
import * as fs from 'fs';
import * as path from 'path';

export async function runCommand(
  task: string | undefined,
  options: {
    provider?: string;
    model?: string;
    'api-key'?: string;
    'base-url'?: string;
    verbose?: boolean;
    stopAt?: string;
    dir?: string;
  },
): Promise<void> {
  if (!task) {
    console.error('Error: Please provide a task/seed. Example: webnovel run "穿越洪荒世界，主角被阐教驱逐"');
    process.exit(1);
  }

  const projectDir = options.dir || process.cwd();
  const webnovelDir = path.join(projectDir, '.webnovel');

  // 1. Initialize or load project
  const engine = new WorkflowEngine(task.slice(0, 50));
  const active = resumeProject(engine, webnovelDir);

  // 2. Configure LLM adapter
  const provider = (options.provider || process.env.LLM_PROVIDER || 'mock') as 'openai' | 'mock';
  const apiKey = options['api-key'] || process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || 'mock-key';

  if (provider === 'openai' && apiKey === 'mock-key') {
    console.error('Error: OPENAI_API_KEY not set. Use --api-key or set the environment variable.');
    process.exit(1);
  }

  const adapter = createLLMAdapter({
    provider,
    apiKey,
    model: options.model,
    baseURL: options['base-url'],
    temperature: 0.7,
    maxTokens: 4096,
  });

  console.log(`\n🚀 Webnovel-Writer Pipeline`);
  console.log(`   Provider: ${adapter.provider}/${adapter.model}`);
  console.log(`   Task: ${task}`);
  console.log(`   Project: ${webnovelDir}\n`);

  // 3. Parse stopAt stage
  const stopStageMap: Record<string, Stage> = {
    '0': Stage.STAGE_0, '1': Stage.STAGE_1, '2': Stage.STAGE_2,
    '3': Stage.STAGE_3, '4': Stage.STAGE_4, '5': Stage.STAGE_5,
    '6': Stage.STAGE_6, '7': Stage.STAGE_7,
  };
  const stopAt = options.stopAt ? stopStageMap[options.stopAt] : Stage.STAGE_5;

  // 4. Run pipeline
  console.log('📋 Starting stage pipeline...\n');

  const results = await runPipeline(adapter, active, {
    verbose: options.verbose !== false,
    stopAtStage: stopAt,
  });

  // 5. Save output
  const outputDir = path.join(webnovelDir, 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const stageNames: Record<string, string> = {
    [Stage.STAGE_0]: '00-seed-analysis',
    [Stage.STAGE_1]: '01-soul-activation',
    [Stage.STAGE_2]: '02-skeleton-activation',
    [Stage.STAGE_3]: '03-world-building',
    [Stage.STAGE_4]: '04-character-cards',
    [Stage.STAGE_5]: '05-chapter-draft',
    [Stage.STAGE_6]: '06-soul-proofread',
    [Stage.STAGE_7]: '07-final-draft',
  };

  for (const result of results) {
    const filename = `${stageNames[result.stage] || result.stage}.md`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, result.content, 'utf-8');
  }

  // 6. Save project state
  saveProject(active, { projectDir: webnovelDir });

  // 7. Summary
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`✅ Pipeline complete! ${results.length} stages executed.`);

  let totalPrompt = 0;
  let totalCompletion = 0;
  for (const r of results) {
    if (r.tokenUsage) {
      totalPrompt += r.tokenUsage.prompt;
      totalCompletion += r.tokenUsage.completion;
    }
  }

  if (totalPrompt > 0) {
    console.log(`📊 Total tokens: ${totalPrompt} prompt / ${totalCompletion} completion`);
  }

  console.log(`📁 Output saved to: ${outputDir}`);
  console.log(`💾 State saved to: ${path.join(webnovelDir, 'project-state.json')}`);
  console.log(`\nNext: webnovel run --stopAt 5  to generate the next chapter\n`);
}