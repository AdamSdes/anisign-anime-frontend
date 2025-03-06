'use client';

import axios, { AxiosError } from 'axios';
import { atom, useAtom } from 'jotai';
import { initAuthAtom, loginAtom, logoutAtom } from '@/lib/atom/authAtom';
import React from 'react';

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (config.url?.includes('/auth/token')) {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    } else if (
      config.url?.includes('update-my-avatar') ||
      config.url?.includes('update-my-banner')
    ) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }

    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean };
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const response = await axiosInstance.get<{ access_token: string }>('/auth/refresh-token', {
        params: { remember_me: true },
      });
      const { access_token } = response.data;

      setAuthToken(access_token);
      
      originalRequest.headers.Authorization = `Bearer ${access_token}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      setAuthToken(null);
      return Promise.reject(refreshError);
    }
  }
);

export const useAuthTokenSync = () => {
  const [token] = useAtom(initAuthAtom);
  const [, setLogin] = useAtom(loginAtom);
  const [, logout] = useAtom(logoutAtom);

  React.useEffect(() => {
    setAuthToken(token);
  }, [token]);

  return {
    setLogin: (token: string) => {
      setAuthToken(token);
      setLogin(token);
    },
    logout: async () => {
      setAuthToken(null);
      await logout();
    }
  };
};