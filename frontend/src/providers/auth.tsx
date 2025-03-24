'use client'

import { useEffect } from "react";
import { useAuth } from "@/lib/stores/authStore";

/**
 * Провайдер для инициализации авторизации
 * @param children Дочерние компоненты
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const auth = useAuth();
    
    useEffect(() => {
        if (!auth.isHydrated) {
            auth.checkSession().catch((error: unknown) => {
                if (process.env.NODE_ENV === 'development') {
                    console.error('Ошибка инициализации авторизации', error);
                }
            });
        }
    }, [auth.isHydrated, auth.checkSession]);

    return <>{children}</>;
}