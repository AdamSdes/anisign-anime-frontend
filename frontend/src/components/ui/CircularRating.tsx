'use client';

import { mergeClass } from "@/lib/utils/mergeClass";
import { CircularRatingProps } from "@/shared/types/rating";

/**
 * Компонент кругового рейтинга с цветовой индикацией и текстом
 * @param props Пропсы рейтинга
 */
export function CircularRating({
  score,
  size = 36,
  strokeWidth = 3,
  className,
  showText = true,
}: CircularRatingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (score / 10) * circumference;

  const getScoreColor = (score: number): string => {
    if (score >= 8) return "#86EFAC"; // Зеленый
    if (score >= 6) return "#CCBAE4"; // Фиолетовый
    if (score >= 4) return "#FCD34D"; // Желтый
    return "#FDA4AF"; // Красный
  };

  const getRatingText = (score: number): string => {
    if (score >= 8) return "Отлично";
    if (score >= 6) return "Хорошо";
    if (score >= 4) return "Средне";
    return "Плохо";
  };

  return (
    <div className={mergeClass("relative group", className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getScoreColor(score)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[13px] font-medium text-white">
          {score.toFixed(1)}
        </span>
        {showText && (
          <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 -top-8 bg-black/90 backdrop-blur-sm text-[11px] text-white/90 px-2 py-1 rounded-md whitespace-nowrap">
            {getRatingText(score)}
          </div>
        )}
      </div>
    </div>
  );
}

CircularRating.displayName = "CircularRating";