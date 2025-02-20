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

        // Запускаем проверку срока действия токена
        get().checkTokenExpiration();
      },

      logout: async () => {
        try {
          // Используем правильный endpoint для logout
          await axiosInstance.post('/auth/logout', {}, {
            withCredentials: true
          });
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Logout error:', error);
          }
        } finally {
          // Всегда очищаем состояние, даже если запрос не удался
          set({ isAuthenticated: false, token: null, user: null });
        }
      },

      checkTokenExpiration: () => {
        const token = get().token;
        if (!token) return;

        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000;
        const currentTime = Date.now();
        const timeUntilExpiration = expirationTime - currentTime;

        // Логируем состояние токена только в режиме разработки
        if (process.env.NODE_ENV === 'development') {
          console.log('Token status:', {
            expiresIn: Math.floor(timeUntilExpiration / 1000),
            willRefreshIn: Math.floor((timeUntilExpiration - 300000) / 1000),
            currentTime: new Date(currentTime).toISOString(),
            expirationTime: new Date(expirationTime).toISOString()
          });
        }

        // Обновляем токен только если до истечения осталось менее 5 минут
        // и у нас еще нет активного запроса на обновление
        if (timeUntilExpiration < 300000 && !get().isRefreshing) {
          set({ isRefreshing: true });
          
          if (process.env.NODE_ENV === 'development') {
            console.log('Attempting to refresh token...');
          }

          axiosInstance.get('/auth/refresh-token', {
            params: {
              remember_me: true
            }
          })
            .then(response => {
              const { access_token } = response.data;
              if (process.env.NODE_ENV === 'development') {
                console.log('Token refreshed successfully');
              }
              get().login(access_token);
            })
            .catch(error => {
              console.error('Token refresh error:', error);
              get().logout();
            })
            .finally(() => {
              set({ isRefreshing: false });
            });
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

          // Проверяем срок действия токена
          const payload = JSON.parse(atob(token.split('.')[1]));
          const expirationTime = payload.exp * 1000;
          const currentTime = Date.now();

          if (currentTime >= expirationTime) {
            // Токен истек, пробуем обновить
            try {
              const response = await axiosInstance.get('/auth/refresh-token', {
                params: {
                  remember_me: true
                }
              });
              const { access_token } = response.data;
              await get().login(access_token);
            } catch (error) {
              if (process.env.NODE_ENV === 'development') {
                console.error('Failed to refresh token during init:', error);
              }
              await get().logout();
            }
          } else {
            // Токен действителен, получаем данные пользователя
            const decoded = jwtDecode(token);
            const response = await axiosInstance.get(`/user/get-user-by-username/${decoded.sub}`);
            set({ user: response.data, isAuthenticated: true });

            // Устанавливаем интервал проверки токена
            const checkInterval = setInterval(() => {
              get().checkTokenExpiration();
            }, 300000); // Проверяем каждые 5 минут вместо каждой минуты

            // Очищаем интервал при выходе
            window.addEventListener('beforeunload', () => {
              clearInterval(checkInterval);
            });
          }
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Auth initialization error:', error);
          }
          await get().logout();
        } finally {
          set({ hydrated: true });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
        }
      }
    }
  )
);
