'use client';

import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  History,
  Bookmark,
  User,
  Settings,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

const tabs = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
  { id: 'history', icon: History, label: 'History' },
  { id: 'saved', icon: Bookmark, label: 'Saved' },
  { id: 'profile', icon: User, label: 'Profile' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export default function MobileBottomNav() {
  const { currentView, setCurrentView } = useApp();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-bg-elevated/95 backdrop-blur-md border-t border-glass-border pb-safe">
      <div className="flex items-center justify-around px-2 pt-1.5 pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;

          return (
            <motion.button
              key={tab.id}
              onClick={() => setCurrentView(tab.id)}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl cursor-pointer relative"
              whileTap={{ scale: 0.9 }}
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-tab-bg"
                  className="absolute inset-0 bg-accent-blue/10 rounded-xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                size={20}
                className={`relative z-10 ${isActive ? 'text-accent-blue' : 'text-text-muted'}`}
              />
              <span
                className={`relative z-10 text-[10px] font-medium ${isActive ? 'text-accent-blue' : 'text-text-muted'}`}
              >
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
