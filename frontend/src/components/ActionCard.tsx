/**
 * src/components/ActionCard.tsx
 */

import type { Action } from '../types';

interface ActionCardProps {
  action: Action;
}

export default function ActionCard({ action }: ActionCardProps) {
  return (
    <div className="action-card">
      <div className="action-header">
        <h4>{action.title}</h4>
        <span className={`effort-badge effort-${action.effort}`}>
          {action.effort}
        </span>
      </div>

      <p className="action-description">{action.description}</p>

      <div className="action-meta">
        <div className="meta-item">
          <span className="label">Expected Impact:</span>
          <span className="value">{action.expectedImpact}</span>
        </div>
        <div className="meta-item">
          <span className="label">Timeframe:</span>
          <span className="value">{action.timeframe}</span>
        </div>
      </div>
    </div>
  );
}
