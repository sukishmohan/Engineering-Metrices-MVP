/**
 * src/api/client.ts
 * 
 * Centralized API calls. Single source of truth for backend communication.
 */

import type { ICProfile } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function fetchICProfile(
  developerId: string,
  month: string
): Promise<ICProfile> {
  const url = `${API_BASE}/ic/${developerId}/profile?month=${month}`;

  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch profile');
  }

  return response.json();
}
