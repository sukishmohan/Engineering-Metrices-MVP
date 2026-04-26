/**
 * src/components/InterpretationPanel.tsx
 */

import type { Interpretation } from '../types';
import '../styles/InterpretationPanel.css';

interface InterpretationPanelProps {
  interpretation: Interpretation;
}

// Convert snake_case to Title Case (e.g., "fast_but_fragile" → "Fast but Fragile")
function formatPattern(pattern: string): string {
  return pattern
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function InterpretationPanel({ interpretation }: InterpretationPanelProps) {
  return (
    <section className="interpretation-panel">
      <div className="pattern-badge">Pattern: {formatPattern(interpretation.pattern)}</div>

      <h3>{interpretation.story}</h3>

      <div className="diagnosis">
        <h4>What This Means</h4>
        <p style={{ whiteSpace: 'pre-wrap' }}>{interpretation.diagnosis}</p>
      </div>
    </section>
  );
}
