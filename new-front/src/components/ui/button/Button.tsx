'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'destructive' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'default', 
    isLoading = false, 
    disabled = false, 
    children, 
    ...props 
  }, ref) => {
    const t = useTranslations('common');

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-[#CCBAE4]/50 focus:ring-offset-2 focus:ring-offset-[#060606]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          variant === 'default' && 'bg-[#CCBAE4] text-black hover:bg-[#CCBAE4]/90 shadow-lg shadow-[#CCBAE4]/10',
          variant === 'ghost' && 'bg-transparent text-white/60 hover:bg-white/[0.04] hover:text-white',
          variant === 'destructive' && 'bg-[#FDA4AF] text-white hover:bg-[#FDA4AF]/90',
          variant === 'outline' && 'border border-white/10 bg-transparent text-white/60 hover:bg-white/[0.04] hover:text-white',
          variant === 'secondary' && 'bg-white/[0.02] text-white/60 hover:bg-white/[0.04] hover:text-white',
          size === 'default' && 'h-10 px-4 py-2',
          size === 'sm' && 'h-8 px-3 text-sm',
          size === 'lg' && 'h-12 px-6 text-lg',
          size === 'icon' && 'h-8 w-8',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {t('loading')}
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';