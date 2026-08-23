'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Sun, Moon, Check, Eye, EyeOff, Cpu } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import NeonButton from '@/components/ui/NeonButton';
import { useTheme } from '@/components/providers/ThemeProvider';

export default function SettingsView() {
  const { theme, toggleTheme } = useTheme();

  // AI Model state
  const [aiProvider, setAiProvider] = useState('gemini');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [aiSavedMessage, setAiSavedMessage] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProvider = localStorage.getItem('promptit_user_ai_provider');
      const storedKey = localStorage.getItem('promptit_user_api_key');
      if (storedProvider) setAiProvider(storedProvider);
      if (storedKey) setApiKey(storedKey);
    }
  }, []);

  const handleSaveAiConfig = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('promptit_user_ai_provider', aiProvider);
      localStorage.setItem('promptit_user_api_key', apiKey.trim());
      setAiSavedMessage('AI Model settings saved successfully!');
      setTimeout(() => setAiSavedMessage(''), 3000);
    }
  };

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setPasswordLoading(true);
    setPasswordMessage(null);

    try {
      const res = await fetch('/api/user/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMessage({ type: 'error', text: data.error || 'Failed to update password' });
      }
    } catch {
      setPasswordMessage({ type: 'error', text: 'Something went wrong' });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-heading font-bold text-text-primary mb-1">Settings</h2>
        <p className="text-sm text-text-muted">Manage your preferences</p>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard>
          <h3 className="text-base font-heading font-semibold text-text-primary mb-4">Appearance</h3>

          <div className="flex items-center justify-between p-3 rounded-xl bg-bg-tertiary">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon size={18} className="text-accent-purple" /> : <Sun size={18} className="text-accent-orange" />}
              <div>
                <p className="text-sm font-medium text-text-primary">Theme</p>
                <p className="text-xs text-text-muted">
                  Currently using {theme === 'dark' ? 'dark' : 'light'} mode
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={toggleTheme}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 cursor-pointer ${
                theme === 'dark' ? 'bg-accent-purple' : 'bg-accent-orange'
              }`}
            >
              <motion.div
                className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center"
                animate={{ left: theme === 'dark' ? '30px' : '2px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                {theme === 'dark' ? <Moon size={12} className="text-accent-purple" /> : <Sun size={12} className="text-accent-orange" />}
              </motion.div>
            </button>
          </div>
        </GlassCard>
      </motion.div>

      {/* AI Model Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <GlassCard>
          <h3 className="text-base font-heading font-semibold text-text-primary mb-1 flex items-center gap-2">
            <Cpu size={18} className="text-accent-blue" />
            AI Model Integration
          </h3>
          <p className="text-xs text-text-muted mb-4">
            Connect your custom AI Model API Key (Google Gemini, OpenAI, Claude, or Groq) for real LLM reasoning.
          </p>

          <div className="space-y-4">
            {/* Provider Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary px-1">AI Provider</label>
              <select
                value={aiProvider}
                onChange={(e) => setAiProvider(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-glass-border focus:border-accent-blue/50 outline-none text-text-primary text-sm transition-all"
              >
                <option value="gemini">Google Gemini (Recommended - Free)</option>
                <option value="openai">OpenAI (GPT-4o / GPT-3.5)</option>
                <option value="claude">Anthropic Claude</option>
                <option value="groq">Groq (Llama 3)</option>
              </select>
            </div>

            {/* API Key */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary px-1">API Key</label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 rounded-xl bg-bg-tertiary border border-glass-border focus:border-accent-blue/50 outline-none text-text-primary text-sm transition-all"
                  placeholder={
                    aiProvider === 'gemini' ? 'AIzaSy...' : 'sk-...'
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary cursor-pointer"
                >
                  {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {aiSavedMessage && (
              <div className="p-2.5 rounded-xl bg-accent-green/10 border border-accent-green/20 text-accent-green text-xs text-center flex items-center justify-center gap-1.5">
                <Check size={14} />
                {aiSavedMessage}
              </div>
            )}

            <NeonButton onClick={handleSaveAiConfig} className="w-full">
              Save AI Model Settings
            </NeonButton>
          </div>
        </GlassCard>
      </motion.div>

      {/* Change Password */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard>
          <h3 className="text-base font-heading font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Lock size={16} />
            Change Password
          </h3>

          {passwordMessage && (
            <div className={`p-3 rounded-xl text-sm text-center mb-4 ${
              passwordMessage.type === 'success'
                ? 'bg-accent-green/10 border border-accent-green/20 text-accent-green'
                : 'bg-accent-pink/10 border border-accent-pink/20 text-accent-pink'
            }`}>
              {passwordMessage.text}
            </div>
          )}

          <div className="space-y-4">
            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary px-1">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 rounded-xl bg-bg-tertiary border border-glass-border focus:border-accent-blue/50 outline-none text-text-primary text-sm transition-all"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary cursor-pointer"
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary px-1">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 rounded-xl bg-bg-tertiary border border-glass-border focus:border-accent-blue/50 outline-none text-text-primary text-sm transition-all"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary cursor-pointer"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary px-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-glass-border focus:border-accent-blue/50 outline-none text-text-primary text-sm transition-all"
                placeholder="Confirm new password"
              />
            </div>

            <NeonButton
              onClick={handlePasswordChange}
              disabled={passwordLoading}
              className="w-full mt-2"
            >
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </NeonButton>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
