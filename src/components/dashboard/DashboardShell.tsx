'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Sidebar from '@/components/dashboard/Sidebar';
import UtilityPanel from '@/components/dashboard/UtilityPanel';
import MobileBottomNav from '@/components/dashboard/MobileBottomNav';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, utilityPanelOpen, setUtilityPanelOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-bg-primary transition-colors duration-300">
      {/* Mobile overlay for sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-50 md:hidden w-[260px]"
            >
              <div className="relative h-full">
                <Sidebar />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="absolute top-4 right-4 p-1 rounded-lg text-text-muted hover:text-text-primary cursor-pointer z-10"
                >
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden md:block flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-30 md:hidden bg-bg-primary/95 backdrop-blur-md border-b border-glass-border px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary cursor-pointer"
          >
            <Menu size={22} />
          </button>
          <span className="text-sm font-heading font-semibold text-text-primary">Prompt It</span>
          <div className="w-[34px]" /> {/* spacer */}
        </div>

        <div className="p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
          {children}
        </div>

        {/* Right panel toggle — desktop only */}
        <motion.button
          onClick={() => setUtilityPanelOpen(!utilityPanelOpen)}
          className="hidden xl:flex fixed top-4 right-4 z-30 p-2 rounded-xl bg-bg-elevated border border-glass-border text-text-muted hover:text-text-primary hover:border-glass-border-hover transition-colors cursor-pointer items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={utilityPanelOpen ? 'Close panel' : 'Open panel'}
        >
          {utilityPanelOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
        </motion.button>
      </main>

      {/* Utility Panel — desktop only */}
      <AnimatePresence>
        {utilityPanelOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="hidden xl:block flex-shrink-0 overflow-hidden"
          >
            <UtilityPanel />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
