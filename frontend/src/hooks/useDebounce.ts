'use client'

import { useEffect, useState } from "react";

/**
 * Хук для дебаунса значения
 * @param value Значение
 * @param delay Время задержки мл
 * @returns Значение 
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}