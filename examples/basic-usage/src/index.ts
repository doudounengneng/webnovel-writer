// Basic usage example for Webnovel-Writer Core
//
// This example demonstrates:
// 1. Initializing a workflow engine
// 2. Setting up anchor tracking
// 3. Running stages
// 4. Transitioning between stages

import {
  WorkflowEngine,
  AnchorTracker,
  Stage,
  getAllStageConfigs,
  getAllAgentConfigs,
} from '@webnovel-writer/core';

// 1. Initialize the workflow engine
const engine = new WorkflowEngine('my-first-novel');
console.log('Project created:', engine.getState().projectName);

// 2. Set up anchor tracking
const anchor = new AnchorTracker();
anchor.setSeedCore('A mortal who defies the heavens to forge his own destiny');
anchor.setBreakingLayer('L6 — Mental Consciousness');

anchor.addMLayer({
  layer: 'L6',
  name: '心智意识层',
  fiveDimensions: {
    dao: 'Willpower determines reality',
    fa: 'Spiritual cultivation system — 9 levels',
    shu: 'Soul attacks, mental illusions, divine sense',
    qi: 'Soul artifacts, cultivation caves',
    shi: 'Individual will vs. Heavenly Dao',
  },
  fateTags: ['🧠', '⚔️'],
});

anchor.addMLayer({
  layer: 'L7',
  name: '社会文明层',
  fiveDimensions: {
    dao: 'Power determines social hierarchy',
    fa: 'Sect system, clan politics, dynastic law',
    shu: 'Political maneuvering, resource allocation',
    qi: 'Sect headquarters, ancient battlefields',
    shi: 'Sect interests vs. individual freedom',
  },
  fateTags: ['👁️'],
});

anchor.addExplosionPoint('L6', 15);
anchor.addExplosionPoint('L7', 30);

anchor.setMainArc('A mortal rises through the ranks, breaking limits');
anchor.setDarkArc('A hidden ancient sect pulls the strings from the shadows');
anchor.setSecretArc('The protagonist is the reincarnation of a fallen heavenly emperor');

engine.updateAnchor(anchor.getAnchor());

// 3. View all agents
const agents = getAllAgentConfigs();
console.log(`\n${agents.length} agents available:`);
agents.forEach(a => console.log(`  ${a.name} (${a.department})`));

// 4. View all stages
const stages = getAllStageConfigs();
console.log(`\n${stages.length} stages in workflow:`);
stages.forEach((s, i) => console.log(`  Stage ${i}: ${s.name} [${s.leadSkill}]`));

// 5. Check anchor status
const warnings = anchor.validate();
if (warnings.length > 0) {
  console.log('\nAnchor warnings:');
  warnings.forEach(w => console.log(`  ⚠️  ${w}`));
} else {
  console.log('\nAnchor is complete ✅');
}

console.log('\nAnchor summary:');
console.log(anchor.toSummary());

console.log('\n✅ Example completed successfully!');
console.log('Next step: Run `webnovel stage run -s stage-0` to begin the workflow.');