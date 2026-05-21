'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import NeonButton from '@/components/ui/NeonButton';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-20 px-6 bg-bg-secondary">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto text-center"
      >
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary">
          Ready to get started?
        </h2>

        <p className="mt-3 text-text-secondary max-w-md mx-auto">
          Join creators, developers, and professionals supercharging their AI workflows.
        </p>

        <div className="mt-8">
          <Link href="/signup">
            <NeonButton variant="primary" size="lg">
              Start Prompting
              <ArrowRight className="w-4 h-4 ml-2" />
            </NeonButton>
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-text-muted">
          <span>✓ Free to start</span>
          <span>✓ No credit card</span>
          <span className="hidden sm:inline">✓ 7 AI platforms</span>
        </div>
      </motion.div>
    </section>
  );
}
