'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const sizeMap = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div
          className={`${sizeMap[size]} rounded-full border-2 border-transparent animate-spin`}
          style={{
            borderTopColor: 'var(--accent-blue)',
            borderRightColor: 'var(--accent-purple)',
            filter: 'drop-shadow(0 0 6px rgba(0, 212, 255, 0.5))',
          }}
        />
        <div
          className={`absolute inset-0 ${sizeMap[size]} rounded-full border-2 border-transparent animate-spin`}
          style={{
            borderBottomColor: 'var(--accent-pink)',
            animationDirection: 'reverse',
            animationDuration: '1.5s',
            filter: 'drop-shadow(0 0 4px rgba(236, 72, 153, 0.4))',
          }}
        />
      </div>
      {text && (
        <p className="text-sm text-text-secondary animate-pulse">{text}</p>
      )}
    </div>
  );
}
