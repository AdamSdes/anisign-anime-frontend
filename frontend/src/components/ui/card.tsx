'use client';

import * as React from 'react';
import { mergeClass } from '@/lib/utils/mergeClass';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * Компонент карточки
 * @param props Пропсы карточки
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={mergeClass(
        'rounded-[16px] overflow-hidden bg-[rgba(255,255,255,0.02)] border border-white/5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = 'Card';