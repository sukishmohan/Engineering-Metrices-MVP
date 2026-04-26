/**
 * src/components/MetricCard.tsx
 */

import type { Classification } from '../types';
import '../styles/MetricsPanel.css';

interface MetricCardProps {
  title: string;
  value: number | string;
  unit: string;
  classification: Classification;
  tooltip: string;
}

export default function MetricCard({
  title,
  value,
  unit,
  classification,
  tooltip
}: MetricCardProps) {
  const badgeClass = `badge badge-${classification.status}`;

  return (
    <div className="metric-card">
      <div className="metric-header">
        <h4>{title}</h4>
        <span className={badgeClass}>{classification.status.toUpperCase()}</span>
      </div>

      <div className="metric-value">
        <span className="value">{value}</span>
        <span className="unit">{unit}</span>
      </div>

      <p className="metric-label">{classification.label}</p>
      <p className="metric-tooltip" title={tooltip}>ℹ {tooltip}</p>
    </div>
  );
}
