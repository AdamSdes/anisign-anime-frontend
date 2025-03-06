import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Интерфейс пропсов компонента AnimeCardSkeleton
 * @description Опциональные пропсы для настройки размеров скелетона
 */
interface AnimeCardSkeletonProps {
  width?: string; 
  titleHeight?: string; 
  subtitleHeight?: string; 
}

/**
 * Компонент скелетона карточки аниме
 * @description Отображает заглушку для карточки аниме во время загрузки
 * @param {AnimeCardSkeletonProps} props - Пропсы компонента
 */
export const AnimeCardSkeleton: React.FC<AnimeCardSkeletonProps> = React.memo(
  ({
    width = "150px",
    titleHeight = "20px",
    subtitleHeight = "10px",
  }) => {
    return (
      <div className="w-fit flex flex-col gap-3">
        <Skeleton
          className={`w-[${width}] h-[${titleHeight}] rounded-[9px] bg-white/[0.02]`}
        />
        <Skeleton
          className={`w-[${width}] h-[${subtitleHeight}] rounded-[9px] bg-white/[0.02]`}
        />
      </div>
    );
  }
);

AnimeCardSkeleton.displayName = "AnimeCardSkeleton";