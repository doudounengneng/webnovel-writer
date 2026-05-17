import {
  Stage,
  type ProjectState,
  type HandoffMessage,
  type Anchor,
  type QualityGateResult,
} from '../types';
import { getStageConfig, getNextStage } from '../stages';
import { runQualityGates } from '../quality-gates';

// ============================================================
// Workflow Engine — Manages Stage Transitions
// ============================================================

export class WorkflowEngine {
  private state: ProjectState;

  constructor(projectName: string) {
    this.state = {
      projectName,
      currentStage: Stage.STAGE_0,
      anchor: {},
      completedStages: [],
      artifacts: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  getState(): ProjectState {
    return { ...this.state };
  }

  getCurrentStage(): Stage {
    return this.state.currentStage;
  }

  getCompletedStages(): Stage[] {
    return [...this.state.completedStages];
  }

  updateAnchor(anchor: Partial<Anchor>): void {
    this.state.anchor = { ...this.state.anchor, ...anchor };
    this.state.updatedAt = new Date();
  }

  getAnchor(): Partial<Anchor> {
    return { ...this.state.anchor };
  }

  addArtifact(path: string): void {
    this.state.artifacts.push(path);
    this.state.updatedAt = new Date();
  }

  getArtifacts(): string[] {
    return [...this.state.artifacts];
  }

  async transitionToNextStage(): Promise<HandoffMessage> {
    const currentStage = this.state.currentStage;
    const nextStage = getNextStage(currentStage);

    if (!nextStage) {
      throw new Error('No next stage available — workflow is complete');
    }

    const currentConfig = getStageConfig(currentStage);
    const nextConfig = getStageConfig(nextStage);

    const qualityResult = await runQualityGates(currentStage, this.state);

    const handoff: HandoffMessage = {
      fromStage: currentStage,
      toStage: nextStage,
      fromSkill: currentConfig.leadSkill,
      toSkill: nextConfig.leadSkill,
      summary: `Stage ${currentStage} → ${nextStage}: ${currentConfig.name} complete`,
      anchor: this.state.anchor,
      artifacts: this.state.artifacts,
      qualityGateResult: qualityResult,
    };

    if (!qualityResult.passed) {
      return handoff;
    }

    this.state.completedStages.push(currentStage);
    this.state.currentStage = nextStage;
    this.state.updatedAt = new Date();

    return handoff;
  }

  async runStage(stage: Stage): Promise<QualityGateResult> {
    const config = getStageConfig(stage);
    this.state.currentStage = stage;
    this.state.updatedAt = new Date();

    return await runQualityGates(stage, this.state);
  }

  isWorkflowComplete(): boolean {
    return this.state.currentStage === Stage.STAGE_7;
  }

  shouldPause(): boolean {
    return this.state.currentStage === Stage.STAGE_4 &&
      !this.state.completedStages.includes(Stage.STAGE_4);
  }

  toJSON(): string {
    return JSON.stringify(this.state, null, 2);
  }

  static fromJSON(json: string): WorkflowEngine {
    const data = JSON.parse(json) as ProjectState;
    const engine = new WorkflowEngine(data.projectName);
    engine.state = data;
    return engine;
  }
}