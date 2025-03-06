'use client'

import { QueryClient, QueryClientProvider} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

/**
 * Провайдер для React Query + кэширования
 * @param children Дочерние компоненты
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => {
        return new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: 60 * 1000,
                    retry: 1,
                    refetchOnWindowFocus: false,
                },
            },
        });
    });

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} position="bottom" />
        </QueryClientProvider>
    )
}