import { axiosInstance } from '@/lib/axios/axiosConfig';
import { Character, SearchResponse } from '@/shared/types/character';
import axios from 'axios';

/**
 * Получение списка персонажей с пагинацией
 * @param page Номер страницы
 * @param limit Количество элементов на странице (по умолчанию 50)
 * @returns Массив персонажей
 */
export async function getCharacterList(
  page: number,
  limit: number = 50
): Promise<Character[]> {
  try {
    const response = await axiosInstance.get<Character[]>(
      '/character/get-character-list',
      {
        params: { page, limit },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка при получении списка персонажей:', error.message);
      throw new Error(`Не удалось загрузить список персонажей: ${error.message}`);
    }
    console.error('Неизвестная ошибка при получении списка персонажей:', error);
    throw error;
  }
}

/**
 * Поиск персонажей по запросу
 * @param query Поисковый запрос
 * @param limit Максимальное количество возвращаемых результатов (по умолчанию 20)
 * @returns Массив найденных персонажей
 */
export async function searchCharacters(
  query: string,
  limit: number = 20
): Promise<Character[]> {
  if (!query.trim()) return [];

  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await axiosInstance.get<SearchResponse | Character[]>(
      `/character/name/${encodedQuery}`
    );
    const data = response.data;

    if (Array.isArray(data)) return data.slice(0, limit);
    if ('items' in data && Array.isArray(data.items)) return data.items.slice(0, limit);
    if ('character_list' in data && Array.isArray(data.character_list)) {
      return data.character_list.slice(0, limit);
    }

    console.warn('Неожиданный формат ответа API:', data);
    return [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) return [];
      console.error('Ошибка при поиске персонажей:', error.message);
      throw new Error(`Ошибка поиска: ${error.message}`);
    }
    console.error('Неизвестная ошибка при поиске персонажей:', error);
    return [];
  }
}

/**
 * Получение информации о персонаже по ID
 * @param id Уникальный идентификатор персонажа
 * @returns Объект персонажа или null, если персонаж не найден
 */
export async function getCharacterById(id: string): Promise<Character | null> {
  try {
    const characterId = id.split('-')[0];
    const response = await axiosInstance.get<Character>(`/character/${characterId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) return null;
      console.error('Ошибка при получении персонажа:', error.message);
      throw new Error(`Не удалось загрузить персонажа: ${error.message}`);
    }
    console.error('Неизвестная ошибка при получении персонажа:', error);
    throw error;
  }
}