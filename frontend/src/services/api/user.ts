import { axiosInstance } from '@/lib/api/axiosConfig';
import { User } from '@/lib/types/auth';

// Типы ответов от API
export interface UserResponse {
  id: string;
  username: string;
  email: string;
  user_avatar?: string;
  user_banner?: string;
  nickname?: string;
}

// API методы
export const userApi = {
  // Получить данные пользователя по username
  getUserByUsername: async (username: string): Promise<UserResponse> => {
    const { data } = await axiosInstance.get(`/user/get-user-by-username/${username}`);
    return data;
  },

  // Получить аватар текущего пользователя
  async getMyAvatar() {
    try {
      const response = await axiosInstance.get('/user/get-my-avatar', {
        responseType: 'blob'
      });
      
      const url = URL.createObjectURL(response.data);
      return url;
    } catch (error) {
      console.error('[userApi] Error fetching avatar:', error);
      throw error;
    }
  },

  // Обновить аватар пользователя
  updateAvatar: async (formData: FormData): Promise<UserResponse> => {
    const { data } = await axiosInstance.post('/user/update-my-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  // Получить баннер пользователя
  getMyBanner: async (): Promise<string> => {
    const { data } = await axiosInstance.get('/user/get-my-banner');
    return data;
  },

  // Обновить баннер пользователя
  updateBanner: async (formData: FormData): Promise<UserResponse> => {
    const { data } = await axiosInstance.put('/user/update-my-banner', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  // Поиск пользователей
  searchUsers: async (username: string): Promise<UserResponse[]> => {
    const { data } = await axiosInstance.get(`/user/search?username=${username}`);
    return data;
  },
};
