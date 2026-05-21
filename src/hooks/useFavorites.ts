'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  fetchHistory,
  toggleFavorite as toggleFav,
  type PromptHistoryItem,
} from '@/lib/api-client';

export function useFavorites() {
  const [favorites, setFavorites] = useState<PromptHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchHistory({ favorites: true, limit: 100 });
      setFavorites(data.prompts);
    } catch (e) {
      console.error('Failed to fetch favorites', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggleFavorite = useCallback(
    async (id: string, currentStatus: boolean) => {
      // Optimistic update
      if (currentStatus) {
        setFavorites(prev => prev.filter(f => f.id !== id));
      }
      
      try {
        await toggleFav(id, !currentStatus);
        // Refresh to ensure we have the full favorite item if we added it
        if (!currentStatus) {
          await refresh();
        }
      } catch (e) {
        console.error('Failed to toggle favorite', e);
        await refresh(); // revert on failure
      }
    },
    [refresh],
  );

  const isFavorite = useCallback(
    (id: string) => {
      return favorites.some((f) => f.id === id);
    },
    [favorites],
  );

  return { favorites, toggleFavorite, isFavorite, refresh, loading };
}
