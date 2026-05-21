'use client';

import { motion } from 'framer-motion';
import {
  MessageSquare,
  Brain,
  Sparkles,
  Search,
  Video,
  Code2,
  Rocket,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { AIPlatform } from '@/lib/ai-engine';

type PlatformConfig = {
  id: AIPlatform;
  name: string;
  icon: React.ElementType;
  color: string;
};

const platforms: PlatformConfig[] = [
  { id: 'chatgpt', name: 'ChatGPT', icon: MessageSquare, color: '#10a37f' },
  { id: 'claude', name: 'Claude', icon: Brain, color: '#d97706' },
  { id: 'gemini', name: 'Gemini', icon: Sparkles, color: '#4285f4' },
  { id: 'perplexity', name: 'Perplexity', icon: Search, color: '#20b2aa' },
  { id: 'sora', name: 'Sora', icon: Video, color: '#ec4899' },
  { id: 'copilot', name: 'Copilot', icon: Code2, color: '#0078d4' },
  { id: 'antigravity', name: 'Antigravity', icon: Rocket, color: '#8b5cf6' },
];

export default function AISelector() {
  const { selectedPlatform, setSelectedPlatform } = useApp();

  return (
    <div className="w-full">
      <h3 className="text-sm font-medium text-text-secondary mb-3 font-heading uppercase tracking-wider">
        Select AI Platform
      </h3>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          const isSelected = selectedPlatform === platform.id;

          return (
            <motion.button
              key={platform.id}
              onClick={() => setSelectedPlatform(platform.id)}
              className={`
                flex items-center gap-2 px-3 py-2.5 rounded-xl
                border transition-all duration-200 cursor-pointer
                flex-shrink-0 text-sm
                ${isSelected
                  ? 'border-transparent font-medium'
                  : 'border-glass-border bg-bg-elevated hover:border-glass-border-hover'
                }
              `}
              style={isSelected ? {
                backgroundColor: `${platform.color}12`,
                borderColor: `${platform.color}30`,
                color: platform.color,
              } : {}}
              whileTap={{ scale: 0.97 }}
            >
              <Icon
                size={16}
                style={isSelected ? { color: platform.color } : undefined}
                className={!isSelected ? 'text-text-muted' : ''}
              />
              <span className={!isSelected ? 'text-text-secondary' : ''}>
                {platform.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
