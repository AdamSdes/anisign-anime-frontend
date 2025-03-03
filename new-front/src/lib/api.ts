import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useTranslations } from 'next-intl';
import { useAuthState } from './stores/authStore';
import { Anime, AnimeListResponse, Episode, ReleaseCalendar, ViewHistory } from '@/shared/types/anime';
import { User } from '@/shared/types/user';
import { Comment, CommentResponse } from '@/shared/types/comment';
import { Character } from '@/shared/types/character';
import { Notification } from '@/shared/types/notification';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';


const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Интерфейс для конфигурации запросов
interface ApiConfig extends AxiosRequestConfig {
  useAuth?: boolean; 
}

/**
 * Утилита для выполнения HTTP-запросов к API с поддержкой авторизации и мультиязычности.
 * @param config Конфигурация запроса (URL, метод, данные, заголовки, etc.).
 * @returns Promise с ответом API или ошибкой.
 */
export async function apiRequest<T = any>(config: ApiConfig): Promise<AxiosResponse<T>> {
  const t = useTranslations('common');
  const { token } = useAuthState();

  if (config.useAuth && token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  try {
    const response = await axiosInstance(config);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || t('apiError');
      throw new Error(message);
    }
    throw new Error(t('networkError'));
  }
}

// Перехватчики для обработки запросов и ответов
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const t = useTranslations('common');
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || t('apiError');
      return Promise.reject(new Error(message));
    }
    return Promise.reject(new Error(t('networkError')));
  }
);

// Получение списка аниме с фильтрацией
export const getAnimeList = (params: {
  sort?: 'popular' | 'new' | 'top';
  genre?: string;
  year?: number;
  type?: string;
  status?: string;
  page?: number;
  limit?: number;
} = {}) => {
  return apiRequest<AnimeListResponse>({
    url: '/anime',
    method: 'GET',
    params: {
      sort: params.sort || 'popular',
      genre: params.genre,
      year: params.year,
      type: params.type,
      status: params.status,
      page: params.page || 1,
      limit: params.limit || 20,
    },
    useAuth: false,
  });
};

// Получение деталей аниме по ID
export const getAnimeDetails = (id: string) => {
  return apiRequest<Anime>({
    url: `/anime/${id}`,
    method: 'GET',
    useAuth: false,
  });
};

// Получение списка эпизодов для аниме
export const getAnimeEpisodes = (id: string) => {
  return apiRequest<Episode[]>({
    url: `/anime/${id}/episodes`,
    method: 'GET',
    useAuth: false,
  });
};

// Получение комментариев к аниме
export const getAnimeComments = (id: string, page: number = 1, limit: number = 10) => {
    return apiRequest<CommentResponse>({
      url: `/anime/${id}/comments`,
      method: 'GET',
      params: { page, limit },
      useAuth: false,
    });
};
  
// Добавление комментария к аниме
export const postAnimeComment = (id: string, text: string) => {
    return apiRequest<Comment>({
      url: `/anime/${id}/comments`,
      method: 'POST',
      data: { text },
      useAuth: true,
    });
};

// Добавление аниме в список пользователя 
export const updateAnimeList = (id: string, status: 'watching' | 'planned' | 'dropped' | 'completed' | 'on_hold') => {
  return apiRequest<void>({
    url: `/users/me/anime/${id}`,
    method: 'PUT',
    data: { status },
    useAuth: true,
  });
};

// Получение календаря релизов
export const getReleaseCalendar = (startDate?: string, endDate?: string) => {
  return apiRequest<ReleaseCalendar>({
    url: '/calendar',
    method: 'GET',
    params: { start_date: startDate, end_date: endDate },
    useAuth: false,
  });
};

// Получение данных пользователя
export const getUserProfile = (userId?: string) => {
  return apiRequest<User>({
    url: userId ? `/users/${userId}` : '/users/me',
    method: 'GET',
    useAuth: true,
  });
};

// Получение истории просмотров пользователя
export const getViewHistory = () => {
  return apiRequest<ViewHistory[]>({
    url: '/users/me/history',
    method: 'GET',
    useAuth: true,
  });
};

// Добавление друга
export const addFriend = (friendId: string) => {
  return apiRequest<void>({
    url: '/users/me/friends',
    method: 'POST',
    data: { friend_id: friendId },
    useAuth: true,
  });
};

// Удаление друга
export const removeFriend = (friendId: string) => {
  return apiRequest<void>({
    url: `/users/me/friends/${friendId}`,
    method: 'DELETE',
    useAuth: true,
  });
};

// Вход пользователя
export const login = (credentials: { identifier: string; password: string }) => {
  return apiRequest<{ token: string; user: User }>({
    url: '/auth/login',
    method: 'POST',
    data: credentials,
    useAuth: false,
  });
};

// Регистрация пользователя
export const register = (credentials: { username: string; email: string; password: string }) => {
  return apiRequest<{ token: string; user: User }>({
    url: '/auth/register',
    method: 'POST',
    data: credentials,
    useAuth: false,
  });
};

// Восстановление пароля
export const forgotPassword = (email: string) => {
  return apiRequest<void>({
    url: '/auth/forgot-password',
    method: 'POST',
    data: { email },
    useAuth: false,
  });
};

// Вход через соцсети
export const socialLogin = (provider: 'google' | 'discord', code: string) => {
    return apiRequest({
      url: `/auth/${provider}/callback?code=${encodeURIComponent(code)}`,
      method: 'get',
      useAuth: false, 
    });
};

// Получение деталей персонажа по его ID
export const getCharacterDetails = (characterId: string) => {
    return apiRequest<Character>({
        url: `/characters/${characterId}`,
        method: 'GET',
        useAuth: false,
    });
};

// Получаение списка персонажей
export const getCharactersForAnime = (animeId: string) => {
    return apiRequest<Character[]>({
        url: `/anime/${animeId}/characters`,
        method: 'GET',
        useAuth: false,
    });
};

// Получение уведомлений
export async function fetchNotifications(): Promise<Notification[]> {
    const response = await apiRequest<Notification[]>({
        url: '/notifications',
        method: 'GET',
        useAuth: true,
    });
    return response.data;
} 