'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Trash2,
  Heart,
  ChevronDown,
  ChevronUp,
  Clock,
  AlertTriangle,
  MessageSquare,
  Brain,
  Sparkles,
  Video,
  Code2,
  X,
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import NeonButton from '@/components/ui/NeonButton';
import { useApp } from '@/context/AppContext';

const platformIcons: Record<string, React.ElementType> = {
  chatgpt: MessageSquare,
  claude: Brain,
  gemini: Sparkles,
  perplexity: Search,
  sora: Video,
  copilot: Code2,
};

const platformColors: Record<string, string> = {
  chatgpt: '#10a37f',
  claude: '#d97706',
  gemini: '#4285f4',
  perplexity: '#20b2aa',
  sora: '#ec4899',
  copilot: '#0078d4',
};

const filterTabs = [
  { id: 'all', label: 'All' },
  { id: 'chatgpt', label: 'ChatGPT' },
  { id: 'claude', label: 'Claude' },
  { id: 'gemini', label: 'Gemini' },
  { id: 'perplexity', label: 'Perplexity' },
  { id: 'sora', label: 'Sora' },
  { id: 'copilot', label: 'Copilot' },
];

export default function SearchHistory({ favoritesOnly = false }: { favoritesOnly?: boolean }) {
  const { history, toggleFavorite } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredHistory = useMemo(() => {
    let items = history;

    if (favoritesOnly) {
      items = items.filter((item) => item.isFavorite);
    }

    if (activeFilter !== 'all') {
      items = items.filter((item) => item.platform === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.userInput.toLowerCase().includes(q) ||
          item.optimizedPrompt.toLowerCase().includes(q)
      );
    }

    return items;
  }, [history, activeFilter, searchQuery]);

  const formatTime = (timestamp: string | number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="w-full space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search your prompt history..."
          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[rgba(255,255,255,0.03)] border border-glass-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue/40 focus:shadow-[0_0_12px_rgba(0,212,255,0.1)] transition-all duration-200"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary cursor-pointer"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          const color = tab.id !== 'all' ? platformColors[tab.id] : '#00d4ff';

          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex-shrink-0
                ${isActive
                  ? 'text-white'
                  : 'glass text-text-secondary hover:text-text-primary hover:bg-glass-bg-hover'
                }
              `}
              style={
                isActive
                  ? {
                      backgroundColor: `${color}cc`,
                      boxShadow: `0 0 10px ${color}30`,
                    }
                  : {}
              }
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {tab.label}
            </motion.button>
          );
        })}
      </div>

      {/* History List */}
      {filteredHistory.length > 0 ? (
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {filteredHistory.map((item, index) => {
              const PlatformIcon = platformIcons[item.platform] || MessageSquare;
              const pColor = platformColors[item.platform] || '#00d4ff';
              const isExpanded = expandedId === item.id;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.03 }}
                  layout
                >
                  <GlassCard className="p-3 hover:border-glass-border-hover transition-all duration-200">
                    <div className="flex items-start gap-3">
                      {/* Platform Icon */}
                      <div
                        className="p-1.5 rounded-lg flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: `${pColor}15` }}
                      >
                        <PlatformIcon size={14} style={{ color: pColor }} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          className="w-full text-left cursor-pointer"
                        >
                          <p className={`text-sm text-text-primary ${isExpanded ? '' : 'truncate'}`}>
                            {item.userInput}
                          </p>
                        </button>

                        <div className="flex items-center gap-2 mt-1">
                          <Clock size={10} className="text-text-muted" />
                          <span className="text-[10px] text-text-muted">
                            {formatTime(item.createdAt)}
                          </span>
                        </div>

                        {/* Expanded view */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-3 pt-3 border-t border-glass-border">
                                <p className="text-xs text-text-muted mb-1 font-medium">
                                  Optimized Output:
                                </p>
                                <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-wrap">
                                  {item.optimizedPrompt}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <motion.button
                          onClick={() => toggleFavorite(item.id, item.isFavorite)}
                          className="p-1.5 rounded-lg hover:bg-glass-bg-hover transition-colors cursor-pointer"
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Heart
                            size={13}
                            className={
                              item.isFavorite
                                ? 'fill-accent-pink text-accent-pink'
                                : 'text-text-muted hover:text-accent-pink'
                            }
                          />
                        </motion.button>

                        <button
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          className="p-1.5 rounded-lg hover:bg-glass-bg-hover text-text-muted transition-colors cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <GlassCard className="text-center py-10">
          <Clock size={36} className="text-text-muted mx-auto mb-3 opacity-40" />
          <h4 className="text-sm font-heading font-medium text-text-secondary mb-1">
            {searchQuery ? 'No matching prompts found' : 'No history yet'}
          </h4>
          <p className="text-xs text-text-muted">
            {searchQuery
              ? 'Try adjusting your search terms or filters.'
              : 'Start generating prompts and they\'ll appear here.'}
          </p>
        </GlassCard>
      )}

      {/* Clear All */}
      {filteredHistory.length > 0 && (
        <div className="pt-2">
          {showClearConfirm ? (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-[rgba(239,68,68,0.08)] border border-red-500/20"
            >
              <AlertTriangle size={16} className="text-red-400 flex-shrink-0" />
              <p className="text-xs text-red-300 flex-1">
                Clear all history? This cannot be undone.
              </p>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-3 py-1 rounded-lg glass text-xs text-text-secondary hover:text-text-primary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-3 py-1 rounded-lg bg-red-500/20 text-xs text-red-400 hover:bg-red-500/30 cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.button
              onClick={() => setShowClearConfirm(true)}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg glass text-xs text-text-muted hover:text-red-400 hover:border-red-500/20 transition-all cursor-pointer"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Trash2 size={12} />
              Clear All History
            </motion.button>
          )}
        </div>
      )}
    </div>
  );
}
