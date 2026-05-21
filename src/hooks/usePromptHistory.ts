'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  fetchHistory,
  savePrompt,
  deletePrompt,
  fetchStats,
  type PromptHistoryItem,
  type StatsData,
} from '@/lib/api-client';

export function usePromptHistory() {
  const [history, setHistory] = useState<PromptHistoryItem[]>([]);
  const [stats, setStats] = useState<StatsData>({
    totalPrompts: 0,
    favoritePlatform: null,
    mostUsedCategory: null,
    dailyStreak: 0,
    promptsToday: 0,
    platformBreakdown: [],
    categoryBreakdown: [],
  });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [historyData, statsData] = await Promise.all([
        fetchHistory({ limit: 100 }),
        fetchStats()
      ]);
      setHistory(historyData.prompts);
      setStats(statsData);
    } catch (e) {
      console.error('Failed to fetch history or stats', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addToHistory = useCallback(
    async (item: Omit<PromptHistoryItem, 'id' | 'createdAt' | 'isFavorite'>) => {
      await savePrompt(item);
      await refresh();
    },
    [refresh],
  );

  const deleteItem = useCallback(
    async (id: string) => {
      // Optimistic update
      setHistory(prev => prev.filter(p => p.id !== id));
      await deletePrompt(id);
      await refresh(); // ensure stats are updated
    },
    [refresh],
  );

  const clearHistory = useCallback(async () => {
    // API doesn't support clear all yet, so we just reload for now
    await refresh();
  }, [refresh]);

  return { history, stats, addToHistory, deleteItem, clearHistory, refresh, loading };
}
