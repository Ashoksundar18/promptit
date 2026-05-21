'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/ui/Logo';

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
    }, 2500);

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
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg-primary"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          >
            <Logo size="lg" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-4 text-lg text-text-secondary"
          >
            Smarter Prompts. Better Results.
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
