'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Wand2 } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import NeonButton from '@/components/ui/NeonButton';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useApp } from '@/context/AppContext';
import {
  generateOptimizedPrompt,
  type GeneratedPrompt,
} from '@/lib/ai-engine';

const platformNames: Record<string, string> = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  gemini: 'Gemini',
  perplexity: 'Perplexity',
  sora: 'Sora',
  copilot: 'Copilot',
};

const platformColors: Record<string, string> = {
  chatgpt: '#10a37f',
  claude: '#d97706',
  gemini: '#4285f4',
  perplexity: '#20b2aa',
  sora: '#ec4899',
  copilot: '#0078d4',
};

type PromptGeneratorProps = {
  onGenerated: (prompt: GeneratedPrompt) => void;
  inputValue: string;
  onInputChange: (value: string) => void;
};

export default function PromptGenerator({
  onGenerated,
  inputValue,
  onInputChange,
}: PromptGeneratorProps) {
  const { selectedPlatform, selectedCategory, addToHistory } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);

  const maxChars = 2000;

  const handleGenerate = useCallback(async () => {
    if (!inputValue.trim() || isGenerating) return;

    setIsGenerating(true);

    // Simulate processing delay for effect
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const result = generateOptimizedPrompt(
      inputValue,
      selectedPlatform,
      selectedCategory
    );

    addToHistory({
      userInput: inputValue,
      optimizedPrompt: result.optimizedPrompt,
      platform: selectedPlatform,
      category: selectedCategory,
      isFavorite: false,
    });

    onGenerated(result);
    setIsGenerating(false);
  }, [inputValue, selectedPlatform, selectedCategory, isGenerating, addToHistory, onGenerated]);

  const platformColor = platformColors[selectedPlatform] || '#00d4ff';

  return (
    <GlassCard className="relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Wand2 size={20} style={{ color: platformColor }} />
        <h3 className="text-lg font-heading font-semibold text-text-primary">
          Generate Prompt for{' '}
          <span style={{ color: platformColor }}>
            {platformNames[selectedPlatform] || 'AI'}
          </span>
        </h3>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value.slice(0, maxChars))}
          placeholder="Describe what you need... e.g., 'Write a blog post about quantum computing for beginners'"
          rows={5}
          className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-glass-border text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-accent-blue/40 focus:shadow-[0_0_12px_rgba(0,212,255,0.15)] transition-all duration-300 text-sm leading-relaxed"
        />

        {/* Character count */}
        <div className="flex justify-end mt-1.5">
          <span
            className={`text-xs ${
              inputValue.length > maxChars * 0.9
                ? 'text-accent-pink'
                : 'text-text-muted'
            }`}
          >
            {inputValue.length}/{maxChars}
          </span>
        </div>
      </div>

      {/* Generate Button */}
      <div className="mt-4">
        <motion.div whileTap={{ scale: 0.97 }}>
          <NeonButton
            onClick={handleGenerate}
            disabled={!inputValue.trim() || isGenerating}
            size="lg"
            className="w-full"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" />
                Optimizing Prompt...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Wand2 size={18} />
                Generate Optimized Prompt
              </span>
            )}
          </NeonButton>
        </motion.div>
      </div>

      {/* Subtle background glow */}
      <div
        className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full opacity-[0.03] blur-3xl pointer-events-none"
        style={{ backgroundColor: platformColor }}
      />
    </GlassCard>
  );
}
