import authService from './authService';
import { User } from '@/types/user';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '@/lib/axiosInterceptor';

// Тип для декодированного JWT токена
interface DecodedToken {
  sub: string; // username в JWT токене
  exp: number;
  [key: string]: string | number | boolean | null;
}

/**
 * Сервис для работы с данными пользователя
 */
const userService = {
  /**
   * Получение данных текущего пользователя
   * @returns Данные пользователя
   */
  async getCurrentUser(): Promise<User> {
    try {
      const token = authService.getAccessToken();
      if (!token) throw new Error('Не найден токен доступа');

      // Декодируем токен для получения username
      const decoded = jwtDecode<DecodedToken>(token);
      const username = decoded.sub;

      // Получаем пользователя по username
      return await this.getUserByUsername(username);
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },

  /**
   * Получение пользователя по имени пользователя
   * @param username Имя пользователя
   * @returns Данные пользователя
   */
  async getUserByUsername(username: string): Promise<User> {
    try {
      // Используем axiosInstance с interceptor'ом, который уже настроен на работу с токеном из памяти
      const response = await axiosInstance.get(`/user/get-user-by-username/${username}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user by username: ${username}`, error);
      throw error;
    }
  },

  /**
   * Обновление аватара пользователя
   * @param file Файл аватара
   * @returns Результат обновления
   */
  async updateAvatar(file: File) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Используем axiosInstance, который автоматически добавит токен
      const response = await axiosInstance.put(`/user/update-my-avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating avatar:', error);
      throw error;
    }
  },

  /**
   * Обновление баннера пользователя
   * @param file Файл баннера
   * @returns Результат обновления
   */
  async updateBanner(file: File) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Используем axiosInstance, который автоматически добавит токен
      const response = await axiosInstance.put(`/user/update-my-banner`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating banner:', error);
      throw error;
    }
  },

  /**
   * Обновление никнейма пользователя
   * @param nickname Новый никнейм
   * @returns Результат обновления
   */
  async updateNickname(nickname: string) {
    try {
      // Используем axiosInstance, который автоматически добавит токен
      const response = await axiosInstance.put(`/user/update-my-nickname?nickname=${nickname}`);
      return response.data;
    } catch (error) {
      console.error('Error updating nickname:', error);
      throw error;
    }
  },

  /**
   * Получение пользователя по ID
   * @param userId ID пользователя
   * @returns Данные пользователя
   */
  async getUserById(userId: string): Promise<User> {
    try {
      // Используем правильный эндпоинт из API
      const response = await axiosInstance.get(`/user/get-user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user by ID: ${userId}`, error);
      throw error;
    }
  },
};

export default userService;
