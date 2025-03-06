import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Объединяет классы Tailwing с помощью clsx и twMerge
 * @param inputs Список классов и условий
 * @returns Объединенный класс
 */
export function mergeClass(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}