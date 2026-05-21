'use client';

import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import {
  MessageSquare,
  Brain,
  Sparkles,
  Search,
  Video,
  Code2,
  type LucideIcon,
} from 'lucide-react';

interface PlatformCard {
  name: string;
  accent: string;
  icon: LucideIcon;
  description: string;
  slug: string;
}

const platforms: PlatformCard[] = [
  {
    name: 'ChatGPT',
    accent: '#10a37f',
    icon: MessageSquare,
    description:
      'General prompts, coding, productivity, and education. The most versatile AI assistant.',
    slug: 'chatgpt',
  },
  {
    name: 'Claude',
    accent: '#d97706',
    icon: Brain,
    description:
      'Long-form writing, research, analysis, and detailed documentation generation.',
    slug: 'claude',
  },
  {
    name: 'Gemini',
    accent: '#4285f4',
    icon: Sparkles,
    description:
      'Google-integrated tasks, smart summaries, and enhanced search experiences.',
    slug: 'gemini',
  },
  {
    name: 'Perplexity',
    accent: '#20b2aa',
    icon: Search,
    description:
      'Research, real-time information retrieval, and web search assistance.',
    slug: 'perplexity',
  },
  {
    name: 'Sora',
    accent: '#ec4899',
    icon: Video,
    description:
      'Cinematic video prompts, scene generation, and creative animation workflows.',
    slug: 'sora',
  },
  {
    name: 'Copilot',
    accent: '#0078d4',
    icon: Code2,
    description:
      'Code generation, debugging, and software development acceleration.',
    slug: 'copilot',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function AICards() {
  return (
    <section className="relative py-24 md:py-32 px-6">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-accent-purple/[0.04] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-heading font-bold">
            <span className="gradient-blue-purple gradient-text">
              Powered by Leading AI
            </span>
          </h2>
          <p className="mt-4 text-text-secondary text-lg max-w-xl mx-auto">
            Generate optimized prompts tailored for each platform&apos;s unique
            strengths and capabilities.
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {platforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <motion.div key={platform.slug} variants={cardVariants}>
                <GlassCard hover glow="blue">
                  <div className="p-6 flex flex-col h-full group">
                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-shadow duration-300"
                      style={{
                        background: `${platform.accent}15`,
                        border: `1px solid ${platform.accent}30`,
                      }}
                    >
                      <Icon
                        className="w-6 h-6 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_var(--glow)]"
                        style={
                          {
                            color: platform.accent,
                            '--glow': platform.accent,
                          } as React.CSSProperties
                        }
                      />
                    </div>

                    {/* Platform name */}
                    <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">
                      {platform.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-1">
                      {platform.description}
                    </p>

                    {/* Try Now link */}
                    <div className="mt-auto">
                      <span
                        className="inline-flex items-center text-sm font-medium transition-colors duration-200 cursor-pointer group-hover:translate-x-1 transform transition-transform"
                        style={{ color: platform.accent }}
                      >
                        Try Now
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
