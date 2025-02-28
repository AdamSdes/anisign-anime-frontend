'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useOnClickOutside } from '@/lib/utils/useOnClickOutside';
import { useTranslations } from 'next-intl';
import { TooltipContent } from './TooltipContent';
import { TooltipTrigger } from './TooltipTrigger';
import { useTooltipContext } from './TooltipProvider';

interface TooltipProps {
  children: React.ReactNode;
  delayDuration?: number;
  skipDelayDuration?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
}

/**
 * Компонент tooltip для создания интерактивных подсказок при наведении или клике
 * @param children Содержимое триггера tooltip
 * @param delayDuration Задержка перед показом tooltip (мс)
 * @param skipDelayDuration Задержка, которую можно пропустить (мс)
 * @param open Контролируемое состояние открытости tooltip
 * @param onOpenChange Обработчик изменения состояния открытости
 * @param side Сторона отображения tooltip ('top', 'right', 'bottom', 'left')
 * @param sideOffset Смещение tooltip относительно триггера (px)
 */
export function Tooltip({ 
  children, 
  delayDuration = 0, 
  skipDelayDuration = 0, 
  open: controlledOpen, 
  onOpenChange, 
  side = 'top', 
  sideOffset = 8,
}: TooltipProps) {
  const t = useTranslations('common');
  const [isOpen, setIsOpen] = useState(controlledOpen || false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { registerTooltip, unregisterTooltip } = useTooltipContext();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleOpenChange = useCallback((open: boolean) => {
    if (controlledOpen !== undefined && onOpenChange) {
      onOpenChange(open);
      return;
    }
    setIsOpen(open);
    if (open) {
      registerTooltip(`tooltip-${Math.random().toString(36).substr(2, 9)}`);
    } else {
      unregisterTooltip(`tooltip-${Math.random().toString(36).substr(2, 9)}`);
    }
  }, [controlledOpen, onOpenChange, registerTooltip, unregisterTooltip]);

  const handleMouseEnter = useCallback(() => {
    if (skipDelayDuration > 0) {
      handleOpenChange(true);
      return;
    }
    timeoutRef.current = setTimeout(() => {
      handleOpenChange(true);
    }, delayDuration);
  }, [delayDuration, skipDelayDuration, handleOpenChange]);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    handleOpenChange(false);
  }, [handleOpenChange]);

  const handleClickOutside = useCallback(() => {
    handleOpenChange(false);
  }, [handleOpenChange]);

  useOnClickOutside(contentRef, handleClickOutside);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative inline-block">
      <TooltipTrigger
        ref={triggerRef} 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
      >
        {children}
      </TooltipTrigger>
      {(controlledOpen || isOpen) && (
        <TooltipContent
          ref={contentRef}
          triggerRef={triggerRef} 
          side={side}
          sideOffset={sideOffset}
          children={children}
        />
      )}
    </div>
  );
}