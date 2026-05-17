import { Stage, Skill, type StageConfig, type WorkflowConfig } from '../types';

// ============================================================
// Stage Definitions
// ============================================================

const stageDefinitions: StageConfig[] = [
  {
    stage: Stage.STAGE_0,
    name: '灵感激活',
    leadSkill: Skill.TEN_LAYERS,
    qualityGates: [
      'M层≤3',
      '五维定义完整',
      '命运标签标记',
      'U层标注',
    ],
    nextStage: Stage.STAGE_1,
  },
  {
    stage: Stage.STAGE_1,
    name: '灵魂激活',
    leadSkill: Skill.MO_BAI,
    qualityGates: [
      '欲望明确',
      '金手指确定',
      '底色确定',
      '打破层确认',
    ],
    nextStage: Stage.STAGE_2,
  },
  {
    stage: Stage.STAGE_2,
    name: '骨架激活',
    leadSkill: Skill.TEN_LAYERS,
    qualityGates: [
      '五维完整',
      '命运标签完整',
      '⚔️引爆点章节确定',
    ],
    nextStage: Stage.STAGE_3,
  },
  {
    stage: Stage.STAGE_3,
    name: '骨架搭建',
    leadSkill: Skill.CREATOR_GOD,
    qualityGates: [
      '世界观闭环',
      '三线并行（主线/暗线/秘线）',
      '伏笔≥3长线+5中线',
    ],
    nextStage: Stage.STAGE_4,
  },
  {
    stage: Stage.STAGE_4,
    name: '灵魂灌注',
    leadSkill: Skill.MO_BAI,
    qualityGates: [
      '主角立体（欲望/弧光/锚点）',
      '配角独立动机',
      '反派权谋暗线',
      '感情线规划',
    ],
    nextStage: Stage.STAGE_5,
  },
  {
    stage: Stage.STAGE_5,
    name: '正文输出',
    leadSkill: Skill.NOVEL_MASTER,
    qualityGates: [
      '爽点即时兑现',
      '章末有钩子',
      '人物行为符合锚点',
      '字数达标（长篇4000-6000字）',
      '章节要素≥3（环境/动作/对话/内心/爽点）',
    ],
    nextStage: Stage.STAGE_6,
  },
  {
    stage: Stage.STAGE_6,
    name: '灵魂校对',
    leadSkill: Skill.MO_BAI,
    qualityGates: [
      '情感温度达标',
      '对话真实自然',
      '行为逻辑自洽',
      '活人感（无工具人）',
    ],
    nextStage: Stage.STAGE_7,
  },
  {
    stage: Stage.STAGE_7,
    name: '定稿交付',
    leadSkill: Skill.NOVEL_MASTER,
    qualityGates: [
      '无错别字',
      '无语病',
      '格式规范',
      '前后一致',
    ],
    nextStage: null,
  },
];

export function getStageConfig(stage: Stage): StageConfig {
  const config = stageDefinitions.find(s => s.stage === stage);
  if (!config) {
    throw new Error(`Unknown stage: ${stage}`);
  }
  return config;
}

export function getAllStageConfigs(): StageConfig[] {
  return [...stageDefinitions];
}

export function getNextStage(stage: Stage): Stage | null {
  const config = getStageConfig(stage);
  return config.nextStage;
}

export const defaultWorkflowConfig: WorkflowConfig = {
  stages: stageDefinitions,
  autoTransition: true,
  pauseAtStage4: true,
};