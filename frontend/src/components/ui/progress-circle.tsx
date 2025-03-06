"use client";

import * as React from "react";
import { mergeClass } from "@/lib/utils/mergeClass";
import { ProgressCircleProps } from "@/shared/types/progress-circle";

/**
 * Компонент кругового прогресс-бара
 * @param props Пропсы кругового прогресс-бара
 */
export const ProgressCircle = React.forwardRef<SVGSVGElement, ProgressCircleProps>(
  (
    {
      value,
      size = 40,
      strokeWidth = 4,
      className,
      strokeColor = "hsl(var(--primary))", 
      backgroundColor = "hsl(var(--primary) / 0.2)", 
      ...props
    },
    ref
  ) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (Math.max(0, Math.min(value, 100)) / 100) * circumference;

    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={mergeClass("transform -rotate-90", className)}
        {...props}
      >
        {/* Фоновая окружность */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        {/* Окружность прогресса */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
    );
  }
);
ProgressCircle.displayName = "ProgressCircle";