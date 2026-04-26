/**
 * src/components/ActionPanel.tsx
 */

import ActionCard from './ActionCard';
import type { Action } from '../types';
import '../styles/ActionPanel.css';

interface ActionPanelProps {
  actions: Action[];
}

export default function ActionPanel({ actions }: ActionPanelProps) {
  return (
    <section className="action-panel">
      <h3>Suggested Next Steps</h3>
      <p className="subtitle">Pick one to focus on this week</p>

      <div className="actions-list">
        {actions.map((action, idx) => (
          <ActionCard key={idx} action={action} />
        ))}
      </div>
    </section>
  );
}
