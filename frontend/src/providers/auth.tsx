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

    if (!hydrated) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-background">
                <div className="h-5 w-5 animate-spin border-2 border-[#CCBAE4] border-t-transparent rounded-full" />
            </div>
        );
    }

    return <>{children}</>;
}