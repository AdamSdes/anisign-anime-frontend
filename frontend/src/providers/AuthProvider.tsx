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
        <div className="h-5 w-5 animate-spin border-2 border-[#CCBAE4] border-t-transparent rounded-full" />
      </div>
    );
  }

  return <>{children}</>;
}