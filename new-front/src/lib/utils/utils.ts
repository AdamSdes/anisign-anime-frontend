import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

/**
 * Хук для дебаунса значения с указаной задержкой
 * @template T Тип значения
 * @param value Значение для дебаунса
 * @param delay Задержка в мс
 * @returns Значение
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);
    const timer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        timer.current = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            if (timer.current) clearTimeout(timer.current);
        };
    }, [value, delay]);

    return debouncedValue;
};

/**
 * Проверяет является ли строка валидной почтой
 * @param email Строка для проверки
 * @returns true если строка валидная, false иначе
 */
export function isValidEmail(email: string): boolean {
    const t = useTranslations('common');
    const emailRegex =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        console.warn(t('invalidEmail'));
        return false;
    }
    return true;
};

/**
 * Троттлинг функции с указанным интервалом
 * @param func Функция
 * @param limit Интервал мс
 * @returns Функция
 */
export function useThrottle<T extends (...args: any[]) => any>(func: T, limit: number) {
    let inThrottle: boolean;
    return function (...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};