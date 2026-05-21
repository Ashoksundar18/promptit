'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import NeonButton from '@/components/ui/NeonButton';
import { ArrowRight, Sparkles } from 'lucide-react';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function Hero() {
  const scrollToAITools = () => {
    const section = document.getElementById('ai-tools');
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-mesh">
      {/* Floating decorative gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-accent-blue/[0.07] blur-[100px]"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            x: [0, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute -bottom-32 -left-32 w-[600px] h-[600px] rounded-full bg-accent-purple/[0.06] blur-[120px]"
        />
        <motion.div
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
          className="absolute top-1/3 right-1/4 w-[350px] h-[350px] rounded-full bg-accent-pink/[0.04] blur-[80px]"
        />
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium glass border border-accent-blue/20 text-accent-blue">
            <Sparkles className="w-4 h-4" />
            AI Prompt Engineering Hub
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tight leading-[1.1]"
        >
          <span className="gradient-blue-purple gradient-text">Prompt It</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="mt-6 text-xl md:text-2xl text-text-secondary font-medium tracking-wide"
        >
          Smarter Prompts. Better Results.
        </motion.p>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="mt-5 text-base md:text-lg text-text-muted max-w-2xl mx-auto leading-relaxed"
        >
          Your all-in-one AI prompt engineering platform. Generate, optimize, and
          manage prompts for ChatGPT, Claude, Gemini, Perplexity, Sora, and
          Copilot — all from a single, beautifully crafted interface.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/signup">
            <NeonButton variant="primary" size="lg">
              Get Started
              <ArrowRight className="w-5 h-5 ml-2 inline-block" />
            </NeonButton>
          </Link>
          <NeonButton variant="outline" size="lg" onClick={scrollToAITools}>
              Explore AI Tools
            </NeonButton>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={itemVariants}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-12"
        >
          {[
            { value: '6+', label: 'AI Platforms' },
            { value: '50+', label: 'Templates' },
            { value: '10k+', label: 'Prompts Generated' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-heading font-bold text-accent-blue">
                {stat.value}
              </div>
              <div className="text-sm text-text-muted mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent pointer-events-none" />
    </section>
  );
}
