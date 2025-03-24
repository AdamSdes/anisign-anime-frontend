import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const STORAGE_KEY = 'auth_token';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    let token = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem(STORAGE_KEY);
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const response = await axiosInstance.get('/auth/refresh-token', {
          params: { remember_me: true },
        });
        
        if (response.data?.access_token) {
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, response.data.access_token);
          }
          
          originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
          
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    }
    
    return Promise.reject(error);
  }


);