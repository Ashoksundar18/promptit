'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface NeonButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm rounded-lg gap-1.5',
  md: 'px-6 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-8 py-3.5 text-base rounded-xl gap-2.5',
};

const variantStyles = {
  primary: {
    base: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-sm',
    hover: { scale: 1.02, y: -1 },
  },
  secondary: {
    base: 'bg-accent-purple/15 text-accent-purple border border-accent-purple/25 font-medium',
    hover: { scale: 1.02 },
  },
  outline: {
    base: 'bg-bg-elevated text-text-primary font-medium border border-glass-border',
    hover: { scale: 1.02, y: -1 },
  },
  ghost: {
    base: 'bg-transparent text-text-secondary font-medium',
    hover: { scale: 1.02 },
  },
};

export default function NeonButton({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
}: NeonButtonProps) {
  const styles = variantStyles[variant];

  return (
    <motion.button
      type={type}
      className={`
        inline-flex items-center justify-center
        transition-all duration-200
        ${sizeClasses[size]}
        ${styles.base}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      whileHover={disabled || loading ? undefined : styles.hover}
      whileTap={disabled || loading ? undefined : { scale: 0.97 }}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </motion.button>
  );
}
