'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import NeonButton from '@/components/ui/NeonButton';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section className="relative py-24 md:py-32 px-6 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, var(--bg-secondary), var(--bg-primary))',
          }}
        />
        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-accent-blue/[0.06] blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] rounded-full bg-accent-purple/[0.04] blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        {/* Heading */}
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-text-primary leading-tight">
          Ready to Craft{' '}
          <span className="gradient-blue-purple gradient-text">
            Perfect Prompts?
          </span>
        </h2>

        {/* Subtext */}
        <p className="mt-6 text-lg md:text-xl text-text-secondary max-w-xl mx-auto">
          Join thousands of creators, developers, and professionals who are
          already supercharging their AI workflows.
        </p>

        {/* CTA Button */}
        <motion.div
          className="mt-10 inline-block"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link href="/signup">
            <NeonButton variant="primary" size="lg">
              <span className="animate-pulse-glow inline-flex items-center gap-2 rounded-full">
                Start Prompting
                <ArrowRight className="w-5 h-5" />
              </span>
            </NeonButton>
          </Link>
        </motion.div>

        {/* Trust badges */}
        <div className="mt-12 flex items-center justify-center gap-6 text-sm text-text-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent-green" />
            Free to start
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent-blue" />
            No credit card required
          </span>
          <span className="flex items-center gap-1.5 hidden sm:flex">
            <span className="w-2 h-2 rounded-full bg-accent-purple" />
            6 AI platforms
          </span>
        </div>
      </motion.div>
    </section>
  );
}
