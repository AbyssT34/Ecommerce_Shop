import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@shared/utils';

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

export function GlassButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  className,
  disabled,
  ...props
}: GlassButtonProps) {
  const variants = {
    primary: 'bg-gradient-primary text-white border-primary-600/30 hover:shadow-lg hover:shadow-primary-500/25',
    secondary: 'bg-gradient-to-r from-secondary-500/80 to-secondary-600/80 text-white border-secondary-600/30 hover:shadow-lg hover:shadow-secondary-500/25',
    accent: 'bg-gradient-accent text-white border-accent-cyan/30 hover:shadow-lg hover:shadow-accent-teal/25',
    ghost: 'glass text-text-primary border-text-muted/20 hover:border-text-secondary/40',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={cn(
        'rounded-lg font-semibold',
        'backdrop-filter backdrop-blur-md',
        'border transition-all duration-300',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'hover:-translate-y-0.5',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
