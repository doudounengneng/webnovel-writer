# API Reference

> Complete API documentation for `@webnovel-writer/core` and `@webnovel-writer/cli`.

---

## @webnovel-writer/core

### WorkflowEngine

The main workflow orchestrator.

```typescript
import { WorkflowEngine } from '@webnovel-writer/core';

const engine = new WorkflowEngine('my-novel');
```

**When to use:** You're building a programmatic integration (CLI, server, test suite) that needs to manage the full stage pipeline programmatically.

**Not for:** Direct use inside Trae IDE. In Trae IDE, use the `创世` Skill command instead.

#### Constructor

```typescript
new WorkflowEngine(projectName: string)
```

#### Methods

| Method | Returns | Description | Usage Scenario |
|--------|---------|-------------|---------------|
| `getState()` | `ProjectState` | Get current project state | Check what stage you're at before deciding next action |
| `getCurrentStage()` | `Stage` | Get current stage | Determine which quality gates to run |
| `getCompletedStages()` | `Stage[]` | Get completed stages | Verify all prerequisites are done |
| `updateAnchor(anchor)` | `void` | Update anchor data | Feed AI agent output back into the engine |
| `getAnchor()` | `Partial<Anchor>` | Get anchor data | Pass current constraints to AI agent as context |
| `addArtifact(path)` | `void` | Add artifact path | Register output files for tracking |
| `getArtifacts()` | `string[]` | Get all artifacts | List all generated files for verification |
| `transitionToNextStage()` | `Promise<HandoffMessage>` | Transition to next stage | Move pipeline forward after quality gates pass |
| `runStage(stage)` | `Promise<QualityGateResult>` | Run quality gates for a stage | Validate agent output before advancing |
| `isWorkflowComplete()` | `boolean` | Check if workflow is done | Guard condition for "don't run stage 8 after stage 7" |
| `shouldPause()` | `boolean` | Check if should pause | Stage 4 always pauses for human review |
| `toJSON()` | `string` | Serialize to JSON | Save state to disk for session recovery |
| `fromJSON(json)` | `WorkflowEngine` (static) | Deserialize from JSON | Restore engine after restart |

**Typical usage pattern:**
```typescript
const engine = new WorkflowEngine('my-novel');

// 1. Feed AI output
engine.updateAnchor(result.anchor);
engine.addArtifact('outputs/种子冲击报告.md');

// 2. Validate
const qualityResult = await engine.runStage(engine.getCurrentStage());
if (!qualityResult.passed) {
  console.log('质量门未通过:', qualityResult.checks.filter(c => !c.passed));
  return; // Don't advance — fix issues first
}

// 3. Check guard conditions before advancing
if (engine.isWorkflowComplete()) {
  console.log('All stages done');
  return;
}
if (engine.shouldPause()) {
  console.log('Pausing at stage 4 for human review');
  return;
}

// 4. Advance
const handoff = await engine.transitionToNextStage();
console.log(`Moving from ${handoff.fromStage} to ${handoff.toStage}`);
```

---

### AnchorTracker

Tracks core creative elements across stages.

```typescript
import { AnchorTracker } from '@webnovel-writer/core';

const anchor = new AnchorTracker();
```

**When to use:** After each AI agent produces output, extract the key constraints and feed them into the anchor tracker. Then pass the anchor to the next agent as context.

**When NOT to use `setSeedCore` vs `updateAnchor`:** Use `AnchorTracker.setSeedCore()` for initial creation from scratch. Use `WorkflowEngine.updateAnchor()` to feed updated constraints midway through a pipeline.

#### Methods

| Method | Returns | Description | Usage Scenario |
|--------|---------|-------------|---------------|
| `setSeedCore(seed)` | `void` | Set seed core desire | Stage 0: capture user's inspiration |
| `setBreakingLayer(layer)` | `void` | Set breaking layer | Stage 1: which layer's rules must be broken |
| `addMLayer(layer)` | `void` | Add M-Layer definition | Stage 0/2: define world layers |
| `addExplosionPoint(layer, chapter)` | `void` | Add plot detonation point | Stage 2: lock in major plot beats |
| `setMainArc(arc)` | `void` | Set main storyline arc | Stage 3: core narrative throughline |
| `setDarkArc(arc)` | `void` | Set villain arc | Stage 3: antagonist's independent plotline |
| `setSecretArc(arc)` | `void` | Set secret identity arc | Stage 3: identity revelation line |
| `getAnchor()` | `Partial<Anchor>` | Get all anchor data | Pass to next stage/agent |
| `toSummary()` | `string` | Get human-readable summary | Print status for user review |
| `validate()` | `string[]` | Validate anchor completeness | Returns list of missing required fields |

**Decision guide — when to use each setter:**
```
Stage 0:  setSeedCore, addMLayer (initial)
Stage 1:  setBreakingLayer
Stage 2:  addMLayer (refined), addExplosionPoint
Stage 3:  setMainArc, setDarkArc, setSecretArc
Stage 4+:  Read anchor via getAnchor(), don't write
```

### Enums

```typescript
enum Stage {
  STAGE_0 = 'stage-0', // 灵感激活
  STAGE_1 = 'stage-1', // 灵魂激活
  STAGE_2 = 'stage-2', // 骨架激活
  STAGE_3 = 'stage-3', // 骨架搭建
  STAGE_4 = 'stage-4', // 灵魂灌注
  STAGE_5 = 'stage-5', // 正文输出
  STAGE_6 = 'stage-6', // 灵魂校对
  STAGE_7 = 'stage-7', // 定稿交付
}

enum Agent {
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

enum Skill {
  TEN_LAYERS = 'ten-layers',
  CREATOR_GOD = 'creator-god',
  MO_BAI = 'mo-bai',
  NOVEL_MASTER = 'novel-master',
  NOVEL_ANALYZER = 'novel-analyzer',
  NOVEL_COMPARATOR = 'novel-comparator',
  OPERATIONS = 'operations',
  DATA_ANALYTICS = 'data-analytics',
  MARKETING = 'marketing',
  IP_PLANNER = 'ip-planner',
}

enum MLayer { L0, L1, L2, L3, L4, L5, L6, L7, L8, L9 }
```

### Interfaces

```typescript
interface FiveDimension    { dao: string; fa: string; shu: string; qi: string; shi: string; }
interface MLayerDefinition { layer: MLayer; name: string; fiveDimensions: FiveDimension; fateTags: FateTag[]; }
interface Anchor           { seedCore: string; breakingLayer: string; mLayers: MLayerDefinition[]; explosionPoints: Record<string, number>; mainArc: string; darkArc: string; secretArc: string; }
interface QualityGateResult { stage: Stage; checks: QualityCheck[]; passed: boolean; timestamp: Date; }
interface QualityCheck     { name: string; passed: boolean; detail: string; }
interface HandoffMessage   { fromStage: Stage; toStage: Stage; fromSkill: Skill; toSkill: Skill; summary: string; anchor: Partial<Anchor>; artifacts: string[]; qualityGateResult: QualityGateResult; }
interface ProjectState     { projectName: string; currentStage: Stage; anchor: Partial<Anchor>; completedStages: Stage[]; artifacts: string[]; createdAt: Date; updatedAt: Date; }
interface AgentConfig      { id: Agent; name: string; department: string; skill: Skill; description: string; }
```

---

## @webnovel-writer/cli

### Commands

```
Usage: webnovel [options] [command]

Commands:
  init [name]          Initialize a new Webnovel-Writer project
  create <title>       Create a new web novel
  stage <action>       Manage workflow stages
  status               Show current project status
  agent [action]       List and manage AI agents
  help                 Display help
```

#### `webnovel init`

Initialize a new project. Creates `.webnovel/` directory with default config.

```
Options:
  -d, --dir <path>    Project directory (default: ".")
```

#### `webnovel create`

Create a new novel entry. Registers the novel metadata and initializes Stage 0.

```
Arguments:
  title               Novel title

Options:
  --genre <genre>     Novel genre
  --world <type>      World type (xianxia, fantasy, sci-fi)
```

#### `webnovel stage`

Manage workflow stages. The `run` action validates the current stage via quality gates.

```
Arguments:
  action              Action: list, run, next, status

Options:
  -s, --stage <stage> Stage identifier
```

#### `webnovel status`

Show project state: current stage, completed stages, artifacts, anchor summary.

```
Options:
  -v, --verbose       Show detailed information including anchor data
```

#### `webnovel agent`

List and manage agents. The `call` action outputs the exact Trae IDE command to invoke the agent. The agent list includes the Trae command column for quick reference.

```
Arguments:
  action              Action: list, info, call

Options:
  -a, --agent <id>    Agent ID (e.g., agent-3-architect)
  -t, --task <desc>   Task description
```