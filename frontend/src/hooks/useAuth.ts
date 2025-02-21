'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from "jwt-decode";
import { User } from '@/lib/types/auth';
import { axiosInstance } from '@/lib/api/axiosConfig';

// Кэш для данных пользователя
const userCache = new Map<string, { data: User; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

// Утилиты для работы с токеном
const tokenUtils = {
  decode: (token: string) => {
    try {
      return jwtDecode(token) as { sub: string; exp: number };
    } catch {
      return null;
    }
  },

  getExpiration: (token: string) => {
    const decoded = tokenUtils.decode(token);
    return decoded ? decoded.exp * 1000 : 0;
  },

  isExpired: (token: string) => {
    const exp = tokenUtils.getExpiration(token);
    return Date.now() >= exp;
  },

  needsRefresh: (token: string) => {
    const exp = tokenUtils.getExpiration(token);
    const timeUntilExpiration = exp - Date.now();
    return timeUntilExpiration > 0 && timeUntilExpiration < 300000;
  }
};

// Утилиты для работы с данными пользователя
const userUtils = {
  async fetchUserData(username: string): Promise<User> {
    const cached = userCache.get(username);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    const response = await axiosInstance.get(`/user/get-user-by-username/${username}`);
    const userData = response.data;
    const user = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      user_avatar: userData.user_avatar || userData.avatar,
      user_banner: userData.user_banner || userData.banner,
      nickname: userData.nickname
    };

    userCache.set(username, { data: user, timestamp: Date.now() });
    return user;
  },

  clearCache() {
    userCache.clear();
  }
};

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  hydrated: boolean;
  isRefreshing: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  checkTokenExpiration: () => Promise<void>;
  setHydrated: (value: boolean) => void;
  initAuth: () => Promise<void>;
  // Селекторы
  getUser: () => User | null;
  getIsAuthenticated: () => boolean;
  getToken: () => string | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      token: null,
      user: null,
      hydrated: false,
      isRefreshing: false,

      // Мемоизированные селекторы
      getUser: () => get().user,
      getIsAuthenticated: () => get().isAuthenticated,
      getToken: () => get().token,

      login: async (token: string) => {
        set({ isAuthenticated: true, token });
        
        try {
          const decoded = tokenUtils.decode(token);
          if (decoded?.sub) {
            const user = await userUtils.fetchUserData(decoded.sub);
            set({ user });
          }
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error fetching user data:', error);
          }
        }
      },

      logout: async () => {
        try {
          await axiosInstance.post('/auth/logout', {}, {
            withCredentials: true
          });
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Logout error:', error);
          }
        } finally {
          userUtils.clearCache();
          set({ isAuthenticated: false, token: null, user: null });
        }
      },

      checkTokenExpiration: async () => {
        const token = get().token;
        if (!token || get().isRefreshing) return;

        if (tokenUtils.needsRefresh(token)) {
          set({ isRefreshing: true });
          
          try {
            const response = await axiosInstance.get('/auth/refresh-token', {
              params: { remember_me: true }
            });
            await get().login(response.data.access_token);
          } catch {
            await get().logout();
          } finally {
            set({ isRefreshing: false });
          }
        }
      },

      setHydrated: (value: boolean) => {
        set({ hydrated: value });
      },

      initAuth: async () => {
        try {
          const token = get().token;
          if (!token) {
            set({ hydrated: true });
            return;
          }

          if (tokenUtils.isExpired(token)) {
            try {
              const response = await axiosInstance.get('/auth/refresh-token', {
                params: { remember_me: true }
              });
              await get().login(response.data.access_token);
            } catch {
              await get().logout();
            }
          } else {
            await get().login(token);
          }
        } catch {
          await get().logout();
        } finally {
          set({ hydrated: true });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
      onRehydrateStorage: () => {
        return (state) => {
          state?.setHydrated(true);
        };
      },
    }
  )
);
