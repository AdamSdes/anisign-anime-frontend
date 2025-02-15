'use client';

import axios from 'axios';
import { useAuthStore } from '@/hooks/useAuth';

// Создаем базовый инстанс axios
export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('[Axios] Preparing request:', {
      url: config.url,
      method: config.method,
      withCredentials: config.withCredentials
    });

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

    // Получаем токен из хранилища
    let token = null;
    try {
      if (typeof window !== 'undefined') {
        token = useAuthStore.getState()?.token;
        if (token) {
          console.log('[Axios] Adding token to request');
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error('[Axios] Error getting token:', error);
    }

    return config;
  },
  (error) => {
    console.error('[Axios] Request error:', error);
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (error: any) => void; }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  console.log('[Axios] Processing failed queue:', {
    hasError: !!error,
    queueLength: failedQueue.length,
    token: token ? 'present' : 'absent'
  });
  
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('[Axios] Response received:', {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText
    });
    return response;
  },
  async (error) => {
    console.error('[Axios] Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      error: error.message
    });

    const originalRequest = error.config;

    // Если ошибка 401 и это не запрос на обновление токена
    if (error.response?.status === 401 && 
        !originalRequest._retry && 
        !originalRequest.url?.includes('/auth/refresh-token') &&
        !originalRequest.url?.includes('/auth/token')) {
      
      console.log('[Axios] Handling 401 error:', {
        isRefreshing,
        originalUrl: originalRequest.url
      });

      if (isRefreshing) {
        console.log('[Axios] Token refresh in progress, queueing request');
        try {
          const token = await new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          console.log('[Axios] Request dequeued, retrying with new token');
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          console.error('[Axios] Failed to process queued request:', err);
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('[Axios] Attempting to refresh token');
        const response = await axiosInstance.get('/auth/refresh-token');
        
        const token = response.data.access_token;
        if (token) {
          console.log('[Axios] Token refresh successful');
          // Безопасно получаем store
          const authStore = typeof window !== 'undefined' ? useAuthStore.getState() : null;
          if (authStore) {
            authStore.login(token);
          }
          processQueue(null, token);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        } else {
          console.error('[Axios] Refresh token response missing access_token');
          processQueue(new Error('Failed to refresh token'));
          if (typeof window !== 'undefined') {
            console.log('[Axios] Redirecting to auth page');
            window.location.href = '/auth';
          }
          return Promise.reject(error);
        }
      } catch (refreshError) {
        console.error('[Axios] Token refresh failed:', refreshError);
        processQueue(refreshError);
        if (typeof window !== 'undefined') {
          console.log('[Axios] Logging out user and redirecting to auth page');
          const authStore = useAuthStore.getState();
          if (authStore) {
            authStore.logout();
          }
          window.location.href = '/auth';
        }
        throw refreshError;
      } finally {
        console.log('[Axios] Resetting refresh state');
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);