// lib/hooks/useAuth.ts
'use client';

import { useAtom } from 'jotai';
import useSWR from 'swr';
import {
  isAuthenticatedAtom,
  userAtom,
  tokenAtom,
  hydratedAtom,
  loginAtom,
  logoutAtom,
  checkSessionAtom,
  initAuthAtom,
  refreshTokenAtom,
} from '@/lib/atom/authAtom';
import { getCurrentUser, login as apiLogin, logout as apiLogout, updateAvatar, updateBanner } from '@/services/auth';
import { User } from '@/shared/types/auth';

/**
 * Хук для работы с авторизацией
 */
export function useAuth() {
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [user, setUser] = useAtom(userAtom);
  const [token] = useAtom(tokenAtom);
  const [hydrated] = useAtom(hydratedAtom);
  const [, login] = useAtom(loginAtom);
  const [, logout] = useAtom(logoutAtom);
  const [, checkSession] = useAtom(checkSessionAtom);
  const [, initAuth] = useAtom(initAuthAtom);
  const [, refreshToken] = useAtom(refreshTokenAtom);

  const { data: fetchedUser, error: userError, mutate } = useSWR<User, Error>(
    isAuthenticated ? '/auth/me' : null,
    getCurrentUser,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      onSuccess: (data) => setUser(data),
      onError: () => setUser(null),
    }
  );

  const handleLogin = async (token: string) => {
    await login(token); 
    await mutate(); 
  };

  const handleLogout = async () => {
    await apiLogout();
    logout();
    await mutate(); 
  };

  const handleUpdateAvatar = async (file: File) => {
    const avatarUrl = await updateAvatar(file);
    if (user) setUser({ ...user, user_avatar: avatarUrl });
    await mutate();
    return avatarUrl;
  };

  const handleUpdateBanner = async (file: File) => {
    const bannerUrl = await updateBanner(file);
    if (user) setUser({ ...user, user_banner: bannerUrl });
    await mutate();
    return bannerUrl;
  };

  return {
    isAuthenticated,
    user: fetchedUser || user,
    token,
    hydrated,
    userError,
    login: handleLogin,
    logout: handleLogout,
    checkSession,
    initAuth,
    refreshToken,
    updateAvatar: handleUpdateAvatar,
    updateBanner: handleUpdateBanner,
  };
}