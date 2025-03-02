'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    const t = useTranslations('common');

    return (
      <label
        className={cn(
          'inline-flex items-center gap-2',
          'cursor-pointer select-none',
          'text-white/60 hover:text-white',
          className
        )}
      >
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          className={cn(
            'peer hidden',
            'focus:ring-2 focus:ring-[#CCBAE4]/50 focus:ring-offset-2 focus:ring-offset-[#060606]'
          )}
          {...props}
        />
        <span
          className={cn(
            'w-5 h-5 rounded-sm border border-white/10 bg-white/[0.02]',
            'peer-checked:bg-[#CCBAE4] peer-checked:border-[#CCBAE4]',
            'flex items-center justify-center transition-colors duration-200',
            'hover:border-white/20'
          )}
        >
          {checked && ''}
        </span>
        {props.id && (
          <span className="text-sm font-medium">{props['aria-label'] || t('select')}</span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';