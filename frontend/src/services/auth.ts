import { axiosInstance } from '@/lib/axios/axiosConfig';
import { LoginData, LoginResponse, RegisterData, User, ApiError } from '@/shared/types/auth';

/**
 * Вход пользователя
 * @param data Данные для входа
 * @returns Ответ с токеном доступа
 */
export async function login(data: LoginData): Promise<LoginResponse> {
    try {
      const formData = new URLSearchParams({
        username: data.username,
        password: data.password,
        grant_type: 'password',
        scope: '',
        client_id: '',
        client_secret: '',
      });
  
      const response = await axiosInstance.post<LoginResponse>(
        `/auth/token?remember_me=${data.remember_me || false}`,
        formData,
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          withCredentials: true,
        }
      );
  
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', response.data.access_token);
      }
  
      return response.data;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error, 'Ошибка входа');
      throw new Error(errorMessage);
    }
}
  
/**
 * Регистрация пользователя
 * @param data Данные для регистрации
 */
 export async function register(data: RegisterData): Promise<void> {
    try {
      await axiosInstance.post('/user/create-user', data, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error, 'Ошибка регистрации');
      throw new Error(errorMessage);
    }
}
  
/**
 * Обновление аватара пользователя
 * @param file Файл аватара
 * @returns URL обновленного аватара
 */
export async function updateAvatar(file: File): Promise<string> {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  
    try {
      if (file.size > maxSize) throw new Error('Размер файла не должен превышать 10MB');
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Поддерживаются только форматы: JPEG, PNG, WebP, GIF');
      }
  
      const formData = new FormData();
      formData.append('file', file);
  
      await axiosInstance.put('/user/update-my-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      });
  
      const avatarResponse = await axiosInstance.get<{ avatar_url: string }>('/user/get-my-avatar');
      const avatarUrl = avatarResponse.data.avatar_url;
      if (!avatarUrl) throw new Error('Не удалось получить URL аватара');
  
      return avatarUrl;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error, 'Ошибка обновления аватара');
      throw new Error(errorMessage);
    }
}
  
/**
 * Получение URL баннера пользователя
 * @returns URL баннера
 */
export async function getBanner(): Promise<string> {
    try {
      const response = await axiosInstance.get<{ banner_url: string }>('/user/get-my-banner');
      return response.data.banner_url;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error, 'Ошибка получения баннера');
      throw new Error(errorMessage);
    }
}
  
/**
 * Обновление баннера пользователя
 * @param file Файл баннера
 * @returns URL обновленного баннера
 */
export async function updateBanner(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
  
      await axiosInstance.put('/user/update-my-banner', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      });
  
      const bannerResponse = await axiosInstance.get<{ banner_url: string }>('/user/get-my-banner');
      const bannerUrl = bannerResponse.data.banner_url;
      if (!bannerUrl) throw new Error('Не удалось получить URL баннера');
  
      return bannerUrl;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error, 'Ошибка обновления баннера');
      throw new Error(errorMessage);
    }
}
  
/**
 * Выход пользователя
 */
export async function logout(): Promise<void> {
    try {
      await axiosInstance.post('/auth/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_avatar');
        localStorage.removeItem('user_banner');
        sessionStorage.removeItem('avatarSessionKey');
        sessionStorage.removeItem('bannerSessionKey');
        document.documentElement.style.setProperty('--profile-banner', 'none');
  
        if ('caches' in window) {
          caches.keys().then(keys => {
            keys.forEach(key => {
              if (key.includes('avatar') || key.includes('banner')) {
                caches.delete(key);
              }
            });
          });
        }
      }
    }
}
 
/**
 * Получение данных текущего пользователя
 * @returns Данные текущего пользователя
 */
export async function getCurrentUser(): Promise<User> {
    try {
      const response = await axiosInstance.get<User>('/auth/get-cookies');
      return response.data;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error, 'Ошибка получения данных пользователя');
      throw new Error(errorMessage);
    }
}

/**
 * Извлечение сообщения об ошибке из ответа API
 * @param error Ошибка от Axios
 * @param defaultMessage Сообщение по умолчанию
 * @returns Форматированное сообщение об ошибке
 */
export function extractErrorMessage(error: any, defaultMessage: string): string {
    if (error.response?.data?.detail) {
      const detail = error.response.data.detail;
      return Array.isArray(detail) ? detail.map((err: any) => err.msg).join(', ') : detail;
    }
    return error.response?.data?.message || error.message || defaultMessage;
}