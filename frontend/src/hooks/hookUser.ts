'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/services/user'; 
import { useAuth } from '@/lib/stores/authStore';
import { login, register, logout, updateAvatar, updateBanner } from '@/services/auth';
import { LoginData, RegisterData } from '@/shared/types/auth';

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

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { login: authLogin } = useAuth();

  return useMutation({
    mutationKey: userKeys.mutations.login(),
    mutationFn: (data: LoginData) => login(data),
    onSuccess: async (response) => {
      const queries = queryClient
        .getQueryCache()
        .findAll({ queryKey: userKeys.avatar() });
      queries.forEach((query) => {
        const data = query.state.data;
        if (typeof data === 'string' && data.startsWith('blob:')) {
          URL.revokeObjectURL(data);
        }
        queryClient.removeQueries({ queryKey: query.queryKey });
      });
      await authLogin(response.access_token);
    },
  });
};

export const useRegister = () =>
  useMutation({
    mutationKey: userKeys.mutations.register(),
    mutationFn: (data: RegisterData) => register(data),
  });

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout: authLogout } = useAuth();

  return useMutation({
    mutationKey: userKeys.mutations.logout(),
    mutationFn: authLogout,
    onSuccess: () => {
      const queries = queryClient
        .getQueryCache()
        .findAll({ queryKey: userKeys.avatar() });
      queries.forEach((query) => {
        const data = query.state.data;
        if (typeof data === 'string' && data.startsWith('blob:')) {
          URL.revokeObjectURL(data);
        }
        queryClient.removeQueries({ queryKey: query.queryKey });
      });
    },
  });
};

export const useUser = (username: string) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: userKeys.user(username),
    queryFn: () => userApi.getUserByUsername(username),
    enabled: !!username && isAuthenticated,
  });
};

export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationKey: userKeys.mutations.updateAvatar(),
    mutationFn: updateAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.avatar() });
      if (user?.username) queryClient.invalidateQueries({ queryKey: userKeys.user(user.username) });
    },
  });
};

export const useMyBanner = () => {
  const { isAuthenticated, user } = useAuth();
  return useQuery({
    queryKey: userKeys.banner(),
    queryFn: () => userApi.getMyBanner(),
    enabled: isAuthenticated && !!user,
    initialData: user?.user_banner,
  });
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationKey: userKeys.mutations.updateBanner(),
    mutationFn: updateBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.banner() });
      if (user?.username) queryClient.invalidateQueries({ queryKey: userKeys.user(user.username) });
    },
  });
};

export const useSearchUsers = (query: string) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: userKeys.search(query),
    queryFn: () => userApi.searchUsers(query),
    enabled: !!query && query.length >= 2 && isAuthenticated,
  });
};