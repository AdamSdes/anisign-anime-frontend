'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/hooks/useAuth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initAuth, hydrated } = useAuthStore();

  useEffect(() => {
    if (hydrated) {
      initAuth().catch(error => {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error initializing auth:', error);
        }
      });
    }
  }, [hydrated, initAuth]);

  if (!hydrated) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return <>{children}</>;
}