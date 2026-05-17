import * as fs from 'fs';
import * as path from 'path';
import { WorkflowEngine, getAllAgentConfigs, getAgentConfig, Agent } from '@webnovel-writer/core';

export function statusCommand(options: { verbose: boolean }): void {
  const stateFile = path.resolve('project-state.json');

  if (!fs.existsSync(stateFile)) {
    console.error('Error: No Webnovel-Writer project found. Run `webnovel init` first.');
    process.exit(1);
  }

  const stateJson = fs.readFileSync(stateFile, 'utf-8');
  const engine = WorkflowEngine.fromJSON(stateJson);
  const state = engine.getState();

  console.log(`\n  ╔══════════════════════════════════════╗`);
  console.log(`  ║     Webnovel-Writer Project Status   ║`);
  console.log(`  ╚══════════════════════════════════════╝\n`);
  console.log(`  📖 Project: ${state.projectName}`);
  console.log(`  📍 Stage: ${state.currentStage}`);
  console.log(`  ✅ Completed: ${state.completedStages.length}/8 stages`);
  console.log(`  📦 Artifacts: ${state.artifacts.length}`);

  if (options.verbose) {
    console.log(`\n  ── Anchor Summary ──`);
    const anchor = engine.getAnchor();
    if (anchor.seedCore) console.log(`  seed-core: ${anchor.seedCore}`);
    if (anchor.breakingLayer) console.log(`  breaking-layer: ${anchor.breakingLayer}`);
    if (anchor.mLayers?.length) {
      console.log(`  m-layers: [${anchor.mLayers.map(l => l.layer).join(', ')}]`);
    }
    if (anchor.mainArc) console.log(`  main-arc: ${anchor.mainArc}`);
    if (anchor.darkArc) console.log(`  dark-arc: ${anchor.darkArc}`);
    if (anchor.secretArc) console.log(`  secret-arc: ${anchor.secretArc}`);

    console.log(`\n  ── Artifacts ──`);
    state.artifacts.forEach(a => console.log(`  📄 ${a}`));
  }

  console.log();
}