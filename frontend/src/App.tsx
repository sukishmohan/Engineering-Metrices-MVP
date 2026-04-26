/**
 * src/App.tsx
 */

import { useState } from 'react';
import ICProfileView from './pages/ICProfileView';
import './App.css';

export default function App() {
  const [selectedDeveloperId, setSelectedDeveloperId] = useState('dev-001');

  return (
    <div className="app">
      <header className="app-header">
        <h1>Engineering Metrics Profile</h1>
        <p className="subtitle">Understand your metrics, improve your work</p>
      </header>

      <main className="app-main">
        <div className="developer-selector">
          <label htmlFor="dev-select">View profile for:</label>
          <select
            id="dev-select"
            value={selectedDeveloperId}
            onChange={(e) => setSelectedDeveloperId(e.target.value)}
          >
            <option value="dev-001">Alice Johnson (Platform)</option>
            <option value="dev-002">Bob Chen (Mobile)</option>
            <option value="dev-003">Carol Davis (Platform, Junior)</option>
          </select>
        </div>

        <ICProfileView developerId={selectedDeveloperId} month="2026-04" />
      </main>

      <footer className="app-footer">
        <p>Metrics for April 2026 | Internal Use</p>
      </footer>
    </div>
  );
}
