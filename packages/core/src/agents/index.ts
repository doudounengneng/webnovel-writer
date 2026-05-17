import { Agent, Skill, type AgentConfig } from '../types';

// ============================================================
// Agent Registry — 11 Specialized Agents
// ============================================================

const agentRegistry: AgentConfig[] = [
  {
    id: Agent.CEO,
    name: 'CEO/总编',
    department: '总裁办',
    skill: Skill.CREATOR_GOD,
    description: '接收指令，调度各部门，管理阶段流转，整合产出，交付成品',
  },
  {
    id: Agent.PLANNER,
    name: '策划师',
    department: '策划部',
    skill: Skill.TEN_LAYERS,
    description: 'M层识别、五维定义、命运标签标记、种子冲击报告生成',
  },
  {
    id: Agent.ARCHITECT,
    name: '架构师',
    department: '技术部',
    skill: Skill.CREATOR_GOD,
    description: '世界观搭建、三线设计、伏笔布局、爽点密度规划',
  },
  {
    id: Agent.EDITOR,
    name: '灵魂师',
    department: '编辑部',
    skill: Skill.MO_BAI,
    description: '人设灌注、情感把控、对话真实性、活人感审核',
  },
  {
    id: Agent.WRITER,
    name: '写手',
    department: '生产部',
    skill: Skill.NOVEL_MASTER,
    description: '正文输出、爽点植入、钩子设计、定稿交付',
  },
  {
    id: Agent.ANALYST,
    name: '分析师',
    department: '市场调研部',
    skill: Skill.NOVEL_ANALYZER,
    description: '深度拆解小说结构、提取爆款共性、竞品分析',
  },
  {
    id: Agent.OPTIMIZER,
    name: '优化师',
    department: '质量优化部',
    skill: Skill.NOVEL_COMPARATOR,
    description: '五维对比分析、差距识别、自动修改优化',
  },
  {
    id: Agent.OPERATOR,
    name: '运营总监',
    department: '运营部',
    skill: Skill.OPERATIONS,
    description: '平台策略、更新节奏、读者互动、数据追踪',
  },
  {
    id: Agent.DATA_SCIENTIST,
    name: '数据科学家',
    department: '数据分析部',
    skill: Skill.DATA_ANALYTICS,
    description: '追读率分析、付费转化、读者画像、A/B测试',
  },
  {
    id: Agent.MARKETER,
    name: '营销策划',
    department: '内容营销部',
    skill: Skill.MARKETING,
    description: '书名优化、简介打磨、封面策略、推广文案',
  },
  {
    id: Agent.IP_DEVELOPER,
    name: 'IP策划师',
    department: 'IP开发部',
    skill: Skill.IP_PLANNER,
    description: 'IP价值评估、改编规划、版权策略、衍生品设计',
  },
];

export function getAgentConfig(agent: Agent): AgentConfig {
  const config = agentRegistry.find(a => a.id === agent);
  if (!config) {
    throw new Error(`Unknown agent: ${agent}`);
  }
  return config;
}

export function getAllAgentConfigs(): AgentConfig[] {
  return [...agentRegistry];
}

export function getAgentsByDepartment(department: string): AgentConfig[] {
  return agentRegistry.filter(a => a.department === department);
}

export function getAgentBySkill(skill: Skill): AgentConfig[] {
  return agentRegistry.filter(a => a.skill === skill);
}