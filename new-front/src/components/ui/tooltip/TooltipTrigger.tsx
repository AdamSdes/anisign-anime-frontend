'use client';

import React, { forwardRef } from 'react';
import { useTooltipContext } from './TooltipProvider';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface TooltipTriggerProps {
  children: React.ReactNode;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  asChild?: boolean;
}

export const TooltipTrigger = forwardRef<HTMLDivElement, TooltipTriggerProps>(
  ({ children, className, onMouseEnter, onMouseLeave, onFocus, onBlur, asChild = false }, ref) => {
    const t = useTranslations('common');
    const { registerTooltip, unregisterTooltip } = useTooltipContext();
    const id = `tooltip-${Math.random().toString(36).substr(2, 9)}`;

    const handleMouseEnter = () => {
      registerTooltip(id);
      onMouseEnter?.();
    };

    const handleMouseLeave = () => {
      unregisterTooltip(id);
      onMouseLeave?.();
    };

    const handleFocus = () => {
      registerTooltip(id);
      onFocus?.();
    };

    const handleBlur = () => {
      unregisterTooltip(id);
      onBlur?.();
    };

    const Child = asChild ? React.Children.only(children) as React.ReactElement : (
      <div ref={ref} className={cn('inline-flex', className)}>
        {children}
      </div>
    );

    return React.cloneElement(Child, {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onFocus: handleFocus,
      onBlur: handleBlur,
    });
  }
);

TooltipTrigger.displayName = 'TooltipTrigger';