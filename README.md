# Webnovel-Writer

> 一套多智能体协作的网文长篇创作系统 — 从世界观构建到最终定稿，11 个专业 AI Agent 全程护航。
>
> A multi-agent collaborative web novel creation system — from world-building to final draft, powered by 11 specialized AI agents.

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT License">
  <img src="https://img.shields.io/badge/TypeScript-5.3-blue.svg" alt="TypeScript">
  <img src="https://img.shields.io/badge/Node.js-%3E%3D18-green.svg" alt="Node.js">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome">
  <img src="https://img.shields.io/badge/Trae_IDE-compatible-purple.svg" alt="Trae IDE">
</p>

---

## 目录

- [项目简介](#项目简介)
- [11 大部门架构](#11-大部门架构)
- [8 阶段创作管线](#8-阶段创作管线)
- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [技术架构](#技术架构)
- [质量门体系](#质量门体系)
- [核心概念](#核心概念)
- [开发指南](#开发指南)
- [致谢](#致谢)

---

## 项目简介

**Webnovel-Writer** 是一个开源的多智能体协作网文创作系统。它模拟了一家完整的出版公司的运作模式，11 个专业 AI Agent 各司其职：

| 编号 | 部门 | 智能体 | 技能包 | 职责 |
|------|------|--------|--------|------|
| 1 | 总裁办 | CEO/总编 | 创世 | 接收灵感、调度部门、阶段流转、最终交付 |
| 2 | 策划部 | 策划师 | 十层宇宙 | M 层识别、五维定义、命运标签标记 |
| 3 | 技术部 | 架构师 | 创世神 | 世界观搭建、三线设计、伏笔布局 |
| 4 | 编辑部 | 灵魂师 | 墨白 | 人设灌注、情感把控、活人感审核 |
| 5 | 生产部 | 写手 | 网文创作大师 | 正文输出、爽点植入、钩子设计 |
| 6 | 市场调研部 | 分析师 | 小说拆文 | 爆款拆解、竞品分析、共性提取 |
| 7 | 质量优化部 | 优化师 | 网文对比 | 五维对比、差距优化、自动修改 |
| 8 | 运营部 | 运营总监 | 运营大师 | 平台策略、更新节奏、读者互动 |
| 9 | 数据分析部 | 数据科学家 | 数据分析师 | 追读率、转化率、读者画像 |
| 10 | 内容营销部 | 营销策划 | 营销策划师 | 书名优化、简介打磨、推广文案 |
| 11 | IP 开发部 | IP 策划师 | IP 策划师 | IP 价值评估、改编规划、版权策略 |

---

## 8 阶段创作管线

```
阶段 0 ──→ 阶段 1 ──→ 阶段 2 ──→ 阶段 3 ──→ 阶段 4 ──→ 阶段 5 ──→ 阶段 6 ──→ 阶段 7
灵感激活    灵魂激活    骨架激活    骨架搭建    灵魂灌注    正文输出    灵魂校对    定稿交付
(十层宇宙)  (墨白)     (十层+创世) (创世神)   (墨白)     (网文大师)  (墨白)     (网文大师)
```

每个阶段都有**质量门**（Quality Gates），通过后方可进入下一阶段。

| 阶段 | 主导 Skill | 质量门（示例） |
|------|-----------|---------------|
| 0 — 灵感激活 | 十层宇宙 | M 层 ≤ 3、五维定义完整、命运标签标记 |
| 1 — 灵魂激活 | 墨白 | 核心欲望明确、金手指确定、打破层确认 |
| 2 — 骨架激活 | 十层 + 创世 | 五维完整、⚔️ 引爆点章节锁定 |
| 3 — 骨架搭建 | 创世神 | 世界观闭环、三线并行、伏笔 ≥ 3 长线 + 5 中线 |
| 4 — 灵魂灌注 | 墨白 | 主角立体、配角独立动机、反派权谋暗线 |
| 5 — 正文输出 | 网文大师 | 爽点兑现、章末钩子、字数 4000-6000 字 |
| 6 — 灵魂校对 | 墨白 | 情感温度、对话真实性、活人感 |
| 7 — 定稿交付 | 网文大师 | 无错字、无语病、格式规范、前后一致 |

---

## 快速开始

### 方式一：Trae IDE（推荐，完整体验）

1. 克隆仓库并在 Trae IDE 中打开
2. `.trae/` 目录自动加载 11 个 Skill 包和全套规则
3. 输入以下命令，一键启动全流程创作：

```
创世 穿越洪荒世界，主角拜入阐教受偏见
```

其他专项命令：

| 命令 | 功能 |
|------|------|
| `十层 [种子]` | 启动策划部 — M 层分析 |
| `世界观 [设定]` | 启动技术部 — 世界观搭建 |
| `人设 [大纲]` | 启动编辑部 — 人物灌注 |
| `写 [章节]` | 启动生产部 — 正文输出 |
| `拆解 [书名]` | 启动市场调研部 — 爆款分析 |
| `对比 [章节]` | 启动质量优化部 — 对标大神 |
| `运营 [作品]` | 启动运营部 — 平台策略 |
| `分析 [作品]` | 启动数据分析部 — 数据报告 |
| `营销 [作品]` | 启动内容营销部 — 推广方案 |
| `IP评估 [作品]` | 启动 IP 开发部 — 价值评估 |

### 方式二：CLI 命令行

```bash
# 克隆项目
git clone https://github.com/doudounengneng/webnovel-writer.git
cd webnovel-writer

# 安装依赖
npm install
npm run build

# 初始化新项目
node packages/cli/dist/index.js init my-novel
cd my-novel

# 开始创作
webnovel create "气运之子" --genre xianxia --world cultivation
webnovel stage run -s stage-0
webnovel stage next
webnovel status
```

### 方式三：编程 API

```typescript
import { WorkflowEngine, AnchorTracker, Stage } from '@webnovel-writer/core';

const engine = new WorkflowEngine('my-novel');
const anchor = new AnchorTracker();

anchor.setSeedCore('一个被家族遗弃的少年，身怀远古血脉');
anchor.setBreakingLayer('L6');
anchor.setMainArc('少年从底层崛起，一步步揭开身世之谜');
anchor.setDarkArc('幕后黑手操控各方势力，企图复活古神');
anchor.setSecretArc('主角是远古神族的最后血脉');

engine.updateAnchor(anchor.getAnchor());
await engine.transitionToNextStage();
```

---

## 项目结构

```
Webnovel-Writer/
├── packages/
│   ├── core/                         # 核心引擎
│   │   └── src/
│   │       ├── types/index.ts        #   所有类型定义（Stage/Agent/Skill/MLayer）
│   │       ├── workflow/index.ts     #   工作流引擎（阶段流转/状态管理）
│   │       ├── agents/index.ts       #   11 个 Agent 注册表
│   │       ├── stages/index.ts       #   8 阶段定义（名称/主导Skill/质量门）
│   │       ├── quality-gates/index.ts#   质量门检查器（每阶段 3-5 项）
│   │       └── anchor/index.ts       #   锚点追踪系统（种子核心/三线/引爆点）
│   └── cli/                          # CLI 工具
│       └── src/
│           ├── index.ts              #   入口（webnovel / wnw）
│           └── commands/
│               ├── init.ts           #   webnovel init — 初始化项目
│               ├── create.ts         #   webnovel create — 创建小说
│               ├── stage.ts          #   webnovel stage — 管理工作流
│               ├── status.ts         #   webnovel status — 项目状态
│               └── agent.ts          #   webnovel agent — Agent 管理
├── .trae/                            # Trae IDE Skill 包
│   ├── skills/                       #   11 个 Skill 包
│   │   ├── 创世/SKILL.md            #   CEO — 总调度入口
│   │   ├── 十层宇宙/SKILL.md        #   策划部 — M 层分析
│   │   ├── 创世神/SKILL.md          #   技术部 — 世界观搭建
│   │   ├── 墨白/SKILL.md            #   编辑部 — 灵魂工程
│   │   ├── 网文创作大师/SKILL.md    #   生产部 — 正文输出
│   │   └── ...                      #   数据分析/营销/IP 等
│   ├── rules/                        #   15 个协作规则
│   │   ├── TEN_LAYERS_X_THREE_SKILLS.md  #   十层 × 三 Skill 协作协议
│   │   ├── MULTI_AGENT_ARCHITECTURE.md   #   多 Agent 架构
│   │   └── ...                      #   质量门/契约/断点/轨迹等
│   └── agents/                       #   11 个 Agent 启动配置
│       └── agent-X-name/STARTUP.md
├── docs/                             # 文档
│   ├── architecture.md               #   架构说明
│   ├── api-reference.md             #   API 参考
│   └── contributing.md              #   贡献指南
├── examples/
│   └── basic-usage/                  #   基础用法示例
├── package.json                      #   根 workspace 配置
├── tsconfig.json                     #   TypeScript 配置
├── LICENSE                           #   MIT 许可证
└── README.md                         #   本文件
```

---

## 技术架构

```
                        用户（Author）
                            │
           ┌────────────────▼────────────────┐
           │    主编 Agent（CEO/总编）         │
           │  意图解析 → 任务分发 → 质量把控   │
           └──────┬───────┬───────┬───────────┘
                  │       │       │
          ┌───────▼──┐ ┌──▼────┐ ┌▼────────┐
          │ 骨架 Agent │ │灵魂 Agent│ │肌肉 Agent│
          │  (创世神)  │ │ (墨白)  │ │(网文大师)│
          │ 世界观    │ │ 人设    │ │ 正文     │
          │ 伏笔布局  │ │ 情感    │ │ 爽点     │
          │ 节奏规划  │ │ 校对    │ │ 定稿     │
          └───────────┘ └────────┘ └──────────┘
```

**核心系统：**

| 系统 | 模块 | 说明 |
|------|------|------|
| **WorkflowEngine** | `packages/core/src/workflow/` | 8 阶段自动流转，状态持久化 |
| **AnchorTracker** | `packages/core/src/anchor/` | 锚点追踪：种子核心/打破层/M 层/三线/引爆点 |
| **QualityGates** | `packages/core/src/quality-gates/` | 每阶段 3-5 项质量检查，阻止不合格产出 |
| **AgentRegistry** | `packages/core/src/agents/` | 11 个 Agent 的完整注册信息 |

详见 [架构说明](docs/architecture.md)。

---

## 质量门体系

每个阶段的产出必须通过质量门检查。以下为各阶段示例：

| 阶段 | 质量门项 |
|------|---------|
| 阶段 0 | M 层 ≤ 3、五维定义完整、命运标签（🧠👁️⚔️）标记、U 层标注 |
| 阶段 1 | 核心欲望明确、金手指类型确定、世界底色确定、打破层 + 代价确认 |
| 阶段 2 | M 层五维细化完整、命运标签完整、⚔️ 引爆点章节确定 |
| 阶段 3 | 世界观逻辑闭环、三线并行（主线/暗线/秘线）、伏笔 ≥ 3 长线 + 5 中线 |
| 阶段 4 | 主角立体（欲望 + 弧光 + 高光/底线锚点）、配角独立动机、反派权谋暗线、感情线规划 |
| 阶段 5 | 爽点即时兑现、章末钩子、人物行为符合锚点、字数 ≥ 4000、章节要素 ≥ 3 |
| 阶段 6 | 情感温度达标、对话真实自然、行为逻辑自洽、活人感（无工具人配角） |
| 阶段 7 | 无错别字、无语病、格式规范、前后设定一致 |

---

## 核心概念

### M 层（十层宇宙）

故事涉及的世界层次，最多 3 个：

| 层级 | 名称 | 示例 |
|------|------|------|
| L6 | 心智意识层 | 精神力修炼体系、灵魂攻击、神识 |
| L7 | 社会文明层 | 宗门制度、王朝政治、势力博弈 |
| L9 | 本源层 | 天地大道、宇宙起源法则 |

每个 M 层包含**五维定义**：道（根本规律）、法（规则体系）、术（操作技巧）、器（承载物件）、势（矛盾方向）。

### 锚点网络

贯穿全创作流程的核心约束链：

```
种子核心（阶段0）→ 打破层（阶段1）→ M层五维（阶段2）→ 三线架构（阶段3）→ 人物欲望（阶段4）→ 正文（阶段5-7）
```

---

## 开发指南

### 环境要求

- Node.js ≥ 18
- TypeScript 5.3+
- Git

### 本地开发

```bash
# 克隆
git clone https://github.com/doudounengneng/webnovel-writer.git
cd webnovel-writer

# 安装
npm install
npm run build

# 开发
npm run dev

# 运行 CLI
node packages/cli/dist/index.js --help
```

### 扩展新 Agent

```typescript
// 1. types/index.ts — 添加到 Agent 枚举
export enum Agent { MY_AGENT = 'agent-12-my-agent' }

// 2. agents/index.ts — 添加到注册表
{ id: Agent.MY_AGENT, name: '我的Agent', department: '新部门', skill: Skill.TEN_LAYERS, description: '...' }

// 3. .trae/skills/ — 创建 SKILL.md
// 4. .trae/agents/ — 创建 STARTUP.md
```

详见 [贡献指南](docs/contributing.md)。

---

## 致谢

项目设计受以下网文大神技法启发：

- **老鹰**（鹰）— 节奏把控与紧凑叙事
- **辰东** — 宏大世界观构建
- **唐家三少** — 系统化修炼体系
- **番茄** — 情感共鸣与爽感落点
- **耳根** — 人物成长弧光
- **梦入神机** — 权谋布局

基于 [Trae IDE](https://www.trae.ai/) 多智能体架构构建。

---

## License

MIT License — 详见 [LICENSE](LICENSE)。

---

> 不是产出一份 50 页的设定文档，而是让作者说出："天，我从来没意识到，原来我故事里的那道裂缝，是整个宇宙的基石。"