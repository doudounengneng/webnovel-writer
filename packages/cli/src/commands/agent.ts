import { getAllAgentConfigs, getAgentConfig, Agent } from '@webnovel-writer/core';

export function agentCommand(
  action: string | undefined,
  options: { agent?: string; task?: string }
): void {
  switch (action) {
    case 'list':
      listAgents();
      break;
    case 'info':
      if (!options.agent) {
        console.error('Error: Please specify an agent with --agent');
        process.exit(1);
      }
      showAgentInfo(options.agent as Agent);
      break;
    case 'call':
      if (!options.agent || !options.task) {
        console.error('Error: Please specify --agent and --task');
        process.exit(1);
      }
      callAgent(options.agent as Agent, options.task);
      break;
    default:
      listAgents();
  }
}

function listAgents(): void {
  const agents = getAllAgentConfigs();
  console.log('\n  🤖 Webnovel-Writer Agent Registry\n');
  console.log('  ┌──────┬────────────────────┬──────────────────┬─────────────────────┐');
  console.log('  │ ID   │ Name               │ Department       │ Skill               │');
  console.log('  ├──────┼────────────────────┼──────────────────┼─────────────────────┤');

  agents.forEach((agent, i) => {
    const id = `${i + 1}`.padEnd(4);
    const name = agent.name.padEnd(18);
    const dept = agent.department.padEnd(16);
    const skill = agent.skill.padEnd(19);
    console.log(`  │ ${id}│ ${name}│ ${dept}│ ${skill}│`);
  });

  console.log('  └──────┴────────────────────┴──────────────────┴─────────────────────┘\n');
  console.log('  Run `webnovel agent info -a <id>` for details on a specific agent.\n');
}

function showAgentInfo(agentId: Agent): void {
  try {
    const config = getAgentConfig(agentId);
    console.log(`\n  🤖 Agent: ${config.name}`);
    console.log(`  🏢 Department: ${config.department}`);
    console.log(`  🛠️  Skill: ${config.skill}`);
    console.log(`  📝 Description: ${config.description}\n`);
  } catch {
    console.error(`Error: Unknown agent: ${agentId}`);
    process.exit(1);
  }
}

function callAgent(agentId: Agent, task: string): void {
  try {
    const config = getAgentConfig(agentId);
    console.log(`\n  📞 Calling agent: ${config.name} (${config.department})`);
    console.log(`  📋 Task: ${task}`);
    console.log(`  🛠️  Using skill: ${config.skill}`);
    console.log(`\n  ⏳ Agent dispatched...\n`);
    console.log(`  ℹ️  In the current implementation, agent tasks are processed`);
    console.log(`  through the Trae IDE integration. For CLI-only mode,`);
    console.log(`  please use the stage workflow commands.\n`);
  } catch {
    console.error(`Error: Unknown agent: ${agentId}`);
    process.exit(1);
  }
}