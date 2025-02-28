'use client'

import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    value?: number;
    onValueChange?: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
}
export const Slider = forwardRef<HTMLInputElement, SliderProps>(
    ({ className, value, onValueChange, min = 0, max = 100, step = 1, ...props }, ref) => {
      const t = useTranslations('common');
      const [internalValue, setInternalValue] = useState<number>(value || min);
  
      useEffect(() => {
        setInternalValue(value || min);
      }, [value, min]);
  
      const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);
        setInternalValue(newValue);
        onValueChange?.(newValue);
      }, [onValueChange]);
  
      return (
        <div className={cn('relative w-full', className)}>
          <input
            type="range"
            ref={ref}
            value={internalValue}
            onChange={handleChange}
            min={min}
            max={max}
            step={step}
            className={cn(
              'w-full h-1.5 bg-white/[0.06] rounded-full appearance-none cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-[#CCBAE4]/50 focus:ring-offset-2 focus:ring-offset-[#060606]',
              'before:absolute before:top-1/2 before:-translate-y-1/2 before:h-1.5 before:rounded-full before:bg-[#CCBAE4] before:transition-all before:duration-300',
              'before:w-[calc(var(--value)*1%)]',
              '&::-webkit-slider-thumb', 
              'w-4 h-4 rounded-full bg-[#CCBAE4] shadow-lg shadow-[#CCBAE4]/10 appearance-none cursor-pointer transition-all duration-200',
              '&::-moz-range-thumb', 
              'w-4 h-4 rounded-full bg-[#CCBAE4] shadow-lg shadow-[#CCBAE4]/10 appearance-none cursor-pointer transition-all duration-200'
            )}
            style={{ '--value': internalValue } as React.CSSProperties}
            {...props}
          />
          <span className="text-xs text-white/60 ml-2">
            {t('value', { value: internalValue })}
          </span>
        </div>
      );
    }
  );
  
  Slider.displayName = 'Slider';