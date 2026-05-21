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
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          const isSelected = selectedPlatform === platform.id;

          return (
            <motion.button
              key={platform.id}
              onClick={() => setSelectedPlatform(platform.id)}
              className={`
                relative flex items-center gap-2.5 px-4 py-3 rounded-xl
                border transition-colors duration-200 cursor-pointer
                flex-shrink-0 min-w-[140px]
                ${isSelected
                  ? 'bg-[rgba(255,255,255,0.06)] border-transparent'
                  : 'glass hover:bg-glass-bg-hover hover:border-glass-border-hover'
                }
              `}
              style={isSelected ? {
                borderColor: `${platform.color}60`,
                boxShadow: `0 0 12px ${platform.color}30, 0 0 30px ${platform.color}10, inset 0 0 8px ${platform.color}08`,
                background: `linear-gradient(135deg, ${platform.color}12, ${platform.color}06)`,
              } : {}}
              whileHover={{ scale: isSelected ? 1.0 : 1.03 }}
              whileTap={{ scale: 0.97 }}
              layout
            >
              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  layoutId="ai-platform-indicator"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    border: `1px solid ${platform.color}50`,
                    boxShadow: `0 0 15px ${platform.color}25`,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <div
                className="p-1.5 rounded-lg flex-shrink-0"
                style={{
                  backgroundColor: `${platform.color}18`,
                }}
              >
                <Icon
                  size={18}
                  style={{ color: isSelected ? platform.color : undefined }}
                  className={!isSelected ? 'text-text-secondary' : ''}
                />
              </div>

              <span
                className={`text-sm font-medium whitespace-nowrap ${isSelected ? 'text-text-primary' : 'text-text-secondary'}`}
                style={isSelected ? { color: platform.color } : {}}
              >
                {platform.name}
              </span>

              {/* Active dot */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-1.5 h-1.5 rounded-full ml-auto flex-shrink-0"
                  style={{ backgroundColor: platform.color, boxShadow: `0 0 6px ${platform.color}` }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
