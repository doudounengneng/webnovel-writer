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

#### Constructor

```typescript
new WorkflowEngine(projectName: string)
```

#### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `getState()` | `ProjectState` | Get current project state |
| `getCurrentStage()` | `Stage` | Get current stage |
| `getCompletedStages()` | `Stage[]` | Get completed stages |
| `updateAnchor(anchor)` | `void` | Update anchor data |
| `getAnchor()` | `Partial<Anchor>` | Get anchor data |
| `addArtifact(path)` | `void` | Add artifact path |
| `getArtifacts()` | `string[]` | Get all artifacts |
| `transitionToNextStage()` | `Promise<HandoffMessage>` | Transition to next stage |
| `runStage(stage)` | `Promise<QualityGateResult>` | Run quality gates for a stage |
| `isWorkflowComplete()` | `boolean` | Check if workflow is done |
| `shouldPause()` | `boolean` | Check if should pause |
| `toJSON()` | `string` | Serialize to JSON |
| `fromJSON(json)` | `WorkflowEngine` | Deserialize from JSON |

### AnchorTracker

Tracks core creative elements across stages.

```typescript
import { AnchorTracker } from '@webnovel-writer/core';

const anchor = new AnchorTracker();
```

#### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `setSeedCore(seed)` | `void` | Set seed core desire |
| `setBreakingLayer(layer)` | `void` | Set breaking layer |
| `addMLayer(layer)` | `void` | Add M-Layer definition |
| `addExplosionPoint(layer, chapter)` | `void` | Add plot detonation point |
| `setMainArc(arc)` | `void` | Set main storyline |
| `setDarkArc(arc)` | `void` | Set villain's storyline |
| `setSecretArc(arc)` | `void` | Set secret identity storyline |
| `getAnchor()` | `Partial<Anchor>` | Get all anchor data |
| `toSummary()` | `string` | Get human-readable summary |
| `validate()` | `string[]` | Validate anchor completeness |

### Enums

```typescript
enum Stage {
  STAGE_0 = 'stage-0',
  STAGE_1 = 'stage-1',
  STAGE_2 = 'stage-2',
  STAGE_3 = 'stage-3',
  STAGE_4 = 'stage-4',
  STAGE_5 = 'stage-5',
  STAGE_6 = 'stage-6',
  STAGE_7 = 'stage-7',
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
  DATA_SCIENTIST = 'agent-9-analyst',
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

enum MLayer {
  L0, L1, L2, L3, L4, L5, L6, L7, L8, L9,
}
```

### Interfaces

```typescript
interface FiveDimension {
  dao: string;
  fa: string;
  shu: string;
  qi: string;
  shi: string;
}

interface MLayerDefinition {
  layer: MLayer;
  name: string;
  fiveDimensions: FiveDimension;
  fateTags: FateTag[];
}

interface Anchor {
  seedCore: string;
  breakingLayer: string;
  mLayers: MLayerDefinition[];
  explosionPoints: Record<string, number>;
  mainArc: string;
  darkArc: string;
  secretArc: string;
}

interface QualityGateResult {
  stage: Stage;
  checks: QualityCheck[];
  passed: boolean;
  timestamp: Date;
}

interface QualityCheck {
  name: string;
  passed: boolean;
  detail: string;
}

interface HandoffMessage {
  fromStage: Stage;
  toStage: Stage;
  fromSkill: Skill;
  toSkill: Skill;
  summary: string;
  anchor: Partial<Anchor>;
  artifacts: string[];
  qualityGateResult: QualityGateResult;
}

interface ProjectState {
  projectName: string;
  currentStage: Stage;
  anchor: Partial<Anchor>;
  completedStages: Stage[];
  artifacts: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface AgentConfig {
  id: Agent;
  name: string;
  department: string;
  skill: Skill;
  description: string;
}
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

Initialize a new project.

```
Options:
  -d, --dir <path>    Project directory (default: ".")
```

#### `webnovel create`

Create a new novel.

```
Arguments:
  title               Novel title

Options:
  --genre <genre>     Novel genre
  --world <type>      World type (xianxia, fantasy, sci-fi)
```

#### `webnovel stage`

Manage workflow stages.

```
Arguments:
  action              Action: list, run, next, status

Options:
  -s, --stage <stage> Stage identifier
```

#### `webnovel status`

Show project status.

```
Options:
  -v, --verbose       Show detailed information
```

#### `webnovel agent`

List and manage agents.

```
Arguments:
  action              Action: list, info, call

Options:
  -a, --agent <id>    Agent ID
  -t, --task <desc>   Task description
```