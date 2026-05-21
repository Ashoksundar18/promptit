'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  History,
  Bookmark,
  Heart,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Sun,
  Moon,
  Download,
} from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

type NavItem = {
  id: string;
  icon: React.ElementType;
  label: string;
  phase2?: boolean;
};

const navItems: NavItem[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'history', icon: History, label: 'Search History' },
  { id: 'saved', icon: Bookmark, label: 'Saved Prompts' },
  { id: 'favorites', icon: Heart, label: 'Favorites' },
  { id: 'profile', icon: User, label: 'Profile' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen, currentView, setCurrentView } = useApp();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <>
      <motion.aside
        className="h-full glass-panel flex flex-col relative z-30"
        animate={{ width: sidebarOpen ? 260 : 72 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center px-4 pt-6 pb-4">
          <Logo size={sidebarOpen ? 'md' : 'sm'} iconOnly={!sidebarOpen} />
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
                    ? 'text-accent-blue bg-accent-blue/10 font-medium'
                    : 'text-text-secondary hover:bg-glass-bg-hover hover:text-text-primary'
                  }
                `}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Icon size={20} className="flex-shrink-0" />

                <AnimatePresence mode="wait">
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Coming Soon badge */}
                <AnimatePresence>
                  {item.phase2 && sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-accent-purple/15 text-accent-purple border border-accent-purple/20 whitespace-nowrap"
                    >
                      Soon
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-4 h-px bg-glass-border mb-2" />

        {/* Theme Toggle */}
        <div className="px-3 pb-1">
          <motion.button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-secondary hover:bg-glass-bg-hover hover:text-text-primary transition-colors duration-200 cursor-pointer"
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.97 }}
          >
            {theme === 'dark' ? (
              <Sun size={20} className="flex-shrink-0" />
            ) : (
              <Moon size={20} className="flex-shrink-0" />
            )}
            <AnimatePresence mode="wait">
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm whitespace-nowrap overflow-hidden"
                >
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Install App */}
        <div className="px-3 pb-1">
          <motion.button
            onClick={() => {
              // Trigger the browser's install prompt if available
              const event = new CustomEvent('trigger-install');
              window.dispatchEvent(event);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-secondary hover:bg-accent-green/10 hover:text-accent-green transition-colors duration-200 cursor-pointer"
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.97 }}
          >
            <Download size={20} className="flex-shrink-0" />
            <AnimatePresence mode="wait">
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm whitespace-nowrap overflow-hidden"
                >
                  Install App
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Logout */}
        <div className="px-3 pb-3">
          <motion.button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-secondary hover:bg-accent-pink/10 hover:text-accent-pink transition-colors duration-200 cursor-pointer"
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
                  className="text-sm whitespace-nowrap overflow-hidden"
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
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-bg-secondary border border-glass-border flex items-center justify-center text-text-secondary hover:text-accent-blue hover:border-accent-blue/40 transition-colors cursor-pointer z-50"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
        >
          {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </motion.button>
      </motion.aside>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="bg-bg-elevated rounded-2xl border border-glass-border p-6 max-w-sm w-full mx-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-accent-pink/10">
                  <AlertTriangle size={20} className="text-accent-pink" />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-bold text-text-primary">Logout</h3>
                  <p className="text-xs text-text-muted">End your session</p>
                </div>
              </div>

              <p className="text-sm text-text-secondary mb-6">
                Are you sure you want to logout? You&apos;ll need to sign in again to access your prompts.
              </p>

              <div className="flex gap-3">
                <motion.button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-bg-tertiary text-sm font-medium text-text-secondary hover:text-text-primary transition-all cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleLogout}
                  className="flex-1 py-2.5 rounded-xl bg-accent-pink/15 text-sm font-medium text-accent-pink hover:bg-accent-pink/25 transition-all cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Yes, Logout
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
