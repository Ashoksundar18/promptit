'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  Check,
  Heart,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Sparkles,
  Eye,
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import type { GeneratedPrompt } from '@/lib/ai-engine';

const platformBadges: Record<string, { name: string; color: string }> = {
  chatgpt: { name: 'ChatGPT', color: '#10a37f' },
  claude: { name: 'Claude', color: '#d97706' },
  gemini: { name: 'Gemini', color: '#4285f4' },
  perplexity: { name: 'Perplexity', color: '#20b2aa' },
  sora: { name: 'Sora', color: '#ec4899' },
  copilot: { name: 'Copilot', color: '#0078d4' },
  antigravity: { name: 'Antigravity', color: '#8b5cf6' },
};

type PromptOutputProps = {
  result: GeneratedPrompt | null;
  platform: string;
  onRegenerate: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
};

export default function PromptOutput({
  result,
  platform,
  onRegenerate,
  isFavorite = false,
  onToggleFavorite,
}: PromptOutputProps) {
  const [copied, setCopied] = useState(false);
  const [tipsOpen, setTipsOpen] = useState(false);
  const [exampleOpen, setExampleOpen] = useState(false);

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.optimizedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = result.optimizedPrompt;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const badge = platformBadges[platform];

  const qualityColor =
    (result?.qualityScore ?? 0) >= 80
      ? '#10b981'
      : (result?.qualityScore ?? 0) >= 60
        ? '#f59e0b'
        : '#ef4444';

  return (
    <AnimatePresence mode="wait">
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <GlassCard className="relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-accent-blue" />
                <h3 className="text-lg font-heading font-semibold text-text-primary">
                  Optimized Prompt
                </h3>
              </div>
              {badge && (
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-medium border"
                  style={{
                    backgroundColor: `${badge.color}15`,
                    borderColor: `${badge.color}30`,
                    color: badge.color,
                  }}
                >
                  {badge.name}
                </span>
              )}
            </div>

            {/* Prompt Content */}
            <div className="rounded-xl bg-bg-tertiary border border-glass-border p-4 mb-4">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed text-text-primary font-sans break-words">
                {result.optimizedPrompt}
              </pre>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <motion.button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-tertiary border border-glass-border text-sm text-text-secondary hover:text-accent-blue hover:border-accent-blue/30 transition-all cursor-pointer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-accent-green" />
                    <span className="text-accent-green">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy</span>
                  </>
                )}
              </motion.button>

              <motion.button
                onClick={onToggleFavorite}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-tertiary border border-glass-border text-sm transition-all cursor-pointer ${
                  isFavorite
                    ? 'text-accent-pink border-accent-pink/30'
                    : 'text-text-secondary hover:text-accent-pink hover:border-accent-pink/30'
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Heart
                  size={14}
                  className={isFavorite ? 'fill-accent-pink' : ''}
                />
                <span>{isFavorite ? 'Saved' : 'Save'}</span>
              </motion.button>

              <motion.button
                onClick={onRegenerate}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-tertiary border border-glass-border text-sm text-text-secondary hover:text-accent-purple hover:border-accent-purple/30 transition-all cursor-pointer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <RefreshCw size={14} />
                <span>Regenerate</span>
              </motion.button>
            </div>

            {/* Quality Indicator */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-text-secondary font-medium">
                  Prompt Quality
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: qualityColor }}
                >
                  {result.qualityScore}/100
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-bg-tertiary overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: qualityColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${result.qualityScore}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                />
              </div>
            </div>

            {/* Example Output Preview */}
            {result.exampleOutput && (
              <div className="mb-4">
                <motion.button
                  onClick={() => setExampleOpen(!exampleOpen)}
                  className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent-blue transition-colors cursor-pointer w-full"
                  whileTap={{ scale: 0.98 }}
                >
                  <Eye size={14} />
                  <span className="font-medium">
                    Example Output Preview
                  </span>
                  {exampleOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </motion.button>

                <AnimatePresence>
                  {exampleOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-3 overflow-hidden"
                    >
                      <div className="rounded-xl bg-bg-tertiary border border-glass-border p-4">
                        <p className="text-[10px] uppercase tracking-wider text-text-muted mb-2 font-medium">
                          What the AI might respond with:
                        </p>
                        <pre className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary font-sans break-words">
                          {result.exampleOutput}
                        </pre>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Tips Section */}
            {result.tips && result.tips.length > 0 && (
              <div>
                <motion.button
                  onClick={() => setTipsOpen(!tipsOpen)}
                  className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent-blue transition-colors cursor-pointer w-full"
                  whileTap={{ scale: 0.98 }}
                >
                  <Lightbulb size={14} />
                  <span className="font-medium">
                    Tips ({result.tips.length})
                  </span>
                  {tipsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </motion.button>

                <AnimatePresence>
                  {tipsOpen && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-2 space-y-1 overflow-hidden"
                    >
                      {result.tips.map((tip, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="text-xs text-text-muted pl-4 py-1 border-l-2 border-accent-blue/20"
                        >
                          {tip}
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            )}
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
