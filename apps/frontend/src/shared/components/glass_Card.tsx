import { ReactNode } from 'react';
import { cn } from '@shared/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'light' | 'dark';
  hover?: boolean;
}

export function GlassCard({
  children,
  className,
  variant = 'light',
  hover = false,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl shadow-xl',
        variant === 'light' ? 'glass' : 'glass-dark',
        hover && 'transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl',
        className
      )}
    >
      {children}
    </div>
  );
}
