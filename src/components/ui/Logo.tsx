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

export default function Logo({ size = 'md' }: LogoProps) {
  const config = sizeConfig[size];

  return (
    <div className={`inline-flex items-center ${config.gap}`}>
      <div className="rounded-lg p-1 bg-accent-blue/10">
        <Zap size={config.icon} className="text-accent-blue" />
      </div>
      <span
        className={`font-heading font-bold ${config.text} text-text-primary`}
      >
        Prompt It
      </span>
    </div>
  );
}
