import { axiosInstance } from '@/lib/axios/axiosConfig';
import { User } from '@/shared/types/auth';

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  user_avatar?: string;
  user_banner?: string;
  nickname?: string;
}

export const userApi = {
  /**
   * Получить данные пользователя по username
   * @param username Имя пользователя
   * @returns Данные пользователя
   */
  getUserByUsername: async (username: string): Promise<UserResponse> => {
    const { data } = await axiosInstance.get<UserResponse>(`/user/get-user-by-username/${username}`);
    return data;
  },

  /**
   * Получить URL аватара текущего пользователя
   * @returns URL аватара в формате blob
   */
  getMyAvatar: async (): Promise<string> => {
    try {
      const response = await axiosInstance.get('/user/get-my-avatar', {
        responseType: 'blob',
      });
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error('[userApi] Error fetching avatar:', error);
      throw error;
    }
  },

  /**
   * Обновить аватар пользователя
   * @param formData Данные формы с файлом
   * @returns Обновленные данные пользователя
   */
  updateAvatar: async (formData: FormData): Promise<UserResponse> => {
    const { data } = await axiosInstance.post<UserResponse>('/user/update-my-avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * Получить URL баннера текущего пользователя
   * @returns URL баннера
   */
  getMyBanner: async (): Promise<string> => {
    const { data } = await axiosInstance.get<string>('/user/get-my-banner');
    return data;
  },

  /**
   * Обновить баннер пользователя
   * @param formData Данные формы с файлом
   * @returns Обновленные данные пользователя
   */
  updateBanner: async (formData: FormData): Promise<UserResponse> => {
    const { data } = await axiosInstance.put<UserResponse>('/user/update-my-banner', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * Поиск пользователей по имени
   * @param username Имя пользователя для поиска
   * @returns Список найденных пользователей
   */
  searchUsers: async (username: string): Promise<UserResponse[]> => {
    const { data } = await axiosInstance.get<UserResponse[]>(`/user/search?username=${username}`);
    return data;
  },
};