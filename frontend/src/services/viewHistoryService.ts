import axios from 'axios';

const API_URL = '/api';

/**
 * Сервис для работы с историей просмотров аниме
 */
const viewHistoryService = {
  /**
   * Получить историю просмотров пользователя
   * @param userId ID пользователя
   * @returns История просмотров и информация об аниме
   */
  async getViewHistory(userId: string) {
    try {
      const response = await axios.post(
        `${API_URL}/viewhistory/get-view-history-of-user/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении истории просмотров:', error);
      throw error;
    }
  },

  /**
   * Добавить аниме в историю просмотров пользователя
   * @param userId ID пользователя
   * @param animeId ID аниме (UUID формат)
   * @returns Обновленная запись истории просмотров
   */
  async addAnimeToViewHistory(userId: string, animeId: string) {
    try {
      const response = await axios.post(
        `${API_URL}/viewhistory/add-anime-to-view-history-of-user/${userId}?anime_id=${animeId}`
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка при добавлении аниме в историю просмотров:', error);
      throw error;
    }
  }
};

export default viewHistoryService;
