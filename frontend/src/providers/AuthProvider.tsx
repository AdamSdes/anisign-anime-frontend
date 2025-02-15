'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/hooks/useAuth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initAuth, hydrated } = useAuthStore();

  useEffect(() => {
    console.log('[AuthProvider] Checking hydration status:', hydrated);
    
    if (hydrated) {
      console.log('[AuthProvider] Store is hydrated, initializing auth');
      initAuth().catch(error => {
        console.error('[AuthProvider] Error initializing auth:', error);
      });
    }
  }, [hydrated, initAuth]);

  if (!hydrated) {
    console.log('[AuthProvider] Waiting for store hydration');
    return null;
  }

  return <>{children}</>;
}