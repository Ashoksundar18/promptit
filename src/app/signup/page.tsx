'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Lock, Mail, User, ArrowRight } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import NeonButton from '@/components/ui/NeonButton';
import Logo from '@/components/ui/Logo';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Something went wrong');
      }

      // Auto sign-in after successful registration
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        // Registration succeeded but auto-login failed, go to login page
        router.push('/login?registered=true');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-bg-primary">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-blue/5 rounded-full blur-[120px] " />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-[120px] " />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-4 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">
            Create an account
          </h1>
          <p className="text-text-secondary text-sm">
            Join Prompt It and supercharge your AI workflow
          </p>
        </div>

        <GlassCard className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-medium text-text-secondary px-1">
                Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                <input
                  suppressHydrationWarning
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-tertiary border border-glass-border focus:border-accent-blue  outline-none text-text-primary text-sm transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-text-secondary px-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                <input
                  suppressHydrationWarning
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-tertiary border border-glass-border focus:border-accent-blue  outline-none text-text-primary text-sm transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-text-secondary px-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                <input
                  suppressHydrationWarning
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-tertiary border border-glass-border focus:border-accent-blue  outline-none text-text-primary text-sm transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <NeonButton
                type="submit"
                variant="primary"
                className="w-full justify-center group"
                disabled={isLoading}
              >
                <span>{isLoading ? 'Creating account...' : 'Sign Up'}</span>
                {!isLoading && (
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                )}
              </NeonButton>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-text-muted">
            Already have an account?{' '}
            <Link href="/login" className="text-accent-purple hover:text-accent-purple/80 transition-colors">
              Sign in
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
