'use client'

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
    ({ className, checked, onCheckedChange, ...props }, ref) => {
        const t = useTranslations('common');
        return (
            <label 
                className={cn(
                    'inline-flex items-center gap-2 cursor-pointer',
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
                        'w-10 h-5 rouded-full bg-white/[0.06] transition-colors duration-200',
                        'peer-checked:bg-[#CCBAE4]',
                        'relative before:absolute before:content-[""] before:w-4 before:h-4 before:rounded-full before:bg-white before:transition-transform before:duration-200 before:left-0.5 before:top-0.5 peer-checked:before:translate-x-5'
                    )}
                />
                {props.id && (
                    <span className="text-sm font-medium">{props['aria-label'] || t('toggle')}</span>
                )}                
            </label>
        );
    }
);

Switch.displayName = 'Switch';