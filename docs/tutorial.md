# Webnovel-Writer 教程：从零到一本书

> 本教程将带你从安装开始，逐步完成一本 500 章网文的全流程创作。

---

## 目录

1. [安装](#1-安装)
2. [5 分钟快速体验](#2-5-分钟快速体验)
3. [项目初始化](#3-项目初始化)
4. [首章创作（全管线）](#4-首章创作全管线)
5. [续写章节（增量模式）](#5-续写章节增量模式)
6. [成本估算](#6-成本估算)
7. [高级用法](#7-高级用法)
8. [与 Trae IDE 集成](#8-与-trae-ide-集成)
9. [常见问题](#9-常见问题)

---

## 1. 安装

### 方式 A：npm 全局安装（推荐）

```bash
npm install -g @webnovel-writer/cli
```

安装成功后，可以使用 `webnovel` 或 `wnw` 命令：

```bash
webnovel --version
# → 0.1.0
```

### 方式 B：从源码安装

```bash
git clone https://github.com/doudounengneng/webnovel-writer.git
cd webnovel-writer
npm install
npm run build
npm link
```

---

## 2. 5 分钟快速体验

无需任何 API Key，立即体验完整创作管线：

```bash
webnovel quickstart
```

你会看到 6 个阶段依次执行，每个阶段产生不同的创作内容。如果没有提供创作种子，系统会随机选择一个：

```bash
# 也可以自定义种子
webnovel quickstart "穿越洪荒世界，主角是阐教弃徒"
```

产出文件保存在 `.webnovel/output/` 目录：

```
.webnovel/output/
├── 00-灵感激活.md    ← 种子分析 + M 层识别
├── 01-灵魂激活.md    ← 主角核心欲望 + 金手指
├── 02-骨架激活.md    ← M 层细化
├── 03-骨架搭建.md    ← 世界观 + 三线 + 伏笔
├── 04-灵魂灌注.md    ← 人物灵魂卡 + 感情线
└── 05-正文输出.md    ← 第一章正文
```

> 💡 **重要**：Quickstart 使用 Mock 模式，输出的是内置示例文本。真实创作需要接入 OpenAI API。

---

## 3. 项目初始化

```bash
# 创建新项目
webnovel init 洪荒封神录

# 或者
webnovel create "洪荒封神录" --genre xianxia --world honghuang
```

项目结构：

```
洪荒封神录/
└── .webnovel/
    ├── project-state.json    ← 项目状态（可断点续跑）
    ├── backups/              ← 自动备份（保留最近 3 份）
    └── output/               ← 各阶段产出
```

---

## 4. 首章创作（全管线）

### 4.1 获取 API Key

1. 访问 https://platform.openai.com/api-keys
2. 创建 API Key
3. 设置环境变量：

```bash
# Windows PowerShell
$env:OPENAI_API_KEY = "sk-..."

# macOS / Linux
export OPENAI_API_KEY="sk-..."
```

### 4.2 运行全管线

```bash
webnovel run "穿越洪荒，被阐教驱逐后发现自己是上古神族最后一滴血脉"
```

管线执行流程：

```
🌱 Stage 0 → Agent-2 策划师 → 种子分析（M 层识别）
💫 Stage 1 → Agent-4 灵魂师 → 灵魂激活（核心设定）
🦴 Stage 2 → Agent-2 策划师 → 骨架细化
🏗️ Stage 3 → Agent-3 架构师 → 世界观搭建 + 三线 + 伏笔
👤 Stage 4 → Agent-4 灵魂师 → 人物灌注 + 感情线
✍️ Stage 5 → Agent-5 写手   → 第一章正文（4000-6000 字）
```

### 4.3 控制管线深度

```bash
# 只跑到阶段 3（世界观）
webnovel run "种子" --stop-at 3

# 跑完整 8 阶段（含校对和定稿）
webnovel run "种子" --stop-at 7

# 自定义模型
webnovel run "种子" --model gpt-4o-mini
```

### 4.4 查看产出

```bash
# 打开输出目录
webnovel status
```

---

## 5. 续写章节（增量模式）

首章之后，不需要重新跑全管线（省成本）。

```bash
# 增量模式：只跑 Stage 5（正文输出），复用已有设定
webnovel run --resume
```

### 5.1 定期刷新

每 50 章刷新一次世界观，保持一致性：

```bash
# 第 50 章：刷新世界观和人设
webnovel run --refresh --stop-at 4

# 第 51-100 章：继续增量
webnovel run --resume
```

### 5.2 断点续跑

```bash
# 保存状态
webnovel run "种子" --stop-at 5

# 项目状态自动保存到 .webnovel/project-state.json

# 下次继续（手动设定原子跑过的阶段）
webnovel run --resume
```

---

## 6. 成本估算

在开始长篇创作之前，先了解成本：

```bash
webnovel estimate --chapters 500
```

输出示例：

```
📚 全书成本预估（基于 500 章）:

  模型              总成本(USD)   每章均价     千章成本
  ────────────────────────────────────────────────
  gpt-4o              $24.24      $0.0485     $48.48
  gpt-4o-mini          $1.45      $0.0029      $2.91
  o3-mini             $10.66      $0.0213     $21.33

💡 建议策略：
  · 首章 gpt-4o（全管线），续章 gpt-4o-mini（增量）
  · 500 章总成本约 $1.5-3.0（混合策略）
```

### 6.1 省钱策略

| 策略 | 成本（500 章） | 质量影响 |
|------|-------------|---------|
| gpt-4o 全程 | ~$24 | 最高质量 |
| gpt-4o-mini 全程 | ~$1.45 | 质量可接受 |
| 混合：首章 gpt-4o + 续章 gpt-4o-mini | ~$3.0 | 推荐 |
| 混合 + 只刷新关键章节 | ~$2.5 | 最优性价比 |

---

## 7. 高级用法

### 7.1 使用其他 API

```bash
# 兼容 OpenAI 格式的 API（如 DeepSeek、Qwen、OneAPI）
webnovel run "种子" --provider openai --base-url "https://your-api.com/v1" --api-key "your-key" --model "deepseek-chat"
```

### 7.2 查看 Agent 列表

```bash
webnovel agent list

# 了解某个 Agent
webnovel agent info --agent agent-5-writer
```

### 7.3 备份与恢复

```bash
# 查看备份
ls .webnovel/backups/

# 恢复最近备份
# （自动保留最近 3 份备份）
```

### 7.4 只生成人设和世界观（不写正文）

```bash
webnovel run "种子" --stop-at 4
```

这会在阶段 4（灵魂灌注）之后停止，产出完整的世界观 + 人设。

---

## 8. 与 Trae IDE 集成

如果你使用 Trae IDE，可以直接在对话中调用 Skill：

```
创世 穿越洪荒世界，主角被阐教驱逐
```

Trae IDE 会加载 `.trae/skills/` 下的 11 个 Skill 包，自动调度 Agent 协作。

更多信息见 `.trae/README.md`。

---

## 9. 常见问题

### Q: 需要什么技术背景？

不需要编程背景。只需：
1. 安装 Node.js（18+）
2. 注册 OpenAI 账号获取 API Key
3. 运行 `webnovel quickstart` 试玩

### Q: Mock 模式和真实模式有什么区别？

| | Mock 模式 | 真实（OpenAI）模式 |
|---|---|---|
| 需要 API Key | ❌ | ✅ |
| 产出内容 | 内置示例 | AI 基于你的种子创作 |
| 适合 | 演示、了解流程 | 实际创作 |

### Q: 产出的章节质量如何？

取决于三个因素：
1. **种子质量**：越具体的种子，产出越好
2. **模型选择**：gpt-4o > gpt-4o-mini > mock
3. **8 阶段完整性**：完整管线产出的章节质量远高于跳过前 4 个阶段

我们设计了完整的质量门体系（`.trae/rules/QUALITY_GATES.md`），每个 Agent 都有明确的输出标准。

### Q: 可以用于商业出版吗？

可以。产物版权归你。但建议：
1. 将 AI 产出视为"精稿"而非"终稿"
2. 对每章进行人工校对和润色
3. 关键章节建议人工重写或深度修改

### Q: 支持哪些模型？

- OpenAI：gpt-4o、gpt-4o-mini、o3-mini
- 兼容 OpenAI 格式（即将支持 Anthropic Claude）
- 本地模型（通过 --base-url 指向兼容接口）

### Q: 如何贡献？

1. Fork 仓库
2. 创建 Feature Branch
3. 提交 PR

更多见 `docs/contributing.md`。

---

## 下一步

- 📖 阅读[架构文档](docs/architecture.md)
- 🔧 了解[API 参考](docs/api-reference.md)
- 🤝 阅读[贡献指南](docs/contributing.md)
- 🎮 在 Trae IDE 中使用 Skill 包

---

*本教程使用 Webnovel-Writer v0.1.0。API 可能随版本更新变化。*