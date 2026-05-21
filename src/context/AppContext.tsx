'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AIPlatform, PromptCategory } from '@/lib/ai-engine';
import {
  fetchHistory,
  savePrompt,
  toggleFavorite as toggleFav,
  type PromptHistoryItem,
} from '@/lib/api-client';

interface AppState {
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedPlatform: AIPlatform;
  setSelectedPlatform: (p: AIPlatform) => void;
  selectedCategory: PromptCategory;
  setSelectedCategory: (c: PromptCategory) => void;
  history: PromptHistoryItem[];
  addToHistory: (item: Omit<PromptHistoryItem, 'id' | 'createdAt' | 'isFavorite'>) => Promise<void>;
  toggleFavorite: (id: string, currentStatus: boolean) => Promise<void>;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  utilityPanelOpen: boolean;
  setUtilityPanelOpen: (open: boolean) => void;
  templateText: string;
  setTemplateText: (text: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function useApp(): AppState {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedPlatform, setSelectedPlatform] = useState<AIPlatform>('chatgpt');
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory>('content');
  const [history, setHistory] = useState<PromptHistoryItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [utilityPanelOpen, setUtilityPanelOpen] = useState(true);
  const [templateText, setTemplateText] = useState('');

  const loadHistory = useCallback(async () => {
    try {
      const data = await fetchHistory({ limit: 50 });
      setHistory(data.prompts);
    } catch (e) {
      console.error('Failed to fetch history', e);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const addToHistory = useCallback(
    async (item: Omit<PromptHistoryItem, 'id' | 'createdAt' | 'isFavorite'>) => {
      try {
        const saved = await savePrompt(item);
        setHistory((prev) => [saved, ...prev]);
      } catch (e) {
        console.error('Failed to save prompt', e);
      }
    },
    [],
  );

  const toggleFavorite = useCallback(async (id: string, currentStatus: boolean) => {
    try {
      // Optimistic update
      setHistory((prev) => prev.map(p => p.id === id ? { ...p, isFavorite: !currentStatus } : p));
      await toggleFav(id, !currentStatus);
    } catch (e) {
      console.error('Failed to toggle favorite', e);
      // Revert on failure
      setHistory((prev) => prev.map(p => p.id === id ? { ...p, isFavorite: currentStatus } : p));
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedPlatform,
        setSelectedPlatform,
        selectedCategory,
        setSelectedCategory,
        history,
        addToHistory,
        toggleFavorite,
        sidebarOpen,
        setSidebarOpen,
        utilityPanelOpen,
        setUtilityPanelOpen,
        templateText,
        setTemplateText,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppContext;
