'use client'

import { useEffect, useState} from 'react';

const MOBILE_BREAKPOINT = 768;

/**
 * Хук для определения моб устройства
 * @returns Булевое значение
 */
export function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
        const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        mql.addEventListener('change', onChange);
        return () => mql.removeEventListener('change', onChange);
    }, []);

    return isMobile;
}