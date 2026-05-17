# Architecture Documentation

> Webnovel-Writer uses a **multi-agent orchestration architecture** with 11 specialized agents organized into 7 departments, all coordinated by a Chief Editor Agent.

---

## Core Concepts

### 1. Multi-Agent Architecture

```
                    ┌───────────────────────┐
                    │    Chief Editor (CEO)  │
                    │   Coordination & QA    │
                    └───────────┬───────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  Skeleton Agent │   │   Soul Agent    │   │  Muscle Agent   │
│  (World Design) │   │ (Character/Soul)│   │ (Chapter Write) │
│    创世神        │   │     墨白        │   │  网文创作大师    │
└────────┬────────┘   └────────┬────────┘   └────────┬────────┘
         │                     │                     │
         ▼                     ▼                     ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  World Building │   │ Character Cards │   │  Chapter Draft  │
│  Three-Arc      │   │ Emotional Lines │   │  爽点 & Hooks   │
│  Foreshadowing  │   │ Authenticity    │   │  Final Polish   │
└─────────────────┘   └─────────────────┘   └─────────────────┘
```

### 2. The 8-Stage Pipeline

| Stage | Name | Lead Skill | Description |
|-------|------|-----------|-------------|
| 0 | 灵感激活 | 十层宇宙 | Analyze story seed, identify M-Layers |
| 1 | 灵魂激活 | 墨白 | Define protagonist's core desire and breaking layer |
| 2 | 骨架激活 | 十层+创世 | Refine five dimensions, mark fate tags |
| 3 | 骨架搭建 | 创世神 | Build world, design three arcs, plant foreshadowing |
| 4 | 灵魂灌注 | 墨白 | Create character cards, emotional lines |
| 5 | 正文输出 | 网文大师 | Write chapters with 爽点 and hooks |
| 6 | 灵魂校对 | 墨白 | Proofread for emotional authenticity |
| 7 | 定稿交付 | 网文大师 | Final polish and delivery |

### 3. Quality Gates

Each stage has 3-5 quality gates that must be passed before transitioning:

```
Stage: STAGE_3 (Skeleton Building)
├── World logic is self-consistent
├── Three arcs are parallel (main/dark/secret)
└── Foreshadowing: ≥3 long-term, ≥5 medium-term
```

### 4. Anchor Tracking

Core creative elements (anchors) are tracked across all stages:

- **seed-core**: The protagonist's core desire
- **breaking-layer**: What the protagonist breaks through
- **m-layers**: Which M-Layers the story touches
- **explosion-points**: Plot detonation points mapped to chapters
- **main-arc**: Main storyline
- **dark-arc**: Villain's hidden storyline
- **secret-arc**: Protagonist's secret identity storyline

---

## Package Architecture

```
@webnovel-writer/core          @webnovel-writer/cli
┌──────────────────────┐      ┌──────────────────────┐
│  types/               │      │  commands/            │
│  ├── index.ts         │      │  ├── init.ts          │
│  workflow/            │      │  ├── create.ts        │
│  ├── index.ts         │      │  ├── stage.ts         │
│  agents/              │      │  ├── status.ts        │
│  ├── index.ts         │      │  └── agent.ts         │
│  stages/              │      │  index.ts              │
│  ├── index.ts         │      └──────────────────────┘
│  quality-gates/       │
│  ├── index.ts         │
│  anchor/              │
│  ├── index.ts         │
│  index.ts             │
└──────────────────────┘
```

---

## Data Flow

```
User Input
    │
    ▼
WorkflowEngine.runStage(stage)
    │
    ├── StageConfig: Get stage definition
    ├── QualityGates: Run checks
    ├── AnchorTracker: Update anchors
    └── HandoffMessage: Prepare for next stage
    │
    ▼
Next Stage (or completion)
```

---

## Extending

### Adding a New Agent

```typescript
// 1. Add to Agent enum in types/index.ts
export enum Agent {
  // ... existing agents
  MY_NEW_AGENT = 'agent-12-my-agent',
}

// 2. Add to agent registry in agents/index.ts
const agentRegistry: AgentConfig[] = [
  // ... existing agents
  {
    id: Agent.MY_NEW_AGENT,
    name: 'My Agent',
    department: 'My Department',
    skill: Skill.MY_SKILL,
    description: 'What this agent does',
  },
];
```

### Adding a New Stage

```typescript
// 1. Add to Stage enum in types/index.ts
export enum Stage {
  // ... existing stages
  STAGE_8 = 'stage-8',
}

// 2. Add stage config in stages/index.ts
const stageDefinitions: StageConfig[] = [
  // ... existing stages
  {
    stage: Stage.STAGE_8,
    name: 'My Stage',
    leadSkill: Skill.MY_SKILL,
    qualityGates: ['Gate 1', 'Gate 2'],
    nextStage: null,
  },
];
```

### Adding Quality Gates

```typescript
// In quality-gates/index.ts, add to qualityGateCheckers
[Stage.STAGE_8]: (state) => [
  { name: 'My Check', passed: true, detail: 'Check passed' },
],
```