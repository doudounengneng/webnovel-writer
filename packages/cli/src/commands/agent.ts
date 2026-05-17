import { getAllAgentConfigs, getAgentConfig, Agent } from '@webnovel-writer/core';

const AGENT_TRAE_COMMAND: Partial<Record<Agent, string>> = {
  [Agent.CEO]: '创世',
  [Agent.PLANNER]: '十层',
  [Agent.ARCHITECT]: '世界观',
  [Agent.EDITOR]: '人设 / 校对',
  [Agent.WRITER]: '写 / 定稿',
  [Agent.ANALYST]: '拆解',
  [Agent.OPTIMIZER]: '对比 / 优化',
  [Agent.OPERATOR]: '运营',
  [Agent.DATA_SCIENTIST]: '分析',
  [Agent.MARKETER]: '营销',
  [Agent.IP_DEVELOPER]: 'IP评估',
};

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
  console.log('  ┌──────┬────────────────────┬──────────────────┬─────────────────────┬──────────────────┐');
  console.log('  │ ID   │ Name               │ Department       │ Skill               │ Trae 命令        │');
  console.log('  ├──────┼────────────────────┼──────────────────┼─────────────────────┼──────────────────┤');

  agents.forEach((agent, i) => {
    const id = `${i + 1}`.padEnd(4);
    const name = agent.name.padEnd(18);
    const dept = agent.department.padEnd(16);
    const skill = agent.skill.padEnd(19);
    const cmd = (AGENT_TRAE_COMMAND[agent.id] || '-').padEnd(16);
    console.log(`  │ ${id}│ ${name}│ ${dept}│ ${skill}│ ${cmd}│`);
  });

  console.log('  └──────┴────────────────────┴──────────────────┴─────────────────────┴──────────────────┘\n');
  console.log('  Run `webnovel agent info -a <id>` for details on a specific agent.\n');
}

function showAgentInfo(agentId: Agent): void {
  try {
    const config = getAgentConfig(agentId);
    const cmd = AGENT_TRAE_COMMAND[agentId] || '—';
    console.log(`\n  🤖 Agent: ${config.name}`);
    console.log(`  🏢 Department: ${config.department}`);
    console.log(`  🛠️  Skill: ${config.skill}`);
    console.log(`  📝 ${config.description}`);
    console.log(`\n  💡 Trae IDE 中加载此 Skill 的启动命令: ${cmd} [你的输入]`);
    console.log(`  📖 技能详情: .trae/skills/${getSkillFolderName(config.skill)}/SKILL.md\n`);
  } catch {
    console.error(`Error: Unknown agent: ${agentId}`);
    process.exit(1);
  }
}

function callAgent(agentId: Agent, task: string): void {
  try {
    const config = getAgentConfig(agentId);
    const command = AGENT_TRAE_COMMAND[agentId] || config.name;

    console.log(`\n  📞 调用 Agent: ${config.name} (${config.department})`);
    console.log(`  📋 任务: ${task}`);
    console.log(`  🛠️  技能包: ${config.skill}\n`);

    console.log(`  ┌────────────────────────────────────────────────────────────────┐`);
    console.log(`  │                                                                │`);
    console.log(`  │  请在 Trae IDE 中输入以下命令启动该 Agent:                      │`);
    console.log(`  │                                                                │`);
    console.log(`  │    ${command} ${task}`);
    console.log(`  │                                                                │`);
    console.log(`  │  技能配置: .trae/skills/${getSkillFolderName(config.skill)}/SKILL.md`);
    console.log(`  │  Agent 配置: .trae/agents/agent-${agentId.split('-')[1]}-${getAgentShortName(agentId)}/STARTUP.md`);
    console.log(`  │                                                                │`);
    console.log(`  └────────────────────────────────────────────────────────────────┘\n`);
  } catch {
    console.error(`Error: Unknown agent: ${agentId}`);
    process.exit(1);
  }
}

function getSkillFolderName(skill: string): string {
  const map: Record<string, string> = {
    'ten-layers': '十层宇宙',
    'creator-god': '创世神',
    'mo-bai': '墨白',
    'novel-master': '网文创作大师',
    'novel-analyzer': '小说拆文',
    'novel-comparator': '网文对比',
    operations: '运营大师',
    'data-analytics': '数据分析师',
    marketing: '营销策划师',
    'ip-planner': 'IP策划师',
  };
  return map[skill] || skill;
}

function getAgentShortName(agentId: Agent): string {
  const map: Partial<Record<Agent, string>> = {
    [Agent.CEO]: 'ceo',
    [Agent.PLANNER]: 'planner',
    [Agent.ARCHITECT]: 'architect',
    [Agent.EDITOR]: 'editor',
    [Agent.WRITER]: 'writer',
    [Agent.ANALYST]: 'analyst',
    [Agent.OPTIMIZER]: 'optimizer',
    [Agent.OPERATOR]: 'operator',
    [Agent.DATA_SCIENTIST]: 'data-scientist',
    [Agent.MARKETER]: 'marketer',
    [Agent.IP_DEVELOPER]: 'ip-developer',
  };
  return map[agentId] || '';
}