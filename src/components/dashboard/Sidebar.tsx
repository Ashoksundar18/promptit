'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  History,
  Bot,
  Bookmark,
  Heart,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useApp } from '@/context/AppContext';

type NavItem = {
  id: string;
  icon: React.ElementType;
  label: string;
  phase2?: boolean;
};

const navItems: NavItem[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'history', icon: History, label: 'Search History' },
  { id: 'ai-tools', icon: Bot, label: 'AI Tools' },
  { id: 'saved', icon: Bookmark, label: 'Saved Prompts' },
  { id: 'favorites', icon: Heart, label: 'Favorites' },
  { id: 'profile', icon: User, label: 'Profile', phase2: true },
  { id: 'settings', icon: Settings, label: 'Settings', phase2: true },
];

import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen, currentView, setCurrentView } = useApp();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <motion.aside
      className="h-full glass-panel flex flex-col relative z-30"
      animate={{ width: sidebarOpen ? 260 : 72 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Logo */}
      <div className="flex items-center justify-center px-4 pt-6 pb-4">
        <Logo size={sidebarOpen ? 'md' : 'sm'} />
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-glass-border mb-2" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                transition-colors duration-200 cursor-pointer relative
                ${isActive
                  ? 'text-accent-blue neon-border-blue bg-[rgba(0,212,255,0.08)]'
                  : 'text-text-secondary hover:bg-glass-bg-hover hover:text-text-primary'
                }
              `}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.97 }}
            >
              <Icon
                size={20}
                className={`flex-shrink-0 ${isActive ? 'drop-shadow-[0_0_6px_rgba(0,212,255,0.6)]' : ''}`}
              />

              <AnimatePresence mode="wait">
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-medium whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Phase 2 badge */}
              <AnimatePresence>
                {item.phase2 && sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-accent-purple/20 text-accent-purple border border-accent-purple/30 whitespace-nowrap"
                  >
                    Phase 2
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-4 h-px bg-glass-border mb-2" />

      {/* Logout */}
      <div className="px-3 pb-3">
        <motion.button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-secondary hover:bg-[rgba(236,72,153,0.08)] hover:text-accent-pink transition-colors duration-200 cursor-pointer"
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.97 }}
        >
          <LogOut size={20} className="flex-shrink-0" />
          <AnimatePresence mode="wait">
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-medium whitespace-nowrap overflow-hidden"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Collapse Toggle */}
      <motion.button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-bg-tertiary border border-glass-border flex items-center justify-center text-text-secondary hover:text-accent-blue hover:border-accent-blue/40 transition-colors cursor-pointer z-50"
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
      >
        {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </motion.button>
    </motion.aside>
  );
}
