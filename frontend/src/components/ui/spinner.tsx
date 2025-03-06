"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { mergeClass } from "@/lib/utils/mergeClass";

// Пропсы компонента спиннера
interface SpinnerProps extends React.HTMLAttributes<SVGSVGElement> {
  size: "sm" | "md" | "lg";
}

//  Размеры спиннера
const sizeClasses: Record<SpinnerProps["size"], string> = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

/**
 * Компонент спиннера
 * @param props Пропсы спиннера
 */
export const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ size = "md", className, ...props }, ref) => (
    <Loader2
      ref={ref}
      className={mergeClass("animate-spin text-white/60", sizeClasses[size], className)}
      {...props}
    />
  )
);
Spinner.displayName = "Spinner";