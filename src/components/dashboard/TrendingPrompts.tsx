'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

const platformColors: Record<string, string> = {
  chatgpt: '#10a37f',
  claude: '#d97706',
  gemini: '#4285f4',
  perplexity: '#20b2aa',
  sora: '#ec4899',
  copilot: '#0078d4',
  antigravity: '#8b5cf6',
};

type TrendingPrompt = {
  id: string;
  title: string;
  prompt: string;
  platform: string;
  uses: number;
};

const trendingData: TrendingPrompt[] = [
  {
    id: 't1',
    title: 'Expert Code Reviewer',
    prompt: 'Act as a senior software engineer reviewing my code. Identify bugs, performance issues, security vulnerabilities, and suggest improvements with explanations.',
    platform: 'chatgpt',
    uses: 2847,
  },
  {
    id: 't2',
    title: 'Socratic Learning Tutor',
    prompt: 'Teach me about [topic] using the Socratic method. Ask me questions to guide my understanding rather than giving direct answers. Adapt difficulty based on my responses.',
    platform: 'claude',
    uses: 2103,
  },
  {
    id: 't3',
    title: 'Research Synthesis Engine',
    prompt: 'Search for the latest research on [topic]. Synthesize findings from multiple sources, compare viewpoints, and provide a structured summary with citations.',
    platform: 'perplexity',
    uses: 1956,
  },
  {
    id: 't4',
    title: 'Cinematic Scene Creator',
    prompt: 'Create a 15-second cinematic video: [scene description]. Use dramatic lighting, slow-motion effects, 4K quality. Camera starts wide then pushes in to a close-up.',
    platform: 'sora',
    uses: 1842,
  },
  {
    id: 't5',
    title: 'Multi-Model Analysis',
    prompt: 'Analyze [data/topic] from multiple perspectives: technical, business, ethical, and creative. Create a comprehensive report with an executive summary and action items.',
    platform: 'gemini',
    uses: 1705,
  },
  {
    id: 't6',
    title: 'Full-Stack Feature Builder',
    prompt: 'Build a complete [feature] with React frontend, Node.js backend, and database schema. Include error handling, tests, TypeScript types, and deployment config.',
    platform: 'copilot',
    uses: 1634,
  },
  {
    id: 't7',
    title: 'Brand Voice Generator',
    prompt: 'Create a comprehensive brand voice guide for [company type]. Include tone attributes, do/don\'t examples, sample copy for 5 channels, and emotional positioning.',
    platform: 'claude',
    uses: 1521,
  },
  {
    id: 't8',
    title: 'Data Pipeline Architect',
    prompt: 'Design a data pipeline for [use case]. Include architecture diagram description, tech stack recommendations, scaling strategy, monitoring, and cost optimization.',
    platform: 'chatgpt',
    uses: 1398,
  },
];

type TrendingPromptsProps = {
  onTryPrompt?: (prompt: string) => void;
  compact?: boolean;
  limit?: number;
};

export default function TrendingPrompts({
  onTryPrompt,
  compact = false,
  limit,
}: TrendingPromptsProps) {
  const displayed = limit ? trendingData.slice(0, limit) : trendingData;

  return (
    <div className="w-full">
      {!compact && (
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-accent-orange" />
          <h3 className="text-sm font-heading font-semibold text-text-primary uppercase tracking-wider">
            Trending Prompts
          </h3>
        </div>
      )}

      <div className="space-y-2">
        {displayed.map((item, index) => {
          const pColor = platformColors[item.platform] || '#00d4ff';

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {compact ? (
                <motion.button
                  onClick={() => onTryPrompt?.(item.prompt)}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-glass-bg-hover transition-colors cursor-pointer group"
                  whileHover={{ x: 3 }}
                >
                  <Sparkles size={12} style={{ color: pColor }} className="flex-shrink-0" />
                  <span className="text-xs text-text-secondary group-hover:text-text-primary transition-colors truncate flex-1">
                    {item.title}
                  </span>
                  <ArrowRight size={10} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </motion.button>
              ) : (
                <GlassCard className="hover:border-glass-border-hover transition-all duration-200 group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium text-text-primary truncate">
                          {item.title}
                        </h4>
                        <span
                          className="px-1.5 py-0.5 rounded text-[9px] font-medium flex-shrink-0"
                          style={{
                            backgroundColor: `${pColor}18`,
                            color: pColor,
                          }}
                        >
                          {item.platform}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted line-clamp-2 mb-2">
                        {item.prompt}
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-text-muted">
                          {item.uses.toLocaleString()} uses
                        </span>
                        <motion.button
                          onClick={() => onTryPrompt?.(item.prompt)}
                          className="text-[11px] text-accent-blue hover:text-accent-blue/80 font-medium cursor-pointer flex items-center gap-1"
                          whileHover={{ x: 2 }}
                        >
                          Try it <ArrowRight size={10} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
