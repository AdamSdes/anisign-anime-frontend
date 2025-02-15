'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi, UserResponse } from '@/services/api/user';
import { useAuthStore } from './useAuth';
import { login as authLogin, register as authRegister, logout as authLogout } from '@/lib/auth';
import { LoginData, RegisterData } from '@/lib/types/auth';

// Ключи для запросов
export const userKeys = {
  all: ['users'] as const,
  currentUser: () => [...userKeys.all, 'me'] as const,
  avatar: () => [...userKeys.all, 'avatar'] as const,
  banner: () => [...userKeys.all, 'banner'] as const,
  search: (query: string) => [...userKeys.all, 'search', query] as const,
  user: (username: string) => [...userKeys.all, 'user', username] as const,
  mutations: {
    login: () => [...userKeys.all, 'login'] as const,
    register: () => [...userKeys.all, 'register'] as const,
    logout: () => [...userKeys.all, 'logout'] as const,
    updateAvatar: () => [...userKeys.all, 'updateAvatar'] as const,
    updateBanner: () => [...userKeys.all, 'updateBanner'] as const,
  },
};

// Хук для авторизации
export const useLogin = () => {
  const queryClient = useQueryClient();
  const { login } = useAuthStore();

  return useMutation({
    mutationKey: userKeys.mutations.login(),
    mutationFn: (data: LoginData) => authLogin(data),
    onSuccess: async (response) => {
      // Находим и очищаем все blob URLs в кэше
      const queries = queryClient.getQueryCache().findAll(['users', 'avatar']);
      queries.forEach(query => {
        const data = query.state.data;
        if (typeof data === 'string' && data.startsWith('blob:')) {
          URL.revokeObjectURL(data);
        }
        // Удаляем запрос из кэша
        queryClient.removeQueries({ queryKey: query.queryKey });
      });
      
      // Обновляем состояние авторизации в Zustand
      if (response.access_token) {
        await login(response.access_token);
      }
    },
  });
};

// Хук для регистрации
export const useRegister = () => {
  return useMutation({
    mutationKey: userKeys.mutations.register(),
    mutationFn: (data: RegisterData) => authRegister(data),
  });
};

// Хук для выхода
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: userKeys.mutations.logout(),
    mutationFn: authLogout,
    onSuccess: () => {
      // Находим и очищаем все blob URLs в кэше
      const queries = queryClient.getQueryCache().findAll(['users', 'avatar']);
      queries.forEach(query => {
        const data = query.state.data;
        if (typeof data === 'string' && data.startsWith('blob:')) {
          URL.revokeObjectURL(data);
        }
        // Удаляем запрос из кэша
        queryClient.removeQueries({ queryKey: query.queryKey });
      });
    },
  });
};

// Хук для получения данных пользователя по username
export const useUser = (username: string) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery({
    queryKey: userKeys.user(username),
    queryFn: () => userApi.getUserByUsername(username),
    enabled: !!username && isAuthenticated,
  });
};

// Хук для обновления аватара
export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: userKeys.mutations.updateAvatar(),
    mutationFn: (file: File) => userApi.updateAvatar(new FormData().append('file', file)),
    onSuccess: () => {
      // Инвалидируем кэш аватара и данных пользователя
      queryClient.invalidateQueries({ queryKey: userKeys.avatar() });
      queryClient.invalidateQueries({ queryKey: userKeys.user(useAuthStore.getState().user?.username || '') });
    },
  });
};

// Хук для получения баннера текущего пользователя
export const useMyBanner = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);

  return useQuery({
    queryKey: userKeys.banner(),
    queryFn: userApi.getMyBanner,
    enabled: isAuthenticated && !!user,
    initialData: user?.user_banner,
  });
};

// Хук для обновления баннера
export const useUpdateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: userKeys.mutations.updateBanner(),
    mutationFn: (file: File) => userApi.updateBanner(new FormData().append('file', file)),
    onSuccess: () => {
      // Инвалидируем кэш баннера и данных пользователя
      queryClient.invalidateQueries({ queryKey: userKeys.banner() });
      queryClient.invalidateQueries({ queryKey: userKeys.user(useAuthStore.getState().user?.username || '') });
    },
  });
};

// Хук для поиска пользователей
export const useSearchUsers = (query: string) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery({
    queryKey: userKeys.search(query),
    queryFn: () => userApi.searchUsers(query),
    enabled: !!query && query.length >= 2 && isAuthenticated,
  });
};
