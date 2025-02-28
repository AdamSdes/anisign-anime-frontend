import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Комбинирует и сливает стили CSS-классов для использования с Tailwind CSS.
 * @param inputs - Массив или значения классов (строки, объекты, массивы).
 * @returns Объединённая строка классов, оптимизированная для Tailwind.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}