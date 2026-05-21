'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import GlassCard from '@/components/ui/GlassCard';
import {
  MessageSquare,
  Brain,
  Sparkles,
  Search,
  Video,
  Code2,
  Rocket,
  ArrowRight,
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
    description: 'General prompts, coding, productivity, and education.',
    slug: 'chatgpt',
  },
  {
    name: 'Claude',
    accent: '#d97706',
    icon: Brain,
    description: 'Long-form writing, research, analysis, and documentation.',
    slug: 'claude',
  },
  {
    name: 'Gemini',
    accent: '#4285f4',
    icon: Sparkles,
    description: 'Google-integrated tasks, smart summaries, and search.',
    slug: 'gemini',
  },
  {
    name: 'Perplexity',
    accent: '#20b2aa',
    icon: Search,
    description: 'Research, real-time info, and web search assistance.',
    slug: 'perplexity',
  },
  {
    name: 'Sora',
    accent: '#ec4899',
    icon: Video,
    description: 'Cinematic video prompts and creative animation.',
    slug: 'sora',
  },
  {
    name: 'Copilot',
    accent: '#0078d4',
    icon: Code2,
    description: 'Code generation, debugging, and development.',
    slug: 'copilot',
  },
  {
    name: 'Antigravity',
    accent: '#8b5cf6',
    icon: Rocket,
    description: 'Agentic AI for complex multi-step tasks and planning.',
    slug: 'antigravity',
  },
];

export default function AICards() {
  return (
    <section className="py-20 px-6 bg-bg-secondary">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary">
            Supported Platforms
          </h2>
          <p className="mt-3 text-text-secondary max-w-lg mx-auto">
            Generate optimized prompts tailored for each platform.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {platforms.map((platform, i) => {
            const Icon = platform.icon;
            return (
              <motion.div
                key={platform.slug}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href="/signup">
                  <GlassCard className="hover:border-glass-border-hover hover:shadow-md transition-all cursor-pointer h-full">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${platform.accent}12` }}
                      >
                        <Icon size={20} style={{ color: platform.accent }} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-text-primary mb-1">
                          {platform.name}
                        </h3>
                        <p className="text-xs text-text-muted leading-relaxed">
                          {platform.description}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
