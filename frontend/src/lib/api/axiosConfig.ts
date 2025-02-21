'use client';

import axios from 'axios';
import { useAuthStore } from '@/hooks/useAuth';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5 seconds timeout
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Для auth/token используем form-urlencoded
    if (config.url?.includes('/auth/token')) {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      return config;
    }

    // Для загрузки файлов используем multipart/form-data
    if (config.url?.includes('update-my-avatar') || config.url?.includes('update-my-banner')) {
      config.headers['Content-Type'] = 'multipart/form-data';
      return config;
    }

    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Если получили 401 и это не запрос на обновление токена
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('Received 401, attempting to refresh token...');
      originalRequest._retry = true;

      try {
        const response = await axiosInstance.get('/auth/refresh-token', {
          params: {
            remember_me: true // или можно получать из состояния useAuthStore
          }
        });
        const { access_token } = response.data;
        
        console.log('Token refreshed via interceptor');
        // Сохраняем новый токен
        await useAuthStore.getState().login(access_token);
        
        // Повторяем оригинальный запрос с новым токеном
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        // Если не удалось обновить токен, разлогиниваем пользователя
        await useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);