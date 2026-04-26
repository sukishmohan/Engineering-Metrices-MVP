/**
 * src/pages/ICProfileView.tsx
 * 
 * Main page component. Orchestrates data fetching and sub-component composition.
 */

import { useEffect, useState } from 'react';
import MetricsPanel from '../components/MetricsPanel';
import InterpretationPanel from '../components/InterpretationPanel';
import ActionPanel from '../components/ActionPanel';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { fetchICProfile } from '../api/client';
import type { ICProfile } from '../types';
import '../styles/ICProfileView.css';

interface ICProfileViewProps {
  developerId: string;
  month: string;
}

export default function ICProfileView({ developerId, month }: ICProfileViewProps) {
  const [profile, setProfile] = useState<ICProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchICProfile(developerId, month);
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [developerId, month]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!profile) {
    return <ErrorMessage message="No profile data available" />;
  }

  return (
    <div className="ic-profile-view">
      <div className="profile-header">
        <h2>{profile.developer.name}</h2>
        <p className="developer-meta">
          {profile.developer.team} Team · {profile.month}
        </p>
      </div>

      <MetricsPanel metrics={profile.metrics} classifications={profile.interpretation.classifications} />
      <InterpretationPanel interpretation={profile.interpretation} />
      <ActionPanel actions={profile.interpretation.actions} />
    </div>
  );
}
