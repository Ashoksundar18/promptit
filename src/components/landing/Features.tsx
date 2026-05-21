'use client';

import { motion } from 'framer-motion';
import {
  Zap,
  Layers,
  LayoutTemplate,
  History,
  Copy,
  FolderTree,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

const features: Feature[] = [
  {
    title: 'AI-Optimized Prompts',
    description: 'Prompts specifically tuned for each platform, maximizing output quality.',
    icon: Zap,
  },
  {
    title: 'Multi-Platform Support',
    description: 'One hub for 7 AI platforms — switch seamlessly between them.',
    icon: Layers,
  },
  {
    title: 'Smart Templates',
    description: 'Pre-built templates across 5 categories to jumpstart your workflow.',
    icon: LayoutTemplate,
  },
  {
    title: 'Prompt History',
    description: 'Track and revisit all your generated prompts in one place.',
    icon: History,
  },
  {
    title: 'One-Click Copy',
    description: 'Copy optimized prompts instantly and paste into any AI tool.',
    icon: Copy,
  },
  {
    title: 'Category System',
    description: 'Organize prompts by Study, Content, Developer, Business, or Creative.',
    icon: FolderTree,
  },
];

export default function Features() {
  return (
    <section className="py-20 px-6 bg-bg-primary">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary">
            Features
          </h2>
          <p className="mt-3 text-text-secondary max-w-lg mx-auto">
            Everything you need to create better AI prompts.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-2xl border border-glass-border bg-bg-elevated"
              >
                <div className="w-10 h-10 rounded-lg bg-accent-blue/10 flex items-center justify-center mb-3">
                  <Icon size={20} className="text-accent-blue" />
                </div>
                <h3 className="text-sm font-semibold text-text-primary mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
