'use client';

import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import {
  Zap,
  Layers,
  LayoutTemplate,
  History,
  Copy,
  FolderTree,
  type LucideIcon,
} from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
}

const features: Feature[] = [
  {
    title: 'AI-Optimized Prompts',
    description:
      'Generate prompts specifically optimized for each AI platform, maximizing output quality and relevance.',
    icon: Zap,
    accent: 'var(--accent-blue)',
  },
  {
    title: 'Multi-Platform Support',
    description:
      'One hub for ChatGPT, Claude, Gemini, Perplexity, Sora, and Copilot — switch seamlessly between platforms.',
    icon: Layers,
    accent: 'var(--accent-purple)',
  },
  {
    title: 'Smart Templates',
    description:
      'Pre-built templates across 5 categories to jumpstart your prompt engineering workflow instantly.',
    icon: LayoutTemplate,
    accent: 'var(--accent-pink)',
  },
  {
    title: 'Prompt History',
    description:
      'Track and revisit all your generated prompts. Never lose a great prompt again.',
    icon: History,
    accent: 'var(--accent-green)',
  },
  {
    title: 'One-Click Copy',
    description:
      'Copy optimized prompts to your clipboard instantly and paste them into any AI platform.',
    icon: Copy,
    accent: 'var(--accent-orange)',
  },
  {
    title: 'Category System',
    description:
      'Organize prompts with Study, Content, Developer, Business, and Creative modes for every use case.',
    icon: FolderTree,
    accent: 'var(--accent-teal)',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function Features() {
  return (
    <section className="relative py-24 md:py-32 px-6">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] rounded-full bg-accent-blue/[0.03] blur-[100px]" />
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] rounded-full bg-accent-pink/[0.03] blur-[100px]" />
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
          <h2 className="text-3xl md:text-5xl font-heading font-bold neon-text-blue">
            Everything You Need
          </h2>
          <p className="mt-4 text-text-secondary text-lg max-w-xl mx-auto">
            A complete toolkit for crafting perfect prompts across every AI
            platform.
          </p>
        </motion.div>

        {/* Feature cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} variants={cardVariants}>
                <GlassCard>
                  <div className="p-6">
                    {/* Icon */}
                    <div
                      className="w-11 h-11 rounded-lg flex items-center justify-center mb-4"
                      style={{
                        background: `color-mix(in srgb, ${feature.accent} 12%, transparent)`,
                        border: `1px solid color-mix(in srgb, ${feature.accent} 20%, transparent)`,
                      }}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{ color: feature.accent }}
                      />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {feature.description}
                    </p>
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
