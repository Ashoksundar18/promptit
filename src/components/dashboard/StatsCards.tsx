'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Star, FolderTree } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { fetchStats, type StatsData } from '@/lib/api-client';

type StatCardConfig = {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  getValue: (stats: StatsData) => string | number;
  isNumber?: boolean;
};

const statCards: StatCardConfig[] = [
  {
    id: 'total-prompts',
    label: 'Total Prompts Created',
    icon: Zap,
    color: '#00d4ff',
    getValue: (s) => s.totalPrompts,
    isNumber: true,
  },
  {
    id: 'favorite-platform',
    label: 'Favorite Platform',
    icon: Star,
    color: '#f59e0b',
    getValue: (s) => s.favoritePlatform || 'None yet',
  },
  {
    id: 'top-category',
    label: 'Most Used Category',
    icon: FolderTree,
    color: '#8b5cf6',
    getValue: (s) => s.mostUsedCategory || 'None yet',
  },
  {
    id: 'prompts-today',
    label: 'Prompts Today',
    icon: Zap,
    color: '#ec4899',
    getValue: (s) => s.promptsToday,
    isNumber: true,
  },
];

function AnimatedCounter({ value, color }: { value: number; color: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (value === 0) return;
    const duration = 1200;
    const steps = 30;
    const stepTime = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += value / steps;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className="text-3xl font-heading font-bold" style={{ color }}>
      {count}
    </span>
  );
}

export default function StatsCards() {
  const [stats, setStats] = useState<StatsData>({
    totalPrompts: 0,
    favoritePlatform: null,
    mostUsedCategory: null,
    dailyStreak: 0,
    promptsToday: 0,
    platformBreakdown: [],
    categoryBreakdown: [],
  });

  useEffect(() => {
    fetchStats().then(setStats).catch(console.error);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        const value = card.getValue(stats);

        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4, ease: 'easeOut' }}
          >
            <GlassCard className="relative overflow-hidden group hover:border-glass-border-hover transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs text-text-muted mb-2 uppercase tracking-wider font-medium">
                    {card.label}
                  </p>
                  {card.isNumber ? (
                    <AnimatedCounter
                      value={typeof value === 'number' ? value : 0}
                      color={card.color}
                    />
                  ) : (
                    <span
                      className="text-xl font-heading font-bold capitalize"
                      style={{ color: card.color }}
                    >
                      {value}
                    </span>
                  )}
                </div>
                <div
                  className="p-2.5 rounded-xl flex-shrink-0"
                  style={{
                    backgroundColor: `${card.color}12`,
                  }}
                >
                  <Icon
                    size={22}
                    style={{ color: card.color }}
                    className="drop-shadow-sm"
                  />
                </div>
              </div>

              {/* Subtle glow accent */}
              <div
                className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-500 pointer-events-none"
                style={{ backgroundColor: card.color }}
              />
            </GlassCard>
          </motion.div>
        );
      })}
    </div>
  );
}
