'use client';

import React from 'react';
import { Zap } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  iconOnly?: boolean;
}

const sizeConfig = {
  sm: { text: 'text-lg', icon: 14, gap: 'gap-1.5', pad: 'p-1' },
  md: { text: 'text-2xl', icon: 20, gap: 'gap-2', pad: 'p-1.5' },
  lg: { text: 'text-4xl', icon: 28, gap: 'gap-3', pad: 'p-2' },
};

export default function Logo({ size = 'md', iconOnly = false }: LogoProps) {
  const config = sizeConfig[size];

  return (
    <div className={`inline-flex items-center ${config.gap}`}>
      <div className={`rounded-lg ${config.pad} bg-accent-blue/10`}>
        <Zap size={config.icon} className="text-accent-blue" />
      </div>
      {!iconOnly && (
        <span
          className={`font-heading font-bold ${config.text} text-text-primary`}
        >
          Prompt It
        </span>
      )}
    </div>
  );
}
