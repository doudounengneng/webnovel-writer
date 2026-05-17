import {
  Stage,
  type ProjectState,
  type QualityGateResult,
  type QualityCheck,
  type MLayerDefinition,
} from '../types';
import { getStageConfig } from '../stages';

function hasAnchor(anchor: unknown): anchor is Record<string, unknown> {
  return typeof anchor === 'object' && anchor !== null;
}

function isEmpty(v: unknown): boolean {
  return v === undefined || v === null || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && v.length === 0);
}

function isNonEmptyString(v: unknown): boolean {
  return typeof v === 'string' && v.trim().length > 0;
}

function getMlayers(state: ProjectState): MLayerDefinition[] {
  return (hasAnchor(state.anchor) && Array.isArray(state.anchor.mLayers) ? state.anchor.mLayers : []) as MLayerDefinition[];
}

function getExplosionPoints(state: ProjectState): Record<string, number> {
  const ep = hasAnchor(state.anchor) ? state.anchor.explosionPoints : undefined;
  if (typeof ep === 'object' && ep !== null) return ep as Record<string, number>;
  return {};
}

function getAnchorString(state: ProjectState, key: string): string {
  if (!hasAnchor(state.anchor)) return '';
  const v = (state.anchor as Record<string, unknown>)[key];
  return typeof v === 'string' ? v : '';
}

const qualityGateCheckers: Record<Stage, (state: ProjectState) => QualityCheck[]> = {

  [Stage.STAGE_0]: (state) => {
    const mLayers = getMlayers(state);
    const count = mLayers.length;
    const countPassed = count >= 1 && count <= 3;

    let fiveDimComplete = true;
    let fiveDimDetail = '道法术器势均已定义';
    if (count === 0) {
      fiveDimComplete = false;
      fiveDimDetail = '未定义任何 M 层，无法校验五维';
    } else {
      const incomplete = mLayers.filter(l => {
        const fd = l.fiveDimensions;
        return !fd || isEmpty(fd.dao) || isEmpty(fd.fa) || isEmpty(fd.shu) || isEmpty(fd.qi) || isEmpty(fd.shi);
      });
      if (incomplete.length > 0) {
        fiveDimComplete = false;
        fiveDimDetail = `以下层五维不完整: ${incomplete.map(l => `${l.layer}(${l.name || '?'})`).join(', ')}`;
      }
    }

    let fateTagsPassed = true;
    let fateTagsDetail = '🧠👁️⚔️标签已标记';
    if (count === 0) {
      fateTagsPassed = false;
      fateTagsDetail = '未定义 M 层，无法校验命运标签';
    } else {
      const untagged = mLayers.filter(l => !l.fateTags || l.fateTags.length === 0);
      if (untagged.length > 0) {
        fateTagsPassed = false;
        fateTagsDetail = `以下层未标记命运标签: ${untagged.map(l => l.layer).join(', ')}`;
      }
    }

    return [
      { name: 'M层≤3', passed: countPassed, detail: count === 0 ? '尚未定义任何 M 层' : count > 3 ? `当前 ${count} 层，超过上限 3` : `当前 ${count} 层，符合要求` },
      { name: '五维定义完整', passed: fiveDimComplete, detail: fiveDimDetail },
      { name: '命运标签标记', passed: fateTagsPassed, detail: fateTagsDetail },
      { name: 'U层标注', passed: true, detail: 'U 层标注需在 AI 输出阶段「种子冲击报告」时人工/Agent 确认' },
    ];
  },

  [Stage.STAGE_1]: (state) => {
    const seedCore = getAnchorString(state, 'seedCore');
    const breakingLayer = getAnchorString(state, 'breakingLayer');

    return [
      { name: '欲望明确', passed: isNonEmptyString(seedCore), detail: isNonEmptyString(seedCore) ? `种子核心: ${seedCore.slice(0, 60)}` : '种子核心尚未定义 — 请在阶段0完成后用 updateAnchor() 写入' },
      { name: '金手指确定', passed: true, detail: '金手指类型在阶段1中由墨白 Agent 确认后写入，此处检查占位通过，需人工复核' },
      { name: '底色确定', passed: true, detail: '世界底色在阶段1中由墨白 Agent 确认后写入，需人工复核' },
      { name: '打破层确认', passed: isNonEmptyString(breakingLayer), detail: isNonEmptyString(breakingLayer) ? `打破层: ${breakingLayer}` : '打破层尚未确认 — 请在阶段1完成后用 anchor.setBreakingLayer() 写入' },
    ];
  },

  [Stage.STAGE_2]: (state) => {
    const mLayers = getMlayers(state);
    const count = mLayers.length;

    let fiveDimPassed = true;
    let fiveDimDetail = '所有 M 层五维完整';
    if (count === 0) {
      fiveDimPassed = false;
      fiveDimDetail = '未定义 M 层';
    } else {
      const incomplete = mLayers.filter(l => {
        const fd = l.fiveDimensions;
        return !fd || isEmpty(fd.dao) || isEmpty(fd.fa) || isEmpty(fd.shu) || isEmpty(fd.qi) || isEmpty(fd.shi);
      });
      if (incomplete.length > 0) {
        fiveDimPassed = false;
        fiveDimDetail = `五维不完整: ${incomplete.map(l => l.layer).join(', ')}`;
      }
    }

    let fateTagPassed = true;
    let fateTagDetail = '命运标签完整';
    const untagged = mLayers.filter(l => !l.fateTags?.length);
    if (untagged.length > 0) {
      fateTagPassed = false;
      fateTagDetail = `未标记命运标签: ${untagged.map(l => l.layer).join(', ')}`;
    }

    const ep = getExplosionPoints(state);
    const epKeys = Object.keys(ep);
    const epPassed = epKeys.length > 0;
    const epDetail = epPassed ? `⚔️ 引爆点: ${epKeys.map(k => `${k}→第${ep[k]}章`).join(', ')}` : '⚔️ 引爆点尚未规划 — 请用 anchor.addExplosionPoint() 写入';

    return [
      { name: '五维完整', passed: fiveDimPassed, detail: fiveDimDetail },
      { name: '命运标签完整', passed: fateTagPassed, detail: fateTagDetail },
      { name: '⚔️引爆点章节确定', passed: epPassed, detail: epDetail },
    ];
  },

  [Stage.STAGE_3]: (state) => {
    const mainArc = getAnchorString(state, 'mainArc');
    const darkArc = getAnchorString(state, 'darkArc');
    const secretArc = getAnchorString(state, 'secretArc');
    const threeArcsPassed = isNonEmptyString(mainArc) && isNonEmptyString(darkArc) && isNonEmptyString(secretArc);

    let threeArcsDetail = '三线已全部设计';
    if (!threeArcsPassed) {
      const missing: string[] = [];
      if (!isNonEmptyString(mainArc)) missing.push('主线明线');
      if (!isNonEmptyString(darkArc)) missing.push('反派暗线');
      if (!isNonEmptyString(secretArc)) missing.push('身份秘线');
      threeArcsDetail = `缺少: ${missing.join('、')}`;
    }

    return [
      { name: '世界观闭环', passed: true, detail: '世界观逻辑自洽需 AI/Agent 在「世界框架验证」环节人工复核' },
      { name: '三线并行', passed: threeArcsPassed, detail: threeArcsDetail },
      { name: '伏笔≥3长线+5中线', passed: true, detail: '伏笔数量在创世神 Agent 的「伏笔清单.md」中追踪，此处检查占位通过' },
    ];
  },

  [Stage.STAGE_4]: (state) => {
    const hasStage3completed = state.completedStages.includes(Stage.STAGE_3);
    return [
      { name: '主角立体', passed: hasStage3completed, detail: hasStage3completed ? '阶段3已完成，可进入人设灌注' : '前置阶段3未完成，骨架未搭建，人设灌注缺乏基础' },
      { name: '配角独立动机', passed: true, detail: '配角动机在墨白 Agent 产出「人物灵魂卡」后确认，需人工复核' },
      { name: '反派权谋暗线', passed: true, detail: '反派暗线需墨白 Agent 在灵魂灌注阶段与创世神的三线设计对齐' },
      { name: '感情线规划', passed: true, detail: '感情线升温节点在墨白 Agent 的「情感线规划.md」中确认' },
    ];
  },

  [Stage.STAGE_5]: (state) => {
    return [
      { name: '爽点即时兑现', passed: true, detail: '爽点需网文大师 Agent 在正文输出时即时兑现，此处检查经 Agent 确认后放行' },
      { name: '章末有钩子', passed: true, detail: '章末钩子在正文输出后由墨白 Agent 在阶段6复核' },
      { name: '人物行为符合锚点', passed: true, detail: '需在阶段6（灵魂校对）中进行锚点一致性检查' },
      { name: '字数达标', passed: true, detail: '字数由网文大师 Agent 在输出时自行把控（目标 4000-6000 字），若不足请用「扩写」命令补写' },
      { name: '章节要素≥3', passed: true, detail: '章节要素（环境/动作/对话/内心/爽点）由 Agent 在输出时覆盖，覆盖不足需人工补写' },
    ];
  },

  [Stage.STAGE_6]: (state) => {
    const hasStage5completed = state.completedStages.includes(Stage.STAGE_5);
    return [
      { name: '情感温度达标', passed: hasStage5completed, detail: hasStage5completed ? '阶段5已完成，进入校对' : '无正文草稿可供校对 — 请先完成阶段5' },
      { name: '对话真实自然', passed: true, detail: '由墨白 Agent 逐段审查对话，以「是否像这个角色说的话」为标准' },
      { name: '行为逻辑自洽', passed: true, detail: '由墨白 Agent 逐行为检查，核对与人物灵魂卡的一致性' },
      { name: '活人感', passed: true, detail: '由墨白 Agent 检查配角是否有独立动机，是否沦为工具人' },
    ];
  },

  [Stage.STAGE_7]: (state) => {
    const hasStage6completed = state.completedStages.includes(Stage.STAGE_6);
    return [
      { name: '错别字/语病/格式', passed: true, detail: hasStage6completed ? '校对后进入定稿格式检查' : '建议先完成阶段6校对后再进入定稿' },
      { name: '前后设定一致', passed: true, detail: '由网文大师 Agent 在定稿阶段逐章核对与前文的设定一致性' },
    ];
  },
};

export async function runQualityGates(
  stage: Stage,
  state: ProjectState
): Promise<QualityGateResult> {
  const checker = qualityGateCheckers[stage];
  const checks = checker(state);
  const allPassed = checks.every(c => c.passed);

  return {
    stage,
    checks,
    passed: allPassed,
    timestamp: new Date(),
  };
}

export function getQualityGatesForStage(stage: Stage): string[] {
  const config = getStageConfig(stage);
  return config.qualityGates;
}

export function getAllQualityGates(): Record<Stage, string[]> {
  const result: Record<string, string[]> = {};
  for (const stage of Object.values(Stage)) {
    result[stage] = getQualityGatesForStage(stage);
  }
  return result;
}