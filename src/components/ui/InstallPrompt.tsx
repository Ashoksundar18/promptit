'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';
import NeonButton from '@/components/ui/NeonButton';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed this session
    const wasDismissed = sessionStorage.getItem('pwa_install_dismissed');
    if (wasDismissed) {
      setDismissed(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    // Listen for sidebar "Install App" button
    const triggerHandler = () => {
      if (deferredPrompt) {
        handleInstall();
      } else {
        // Show manual instructions if no prompt available
        alert('To install: Open your browser menu → "Add to Home Screen" or "Install App"');
      }
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('trigger-install', triggerHandler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowBanner(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('trigger-install', triggerHandler);
    };
  });

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    sessionStorage.setItem('pwa_install_dismissed', 'true');
  };

  if (dismissed || !showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 left-4 right-4 z-[200] sm:left-auto sm:right-4 sm:max-w-sm"
      >
        <div className="bg-bg-elevated border border-glass-border rounded-2xl p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center flex-shrink-0">
              <Smartphone size={20} className="text-accent-blue" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-text-primary mb-0.5">
                Install Prompt It
              </h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Add to your home screen for a faster, app-like experience.
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="text-text-muted hover:text-text-secondary transition-colors cursor-pointer flex-shrink-0"
            >
              <X size={16} />
            </button>
          </div>
          <div className="mt-3 flex gap-2">
            <NeonButton onClick={handleInstall} className="flex-1 text-xs justify-center">
              <Download size={14} className="mr-1.5" />
              Install
            </NeonButton>
            <button
              onClick={handleDismiss}
              className="px-3 py-2 text-xs text-text-muted hover:text-text-secondary rounded-xl bg-bg-tertiary transition-colors cursor-pointer"
            >
              Not now
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
