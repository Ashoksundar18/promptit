'use client';

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
};

export default function GlassCard({
  children,
  className = '',
  style,
  onClick,
}: GlassCardProps) {
  return (
    <div
      className={`bg-bg-elevated rounded-2xl border border-glass-border p-5 shadow-sm transition-all duration-200 ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
