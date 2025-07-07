import axiosInstance from '@/lib/axiosInterceptor';

/**
 * Интерфейс для списка сохраненных аниме
 */
export interface AnimeSaveList {
  id: string;
  list_name: string;
  anime_ids: string[];
  user_id: string;
}

/**
 * Сервис для работы со списками сохраненных аниме
 */
const animeSaveListService = {
  /**
   * Получить список сохраненных аниме по имени списка и ID пользователя
   * @param listName Название списка (например, "Watching", "Completed", "Plan to Watch")
   * @param userId ID пользователя
   * @returns Список сохраненных аниме
   */
  getAnimeListByName: async (listName: string, userId: string): Promise<AnimeSaveList> => {
    const response = await axiosInstance.get<AnimeSaveList>(
      `/anime_save_list/get-anime-list-by-name/${listName}/user/${userId}`
    );
    return response.data;
  },

  /**
   * Создать новый список сохраненных аниме
   * @param listName Название списка
   * @returns Созданный список
   */
  createAnimeList: async (listName: string): Promise<AnimeSaveList> => {
    const response = await axiosInstance.post<AnimeSaveList>(
      `/anime_save_list/create-anime-save-list/${listName}`
    );
    return response.data;
  },

  /**
   * Добавить аниме в список сохраненных
   * @param animeId ID аниме
   * @param listName Название списка
   * @returns Обновленный список
   */
  addAnimeToList: async (animeId: string, listName: string): Promise<AnimeSaveList> => {
    const response = await axiosInstance.put<AnimeSaveList>(
      `/anime_save_list/put_anime_id_in_list/${listName}?anime_id=${animeId}`
    );
    return response.data;
  },

  /**
   * Удалить аниме из списка сохраненных
   * @param animeId ID аниме
   * @returns Результат операции
   */
  removeAnimeFromList: async (animeId: string): Promise<unknown> => {
    const response = await axiosInstance.delete(
      `/anime_save_list/delete-anime-id-from-list?anime_id=${animeId}`
    );
    return response.data;
  },

  /**
   * Удалить весь список сохраненных аниме
   * @returns Результат операции
   */
  deleteAllAnimeLists: async (): Promise<unknown> => {
    const response = await axiosInstance.delete('/anime_save_list/delete-anime-list-all');
    return response.data;
  },

  /**
   * Получает все списки пользователя одним запросом с оптимизацией
   */
  async getAllUserLists(userId: string) {
    try {
      // Создаем массив промисов с таймаутами
      const listPromises = ['Watching', 'Completed', 'Plan to Watch', 'On Hold', 'Dropped'].map(
        async (listName) => {
          try {
            // Добавляем таймаут для каждого запроса
            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => reject(new Error(`Timeout for ${listName}`)), 3000);
            });

            const result = await Promise.race([
              this.getAnimeListByName(listName, userId),
              timeoutPromise,
            ]);

            return { status: 'fulfilled', value: result };
          } catch (error) {
            console.warn(`Ошибка при получении списка ${listName}:`, error);
            return { status: 'rejected', reason: error };
          }
        }
      );

      // Ждем все промисы
      const results = await Promise.all(listPromises);

      // Возвращаем только успешные результаты
      return results
        .filter(
          (result): result is { status: 'fulfilled'; value: AnimeSaveList } =>
            result.status === 'fulfilled' && result.value !== null && result.value !== undefined
        )
        .map((result) => result.value);
    } catch (error) {
      console.error('Критическая ошибка при получении всех списков пользователя:', error);
      return [];
    }
  },
};

export default animeSaveListService;
