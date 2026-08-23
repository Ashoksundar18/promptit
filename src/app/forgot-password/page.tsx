'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import NeonButton from '@/components/ui/NeonButton';
import Logo from '@/components/ui/Logo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setSuccess(true);
      // For demo: show the token so user can reset
      if (data.token) {
        setResetToken(data.token);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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
            Forgot Password
          </h1>
          <p className="text-text-secondary text-sm">
            Enter your email and we&apos;ll help you reset your password
          </p>
        </div>

        <GlassCard className="p-8">
          {success ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-accent-green/10 flex items-center justify-center">
                  <CheckCircle size={24} className="text-accent-green" />
                </div>
              </div>
              <h2 className="text-lg font-semibold text-text-primary">Check your email</h2>
              <p className="text-sm text-text-secondary">
                If an account with that email exists, a password reset link has been sent.
              </p>

              {/* Demo: direct reset link (remove in production with real email) */}
              {resetToken && (
                <div className="mt-4 p-3 rounded-xl bg-accent-blue/10 border border-accent-blue/20">
                  <p className="text-xs text-text-muted mb-2">Demo mode — reset link:</p>
                  <Link
                    href={`/reset-password?token=${resetToken}`}
                    className="text-sm text-accent-blue hover:underline break-all"
                  >
                    Click here to reset your password
                  </Link>
                </div>
              )}

              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm text-accent-blue hover:text-accent-blue/80 transition-colors mt-2"
              >
                <ArrowLeft size={14} />
                Back to Sign In
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
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                  <input
                    suppressHydrationWarning
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-tertiary border border-glass-border focus:border-accent-blue/50 outline-none text-text-primary text-sm transition-all"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <NeonButton
                  type="submit"
                  variant="primary"
                  className="w-full justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </NeonButton>
              </div>
            </form>
          )}

          {!success && (
            <div className="mt-6 text-center text-sm text-text-muted">
              Remember your password?{' '}
              <Link href="/login" className="text-accent-blue hover:text-accent-blue/80 transition-colors">
                Sign in
              </Link>
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}
