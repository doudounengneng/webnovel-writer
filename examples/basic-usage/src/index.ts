// Webnovel-Writer Core — 完整管道示例
//
// 演示从种子到阶段3的完整流程：
// 1. 创建项目并设置锚点
// 2. 逐阶段运行质量门
// 3. 阶段切换

import {
  WorkflowEngine,
  AnchorTracker,
  Stage,
  runQualityGates,
  getAllStageConfigs,
  getAllAgentConfigs,
} from '@webnovel-writer/core';

async function main() {
  // ── 1. 初始化 ──
  const engine = new WorkflowEngine('洪荒问道');
  console.log('📖 项目:', engine.getState().projectName);
  console.log('📍 当前阶段:', engine.getCurrentStage());

  // ── 2. 设置锚点（模拟阶段0-1产出）──
  const anchor = new AnchorTracker();
  anchor.setSeedCore('一个被阐教驱逐的弃徒，体内觉醒了上古血脉，一步步揭开洪荒真相');
  anchor.setBreakingLayer('L7 — 社会文明层：打破阐教的等级制度');

  anchor.addMLayer({
    layer: 'L6',
    name: '心智意识层',
    fiveDimensions: {
      dao: '意志力决定修为上限',
      fa: '精神修炼九重天体系',
      shu: '神识攻击 / 幻术 / 灵魂感知',
      qi: '灵魂法器、修炼洞府',
      shi: '个人意志 vs 天道命运',
    },
    fateTags: ['🧠', '⚔️'],
  });

  anchor.addMLayer({
    layer: 'L7',
    name: '社会文明层',
    fiveDimensions: {
      dao: '实力决定地位',
      fa: '宗门制度 / 三教九流 / 王朝律法',
      shu: '势力博弈 / 资源争夺',
      qi: '阐教总部 / 古战场 / 封神台',
      shi: '阐教利益 vs 个体自由',
    },
    fateTags: ['👁️', '⚔️'],
  });

  anchor.addExplosionPoint('L6', 12);
  anchor.addExplosionPoint('L7', 25);

  anchor.setMainArc('弃徒从阐教底层崛起，在洪荒中闯出自己的道');
  anchor.setDarkArc('阐教高层暗中培养"天道容器"，企图封神重开天地');
  anchor.setSecretArc('主角是上古神族的最后一滴血脉');

  engine.updateAnchor(anchor.getAnchor());

  // ── 3. 验证锚点完整性 ──
  console.log('\n─── 锚点验证 ───');
  const warnings = anchor.validate();
  if (warnings.length > 0) {
    console.log('⚠️ 警告:');
    warnings.forEach(w => console.log('  ', w));
  }
  console.log(anchor.toSummary());

  // ── 4. 逐阶段运行质量门（模拟阶段0→3）──
  const targetStage = Stage.STAGE_3;
  const stages = getAllStageConfigs();

  for (const cfg of stages) {
    if (cfg.stage > targetStage) break;

    console.log(`\n─── ${cfg.name} (${cfg.stage}) ───`);
    console.log(`  主导 Skill: ${cfg.leadSkill}`);

    const result = await runQualityGates(cfg.stage, engine.getState());
    console.log(`  状态: ${result.passed ? '✅ 通过' : '❌ 未通过'}`);

    for (const check of result.checks) {
      const icon = check.passed ? '  ✅' : '  ❌';
      console.log(`${icon} ${check.name}: ${check.detail}`);
    }

    if (!result.passed) {
      console.log('\n  ⛔ 质量门未通过，请修正后重试。');
      process.exit(1);
    }

    if (cfg.nextStage) {
      const handoff = await engine.transitionToNextStage();
      console.log(`  → 进入: ${handoff.toStage}`);
    }
  }

  // ── 5. 显示可用 Agent ──
  console.log('\n─── 可用 Agent ───');
  const agents = getAllAgentConfigs();
  agents.forEach(a => console.log(`  ${a.name} (${a.department}) → ${a.skill}`));

  console.log('\n✅ 管道演示完成！');
  console.log('下一步: 在 Trae IDE 中输入 `世界观 基于M层搭建洪荒世界` 继续。');
}

main().catch(console.error);