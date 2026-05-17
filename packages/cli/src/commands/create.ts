import * as fs from 'fs';
import * as path from 'path';
import { WorkflowEngine, AnchorTracker, getAllAgentConfigs } from '@webnovel-writer/core';

export function createCommand(
  title: string,
  options: { genre?: string; world?: string }
): void {
  const stateFile = path.resolve('project-state.json');

  if (!fs.existsSync(stateFile)) {
    console.error('Error: No Webnovel-Writer project found. Run `webnovel init` first.');
    process.exit(1);
  }

  const stateJson = fs.readFileSync(stateFile, 'utf-8');
  const engine = WorkflowEngine.fromJSON(stateJson);

  const anchor = new AnchorTracker();
  anchor.setSeedCore(title);

  engine.updateAnchor(anchor.getAnchor());

  const agents = getAllAgentConfigs();

  console.log(`\n  📖 Creating novel: ${title}`);
  if (options.genre) console.log(`  🏷️  Genre: ${options.genre}`);
  if (options.world) console.log(`  🌍 World: ${options.world}`);
  console.log(`\n  🤖 Available agents: ${agents.length}`);
  console.log(`  📋 Workflow: Stage 0 (Inspiration) → Stage 7 (Final Draft)\n`);
  console.log(`  Run \`webnovel stage run -s stage-0\` to begin the creation workflow.\n`);

  fs.writeFileSync(stateFile, engine.toJSON(), 'utf-8');
}