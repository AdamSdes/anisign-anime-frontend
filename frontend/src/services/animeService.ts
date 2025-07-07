import axios from 'axios';
import { Anime, AnimeFilters, AnimeListResponse } from '@/types/anime';

const API_URL = '/api';

/**
 * Сервис для работы с API аниме
 */
const animeService = {
  /**
   * Получение списка аниме с пагинацией
   * @param page Номер страницы
   * @param limit Количество элементов на странице
   * @returns Список аниме с информацией о пагинации
   */
  async getAnimeList(page = 1, limit = 10): Promise<AnimeListResponse> {
    try {
      console.log(`API Call: getAnimeList - page: ${page}, limit: ${limit}`);
      const response = await axios.get<AnimeListResponse>(
        `${API_URL}/anime/get-anime-list?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching anime list:', error);
      throw error;
    }
  },

  /**
   * Получение аниме по ID
   */
  async getAnimeById(id: string): Promise<Anime> {
    try {
      console.log(`API Call: getAnimeById - id: ${id}`);
      const response = await axios.get<Anime>(`${API_URL}/anime/id/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching anime by ID:', error);
      throw error;
    }
  },

  /**
   * Получение аниме по UUID
   */
  async getAnimeByUUID(uuid: string): Promise<Anime> {
    try {
      const response = await axios.get<Anime>(`${API_URL}/anime/uuid/${uuid}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching anime with UUID ${uuid}:`, error);
      throw error;
    }
  },

  /**
   * Получение отфильтрованного списка аниме
   * @param page Номер страницы
   * @param limit Количество элементов на странице
   * @param filters Фильтры для поиска
   * @returns Отфильтрованный список аниме
   */
  async getFilteredAnimeList(
    page = 1,
    limit = 10,
    filters: AnimeFilters
  ): Promise<AnimeListResponse> {
    try {
      console.log(`API Call: getFilteredAnimeList - page: ${page}, limit: ${limit}, filters:`, filters);
      
      // Проверяем, указаны ли оба параметра года
      if (filters.start_year && filters.end_year) {
        console.log('Detected year range filtering, using specialized endpoint');
        return this.getAnimeByYearRange(filters.start_year, filters.end_year, page, limit);
      }
      
      // Создаем объект с параметрами запроса
      const params: Record<string, string | number | boolean> = {
        page: page,
        limit: limit
      };
      
      // Добавляем параметр сортировки и порядок сортировки
      if (filters.sort_by) {
        params.sort_by = filters.sort_by;
        // По умолчанию порядок сортировки - по возрастанию
        params.sort_order = 'asc';
      }
      
      // Добавляем параметры фильтрации для сортировки
      if (filters.filter_by_score !== undefined) {
        params.filter_by_score = filters.filter_by_score;
      }
      
      if (filters.filter_by_date !== undefined) {
        params.filter_by_date = filters.filter_by_date;
      }
      
      if (filters.filter_by_name !== undefined) {
        params.filter_by_name = filters.filter_by_name;
      }
      
      // Создаем URLSearchParams для правильной передачи массива жанров
      const searchParams = new URLSearchParams();
      
      // Добавляем базовые параметры
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });
      
      // Добавляем жанры как отдельные параметры с одинаковым именем
      if (filters.genre_ids && Array.isArray(filters.genre_ids) && filters.genre_ids.length > 0) {
        // Используем только непустые, валидные id жанров
        filters.genre_ids
          .filter(id => id && String(id).trim() !== '')
          .forEach(id => {
            searchParams.append('genre_id', String(id));
          });
      }
      
      // Добавляем остальные фильтры
      if (filters.status) {
        searchParams.append('status', filters.status);
      }
      
      if (filters.kind) {
        searchParams.append('kind', filters.kind);
      }
      
      if (filters.rating) {
        searchParams.append('rating', filters.rating);
      }
      
      if (filters.start_year) {
        searchParams.append('start_year', String(filters.start_year));
      }
      
      if (filters.end_year) {
        searchParams.append('end_year', String(filters.end_year));
      }
      
      if (filters.season) {
        searchParams.append('season', filters.season);
      }
      
      if (filters.year) {
        searchParams.append('year', String(filters.year));
      }
      
      if (filters.has_translation !== undefined) {
        searchParams.append('has_translation', String(filters.has_translation));
      }
      
      console.log('Sending request with params:', searchParams.toString());
      
      // Используем searchParams для формирования URL
      const response = await axios.get<AnimeListResponse>(
        `${API_URL}/anime/get-anime-list-filtered?${searchParams.toString()}`
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching filtered anime list:', error);
      throw error;
    }
  },

  /**
   * Получение аниме по диапазону годов
   * @param startYear Начальный год
   * @param endYear Конечный год
   * @param page Номер страницы
   * @param limit Количество элементов на странице
   * @returns Список аниме в заданном диапазоне годов
   */
  async getAnimeByYearRange(
    startYear: number,
    endYear: number,
    page = 1,
    limit = 10
  ): Promise<AnimeListResponse> {
    try {
      console.log(`API Call: getAnimeByYearRange - startYear: ${startYear}, endYear: ${endYear}, page: ${page}, limit: ${limit}`);
      
      // Создаем объект URL параметров запроса
      const searchParams = new URLSearchParams();
      searchParams.append('start_year', String(startYear));
      searchParams.append('end_year', String(endYear));
      searchParams.append('page', String(page));
      searchParams.append('limit', String(limit));
      
      // Получение списка аниме по диапазону годов
      const response = await axios.get(`${API_URL}/anime/anime/by-year-range?${searchParams.toString()}`);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching anime by year range:', error);
      return { total_count: 0, anime_list: [] };
    }
  },

  /**
   * Поиск аниме по имени
   * @param query Поисковый запрос
   * @param page Номер страницы
   * @param limit Количество элементов на странице
   * @returns Результаты поиска
   */
  async searchAnime(query: string, page = 1, limit = 10): Promise<AnimeListResponse> {
    try {
      if (!query || query.length < 2) {
        throw new Error('Поисковый запрос должен содержать минимум 2 символа');
      }

      const encodedQuery = encodeURIComponent(query);
      console.log(`API Call: searchAnime - query: ${query}, page: ${page}, limit: ${limit}`);
      
      const response = await axios.get<AnimeListResponse>(
        `${API_URL}/anime/name/${encodedQuery}`
      );
      
      // Проверяем, что ответ содержит ожидаемые данные
      if (!response.data || !Array.isArray(response.data.anime_list)) {
        console.error('Неверный формат ответа от API:', response.data);
        throw new Error('Неверный формат ответа от API');
      }
      
      // Всегда применяем клиентскую пагинацию для результатов поиска
      console.log(`API вернул ${response.data.anime_list.length} результатов. Применяем клиентскую пагинацию.`);
      
      // Сохраняем общее количество для пагинации
      const totalCount = response.data.total_count || response.data.anime_list.length;
      
      // Вычисляем индексы для текущей страницы
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      // Проверяем, что у нас есть результаты для текущей страницы
      if (startIndex >= response.data.anime_list.length) {
        // Если запрошенная страница выходит за пределы доступных результатов,
        // возвращаем последнюю доступную страницу
        const lastPage = Math.ceil(response.data.anime_list.length / limit);
        const newStartIndex = (lastPage - 1) * limit;
        const newEndIndex = Math.min(newStartIndex + limit, response.data.anime_list.length);
        
        return {
          anime_list: response.data.anime_list.slice(newStartIndex, newEndIndex),
          total_count: totalCount,
          limit: limit,
          page: lastPage
        };
      }
      
      // Получаем подмножество результатов для текущей страницы
      const paginatedResults = response.data.anime_list.slice(startIndex, endIndex);
      
      // Возвращаем пагинированные результаты
      return {
        anime_list: paginatedResults,
        total_count: totalCount,
        limit: limit,
        page: page
      };
    } catch (error) {
      console.error('Error searching anime:', error);
      throw error;
    }
  },

  /**
   * Получение списка жанров
   */
  async getGenres(): Promise<{ genre_id: string; name: string; russian: string; id: string }[]> {
    try {
      const response = await axios.get(`${API_URL}/genre/get-list-genres`);
      return response.data;
    } catch (error) {
      console.error('Error fetching genres:', error);
      throw error;
    }
  },

  /**
   * Получение списка типов аниме
   */
  async getAnimeKinds(): Promise<string[]> {
    try {
      const response = await axios.get<string[]>(`${API_URL}/anime/kinds`);
      return response.data;
    } catch (error) {
      console.error('Error fetching anime kinds:', error);
      throw error;
    }
  },

  /**
   * Получение списка рейтингов аниме
   */
  async getAnimeRatings(): Promise<string[]> {
    try {
      const response = await axios.get<string[]>(`${API_URL}/anime/ratings`);
      return response.data;
    } catch (error) {
      console.error('Error fetching anime ratings:', error);
      throw error;
    }
  },

  /**
   * Получение списка статусов аниме
   */
  async getAnimeStatuses(): Promise<string[]> {
    try {
      const response = await axios.get<string[]>(`${API_URL}/anime/statuses`);
      return response.data;
    } catch (error) {
      console.error('Error fetching anime statuses:', error);
      throw error;
    }
  }
};

export default animeService;
