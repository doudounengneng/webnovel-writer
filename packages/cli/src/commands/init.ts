import * as fs from 'fs';
import * as path from 'path';
import { WorkflowEngine } from '@webnovel-writer/core';

export function initCommand(name: string | undefined, options: { dir: string }): void {
  const projectName = name || 'my-webnovel';
  const projectDir = path.resolve(options.dir, projectName);

  if (fs.existsSync(projectDir)) {
    console.error(`Error: Directory ${projectDir} already exists`);
    process.exit(1);
  }

  fs.mkdirSync(projectDir, { recursive: true });
  fs.mkdirSync(path.join(projectDir, 'chapters'));
  fs.mkdirSync(path.join(projectDir, 'artifacts'));
  fs.mkdirSync(path.join(projectDir, 'config'));

  const engine = new WorkflowEngine(projectName);
  const stateFile = path.join(projectDir, 'project-state.json');
  fs.writeFileSync(stateFile, engine.toJSON(), 'utf-8');

  const config = {
    projectName,
    author: '',
    genre: '',
    targetWordsPerChapter: 4000,
    autoTransition: true,
    pauseAtStage4: true,
  };
  fs.writeFileSync(
    path.join(projectDir, 'config', 'settings.json'),
    JSON.stringify(config, null, 2),
    'utf-8'
  );

  console.log(`\n  ✅ Webnovel-Writer project initialized: ${projectName}`);
  console.log(`  📁 Location: ${projectDir}`);
  console.log(`  📂 Structure:`);
  console.log(`    ├── chapters/     — Chapter drafts and finals`);
  console.log(`    ├── artifacts/    — World-building, character cards, etc.`);
  console.log(`    ├── config/       — Project settings`);
  console.log(`    └── project-state.json  — Workflow state\n`);
  console.log(`  🚀 Next: cd ${projectName} && webnovel create "Your Novel Title"\n`);
}