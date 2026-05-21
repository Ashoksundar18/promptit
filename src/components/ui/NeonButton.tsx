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
    base: 'bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold',
    hover: {
      boxShadow: '0 0 15px rgba(0, 212, 255, 0.5), 0 0 30px rgba(139, 92, 246, 0.3)',
      scale: 1.03,
    },
  },
  secondary: {
    base: 'bg-accent-purple/20 text-accent-purple border border-accent-purple/30 font-medium',
    hover: {
      boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)',
      scale: 1.03,
      backgroundColor: 'rgba(139, 92, 246, 0.3)',
    },
  },
  outline: {
    base: 'glass text-text-primary font-medium border border-glass-border',
    hover: {
      boxShadow: '0 0 10px rgba(0, 212, 255, 0.3)',
      scale: 1.03,
      borderColor: 'rgba(0, 212, 255, 0.4)',
    },
  },
  ghost: {
    base: 'bg-transparent text-text-secondary font-medium',
    hover: {
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      scale: 1.02,
      color: '#f0f0f5',
    },
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
        transition-colors duration-200
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
