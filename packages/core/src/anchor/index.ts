import { type Anchor, type MLayerDefinition } from '../types';

// ============================================================
// Anchor Tracking System
// ============================================================

export class AnchorTracker {
  private anchor: Partial<Anchor> = {};

  constructor(initialAnchor?: Partial<Anchor>) {
    if (initialAnchor) {
      this.anchor = { ...initialAnchor };
    }
  }

  setSeedCore(seed: string): void {
    this.anchor.seedCore = seed;
  }

  setBreakingLayer(layer: string): void {
    this.anchor.breakingLayer = layer;
  }

  addMLayer(layer: MLayerDefinition): void {
    if (!this.anchor.mLayers) {
      this.anchor.mLayers = [];
    }
    const existingIndex = this.anchor.mLayers.findIndex(
      l => l.layer === layer.layer
    );
    if (existingIndex >= 0) {
      this.anchor.mLayers[existingIndex] = layer;
    } else {
      this.anchor.mLayers.push(layer);
    }
  }

  addExplosionPoint(layer: string, chapter: number): void {
    if (!this.anchor.explosionPoints) {
      this.anchor.explosionPoints = {};
    }
    this.anchor.explosionPoints[layer] = chapter;
  }

  setMainArc(arc: string): void {
    this.anchor.mainArc = arc;
  }

  setDarkArc(arc: string): void {
    this.anchor.darkArc = arc;
  }

  setSecretArc(arc: string): void {
    this.anchor.secretArc = arc;
  }

  getAnchor(): Partial<Anchor> {
    return { ...this.anchor };
  }

  toSummary(): string {
    const parts: string[] = [];
    if (this.anchor.seedCore) parts.push(`seed-core: ${this.anchor.seedCore}`);
    if (this.anchor.breakingLayer) parts.push(`breaking-layer: ${this.anchor.breakingLayer}`);
    if (this.anchor.mLayers?.length) {
      const layerNames = this.anchor.mLayers.map(l => l.layer).join(', ');
      parts.push(`m-layers: [${layerNames}]`);
    }
    if (this.anchor.explosionPoints) {
      const points = Object.entries(this.anchor.explosionPoints)
        .map(([k, v]) => `${k}:${v}`)
        .join(', ');
      parts.push(`explosion-points: {${points}}`);
    }
    if (this.anchor.mainArc) parts.push(`main-arc: ${this.anchor.mainArc}`);
    if (this.anchor.darkArc) parts.push(`dark-arc: ${this.anchor.darkArc}`);
    if (this.anchor.secretArc) parts.push(`secret-arc: ${this.anchor.secretArc}`);
    return parts.join(' | ');
  }

  validate(): string[] {
    const warnings: string[] = [];
    if (!this.anchor.seedCore) warnings.push('种子核心未定义');
    if (!this.anchor.breakingLayer) warnings.push('打破层未定义');
    if (!this.anchor.mLayers?.length) warnings.push('M层未定义');
    if (!this.anchor.mainArc) warnings.push('主线明线未定义');
    if (!this.anchor.darkArc) warnings.push('反派暗线未定义');
    if (!this.anchor.secretArc) warnings.push('身份秘线未定义');
    return warnings;
  }
}