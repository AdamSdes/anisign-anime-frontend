'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from "jwt-decode";
import { AuthState, User } from '@/lib/types/auth';
import { axiosInstance } from '@/lib/api/axiosConfig';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      hydrated: false,

      setUser: (user) => {
        console.log('[useAuth] Setting user:', user);
        set({ user });
      },
      
      setIsAuthenticated: (value) => {
        console.log('[useAuth] Setting isAuthenticated:', value);
        set({ isAuthenticated: value });
      },

      setHydrated: (value: boolean) => {
        console.log('[useAuth] Setting hydrated:', value);
        set({ hydrated: value });
      },
      
      login: async (token) => {
        console.log('[useAuth] Login called with token');
        set({ token, isAuthenticated: true });
        
        try {
          console.log('[useAuth] Decoding token...');
          const decoded = jwtDecode(token);
          console.log('[useAuth] Token decoded:', decoded);
          
          if (decoded && typeof decoded === 'object' && 'sub' in decoded) {
            // Получаем полные данные пользователя
            console.log('[useAuth] Fetching full user data for:', decoded.sub);
            const response = await axiosInstance.get(`/user/get-user-by-username/${decoded.sub}`);
            const userData = response.data;
            console.log('[useAuth] Received user data:', userData);

            const updateUserData = (userData: any) => {
              console.log('[useAuth] Updating user data:', userData);
              set({
                user: {
                  id: userData.id,
                  username: userData.username,
                  email: userData.email,
                  user_avatar: userData.user_avatar || userData.avatar, // Поддерживаем оба варианта
                  user_banner: userData.user_banner || userData.banner, // Поддерживаем оба варианта
                  nickname: userData.nickname,
                  isPro: userData.isPro,
                  isVerified: userData.isVerified,
                  joinedDate: userData.joinedDate,
                },
                isAuthenticated: true,
              });
            };

            updateUserData(userData);
          } else {
            console.error('[useAuth] Invalid token payload:', decoded);
            throw new Error('Invalid token payload');
          }
        } catch (error) {
          console.error('[useAuth] Error during login:', error);
          set({ token: null, user: null, isAuthenticated: false });
          throw error;
        }
      },

      logout: async () => {
        console.log('[useAuth] Logout called');
        try {
          await axiosInstance.post('/auth/logout');
          console.log('[useAuth] Logout request successful');
        } catch (error) {
          console.error('[useAuth] Error during logout request:', error);
        }
        
        console.log('[useAuth] Clearing auth state');
        set({ 
          isAuthenticated: false, 
          user: null,
          token: null
        });
      },

      checkSession: async () => {
        console.log('[useAuth] Checking session...');
        const token = get().token;
        
        if (!token) {
          console.log('[useAuth] No token found, logging out');
          get().logout();
          return false;
        }

        try {
          console.log('[useAuth] Decoding token for session check');
          const decoded = jwtDecode(token);
          console.log('[useAuth] Decoded token:', decoded);
          
          if (typeof decoded === 'object' && 'exp' in decoded) {
            const expirationTime = (decoded.exp as number) * 1000;
            const now = Date.now();
            console.log('[useAuth] Token expiration check:', {
              expirationTime: new Date(expirationTime).toISOString(),
              now: new Date(now).toISOString(),
              isExpired: expirationTime <= now
            });
            
            if (expirationTime <= now) {
              console.log('[useAuth] Token expired, logging out');
              await get().logout();
              return false;
            }
            console.log('[useAuth] Token is valid');
            return true;
          } else {
            console.warn('[useAuth] Token does not contain expiration time');
          }
        } catch (error) {
          console.error('[useAuth] Error checking session:', error);
          await get().logout();
        }

        return false;
      },

      updateUserData: async (username: string) => {
        try {
          console.log('[useAuth] Updating user data for:', username);
          const response = await axiosInstance.get(`/user/get-user-by-username/${username}`);
          const userData = response.data;
          console.log('[useAuth] Received user data:', userData);

          const updateUserData = (userData: any) => {
            console.log('[useAuth] Updating user data:', userData);
            set({
              user: {
                id: userData.id,
                username: userData.username,
                email: userData.email,
                user_avatar: userData.user_avatar || userData.avatar, // Поддерживаем оба варианта
                user_banner: userData.user_banner || userData.banner, // Поддерживаем оба варианта
                nickname: userData.nickname,
                isPro: userData.isPro,
                isVerified: userData.isVerified,
                joinedDate: userData.joinedDate,
              },
              isAuthenticated: true,
            });
          };

          updateUserData(userData);
          return userData;
        } catch (error) {
          console.error('[useAuth] Error updating user data:', error);
          throw error;
        }
      },

      initAuth: async () => {
        console.log('[useAuth] Initializing auth');
        const isValid = await get().checkSession();
        console.log('[useAuth] Session check result:', isValid);
        
        if (!isValid) {
          console.log('[useAuth] Session invalid, logging out');
          await get().logout();
        } else {
          console.log('[useAuth] Session valid, updating user data');
          const token = get().token;
          if (token) {
            const decoded = jwtDecode(token);
            if (decoded && typeof decoded === 'object' && 'sub' in decoded) {
              // Получаем актуальные данные пользователя
              console.log('[useAuth] Fetching current user data for:', decoded.sub);
              try {
                const response = await axiosInstance.get(`/user/get-user-by-username/${decoded.sub}`);
                const userData = response.data;
                console.log('[useAuth] Received current user data:', userData);

                const updateUserData = (userData: any) => {
                  console.log('[useAuth] Updating user data:', userData);
                  set({
                    user: {
                      id: userData.id,
                      username: userData.username,
                      email: userData.email,
                      user_avatar: userData.user_avatar || userData.avatar, // Поддерживаем оба варианта
                      user_banner: userData.user_banner || userData.banner, // Поддерживаем оба варианта
                      nickname: userData.nickname,
                      isPro: userData.isPro,
                      isVerified: userData.isVerified,
                      joinedDate: userData.joinedDate,
                    },
                    isAuthenticated: true,
                  });
                };

                updateUserData(userData);
              } catch (error) {
                console.error('[useAuth] Error updating user data:', error);
              }
            }
          }
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage: () => (state) => {
        console.log('[useAuth] Rehydrating storage');
        if (state) {
          state.setHydrated(true);
        }
      }
    }
  )
);

export type AuthState = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  setHydrated: (value: boolean) => void;
  updateUserData: (username: string) => Promise<any>;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<boolean>;
  initAuth: () => Promise<void>;
};
