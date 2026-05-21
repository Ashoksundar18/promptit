'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'blue' | 'purple' | 'pink';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const glowStyles = {
  blue: {
    boxShadow: '0 0 5px rgba(0, 212, 255, 0.3), 0 0 20px rgba(0, 212, 255, 0.1)',
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  purple: {
    boxShadow: '0 0 5px rgba(139, 92, 246, 0.3), 0 0 20px rgba(139, 92, 246, 0.1)',
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  pink: {
    boxShadow: '0 0 5px rgba(236, 72, 153, 0.3), 0 0 20px rgba(236, 72, 153, 0.1)',
    borderColor: 'rgba(236, 72, 153, 0.3)',
  },
};

const paddingMap = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
};

export default function GlassCard({
  children,
  className = '',
  hover = false,
  glow,
  padding = 'md',
  onClick,
}: GlassCardProps) {
  const baseClasses = `glass rounded-2xl ${paddingMap[padding]} ${className}`;

  if (hover) {
    return (
      <motion.div
        className={baseClasses}
        style={glow ? glowStyles[glow] : undefined}
        whileHover={{
          y: -4,
          scale: 1.01,
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderColor: glow
            ? glowStyles[glow].borderColor
            : 'rgba(255, 255, 255, 0.15)',
          boxShadow: glow
            ? `${glowStyles[glow].boxShadow}, 0 12px 40px rgba(0, 0, 0, 0.3)`
            : '0 12px 40px rgba(0, 0, 0, 0.3)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={baseClasses}
      style={glow ? glowStyles[glow] : undefined}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
