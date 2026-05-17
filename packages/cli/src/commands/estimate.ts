import * as path from 'path';
import * as fs from 'fs';
import { Stage } from '@webnovel-writer/core';

// Token estimates based on measured prompt sizes
const STAGE_TOKENS: Record<number, { prompt: number; completion: number }> = {
  0: { prompt: 800, completion: 1000 },
  1: { prompt: 600, completion: 800 },
  2: { prompt: 800, completion: 1000 },
  3: { prompt: 1200, completion: 2000 },
  4: { prompt: 1000, completion: 2000 },
  5: { prompt: 3000, completion: 4000 },
  6: { prompt: 5000, completion: 1000 },
  7: { prompt: 6000, completion: 4000 },
};

// Pricing per 1M tokens (USD)
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'gpt-4o': { input: 2.50, output: 10.00 },
  'gpt-4o-mini': { input: 0.15, output: 0.60 },
  'o3-mini': { input: 1.10, output: 4.40 },
  'gpt-4-turbo': { input: 10.00, output: 30.00 },
  'claude-sonnet-4': { input: 3.00, output: 15.00 },
};

function calcCost(
  promptTokens: number,
  completionTokens: number,
  pricing: { input: number; output: number },
): number {
  return (promptTokens / 1_000_000) * pricing.input +
         (completionTokens / 1_000_000) * pricing.output;
}

interface EstimateRow {
  scenario: string;
  stages: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: Record<string, number>;
}

export async function estimateCommand(
  options: {
    chapters?: string;
    depth?: string;
    model?: string;
    output?: string;
  },
): Promise<void> {
  const totalChapters = parseInt(options.chapters || '500', 10);
  const depth = options.depth || 'full';
  const selectedModel = options.model;

  const rows: EstimateRow[] = [];

  // --- First chapter: full pipeline (stages 0-5) ---
  {
    let promptSum = 0;
    let completionSum = 0;
    const stagesUsed: string[] = [];
    for (let s = 0; s <= 5; s++) {
      const t = STAGE_TOKENS[s];
      if (!t) continue;
      promptSum += t.prompt;
      completionSum += t.completion;
      stagesUsed.push(`S${s}`);
    }

    const cost: Record<string, number> = {};
    for (const [model, pricing] of Object.entries(MODEL_PRICING)) {
      cost[model] = calcCost(promptSum, completionSum, pricing);
    }

    rows.push({
      scenario: '🔥 首章（完整管线）',
      stages: stagesUsed.join('→'),
      promptTokens: promptSum,
      completionTokens: completionSum,
      totalTokens: promptSum + completionSum,
      cost,
    });
  }

  // --- Incremental chapter (stage 5 only) ---
  {
    const t = STAGE_TOKENS[5];
    const cost: Record<string, number> = {};
    for (const [model, pricing] of Object.entries(MODEL_PRICING)) {
      cost[model] = calcCost(t.prompt, t.completion, pricing);
    }

    rows.push({
      scenario: '📝 续章（增量模式）',
      stages: 'S5',
      promptTokens: t.prompt,
      completionTokens: t.completion,
      totalTokens: t.prompt + t.completion,
      cost,
    });
  }

  // --- Periodic refresh (every 50 chapters: stages 3-4 + 5) ---
  {
    let promptSum = 0;
    let completionSum = 0;
    for (let s = 3; s <= 5; s++) {
      const t = STAGE_TOKENS[s];
      if (!t) continue;
      promptSum += t.prompt;
      completionSum += t.completion;
    }

    const cost: Record<string, number> = {};
    for (const [model, pricing] of Object.entries(MODEL_PRICING)) {
      cost[model] = calcCost(promptSum, completionSum, pricing);
    }

    rows.push({
      scenario: '🔄 大章刷新（每50章）',
      stages: 'S3→S4→S5',
      promptTokens: promptSum,
      completionTokens: completionSum,
      totalTokens: promptSum + completionSum,
      cost,
    });
  }

  // --- Display ---
  console.log(`\n🤖 Webnovel-Writer Token 成本估算`);
  console.log(`${'─'.repeat(72)}`);

  // Single-chapter costs
  console.log(`\n📋 单章成本明细:\n`);
  console.log(
    `  ${'场景'.padEnd(22)} ${'Tokens'.padStart(10)} ${'gpt-4o'.padStart(10)} ${'gpt-4o-mini'.padStart(12)} ${'o3-mini'.padStart(10)}`,
  );
  console.log(`  ${'─'.repeat(70)}`);

  for (const row of rows) {
    const gptCost = row.cost['gpt-4o']?.toFixed(4) || '-';
    const miniCost = row.cost['gpt-4o-mini']?.toFixed(4) || '-';
    const o3Cost = row.cost['o3-mini']?.toFixed(4) || '-';
    const tokenStr = (row.totalTokens / 1000).toFixed(1) + 'k';

    console.log(
      `  ${row.scenario.padEnd(18)} ${tokenStr.padStart(10)} $${gptCost.padStart(8)} $${miniCost.padStart(10)} $${o3Cost.padStart(8)}`,
    );
  }

  // Full-book projection
  console.log(`\n\n📚 全书成本预估（基于 ${totalChapters} 章）:\n`);

  // Calculation:
  // - 1 chapter: full pipeline (stages 0-5)
  // - Every 50 chapters: world refresh (stages 3-5)
  // - Rest: incremental (stage 5 only)

  const firstChapterPrompt = rows[0].promptTokens;
  const firstChapterCompletion = rows[0].completionTokens;
  const incrementalPrompt = rows[1].promptTokens;
  const incrementalCompletion = rows[1].completionTokens;
  const refreshPrompt = rows[2].promptTokens;
  const refreshCompletion = rows[2].completionTokens;

  const refreshCount = Math.floor((totalChapters - 1) / 50);
  const incrementalCount = totalChapters - 1 - refreshCount;

  const totalPrompt = firstChapterPrompt +
    refreshCount * refreshPrompt +
    incrementalCount * incrementalPrompt;
  const totalCompletion = firstChapterCompletion +
    refreshCount * refreshCompletion +
    incrementalCount * incrementalCompletion;

  const models = selectedModel ? [selectedModel] : ['gpt-4o', 'gpt-4o-mini', 'o3-mini'];

  console.log(`  计算公式: 1 首章(全管线) + ${refreshCount} 大章刷新 + ${incrementalCount} 续章(增量)`);
  console.log(`  总 Token: ${((totalPrompt + totalCompletion) / 1_000_000).toFixed(2)}M`);
  console.log(`\n  ${'模型'.padEnd(16)} ${'总成本(USD)'.padStart(14)} ${'每章均价'.padStart(12)} ${'千章成本'.padStart(12)}`);
  console.log(`  ${'─'.repeat(56)}`);

  for (const model of models) {
    const pricing = MODEL_PRICING[model];
    if (!pricing) {
      console.log(`  ${model.padEnd(16)} — 价格数据不可用`);
      continue;
    }

    const totalCost = calcCost(totalPrompt, totalCompletion, pricing);
    const avgPerChapter = totalCost / totalChapters;
    const perKChapters = avgPerChapter * 1000;

    console.log(
      `  ${model.padEnd(16)} $${totalCost.toFixed(2).padStart(12)} $${avgPerChapter.toFixed(4).padStart(10)} $${perKChapters.toFixed(2).padStart(10)}`,
    );
  }

  // Comparison summary
  console.log(`\n\n💡 成本分析:\n`);
  const gpt4Cost = calcCost(totalPrompt, totalCompletion, MODEL_PRICING['gpt-4o']);
  const miniCost = calcCost(totalPrompt, totalCompletion, MODEL_PRICING['gpt-4o-mini']);
  const ratio = (gpt4Cost / miniCost).toFixed(1);

  console.log(`  · gpt-4o-mini 是 gpt-4o 的 ${ratio}x 便宜，适合大批量草稿`);
  console.log(`  · gpt-4o 质量更高，推荐用于首章 + 关键章节`);
  console.log(`  · 建议策略：首章用 gpt-4o（全管线），续章用 gpt-4o-mini（增量）`);
  console.log(`  · 每 50 章用 gpt-4o 做一次世界观/人设刷新\n`);

  // Save to file if requested
  if (options.output) {
    const outputPath = path.resolve(options.output);
    const lines: string[] = [
      '# Webnovel-Writer Token 成本估算',
      `> 预估章节数: ${totalChapters}`,
      '',
      '| 场景 | Tokens | gpt-4o | gpt-4o-mini | o3-mini |',
      '|------|--------|--------|-------------|---------|',
    ];

    for (const row of rows) {
      const gptCost = row.cost['gpt-4o']?.toFixed(4) || '-';
      const miniCost = row.cost['gpt-4o-mini']?.toFixed(4) || '-';
      const o3Cost = row.cost['o3-mini']?.toFixed(4) || '-';
      lines.push(`| ${row.scenario} | ${(row.totalTokens / 1000).toFixed(1)}k | $${gptCost} | $${miniCost} | $${o3Cost} |`);
    }

    fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8');
    console.log(`📁 已保存至: ${outputPath}\n`);
  }
}