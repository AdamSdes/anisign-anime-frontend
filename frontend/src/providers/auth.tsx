'use client'

import { useEffect } from "react";
import { useAuth } from "@/lib/stores/authStore";

/**
 * Провайдер для инициализации авторизации
 * @param children Дочерние компоненты
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { initAuth, hydrated } = useAuth();
    useEffect(() => {
        if (!hydrated) {
            initAuth().catch((error) => {
                if (process.env.NODE_ENV === 'development') {
                    console.error('Ошибка инициализации авторизации', error);
                }
            });
        }
    }, [hydrated, initAuth]);

    

    return <>{children}</>;
}