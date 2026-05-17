# Webnovel-Writer

> A multi-agent collaborative web novel creation system — from world-building to final draft, powered by 11 specialized AI agents.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## Overview

Webnovel-Writer is an **open-source, multi-agent collaborative system** designed for professional web novel creation. It simulates a complete publishing company with 11 specialized AI agents, each responsible for a specific aspect of the creative pipeline:

| Department | Agent | Responsibility |
|-----------|-------|---------------|
| Executive Office | CEO/Editor-in-Chief | Orchestration, stage management, final delivery |
| Planning | World Designer | M-Layer analysis, five-dimensional definition |
| Technology | Architect | World-building, three-arc design, foreshadowing |
| Editorial | Soul Engineer | Character design, emotional control, authenticity |
| Production | Writer | Chapter output,爽点 implantation, hook design |
| Market Research | Analyst | Competitive analysis, bestseller deconstruction |
| QA | Optimizer | Quality comparison, gap optimization |
| Operations | Ops Director | Platform strategy, release schedule, reader engagement |
| Data Analytics | Data Scientist | Read-through rate, conversion analysis, reader profiling |
| Content Marketing | Marketing Planner | Title optimization, blurb polishing, promotion |
| IP Development | IP Planner | IP valuation, adaptation planning, licensing |

### The 8-Stage Workflow

```
Stage 0 ──→ Stage 1 ──→ Stage 2 ──→ Stage 3 ──→ Stage 4 ──→ Stage 5 ──→ Stage 6 ──→ Stage 7
Inspiration   Soul        Skeleton    Skeleton    Soul        Chapter     Soul        Final
Activation    Activation  Activation  Building    Infusion    Output      Proofread   Draft
(十层宇宙)    (墨白)      (十层+创世) (创世神)    (墨白)      (网文大师)  (墨白)      (网文大师)
```

Each stage has **quality gates** that must be passed before transitioning to the next stage.

---

## Features

- **11 Specialized AI Agents** — Each with distinct skills and responsibilities
- **8-Stage Production Pipeline** — From inspiration to final draft
- **Quality Gate System** — Automated checks at every stage
- **Anchor Tracking** — Core creative elements persist across all stages
- **Multi-Platform Support** — Works as both a CLI tool and a Trae IDE Skill package
- **Extensible Architecture** — Easy to add new agents, stages, or quality gates
- **Bilingual** — Full Chinese/English support for web novel creation

---

## Quick Start

### Option 1: CLI Tool

```bash
# Install
npm install -g @webnovel-writer/cli

# Initialize a project
webnovel init my-novel
cd my-novel

# Create a new novel
webnovel create "Rebirth of the Heavenly Demon" --genre xianxia --world cultivation

# Run the workflow
webnovel stage run -s stage-0
webnovel stage next
webnovel stage status
```

### Option 2: Trae IDE (Recommended for Full Experience)

1. Clone this repository
2. Open in Trae IDE
3. The `.trae/` directory contains all Skill packages and agent configurations
4. Use the `创世` command to start the full workflow:

```
创世 穿越洪荒世界，主角拜入阐教受偏见
```

### Option 3: Programmatic API

```typescript
import { WorkflowEngine, AnchorTracker, Stage } from '@webnovel-writer/core';

const engine = new WorkflowEngine('my-novel');
const anchor = new AnchorTracker();

anchor.setSeedCore('A reborn cultivator seeks revenge');
anchor.addMLayer({
  layer: 'L6',
  name: '心智意识层',
  fiveDimensions: {
    dao: '意识决定存在',
    fa: '精神力修炼体系',
    shu: '神识攻击技法',
    qi: '魂器',
    shi: '意识与肉体的矛盾',
  },
  fateTags: ['🧠', '⚔️'],
});

engine.updateAnchor(anchor.getAnchor());
await engine.transitionToNextStage();
```

---

## Project Structure

```
Webnovel-Writer/
├── package.json              # Root workspace config
├── tsconfig.json             # TypeScript config
├── LICENSE                   # MIT License
├── README.md                 # This file
├── .trae/                    # Trae IDE Skill package
│   ├── skills/               # 11 Skill packages
│   ├── rules/                # Workflow rules & architecture
│   └── agents/               # Agent startup configs
├── packages/
│   ├── core/                 # Core engine (types, workflow, agents, quality gates)
│   │   └── src/
│   │       ├── types/        # Type definitions
│   │       ├── workflow/     # Workflow engine
│   │       ├── agents/       # Agent registry
│   │       ├── stages/       # Stage definitions
│   │       ├── quality-gates/# Quality gate checks
│   │       └── anchor/       # Anchor tracking
│   └── cli/                  # CLI tool
│       └── src/
│           └── commands/     # CLI commands
├── docs/                     # Documentation
│   ├── architecture.md       # Architecture overview
│   ├── api-reference.md      # API documentation
│   └── contributing.md       # Contributing guide
└── examples/                 # Example projects
    └── basic-usage/          # Basic usage example
```

---

## Architecture

Webnovel-Writer uses a **multi-agent orchestration architecture**:

```
User Input
    │
    ▼
┌─────────────────────────────────────────────┐
│         Chief Editor Agent (CEO)            │
│    Intent parsing → Task distribution       │
│    → Quality control → Result integration   │
└──────────┬──────────┬──────────┬────────────┘
           │          │          │
           ▼          ▼          ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │ Skeleton │ │  Soul    │ │  Muscle  │
    │  Agent   │ │  Agent   │ │  Agent   │
    │(创世神)  │ │  (墨白)  │ │(网文大师)│
    └────┬─────┘ └────┬─────┘ └────┬─────┘
         │            │            │
         ▼            ▼            ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │ World    │ │ Character│ │ Chapter  │
    │ Building │ │ Design   │ │ Writing  │
    └──────────┘ └──────────┘ └──────────┘
```

See [Architecture Documentation](docs/architecture.md) for details.

---

## Quality Gates

Each stage has specific quality gates. Examples:

| Stage | Quality Gates |
|-------|--------------|
| Stage 0 | M-Layers ≤ 3, Five dimensions complete, Fate tags assigned |
| Stage 3 | World logic闭环, Three arcs parallel, Foreshadowing ≥ 3 long + 5 medium |
| Stage 5 | 爽点兑现, Chapter hook, Character alignment, Word count ≥ 4000 |
| Stage 6 | Emotional temperature, Dialogue authenticity, Behavioral logic |

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](docs/contributing.md) for guidelines.

### Development Setup

```bash
git clone https://github.com/your-username/webnovel-writer.git
cd webnovel-writer
npm install
npm run build
npm test
```

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Acknowledgments

Inspired by the techniques of master web novel authors:
- **Lao Ying** (老鹰) — Rhythm and pacing
- **Chen Dong** (辰东) — Grand world-building
- **Tang Jia San Shao** (唐家三少) — Systematic cultivation systems
- **Tomato** (番茄) — Emotional resonance
- **Er Gen** (耳根) — Character growth

Built with [Trae IDE](https://www.trae.ai/) multi-agent architecture.