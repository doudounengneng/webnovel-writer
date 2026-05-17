// ============================================================
// Core Type Definitions for Webnovel-Writer
// ============================================================

/** Stage identifiers for the 8-stage creation workflow */
export enum Stage {
  STAGE_0 = 'stage-0', // 灵感激活 — 十层宇宙
  STAGE_1 = 'stage-1', // 灵魂激活 — 墨白
  STAGE_2 = 'stage-2', // 骨架激活 — 十层+创世
  STAGE_3 = 'stage-3', // 骨架搭建 — 创世神
  STAGE_4 = 'stage-4', // 灵魂灌注 — 墨白
  STAGE_5 = 'stage-5', // 正文输出 — 网文大师
  STAGE_6 = 'stage-6', // 灵魂校对 — 墨白
  STAGE_7 = 'stage-7', // 定稿交付 — 网文大师
}

/** Agent identifiers for the 11 specialized agents */
export enum Agent {
  CEO = 'agent-1-ceo',
  PLANNER = 'agent-2-planner',
  ARCHITECT = 'agent-3-architect',
  EDITOR = 'agent-4-editor',
  WRITER = 'agent-5-writer',
  ANALYST = 'agent-6-analyst',
  OPTIMIZER = 'agent-7-optimizer',
  OPERATOR = 'agent-8-operator',
  DATA_SCIENTIST = 'agent-9-data-scientist',
  MARKETER = 'agent-10-marketer',
  IP_DEVELOPER = 'agent-11-ip-developer',
}

/** Skill identifiers */
export enum Skill {
  TEN_LAYERS = 'ten-layers',       // 十层宇宙
  CREATOR_GOD = 'creator-god',     // 创世神
  MO_BAI = 'mo-bai',               // 墨白
  NOVEL_MASTER = 'novel-master',   // 网文创作大师
  NOVEL_ANALYZER = 'novel-analyzer', // 小说拆文
  NOVEL_COMPARATOR = 'novel-comparator', // 网文对比
  OPERATIONS = 'operations',       // 运营大师
  DATA_ANALYTICS = 'data-analytics', // 数据分析师
  MARKETING = 'marketing',         // 营销策划师
  IP_PLANNER = 'ip-planner',       // IP策划师
}

/** M-Layer identifiers for the Ten Layers universe system
 * 
 * 💡 使用频率：L6（心智意识层）和 L7（社会文明层）最常用，约90%的网文只需要这两层。
 * L0-L5 为物理/基础层（极少直接使用），L8-L9 为高阶规则层（高维/本源，仅在大后期使用）。
 * ⚠️ 永远不超过 3 个 M 层。 */
export enum MLayer {
  L0 = 'L0', // 虚无层
  L1 = 'L1', // 混沌层
  L2 = 'L2', // 物质层
  L3 = 'L3', // 能量层
  L4 = 'L4', // 信息层
  L5 = 'L5', // 生命层
  L6 = 'L6', // 心智意识层
  L7 = 'L7', // 社会文明层
  L8 = 'L8', // 时空层
  L9 = 'L9', // 本源层
}

/** Five-dimensional definition for an M-Layer */
export interface FiveDimension {
  dao: string;    // 道 — 根本规律
  fa: string;     // 法 — 规则体系
  shu: string;    // 术 — 具体技巧
  qi: string;     // 器 — 承载物件
  shi: string;    // 势 — 矛盾方向
}

/** Fate tag types */
export type FateTag = '🧠' | '👁️' | '⚔️';
// 🧠 = 内功 (internal cultivation)
// 👁️ = 暗示 (foreshadowing hint)
// ⚔️ = 情节引爆 (plot detonation)

/** M-Layer definition with five dimensions and fate tags */
export interface MLayerDefinition {
  layer: MLayer;
  name: string;
  fiveDimensions: FiveDimension;
  fateTags: FateTag[];
}

/** Anchor point — core data passed between stages */
export interface Anchor {
  seedCore: string;
  breakingLayer: string;
  mLayers: MLayerDefinition[];
  explosionPoints: Record<string, number>;
  mainArc: string;
  darkArc: string;
  secretArc: string;
}

/** Quality gate check result */
export interface QualityGateResult {
  stage: Stage;
  checks: QualityCheck[];
  passed: boolean;
  timestamp: Date;
}

/** Individual quality check */
export interface QualityCheck {
  name: string;
  passed: boolean;
  detail: string;
}

/** Handoff message between stages */
export interface HandoffMessage {
  fromStage: Stage;
  toStage: Stage;
  fromSkill: Skill;
  toSkill: Skill;
  summary: string;
  anchor: Partial<Anchor>;
  artifacts: string[];
  qualityGateResult: QualityGateResult;
}

/** Project state — persisted between sessions */
export interface ProjectState {
  projectName: string;
  currentStage: Stage;
  anchor: Partial<Anchor>;
  completedStages: Stage[];
  artifacts: string[];
  createdAt: Date;
  updatedAt: Date;
}

/** Agent configuration */
export interface AgentConfig {
  id: Agent;
  name: string;
  department: string;
  skill: Skill;
  description: string;
}

/** Workflow configuration */
export interface WorkflowConfig {
  stages: StageConfig[];
  autoTransition: boolean;
  pauseAtStage4: boolean;
}

/** Stage configuration */
export interface StageConfig {
  stage: Stage;
  name: string;
  leadSkill: Skill;
  qualityGates: string[];
  nextStage: Stage | null;
}