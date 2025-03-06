"use client";

import * as React from "react";
import { EmblaCarouselType } from "embla-carousel";

//  Интерфейс возвращаемого значения хука useDotButton
interface UseDotButtonReturn {
  selectedIndex: number;
  scrollSnaps: number[];
  onDotButtonClick: (index: number) => void;
}

/**
 * Хук для управления точками навигации в карусели Embla
 * @param emblaApi Инстанс API Embla Carousel
 * @returns Объект с текущим индексом, точками прокрутки и обработчиком клика
 */
export const useDotButton = (emblaApi: EmblaCarouselType | undefined): UseDotButtonReturn => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  const onDotButtonClick = React.useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onInit = React.useCallback((embla: EmblaCarouselType) => {
    setScrollSnaps(embla.scrollSnapList());
  }, []);

  const onSelect = React.useCallback((embla: EmblaCarouselType) => {
    setSelectedIndex(embla.selectedScrollSnap());
  }, []);

  React.useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit).on("reInit", onSelect).on("select", onSelect);

    return () => {
      emblaApi.off("reInit", onInit).off("reInit", onSelect).off("select", onSelect);
    };
  }, [emblaApi, onInit, onSelect]);

  return { selectedIndex, scrollSnaps, onDotButtonClick };
};

// Пропсы компонента кнопки точки
interface DotButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

/**
 * Компонент кнопки точки для навигации в карусели
 * @param props Пропсы кнопки
 */
export const DotButton = React.forwardRef<HTMLButtonElement, DotButtonProps>(
  ({ children, ...restProps }, ref) => {
    return (
      <button ref={ref} type="button" {...restProps}>
        {children}
      </button>
    );
  }
);
DotButton.displayName = "DotButton";