import * as fs from 'fs';
import * as path from 'path';
import {
  WorkflowEngine,
  getAllStageConfigs,
  getStageConfig,
  Stage,
} from '@webnovel-writer/core';

export function stageCommand(
  action: string,
  options: { stage?: string }
): void {
  const stateFile = path.resolve('project-state.json');

  if (!fs.existsSync(stateFile)) {
    console.error('Error: No Webnovel-Writer project found. Run `webnovel init` first.');
    process.exit(1);
  }

  switch (action) {
    case 'list':
      listStages();
      break;
    case 'run':
      runStage(options.stage);
      break;
    case 'next':
      nextStage();
      break;
    case 'status':
      stageStatus();
      break;
    default:
      console.error(`Unknown action: ${action}. Use: list, run, next, status`);
      process.exit(1);
  }
}

function listStages(): void {
  const stages = getAllStageConfigs();
  console.log('\n  📋 Workflow Stages:\n');
  stages.forEach((s, i) => {
    const stageNum = i;
    console.log(`  ${stageNum}. ${s.stage} — ${s.name}`);
    console.log(`     Lead: ${s.leadSkill}`);
    console.log(`     Gates: ${s.qualityGates.join(', ')}`);
    console.log();
  });
}

function runStage(stageId?: string): void {
  if (!stageId) {
    console.error('Error: Please specify a stage with --stage');
    process.exit(1);
  }

  const stage = stageId as Stage;
  const stateFile = path.resolve('project-state.json');
  const stateJson = fs.readFileSync(stateFile, 'utf-8');
  const engine = WorkflowEngine.fromJSON(stateJson);

  console.log(`\n  🎬 Running stage: ${stage} — ${getStageConfig(stage).name}\n`);
  console.log('  Quality gates will be checked...\n');

  engine.runStage(stage).then(result => {
    console.log(`  📊 Quality Gate Results:\n`);
    result.checks.forEach(check => {
      const icon = check.passed ? '✅' : '❌';
      console.log(`  ${icon} ${check.name}: ${check.detail}`);
    });
    console.log(`\n  ${result.passed ? '✅ All checks passed!' : '❌ Some checks failed'}\n`);

    fs.writeFileSync(stateFile, engine.toJSON(), 'utf-8');
  });
}

function nextStage(): void {
  const stateFile = path.resolve('project-state.json');
  const stateJson = fs.readFileSync(stateFile, 'utf-8');
  const engine = WorkflowEngine.fromJSON(stateJson);

  engine.transitionToNextStage().then(handoff => {
    console.log(`\n  📤 Handoff: ${handoff.fromStage} → ${handoff.toStage}`);
    console.log(`  📋 Summary: ${handoff.summary}`);
    console.log(`  ✅ Quality gates: ${handoff.qualityGateResult.passed ? 'Passed' : 'Failed'}\n`);

    fs.writeFileSync(stateFile, engine.toJSON(), 'utf-8');
  });
}

function stageStatus(): void {
  const stateFile = path.resolve('project-state.json');
  const stateJson = fs.readFileSync(stateFile, 'utf-8');
  const engine = WorkflowEngine.fromJSON(stateJson);

  const state = engine.getState();
  console.log(`\n  📊 Project: ${state.projectName}`);
  console.log(`  📍 Current Stage: ${state.currentStage}`);
  console.log(`  ✅ Completed: ${state.completedStages.length} stages`);
  console.log(`  📦 Artifacts: ${state.artifacts.length} files`);
  console.log(`  🕐 Updated: ${state.updatedAt.toLocaleString()}\n`);

  if (state.completedStages.length > 0) {
    console.log('  Completed stages:');
    state.completedStages.forEach(s => {
      console.log(`    ✅ ${s}`);
    });
    console.log();
  }
}