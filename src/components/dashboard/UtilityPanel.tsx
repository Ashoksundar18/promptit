'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Lightbulb,
  TrendingUp,
  Clock,
  MessageSquare,
  Brain,
  Sparkles,
  Search,
  Video,
  Code2,
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { useApp } from '@/context/AppContext';
import TrendingPrompts from './TrendingPrompts';

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

type PlatformTips = Record<string, string[]>;

const platformTips: PlatformTips = {
  chatgpt: [
    'Use role-based prompts: "Act as a..."',
    'Break complex tasks into numbered steps',
    'Specify output format (JSON, markdown, table)',
    'Use system-level instructions for consistency',
  ],
  claude: [
    'Leverage Claude\'s long context with detailed instructions',
    'Use XML tags to structure your prompts',
    'Ask Claude to think step-by-step',
    'Provide examples for few-shot learning',
  ],
  gemini: [
    'Combine text + image analysis for multimodal tasks',
    'Use structured output schemas',
    'Specify language/region for localized results',
    'Request multiple perspectives in analysis',
  ],
  perplexity: [
    'Frame queries as research questions',
    'Ask for source citations explicitly',
    'Compare multiple viewpoints in queries',
    'Use follow-up questions to drill deeper',
  ],
  sora: [
    'Describe camera angles and movements precisely',
    'Specify lighting conditions and mood',
    'Include temporal details (slow-motion, time-lapse)',
    'Reference cinematic styles or directors',
  ],
  copilot: [
    'Provide function signatures and type hints',
    'Describe edge cases and error handling needs',
    'Reference specific frameworks or libraries',
    'Include test requirements in your prompt',
  ],
};

type Section = 'tips' | 'trending' | 'activity';

export default function UtilityPanel() {
  const { selectedPlatform, history } = useApp();
  const [openSections, setOpenSections] = useState<Record<Section, boolean>>({
    tips: true,
    trending: true,
    activity: true,
  });

  const toggleSection = (section: Section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const tips = platformTips[selectedPlatform] || platformTips.chatgpt;
  const recentHistory = history.slice(0, 5);

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  const SectionHeader = ({
    icon: Icon,
    title,
    section,
    color,
  }: {
    icon: React.ElementType;
    title: string;
    section: Section;
    color: string;
  }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-3 cursor-pointer group"
    >
      <div className="flex items-center gap-2">
        <Icon size={14} style={{ color }} />
        <span className="text-xs font-heading font-semibold text-text-primary uppercase tracking-wider">
          {title}
        </span>
      </div>
      <motion.div
        animate={{ rotate: openSections[section] ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <ChevronDown size={14} className="text-text-muted group-hover:text-text-secondary" />
      </motion.div>
    </button>
  );

  return (
    <div className="h-full glass-panel overflow-y-auto p-4 space-y-4">
      {/* Prompt Tips */}
      <GlassCard className="p-0 overflow-hidden">
        <SectionHeader
          icon={Lightbulb}
          title="Prompt Tips"
          section="tips"
          color="#f59e0b"
        />
        <AnimatePresence initial={false}>
          {openSections.tips && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-3 space-y-1.5">
                {tips.map((tip, i) => (
                  <motion.div
                    key={`${selectedPlatform}-${i}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-2 p-2 rounded-lg hover:bg-glass-bg-hover transition-colors"
                  >
                    <div className="w-1 h-1 rounded-full bg-accent-orange mt-1.5 flex-shrink-0" />
                    <span className="text-xs text-text-secondary leading-relaxed">
                      {tip}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>

      {/* Trending Prompts */}
      <GlassCard className="p-0 overflow-hidden">
        <SectionHeader
          icon={TrendingUp}
          title="Trending Prompts"
          section="trending"
          color="#00d4ff"
        />
        <AnimatePresence initial={false}>
          {openSections.trending && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-1 pb-2">
                <TrendingPrompts compact limit={5} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>

      {/* Recent Activity */}
      <GlassCard className="p-0 overflow-hidden">
        <SectionHeader
          icon={Clock}
          title="Recent Activity"
          section="activity"
          color="#8b5cf6"
        />
        <AnimatePresence initial={false}>
          {openSections.activity && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-3 space-y-1">
                {recentHistory.length > 0 ? (
                  recentHistory.map((item, i) => {
                    const PlatformIcon =
                      platformIcons[item.platform] || MessageSquare;
                    const pColor = platformColors[item.platform] || '#00d4ff';

                    return (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-glass-bg-hover transition-colors cursor-pointer text-left group"
                        whileHover={{ x: 2 }}
                      >
                        <PlatformIcon
                          size={12}
                          style={{ color: pColor }}
                          className="flex-shrink-0"
                        />
                        <span className="text-xs text-text-secondary truncate flex-1 group-hover:text-text-primary transition-colors">
                          {item.userInput}
                        </span>
                        <span className="text-[9px] text-text-muted flex-shrink-0">
                          {formatTime(item.timestamp)}
                        </span>
                      </motion.button>
                    );
                  })
                ) : (
                  <p className="text-xs text-text-muted text-center py-4">
                    No recent activity
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </div>
  );
}
