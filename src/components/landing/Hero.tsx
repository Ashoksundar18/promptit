'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import NeonButton from '@/components/ui/NeonButton';
import { ArrowRight } from 'lucide-react';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export default function Hero() {
  const scrollToAITools = () => {
    const section = document.getElementById('ai-tools');
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-bg-primary">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-3xl mx-auto px-6 text-center"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
            AI Prompt Engineering Hub
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight leading-[1.1] text-text-primary"
        >
          Prompt It
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="mt-4 text-xl md:text-2xl text-text-secondary font-medium"
        >
          Smarter Prompts. Better Results.
        </motion.p>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="mt-4 text-base text-text-muted max-w-xl mx-auto leading-relaxed"
        >
          Generate optimized prompts for ChatGPT, Claude, Gemini, Perplexity,
          Sora, Copilot, and Antigravity — all from one clean interface.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link href="/signup">
            <NeonButton variant="primary" size="lg">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2 inline-block" />
            </NeonButton>
          </Link>
          <NeonButton variant="outline" size="lg" onClick={scrollToAITools}>
            Explore Platforms
          </NeonButton>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={itemVariants}
          className="mt-14 flex flex-wrap items-center justify-center gap-8"
        >
          {[
            { value: '7', label: 'AI Platforms' },
            { value: '50+', label: 'Templates' },
            { value: '10k+', label: 'Prompts Generated' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-heading font-bold text-text-primary">
                {stat.value}
              </div>
              <div className="text-sm text-text-muted mt-0.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
