'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/ui/Logo';
import ParticleField from '@/components/ui/ParticleField';

const INTRO_DURATION = 3500;
const SESSION_KEY = 'promptit_intro_seen';

export default function AnimatedIntro() {
  const [showIntro, setShowIntro] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem(SESSION_KEY);
    if (hasSeen) {
      setShowIntro(false);
      setMounted(true);
      return;
    }

    setShowIntro(true);
    setMounted(true);

    const timer = setTimeout(() => {
      setShowIntro(false);
      sessionStorage.setItem(SESSION_KEY, 'true');
    }, INTRO_DURATION);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          key="animated-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: '#0a0a0f' }}
        >
          {/* Particle field fades in */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0 }}
            className="absolute inset-0"
          >
            <ParticleField particleCount={80} className="absolute inset-0" />
          </motion.div>

          {/* Gradient orbs for ambient light */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent-blue/5 blur-[120px]" />
            <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-accent-purple/5 blur-[100px]" />
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative z-10"
          >
            <Logo size="lg" animated />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.5, ease: 'easeOut' }}
            className="relative z-10 mt-6 text-5xl md:text-7xl font-heading font-bold neon-text-blue tracking-tight"
          >
            Prompt It
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2, ease: 'easeOut' }}
            className="relative z-10 mt-4 text-lg md:text-xl text-text-secondary tracking-wide"
          >
            Smarter Prompts. Better Results.
          </motion.p>

          {/* Subtle horizontal line accent */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 2.3, ease: 'easeOut' }}
            className="relative z-10 mt-6 h-px w-32 origin-center"
            style={{
              background:
                'linear-gradient(90deg, transparent, var(--accent-blue), transparent)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
