'use client';

import React from 'react';
import { Zap } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const sizeConfig = {
  sm: { text: 'text-lg', icon: 14, gap: 'gap-1.5' },
  md: { text: 'text-2xl', icon: 20, gap: 'gap-2' },
  lg: { text: 'text-4xl', icon: 28, gap: 'gap-3' },
};

export default function Logo({ size = 'md', animated = false }: LogoProps) {
  const config = sizeConfig[size];

  return (
    <div className={`inline-flex items-center ${config.gap}`}>
      <div
        className={`${animated ? 'animate-pulse-glow' : ''} rounded-lg p-1`}
        style={{
          background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(139, 92, 246, 0.2))',
        }}
      >
        <Zap
          size={config.icon}
          className="text-accent-blue"
          style={{
            filter: animated ? 'drop-shadow(0 0 6px rgba(0, 212, 255, 0.6))' : undefined,
          }}
        />
      </div>
      <span
        className={`font-heading font-bold ${config.text} gradient-blue-purple gradient-text`}
      >
        Prompt It
      </span>
    </div>
  );
}
