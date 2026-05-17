import * as path from 'path';
import * as fs from 'fs';
import { Stage, createLLMAdapter, runPipeline, WorkflowEngine, saveProject, type AgentResult } from '@webnovel-writer/core';

const WELCOME = `
╔══════════════════════════════════════════════════════════════╗
║              🖋️  Webnovel-Writer Quickstart                 ║
║           5 分钟体验 AI 辅助网文创作管线                      ║
╚══════════════════════════════════════════════════════════════╝
`;

const SEEDS = [
  '穿越洪荒世界，主角被阐教驱逐后发现自己是上古神族最后一滴血脉',
  '都市灵气复苏，废柴大学生觉醒SSS级异能却被全球通缉',
  '重生修仙世界，前世被家族背叛，这一世从外门杂役开始逆袭',
  '某天醒来发现自己在游戏里，而且是全服唯一的隐藏职业',
];

function randomSeed(): string {
  return SEEDS[Math.floor(Math.random() * SEEDS.length)] || SEEDS[0];
}

const STAGE_EMOJI: Record<number, string> = {
  0: '🌱', 1: '💫', 2: '🦴', 3: '🏗️', 4: '👤',
  5: '✍️', 6: '🔍', 7: '📦',
};

const STAGE_LABEL: Record<number, string> = {
  0: '灵感激活', 1: '灵魂激活', 2: '骨架激活', 3: '骨架搭建',
  4: '灵魂灌注', 5: '正文输出', 6: '灵魂校对', 7: '定稿交付',
};

export async function quickstartCommand(
  seed: string | undefined,
  options: { dir?: string },
): Promise<void> {
  const task = seed || randomSeed();
  const projectDir = options.dir || process.cwd();
  const webnovelDir = path.join(projectDir, '.webnovel');
  const outputDir = path.join(webnovelDir, 'output');

  console.log(WELCOME);
  console.log(`  📝 创作种子: "${task}"`);
  console.log(`  📁 项目目录: ${projectDir}`);
  console.log(`  🧪 模式: Mock（无需 API Key，演示完整流程）`);
  console.log(`\n  ⚡ 正在启动 6 阶段创作管线...\n`);

  // Initialize
  const engine = new WorkflowEngine(task.slice(0, 50));
  const adapter = createLLMAdapter({
    provider: 'mock',
    apiKey: 'mock-key',
  });

  const startTime = Date.now();
  const results: AgentResult[] = [];

  try {
    const pipelineResults = await runPipeline(adapter, engine, {
      verbose: false,
      stopAtStage: Stage.STAGE_5,
    });
    results.push(...pipelineResults);
  } catch (err) {
    console.error(`\n  ❌ 管线执行失败: ${err instanceof Error ? err.message : err}`);
    process.exit(1);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  // Save
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const savedFiles: string[] = [];
  for (const result of results) {
    const idx = Number(result.stage.split('-')[1]);
    const label = STAGE_LABEL[idx] || result.stage;
    const filename = `${String(idx).padStart(2, '0')}-${label}.md`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, result.content, 'utf-8');
    savedFiles.push(filename);
  }

  saveProject(engine, { projectDir: webnovelDir });

  // Summary
  console.log(`\n  ${'─'.repeat(56)}`);

  for (const result of results) {
    const idx = Number(result.stage.split('-')[1]);
    const emoji = STAGE_EMOJI[idx] || '•';
    const label = STAGE_LABEL[idx] || result.stage;
    const chars = result.content.length;
    console.log(`  ${emoji} Stage ${idx} · ${label.padEnd(8)} → ${chars} 字符`);
  }

  console.log(`  ${'─'.repeat(56)}`);
  console.log(`  ✅ ${results.length} 个阶段完成 | 耗时 ${elapsed}s`);
  console.log(`  📁 产出保存: ${outputDir}`);
  console.log(`     ${savedFiles.map(f => `  · ${f}`).join('\n')}`);
  console.log(`\n  ${'─'.repeat(56)}`);
  console.log(`  🎯 下一步:`);
  console.log(`     1. 查看产出:  打开 ${outputDir} 目录`);
  console.log(`     2. 真实创作:  webnovel run "你的故事" --provider openai`);
  console.log(`     3. 估算成本:  webnovel estimate --chapters 500`);
  console.log(`     4. 在 Trae IDE 中使用: 创世 "你的灵感"`);
  console.log(`\n  💡 提示: Mock 模式用的是内置示例文本。`);
  console.log(`     接入 OpenAI API Key 后，每个阶段会调用真实 AI 生成。`);
  console.log(`\n`);
}