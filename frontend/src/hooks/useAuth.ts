'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from "jwt-decode";
import { User } from '@/lib/types/auth';
import { axiosInstance } from '@/lib/api/axiosConfig';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  hydrated: boolean;
  isRefreshing: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  checkTokenExpiration: () => void;
  setHydrated: (value: boolean) => void;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      token: null,
      user: null,
      hydrated: false,
      isRefreshing: false,

      login: async (token: string) => {
        set({ isAuthenticated: true, token });
        
        try {
          const decoded = jwtDecode(token);
          if (decoded && typeof decoded === 'object' && 'sub' in decoded) {
            const response = await axiosInstance.get(`/user/get-user-by-username/${decoded.sub}`);
            const userData = response.data;
            set({
              user: {
                id: userData.id,
                username: userData.username,
                email: userData.email,
                user_avatar: userData.user_avatar || userData.avatar,
                user_banner: userData.user_banner || userData.banner,
                nickname: userData.nickname
              }
            });
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
          set({ isAuthenticated: false, token: null, user: null });
        }
      },

      checkTokenExpiration: () => {
        const token = get().token;
        if (!token) return;

        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const expirationTime = payload.exp * 1000;
          const currentTime = Date.now();
          const timeUntilExpiration = expirationTime - currentTime;
          
          // Обновляем токен только если:
          // 1. До истечения осталось менее 5 минут
          // 2. У нас еще нет активного запроса на обновление
          // 3. Токен действительно существует и не истек
          if (timeUntilExpiration > 0 && 
              timeUntilExpiration < 300000 && 
              !get().isRefreshing) {
            
            set({ isRefreshing: true });
            
            axiosInstance.get('/auth/refresh-token', {
              params: { remember_me: true }
            })
              .then(response => {
                const { access_token } = response.data;
                get().login(access_token);
              })
              .catch(() => {
                get().logout();
              })
              .finally(() => {
                set({ isRefreshing: false });
              });
          }
        } catch (error) {
          // Если возникла ошибка при парсинге токена, выходим из системы
          get().logout();
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

          const payload = JSON.parse(atob(token.split('.')[1]));
          const expirationTime = payload.exp * 1000;
          const currentTime = Date.now();

          if (currentTime >= expirationTime) {
            try {
              const response = await axiosInstance.get('/auth/refresh-token', {
                params: { remember_me: true }
              });
              const { access_token } = response.data;
              await get().login(access_token);
            } catch (error) {
              await get().logout();
            }
          } else {
            await get().login(token);
          }
        } catch (error) {
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
