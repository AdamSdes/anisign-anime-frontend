import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Устанавливаем таймер для обновления значения
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Очищаем таймер при изменении value или размонтировании
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}
