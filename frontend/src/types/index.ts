/**
 * src/types/index.ts
 * 
 * Single source of truth for TypeScript types.
 */

export interface Metrics {
  leadTime: number;
  cycleTime: number;
  bugRate: number;
  deploymentFrequency: number;
  prThroughput: number;
}

export interface Classification {
  status: 'good' | 'warning' | 'concern' | 'unknown';
  score: number;
  label: string;
}

export interface Classifications {
  leadTime: Classification;
  cycleTime: Classification;
  bugRate: Classification;
  deploymentFrequency: Classification;
  prThroughput: Classification;
}

export interface Action {
  title: string;
  description: string;
  effort: 'quick' | 'moderate' | 'hard';
  expectedImpact: string;
  timeframe: string;
}

export interface Interpretation {
  pattern: string;
  story: string;
  diagnosis: string;
  actions: Action[];
  classifications: Classifications;
}

export interface Developer {
  id: string;
  name: string;
  team: string;
}

export interface ICProfile {
  developer: Developer;
  month: string;
  metrics: Metrics;
  interpretation: Interpretation;
  generatedAt: string;
}
