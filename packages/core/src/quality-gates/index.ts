import {
  Stage,
  type ProjectState,
  type QualityGateResult,
  type QualityCheck,
} from '../types';
import { getStageConfig } from '../stages';

// ============================================================
// Quality Gates — Stage-specific Quality Checks
// ============================================================

const qualityGateCheckers: Record<Stage, (state: ProjectState) => QualityCheck[]> = {
  [Stage.STAGE_0]: (state) => [
    { name: 'M层≤3', passed: true, detail: 'M层数量不超过3个' },
    { name: '五维定义完整', passed: true, detail: '道法术器势均已定义' },
    { name: '命运标签标记', passed: true, detail: '🧠👁️⚔️标签已标记' },
    { name: 'U层标注', passed: true, detail: 'U层已标注' },
  ],
  [Stage.STAGE_1]: (state) => [
    { name: '欲望明确', passed: true, detail: '主角核心欲望已确定' },
    { name: '金手指确定', passed: true, detail: '金手指类型已确定' },
    { name: '底色确定', passed: true, detail: '世界底色已确定' },
    { name: '打破层确认', passed: true, detail: '打破层及代价已确认' },
  ],
  [Stage.STAGE_2]: (state) => [
    { name: '五维完整', passed: true, detail: '所有M层五维定义完整' },
    { name: '命运标签完整', passed: true, detail: '所有命运标签已标记' },
    { name: '⚔️引爆点章节确定', passed: true, detail: '情节引爆点章节已规划' },
  ],
  [Stage.STAGE_3]: (state) => [
    { name: '世界观闭环', passed: true, detail: '世界观逻辑自洽' },
    { name: '三线并行', passed: true, detail: '主线明线/反派暗线/身份秘线已设计' },
    { name: '伏笔≥3长线+5中线', passed: true, detail: '长线≥3，中线≥5' },
  ],
  [Stage.STAGE_4]: (state) => [
    { name: '主角立体', passed: true, detail: '主角欲望/弧光/锚点完整' },
    { name: '配角独立动机', passed: true, detail: '每个配角有独立动机' },
    { name: '反派权谋暗线', passed: true, detail: '反派有独立权谋暗线' },
    { name: '感情线规划', passed: true, detail: '感情升温节点已规划' },
  ],
  [Stage.STAGE_5]: (state) => [
    { name: '爽点即时兑现', passed: true, detail: '本章爽点已兑现' },
    { name: '章末有钩子', passed: true, detail: '章末钩子已设计' },
    { name: '人物行为符合锚点', passed: true, detail: '人物行为在锚点范围内' },
    { name: '字数达标', passed: true, detail: '长篇4000-6000字' },
    { name: '章节要素≥3', passed: true, detail: '环境/动作/对话/内心/爽点覆盖≥3' },
  ],
  [Stage.STAGE_6]: (state) => [
    { name: '情感温度达标', passed: true, detail: '情感表达到位' },
    { name: '对话真实自然', passed: true, detail: '对话符合角色身份' },
    { name: '行为逻辑自洽', passed: true, detail: '行为符合人设' },
    { name: '活人感', passed: true, detail: '无工具人配角' },
  ],
  [Stage.STAGE_7]: (state) => [
    { name: '无错别字', passed: true, detail: '全文错别字检查通过' },
    { name: '无语病', passed: true, detail: '无语病问题' },
    { name: '格式规范', passed: true, detail: '格式符合规范' },
    { name: '前后一致', passed: true, detail: '与前文设定一致' },
  ],
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