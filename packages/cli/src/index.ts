#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init';
import { createCommand } from './commands/create';
import { stageCommand } from './commands/stage';
import { statusCommand } from './commands/status';
import { agentCommand } from './commands/agent';
import { runCommand } from './commands/run';
import { quickstartCommand } from './commands/quickstart';
import { estimateCommand } from './commands/estimate';
import { version } from '../package.json';

const program = new Command();

program
  .name('webnovel')
  .description('Webnovel-Writer CLI — Multi-agent collaborative web novel creation system')
  .version(version);

program
  .command('init')
  .description('Initialize a new Webnovel-Writer project')
  .argument('[name]', 'Project name')
  .option('-d, --dir <path>', 'Project directory', '.')
  .action(initCommand);

program
  .command('create')
  .description('Create a new web novel from scratch')
  .argument('<title>', 'Novel title')
  .option('--genre <genre>', 'Novel genre')
  .option('--world <type>', 'World type (e.g., xianxia, fantasy, sci-fi)')
  .action(createCommand);

program
  .command('stage')
  .description('Manage workflow stages')
  .argument('<action>', 'Action: list, run, next, status')
  .option('-s, --stage <stage>', 'Stage identifier')
  .action(stageCommand);

program
  .command('status')
  .description('Show current project status')
  .option('-v, --verbose', 'Show detailed information')
  .action(statusCommand);

program
  .command('agent')
  .description('List and manage AI agents')
  .argument('[action]', 'Action: list, info, call')
  .option('-a, --agent <id>', 'Agent ID')
  .option('-t, --task <description>', 'Task description for the agent')
  .action(agentCommand);

program
  .command('run')
  .description('Run the full creation pipeline from seed to chapter')
  .argument('[task]', 'Creative seed/task (e.g. "穿越洪荒世界，主角被阐教驱逐")')
  .option('--provider <provider>', 'LLM provider: openai or mock', 'mock')
  .option('--model <model>', 'Model name (default: gpt-4o for openai)')
  .option('--api-key <key>', 'API key (or set OPENAI_API_KEY env var)')
  .option('--base-url <url>', 'Custom API base URL')
  .option('--stop-at <stage>', 'Stop at stage (0-7, default: 5)', '5')
  .option('-v, --verbose', 'Verbose output')
  .action(runCommand);

program
  .command('quickstart')
  .description('5-minute quickstart — run full pipeline with mock (no API key needed)')
  .argument('[seed]', 'Optional creative seed (random if not provided)')
  .option('-d, --dir <path>', 'Project directory', '.')
  .action(quickstartCommand);

program
  .command('estimate')
  .description('Estimate token cost for different pipeline configurations')
  .option('-c, --chapters <count>', 'Total chapters to estimate for (default: 500)', '500')
  .option('-d, --depth <mode>', 'Pipeline depth: full or incremental', 'full')
  .option('-m, --model <model>', 'Filter by model (gpt-4o, gpt-4o-mini, o3-mini)')
  .option('-o, --output <path>', 'Save estimate to a markdown file')
  .action(estimateCommand);

program.parse(process.argv);