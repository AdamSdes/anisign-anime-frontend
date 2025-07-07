import { useState, useEffect } from 'react';

/**
 * Хук для создания отложенного значения
 * @param value Значение, которое нужно отложить
 * @param delay Задержка в миллисекундах
 * @returns Отложенное значение
 */
export default function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Устанавливаем таймер для обновления значения после задержки
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Очищаем таймер при изменении значения или размонтировании компонента
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
