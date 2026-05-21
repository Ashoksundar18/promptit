'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import AISelector from '@/components/dashboard/AISelector';
import CategorySelector from '@/components/dashboard/CategorySelector';
import PromptGenerator from '@/components/dashboard/PromptGenerator';
import PromptOutput from '@/components/dashboard/PromptOutput';
import TemplateGrid from '@/components/dashboard/TemplateGrid';
import StatsCards from '@/components/dashboard/StatsCards';
import type { GeneratedPrompt } from '@/lib/ai-engine';

import SearchHistory from '@/components/dashboard/SearchHistory';
import GlassCard from '@/components/ui/GlassCard';

export default function DashboardPage() {
  const { selectedPlatform, currentView } = useApp();
  const [generatedPrompt, setGeneratedPrompt] = useState<GeneratedPrompt | null>(null);
  const [promptInput, setPromptInput] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  const handleGenerated = useCallback((result: GeneratedPrompt) => {
    setGeneratedPrompt(result);
    setIsFavorite(false);
  }, []);

  const handleRegenerate = useCallback(() => {
    setGeneratedPrompt(null);
  }, []);

  const handleUseTemplate = useCallback((template: string) => {
    setPromptInput(template);
    setGeneratedPrompt(null);
    document.getElementById('prompt-generator')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, []);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const renderDashboard = () => (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-text-primary">
          Welcome back{' '}
          <span className="gradient-blue-purple gradient-text">✦</span>
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <Calendar size={14} className="text-text-muted" />
          <p className="text-sm text-text-muted">{today}</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <StatsCards />
      </motion.div>

      {/* AI Platform Selector */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <AISelector />
      </motion.div>

      {/* Category Selector */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
      >
        <CategorySelector />
      </motion.div>

      {/* Prompt Generator */}
      <motion.div
        id="prompt-generator"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <PromptGenerator
          onGenerated={handleGenerated}
          inputValue={promptInput}
          onInputChange={setPromptInput}
        />
      </motion.div>

      {/* Prompt Output */}
      <PromptOutput
        result={generatedPrompt}
        platform={selectedPlatform}
        onRegenerate={handleRegenerate}
        isFavorite={isFavorite}
        onToggleFavorite={() => setIsFavorite(!isFavorite)}
      />
    </div>
  );

  return (
    <div className="w-full h-full">
      {currentView === 'dashboard' && renderDashboard()}
      
      {currentView === 'history' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl font-heading font-bold text-text-primary mb-6">Search History</h2>
          <SearchHistory />
        </div>
      )}

      {(currentView === 'ai-tools' || currentView === 'saved') && (
        <div className="max-w-6xl mx-auto space-y-6">
          <h2 className="text-2xl font-heading font-bold text-text-primary mb-6">
            {currentView === 'ai-tools' ? 'AI Tools & Templates' : 'Saved Templates'}
          </h2>
          <TemplateGrid onUseTemplate={handleUseTemplate} />
        </div>
      )}

      {currentView === 'favorites' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl font-heading font-bold text-text-primary mb-6">Favorites</h2>
          <SearchHistory favoritesOnly />
        </div>
      )}

      {(currentView === 'profile' || currentView === 'settings') && (
        <div className="max-w-3xl mx-auto flex items-center justify-center h-[60vh]">
          <GlassCard className="text-center py-16 px-8 max-w-md">
            <h3 className="text-2xl font-heading font-bold text-text-primary mb-2 capitalize">
              {currentView}
            </h3>
            <p className="text-sm text-text-muted mb-6">
              This feature is currently in development and will be available in Phase 2.
            </p>
            <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-accent-purple/10 border border-accent-purple/30">
              <span className="text-xs font-medium text-accent-purple">Coming Soon</span>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
