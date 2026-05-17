import * as fs from 'fs';
import * as path from 'path';
import { Stage, type ProjectState } from '../types';
import { WorkflowEngine } from '../workflow';

const STATE_FILE = 'project-state.json';
const BACKUP_DIR = 'backups';
const MAX_BACKUPS = 3;

export interface StorageConfig {
  projectDir: string;
  autoBackup?: boolean;
}

export function saveProject(engine: WorkflowEngine, config: StorageConfig): string {
  const dir = config.projectDir;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const statePath = path.join(dir, STATE_FILE);

  if (config.autoBackup !== false && fs.existsSync(statePath)) {
    backupState(statePath, dir);
  }

  const json = engine.toJSON();
  fs.writeFileSync(statePath, json, 'utf-8');

  return statePath;
}

export function loadProject(dir: string): WorkflowEngine {
  const statePath = path.join(dir, STATE_FILE);

  if (!fs.existsSync(statePath)) {
    throw new Error(`No project found in ${dir}. Run 'webnovel init' first.`);
  }

  const json = fs.readFileSync(statePath, 'utf-8');
  return WorkflowEngine.fromJSON(json);
}

export function resumeProject(engine: WorkflowEngine, dir: string): WorkflowEngine {
  if (!fs.existsSync(path.join(dir, STATE_FILE))) {
    saveProject(engine, { projectDir: dir });
    console.log(`📝 Created new project state at ${path.join(dir, STATE_FILE)}`);
    return engine;
  }

  console.log(`📂 Resuming from ${path.join(dir, STATE_FILE)}`);
  const loaded = loadProject(dir);
  const state = loaded.getState();
  console.log(`📍 Stage: ${state.currentStage} | Completed: ${state.completedStages.length}/8`);
  return loaded;
}

function backupState(statePath: string, dir: string): void {
  const backupDir = path.join(dir, BACKUP_DIR);
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupName = `project-state-${timestamp}.json`;
  const backupPath = path.join(backupDir, backupName);

  fs.copyFileSync(statePath, backupPath);

  // Clean old backups — keep only the latest MAX_BACKUPS
  const backups = fs.readdirSync(backupDir)
    .filter(f => f.startsWith('project-state-'))
    .sort()
    .reverse();

  for (const old of backups.slice(MAX_BACKUPS)) {
    fs.unlinkSync(path.join(backupDir, old));
  }
}

export function listBackups(dir: string): string[] {
  const backupDir = path.join(dir, BACKUP_DIR);
  if (!fs.existsSync(backupDir)) return [];

  return fs.readdirSync(backupDir)
    .filter(f => f.startsWith('project-state-'))
    .sort()
    .reverse();
}

export function restoreBackup(dir: string, backupName: string): WorkflowEngine {
  const backupPath = path.join(dir, BACKUP_DIR, backupName);
  const statePath = path.join(dir, STATE_FILE);

  if (!fs.existsSync(backupPath)) {
    throw new Error(`Backup not found: ${backupName}`);
  }

  fs.copyFileSync(backupPath, statePath);
  return loadProject(dir);
}