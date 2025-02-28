'use client';

import React, { forwardRef, useState, useEffect, useCallback } from 'react';
import { useTooltipContext } from './TooltipProvider';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface TooltipContentProps {
  ref?: React.Ref<HTMLDivElement>;
  triggerRef: React.RefObject<HTMLDivElement>; 
  className?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  children: React.ReactNode;
}

export const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ triggerRef, className, side = 'top', sideOffset = 8, children }, ref) => {
    const t = useTranslations('common');
    const { openTooltips } = useTooltipContext();
    const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

    const calculatePosition = useCallback(() => {
      if (!triggerRef.current || openTooltips.size === 0) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      let top, left;

      switch (side) {
        case 'top':
          top = triggerRect.top + scrollY - (triggerRect.height + sideOffset);
          left = triggerRect.left + scrollX + (triggerRect.width / 2);
          break;
        case 'right':
          top = triggerRect.top + scrollY + (triggerRect.height / 2);
          left = triggerRect.right + scrollX + sideOffset;
          break;
        case 'bottom':
          top = triggerRect.bottom + scrollY + sideOffset;
          left = triggerRect.left + scrollX + (triggerRect.width / 2);
          break;
        case 'left':
          top = triggerRect.top + scrollY + (triggerRect.height / 2);
          left = triggerRect.left + scrollX - (triggerRect.width + sideOffset);
          break;
        default:
          top = triggerRect.bottom + scrollY + sideOffset;
          left = triggerRect.left + scrollX + (triggerRect.width / 2);
      }

      setPosition({ top, left });
    }, [triggerRef, side, sideOffset, openTooltips]);

    useEffect(() => {
      calculatePosition();
      const handleResizeScroll = () => calculatePosition();
      window.addEventListener('resize', handleResizeScroll);
      window.addEventListener('scroll', handleResizeScroll);
      return () => {
        window.removeEventListener('resize', handleResizeScroll);
        window.removeEventListener('scroll', handleResizeScroll);
      };
    }, [calculatePosition]);

    if (openTooltips.size === 0) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'absolute z-50 bg-[#060606] border border-white/5 p-4 rounded-xl shadow-lg',
          'transform -translate-x-1/2',
          className
        )}
        style={{
          top: position.top,
          left: position.left,
          transform: 'translateX(-50%)',
        }}
      >
        {children}
      </div>
    );
  }
);

TooltipContent.displayName = 'TooltipContent';