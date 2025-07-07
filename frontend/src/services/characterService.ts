import axios from 'axios';
import { Character, CharacterListResponse, CharacterSearchResponse } from '@/types/character';
import { Anime, AnimeListResponse } from '@/types/anime';

const API_URL = '/api';

/**
 * Сервис для работы с API персонажей
 */
const characterService = {
  /**
   * Получение списка персонажей с пагинацией
   */
  async getCharacterList(page = 1, limit = 24): Promise<CharacterListResponse> {
    try {
      console.log(`API Call: getCharacterList - page: ${page}, limit: ${limit}`);
      const response = await axios.get<CharacterListResponse>(
        `${API_URL}/character/get-character-list?page=${page}&limit=${limit}`
      );
      console.log('Characters response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching character list:', error);
      throw error;
    }
  },

  /**
   * Получение персонажа по ID
   */
  async getCharacterById(id: string): Promise<Character> {
    try {
      console.log(`API Call: getCharacterById - id: ${id}`);
      const response = await axios.get<Character>(`${API_URL}/character/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching character by ID:', error);
      throw error;
    }
  },

  /**
   * Поиск персонажей по имени
   */
  async searchCharacterByName(name: string): Promise<CharacterSearchResponse> {
    try {
      console.log(`API Call: searchCharacterByName - name: ${name}`);
      const response = await axios.get<CharacterSearchResponse>(
        `${API_URL}/character/name/${encodeURIComponent(name)}`
      );
      console.log('Search response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error searching characters:', error);
      throw error;
    }
  },

  /**
   * Поиск аниме по ID персонажа
   */
  async getAnimeByCharacterId(characterId: string): Promise<AnimeListResponse> {
    try {
      console.log(`API Call: getAnimeByCharacterId - characterId: ${characterId}`);
      // Используем поиск по всем аниме и фильтруем на клиенте
      const response = await axios.get(`${API_URL}/anime/get-anime-list?page=1&limit=100`);
      
      // Фильтруем аниме, которые содержат данного персонажа
      const animeWithCharacter = response.data.anime_list.filter((anime: Anime) => 
        anime.character_ids && anime.character_ids.includes(characterId)
      );
      
      return {
        total_count: animeWithCharacter.length,
        anime_list: animeWithCharacter
      };
    } catch (error) {
      console.error('Error fetching anime by character ID:', error);
      throw error;
    }
  },
};

export default characterService;
