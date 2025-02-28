import { useEffect, RefObject } from 'react';
import { useTranslations } from 'next-intl';

/**
 * Хук для обработки кликов вне указаного елемента
 * Используется для закрытия модальных окон, tooltip и других UI-элементов при клике вне их области. *
 * @template T - Тип HTML-элемента, к которому привязан ref.
 * @param ref - RefObject, указывающий на элемент, за пределами которого отслеживаются клики.
 * @param handler - Функция-обработчик, вызываемая при клике вне элемента.
*/
export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
    ref: RefObject<T>,
    handler: (event: MouseEvent | TouchEvent) => void
) : void {
    const t = useTranslations('common');
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            const el = ref?.current;
            if (!el || el.contains(event.target as Node)) {
                return;
            }
            try {
                handler(event);
            } catch (error) {
                console.error(t('errorOnClickOutside'), error);
            }
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler, t]);
}