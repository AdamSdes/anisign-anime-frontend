'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode, ElementType } from 'react';
import { mergeClass } from '@/lib/utils/mergeClass';

interface TooltipProviderProps {
  children: ReactNode;
}

interface TooltipProps {
  children: ReactNode;
}

interface TooltipTriggerProps {
  asChild?: boolean;
  children: ReactNode;
}

interface TooltipContentProps {
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  children: ReactNode;
}

interface TooltipContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement>;
}

const TooltipContext = createContext<TooltipContextType | undefined>(undefined);

const useTooltipContext = () => {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error('Tooltip components must be used within a TooltipProvider');
  }
  return context;
};

/**
 * Провайдер тултипа
 * @param props Пропсы провайдера
 */
export const TooltipProvider: React.FC<TooltipProviderProps> = ({ children }) => {
  return <>{children}</>;
};

/**
 * Компонент тултипа
 * @param props Пропсы тултипа
 */
export const Tooltip: React.FC<TooltipProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);

  return (
    <TooltipContext.Provider value={{ isOpen, setIsOpen, triggerRef }}>
      {children}
    </TooltipContext.Provider>
  );
};

/**
 * Триггер тултипа
 * @param props Пропсы триггера
 */
export const TooltipTrigger: React.FC<TooltipTriggerProps> = ({ asChild, children }) => {
  const { setIsOpen, triggerRef } = useTooltipContext();

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);
  const handleFocus = () => setIsOpen(true);
  const handleBlur = () => setIsOpen(false);

  const child = React.Children.only(children) as React.ReactElement;

  if (asChild && React.isValidElement(child)) {
    const childProps = {
      ref: triggerRef,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onFocus: handleFocus,
      onBlur: handleBlur,
    };

    return React.cloneElement(child as React.ReactElement<{ ref?: React.Ref<HTMLElement> }>, childProps);
  }

  return (
    <span
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}
    </span>
  );
};

/**
 * Контент тултипа
 * @param props Пропсы контента
 */
export const TooltipContent: React.FC<TooltipContentProps> = ({ side = 'top', className, children }) => {
  const { isOpen, triggerRef } = useTooltipContext();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !triggerRef.current || !contentRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();

    const positionStyles: React.CSSProperties = {};
    switch (side) {
      case 'top':
        positionStyles.top = triggerRect.top - contentRect.height - 8;
        positionStyles.left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2;
        break;
      case 'bottom':
        positionStyles.top = triggerRect.bottom + 8;
        positionStyles.left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2;
        break;
      case 'left':
        positionStyles.top = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2;
        positionStyles.left = triggerRect.left - contentRect.width - 8;
        break;
      case 'right':
        positionStyles.top = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2;
        positionStyles.left = triggerRect.right + 8;
        break;
    }

    Object.assign(contentRef.current.style, {
      position: 'fixed',
      zIndex: 50,
      ...positionStyles,
    });
  }, [isOpen, side]);

  if (!isOpen) return null;

  return (
    <div
      ref={contentRef}
      className={mergeClass('bg-gray-800 text-white rounded-md shadow-lg border border-gray-700', className)}
    >
      {children}
    </div>
  );
};