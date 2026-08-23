'use client';

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, CheckCircle, Eye, EyeOff } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import NeonButton from '@/components/ui/NeonButton';
import Logo from '@/components/ui/Logo';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <GlassCard className="p-8 text-center">
        <p className="text-text-secondary mb-4">Invalid or missing reset token.</p>
        <Link href="/forgot-password" className="text-accent-blue hover:underline text-sm">
          Request a new reset link
        </Link>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-8">
      {success ? (
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-accent-green/10 flex items-center justify-center">
              <CheckCircle size={24} className="text-accent-green" />
            </div>
          </div>
          <h2 className="text-lg font-semibold text-text-primary">Password Reset!</h2>
          <p className="text-sm text-text-secondary">
            Your password has been updated successfully.
          </p>
          <Link href="/login">
            <NeonButton variant="primary" className="w-full justify-center mt-2">
              Sign In
            </NeonButton>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary px-1">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input
                suppressHydrationWarning
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-bg-tertiary border border-glass-border focus:border-accent-blue/50 outline-none text-text-primary text-sm transition-all"
                placeholder="••••••••"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary px-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input
                suppressHydrationWarning
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-bg-tertiary border border-glass-border focus:border-accent-blue/50 outline-none text-text-primary text-sm transition-all"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <NeonButton
              type="submit"
              variant="primary"
              className="w-full justify-center"
              disabled={isLoading}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </NeonButton>
          </div>
        </form>
      )}
    </GlassCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-4"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">
            Reset Password
          </h1>
          <p className="text-text-secondary text-sm">
            Enter your new password
          </p>
        </div>

        <Suspense fallback={<div className="text-center text-text-muted">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
