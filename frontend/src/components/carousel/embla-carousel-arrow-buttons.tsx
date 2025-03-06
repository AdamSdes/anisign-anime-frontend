"use client";

import * as React from "react";
import { EmblaCarouselType } from "embla-carousel";

// Интерфейс возвращаемого значения хука usePrevNextButtons
interface UsePrevNextButtonsReturn {
  prevBtnDisabled: boolean;
  nextBtnDisabled: boolean;
  onPrevButtonClick: () => void;
  onNextButtonClick: () => void;
}

/**
 * Хук для управления кнопками "предыдущий" и "следующий" в карусели Embla
 * @param emblaApi Инстанс API Embla Carousel
 * @returns Объект с состоянием кнопок и обработчиками кликов
 */
export const usePrevNextButtons = (emblaApi: EmblaCarouselType | undefined): UsePrevNextButtonsReturn => {
  const [prevBtnDisabled, setPrevBtnDisabled] = React.useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = React.useState(true);

  const onPrevButtonClick = React.useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const onNextButtonClick = React.useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("reInit", onSelect).on("select", onSelect);
    return () => {
      emblaApi.off("reInit", onSelect).off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  };
};

// Пропсы компонента кнопки стрелки
interface ArrowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

/**
 * Компонент кнопки "предыдущий" для карусели
 * @param props Пропсы кнопки
 */
export const PrevButton = React.forwardRef<HTMLButtonElement, ArrowButtonProps>(
  ({ children, ...restProps }, ref) => {
    return (
      <button ref={ref} type="button" {...restProps}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.5 15L7.5 10L12.5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {children}
      </button>
    );
  }
);
PrevButton.displayName = "PrevButton";

/**
 * Компонент кнопки "следующий" для карусели
 * @param props Пропсы кнопки
 */
export const NextButton = React.forwardRef<HTMLButtonElement, ArrowButtonProps>(
  ({ children, ...restProps }, ref) => {
    return (
      <button ref={ref} type="button" {...restProps}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.5 5L12.5 10L7.5 15"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {children}
      </button>
    );
  }
);
NextButton.displayName = "NextButton";