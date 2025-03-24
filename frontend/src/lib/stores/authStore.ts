'use client';

import { useAtom, useSetAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';
import {
  isAuthenticatedAtom,
  tokenAtom,
  userAtom,
  hydratedAtom,
  loginAtom,
  logoutAtom,
  refreshTokenAtom,
  initAuthAtom,
  checkSessionAtom,
} from '@/lib/atom/authAtom';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const [token, setToken] = useAtom(tokenAtom);
  const [user, setUser] = useAtom(userAtom);
  const isHydrated = useAtomValue(hydratedAtom);
  const login = useSetAtom(loginAtom);
  const logout = useSetAtom(logoutAtom);
  const refreshToken = useSetAtom(refreshTokenAtom);
  const initAuth = useSetAtom(initAuthAtom);
  const checkSession = useSetAtom(checkSessionAtom);

  useEffect(() => {
    if (!isHydrated) {
      initAuth();
    }
  }, [initAuth, isHydrated]);

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiresIn = payload.exp * 1000 - Date.now();
      
      if (expiresIn < 5 * 60 * 1000) {
        refreshToken();
      }
      
      const refreshInterval = setInterval(() => {
        refreshToken();
      }, Math.max(expiresIn - 5 * 60 * 1000, 60 * 1000));
      
      return () => clearInterval(refreshInterval);
    } catch (error) {
      console.error('Error setting up token refresh:', error);
      return undefined;
    }
  }, [isAuthenticated, token, refreshToken]);

  return {
    isAuthenticated,
    isHydrated,
    token,
    user,
    login,
    logout,
    refreshToken,
    checkSession,
  };
};