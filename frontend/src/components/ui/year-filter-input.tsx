"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { mergeClass } from "@/lib/utils/mergeClass";

// Возможные варианты диапазона для фильтрации годов
enum RANGE {
  MIN = "min",
  MAX = "max",
}

// Константы для минимального и максимального годов
const YEARS: [number, number] = [1965, new Date().getFullYear()];
const DEFAULT_YEAR_START = YEARS[0].toString();
const DEFAULT_YEAR_END = YEARS[1].toString();

// Пропсы компонента ввода года для фильтра
interface YearFilterInputProps {
  years: string[];
  setSelectingYears: (years: string[]) => void;
  handleChangeParam: (name: string, value: string | string[] | boolean) => void;
  range: RANGE;
}

/**
 * Компонент ввода года для фильтрации с дебаунсом и валидацией
 * @param props Пропсы компонента
 */
export const YearFilterInput: React.FC<YearFilterInputProps> = ({
  years,
  setSelectingYears,
  handleChangeParam,
  range,
}) => {
  const [yearValue, setYearValue] = React.useState<string>(
    range === RANGE.MIN ? years[0] : years[1]
  );
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  //Обновление параметров годов
  const changeYearsParams = React.useCallback((value: string[]) => {
    setSelectingYears(value);
    handleChangeParam("years", value);
  }, [setSelectingYears, handleChangeParam]);

  // Дебаунс для обновления параметров годов
  const debouncedChangeYearsParams = React.useCallback(
    (value: string[], delay: number = 400) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        changeYearsParams(value);
      }, delay);
    },
    [changeYearsParams]
  );

  // Сброс значения года, если оно некорректно
  const resetYearIfInvalid = React.useCallback(
    (yearValue: string, defaultYear: string, years: string[]) => {
      if (
        yearValue === "" ||
        Number(yearValue) < Number(DEFAULT_YEAR_START) ||
        Number(yearValue) > Number(DEFAULT_YEAR_END)
      ) {
        setYearValue(defaultYear);
        debouncedChangeYearsParams(
          range === RANGE.MIN ? [defaultYear, years[1]] : [years[0], defaultYear]
        );
      }
    },
    [range, debouncedChangeYearsParams]
  );

  //  Обработка изменения значения года
  const handleYearChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const digitsOnlyRegex = /^(?!0)\d+$/;
      const isInRange =
        Number(value) >= Number(DEFAULT_YEAR_START) &&
        Number(value) <= Number(DEFAULT_YEAR_END);

      if (!digitsOnlyRegex.test(value)) {
        if (range === RANGE.MIN && !value) {
          debouncedChangeYearsParams([DEFAULT_YEAR_START, years[1]]);
        }
        if (range === RANGE.MAX && !value) {
          debouncedChangeYearsParams([years[0], DEFAULT_YEAR_END]);
        }
        return setYearValue("");
      }

      if (range === RANGE.MIN) {
        if (isInRange) {
          if (Number(value) > Number(years[1])) {
            return debouncedChangeYearsParams([years[1], value]);
          }
          debouncedChangeYearsParams([value, years[1]]);
        }
      }

      if (range === RANGE.MAX) {
        if (isInRange) {
          if (Number(value) < Number(years[0])) {
            return debouncedChangeYearsParams([value, years[0]]);
          }
          debouncedChangeYearsParams([years[0], value]);
        }
      }

      setYearValue(value);
    },
    [range, years, debouncedChangeYearsParams]
  );

  React.useEffect(() => {
    setYearValue(range === RANGE.MIN ? years[0] : years[1]);
  }, [years, range]);

  return (
    <Input
      type="text"
      className={mergeClass(
        "w-[72px] h-[35px] bg-white/5 border-white/5 text-white/60 text-center",
        "hover:bg-white/10 focus:bg-white/10 focus:text-white",
        "rounded-full text-[13px] font-medium"
      )}
      value={yearValue}
      onChange={handleYearChange}
      onBlur={() =>
        resetYearIfInvalid(
          yearValue,
          range === RANGE.MIN ? DEFAULT_YEAR_START : DEFAULT_YEAR_END,
          years
        )
      }
    />
  );
};