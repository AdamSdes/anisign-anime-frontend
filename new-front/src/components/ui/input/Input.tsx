'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  variant?: 'default' | 'ghost';
  error?: boolean;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', error = false, ...props }, ref) => {
    const t = useTranslations('common');
    return (
      <input
        ref={ref}
        className={cn(
          'h-10 px-4 rounded-xl text-sm font-medium',
          'border focus:outline-none focus:ring-2 focus:ring-[#CCBAE4]/50 focus:ring-offset-2 focus:ring-offset-[#060606]',
          'transition-all duration-200 placeholder:text-white/40',
          variant === 'default' && 'bg-white/[0.02] border-white/10 text-white/80',
          variant === 'ghost' && 'bg-transparent border-transparent text-white/60',
          error && 'border-red-500 bg-red-500/5 text-red-500 placeholder-red-300',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';