'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useTranslations } from 'next-intl';


interface TooltipContextValue {
  openTooltips: Set<string>; 
  registerTooltip: (id: string) => void;
  unregisterTooltip: (id: string) => void;
}

const TooltipContext = createContext<TooltipContextValue | undefined>(undefined);

// Пропсы для провайдера tooltip, содержащего дочерние элементы.
interface TooltipProviderProps {
  children: ReactNode;
}

/**
 * Провайдер контекста для управления состояниями tooltip в приложении.
 * Обеспечивает регистрацию и снятие регистрации tooltip для глобального управления. *
 * @param children - Дочерние элементы, обёрнутые провайдером.
 */
export function TooltipProvider({ children }: TooltipProviderProps) {
  const t = useTranslations('common');
  const [openTooltips, setOpenTooltips] = useState<Set<string>>(new Set());

  /**
   * Регистрирует новый tooltip по уникальному ID.   *
   * @param id - Уникальный идентификатор tooltip.
   */
  const registerTooltip = (id: string) => {
    setOpenTooltips((prev) => new Set(prev).add(id));
  };

  /**
   * Снимает регистрацию tooltip по уникальному ID.   *
   * @param id - Уникальный идентификатор tooltip.
   */
  const unregisterTooltip = (id: string) => {
    setOpenTooltips((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const value = {
    openTooltips,
    registerTooltip,
    unregisterTooltip,
  };

  return (
    <TooltipContext.Provider value={value}>
      {children}
    </TooltipContext.Provider>
  );
}

/**
 * Хук для доступа к контексту tooltip.
 * Выбрасывает ошибку, если используется вне TooltipProvider. *
 * @returns Контекст tooltip для управления подсказками.
 * @throws Error Если хук используется вне провайдера.
 */
export function useTooltipContext() {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error("useTooltipContext должен использоваться внутри TooltipProvider");
  }
  return context;
}