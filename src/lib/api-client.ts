// ═══════════════════════════════════════════════
//  PROMPT IT — Database API Client
//  Client-side functions to call the API routes
//  Drop-in replacement for localStorage storage
// ═══════════════════════════════════════════════

import type { AIPlatform, PromptCategory } from './ai-engine';

// ─── Types (matching storage.ts for compatibility) ───

export interface PromptHistoryItem {
  id: string;
  userInput: string;
  optimizedPrompt: string;
  platform: AIPlatform;
  category: PromptCategory;
  qualityScore: number;
  isFavorite: boolean;
  createdAt: string;
}

export interface StatsData {
  totalPrompts: number;
  promptsToday: number;
  favoritePlatform: AIPlatform | null;
  mostUsedCategory: PromptCategory | null;
  dailyStreak: number;
  platformBreakdown: { platform: string; count: number }[];
  categoryBreakdown: { category: string; count: number }[];
}

// ─── API Calls ───

const API_BASE = '/api';

/**
 * Fetch prompt history with optional filters
 */
export async function fetchHistory(options?: {
  platform?: string;
  category?: string;
  favorites?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ prompts: PromptHistoryItem[]; total: number }> {
  const params = new URLSearchParams();

  if (options?.platform) params.set('platform', options.platform);
  if (options?.category) params.set('category', options.category);
  if (options?.favorites) params.set('favorites', 'true');
  if (options?.search) params.set('search', options.search);
  if (options?.limit) params.set('limit', String(options.limit));
  if (options?.offset) params.set('offset', String(options.offset));

  const res = await fetch(`${API_BASE}/prompts?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}

/**
 * Save a new prompt to the database
 */
export async function savePrompt(data: {
  userInput: string;
  optimizedPrompt: string;
  platform: AIPlatform;
  category: PromptCategory;
  qualityScore: number;
}): Promise<PromptHistoryItem> {
  const res = await fetch(`${API_BASE}/prompts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save prompt');
  return res.json();
}

/**
 * Toggle favorite status of a prompt
 */
export async function toggleFavorite(
  id: string,
  isFavorite: boolean
): Promise<PromptHistoryItem> {
  const res = await fetch(`${API_BASE}/prompts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isFavorite }),
  });
  if (!res.ok) throw new Error('Failed to toggle favorite');
  return res.json();
}

/**
 * Delete a prompt from history
 */
export async function deletePrompt(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/prompts/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete prompt');
}

/**
 * Fetch dashboard statistics
 */
export async function fetchStats(): Promise<StatsData> {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}
