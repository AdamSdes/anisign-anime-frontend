"use client";

import * as React from "react";
import { mergeClass } from "@/lib/utils/mergeClass";

/**
 * Компонент скелетона для отображения заглушки с анимацией
 * @param props Пропсы скелетона
 */
export const Skeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={mergeClass("animate-pulse rounded-md bg-primary/10", className)}
    {...props}
  />
));
Skeleton.displayName = "Skeleton";