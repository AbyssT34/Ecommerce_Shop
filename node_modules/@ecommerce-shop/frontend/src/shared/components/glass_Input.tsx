import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@shared/utils';

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, error, fullWidth = false, className, ...props }, ref) => {
    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {label && (
          <label className="block text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'glass rounded-lg px-4 py-3',
            'text-text-primary placeholder-text-muted',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500',
            'transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-error focus:ring-error/50 focus:border-error',
            fullWidth && 'w-full',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-error">{error}</p>
        )}
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';
