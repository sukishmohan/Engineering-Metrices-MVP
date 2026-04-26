/**
 * src/components/MetricsPanel.tsx
 */

import MetricCard from './MetricCard';
import type { Metrics, Classifications } from '../types';
import '../styles/MetricsPanel.css';

interface MetricsPanelProps {
  metrics: Metrics;
  classifications: Classifications;
}

export default function MetricsPanel({ metrics, classifications }: MetricsPanelProps) {
  return (
    <section className="metrics-panel">
      <h3>Your Metrics at a Glance</h3>
      <div className="metrics-grid">
        <MetricCard
          title="Lead Time for Changes"
          value={metrics.leadTime}
          unit="days"
          classification={classifications.leadTime}
          tooltip="Avg time from PR open → successful production deploy"
        />
        <MetricCard
          title="Cycle Time"
          value={metrics.cycleTime}
          unit="days"
          classification={classifications.cycleTime}
          tooltip="Avg time from issue 'In Progress' → 'Done'"
        />
        <MetricCard
          title="Bug Rate"
          value={metrics.bugRate}
          unit="%"
          classification={classifications.bugRate}
          tooltip="Escaped bugs this month ÷ issues completed"
        />
        <MetricCard
          title="Deployment Frequency"
          value={metrics.deploymentFrequency}
          unit="deploys/month"
          classification={classifications.deploymentFrequency}
          tooltip="Team-wide successful production deployments"
        />
        <MetricCard
          title="PR Throughput"
          value={metrics.prThroughput}
          unit="PRs"
          classification={classifications.prThroughput}
          tooltip="Merged PRs this month"
        />
      </div>
    </section>
  );
}
