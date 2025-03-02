import { Character } from '@/shared/types/character';
import { getCharacterDetails as getCharacterDetailsApi, getCharactersForAnime as getCharactersForAnimeApi } from '@/lib/api';

export const characterService = {
  /**
   * Получает детали персонажа по его ID
   * @param characterId ID персонажа
   * @returns 
   */
  getCharacterDetails: async (characterId: string): Promise<Character> => {
    const response = await getCharacterDetailsApi(characterId);
    return response.data; 
  },

  /**
   * Получает список персонажей для конкретного аниме
   * @param animeId ID аниме
   * @returns 
   */
  getCharactersForAnime: async (animeId: string): Promise<Character[]> => {
    const response = await getCharactersForAnimeApi(animeId);
    return response.data; 
  },
};