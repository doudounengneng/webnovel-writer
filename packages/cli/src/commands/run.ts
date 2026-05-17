import { Stage } from '@webnovel-writer/core';
import {
  createLLMAdapter,
  createLLMAdapterFromEnv,
  runPipeline,
} from '@webnovel-writer/core';
import {
  WorkflowEngine,
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
    resume?: boolean;
    refresh?: boolean;
    'use-env'?: boolean;
  },
): Promise<void> {
  const projectDir = options.dir || process.cwd();
  const webnovelDir = path.join(projectDir, '.webnovel');

  let startAt = Stage.STAGE_0;
  let stopAt = Stage.STAGE_5;
  const displayTask = task || '(resume)';

  if (options.resume) {
    const stateExists = fs.existsSync(path.join(webnovelDir, 'project-state.json'));
    if (!stateExists) {
      console.error('Error: No existing project found. Run "webnovel run" first to create a project.');
      process.exit(1);
    }
    startAt = Stage.STAGE_5;
    stopAt = Stage.STAGE_5;
    console.log(`\n📝 增量模式：跳过设定阶段，直接生成新章节\n`);
  } else if (options.refresh) {
    const stateExists = fs.existsSync(path.join(webnovelDir, 'project-state.json'));
    if (!stateExists) {
      console.error('Error: No existing project found. Run "webnovel run" first to create a project.');
      process.exit(1);
    }
    startAt = Stage.STAGE_3;
    stopAt = Stage.STAGE_5;
    console.log(`\n🔄 刷新模式：重建世界观 + 人设 + 新章节\n`);
  } else {
    if (!task) {
      console.error('Error: Please provide a task/seed. Example: webnovel run "穿越洪荒世界，主角被阐教驱逐"');
      process.exit(1);
    }
  }

  const engine = new WorkflowEngine((task || 'resume').slice(0, 50));
  const active = resumeProject(engine, webnovelDir);

  const adapter = options['use-env']
    ? createLLMAdapterFromEnv()
    : (() => {
        const provider = (options.provider || 'mock') as 'openai' | 'anthropic' | 'mock';
        const apiKey = options['api-key'] || '';

        if (provider !== 'mock' && !apiKey) {
          console.error(`Error: API key required for provider "${provider}". Use --api-key or set --use-env.`);
          process.exit(1);
        }

        return createLLMAdapter({
          provider,
          apiKey,
          model: options.model,
          baseURL: options['base-url'],
          temperature: 0.7,
          maxTokens: 4096,
        });
      })();

  const modeLabel = options.resume ? '增量' : options.refresh ? '刷新' : '完整';

  console.log(`\n🚀 Webnovel-Writer Pipeline (${modeLabel}模式)`);
  console.log(`   Provider: ${adapter.provider}/${adapter.model}`);
  console.log(`   Task: ${displayTask}`);
  console.log(`   Stages: ${startAt}→${stopAt}`);
  console.log(`   Project: ${webnovelDir}\n`);

  // 4. Parse stopAt stage
  const stopStageMap: Record<string, Stage> = {
    '0': Stage.STAGE_0, '1': Stage.STAGE_1, '2': Stage.STAGE_2,
    '3': Stage.STAGE_3, '4': Stage.STAGE_4, '5': Stage.STAGE_5,
    '6': Stage.STAGE_6, '7': Stage.STAGE_7,
  };
  if (options.stopAt) {
    stopAt = stopStageMap[options.stopAt] ?? stopAt;
  }

  // 5. Run pipeline
  console.log('📋 Starting pipeline...\n');

  const results = await runPipeline(adapter, active, {
    verbose: options.verbose !== false,
    stopAtStage: stopAt,
    startAtStage: startAt,
  });

  // 6. Save output
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

  let chapterNum = 1;
  const existingFiles = fs.readdirSync(outputDir).filter(f => f.startsWith('ch-'));
  chapterNum = existingFiles.length + 1;

  for (const result of results) {
    let filename: string;
    if (result.stage === 'stage-5' && (options.resume || options.refresh)) {
      filename = `ch-${String(chapterNum).padStart(4, '0')}.md`;
      chapterNum++;
    } else {
      filename = `${stageNames[result.stage] || result.stage}.md`;
    }
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, result.content, 'utf-8');
  }

  // 7. Save project state
  saveProject(active, { projectDir: webnovelDir });

  // 8. Summary
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`✅ Pipeline complete! ${results.length} stage(s) executed.`);

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

  if (options.resume) {
    const chCount = fs.readdirSync(outputDir).filter(f => f.startsWith('ch-')).length;
    console.log(`📝 Total chapters written: ${chCount}`);
  }

  console.log(`📁 Output saved to: ${outputDir}`);
  console.log(`💾 State saved to: ${path.join(webnovelDir, 'project-state.json')}`);

  if (options.resume) {
    console.log(`\nNext: webnovel run --resume  to write the next chapter\n`);
  } else {
    console.log(`\nNext: webnovel run --resume  to write chapter 2 (incremental, save cost)\n`);
  }
}