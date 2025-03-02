import { Anime, AnimeListResponse } from '@/shared/types/anime';
import { apiRequest, getAnimeList } from '@/lib/api';

export const animeService = {
    /**
     * Получает список аниме
     * @param params - параметры запроса
     * @returns
     */
    getAnimeList: async (params: Record<string, any> = {}): Promise<AnimeListResponse> => {
        const response = await apiRequest<AnimeListResponse>({
            url: '/anime',
            method: 'GET',
            params: {...params, page: params.page || 1, limit: params.limit || 20 },
            useAuth: false,
        });
        return response.data;
    },

    /**
     * Получаем детали конкретного аниме по АЙДИ
     * @param id АЙДИ аниме
     * @returns детали
     */
    getAnimeDetails: async (id: string): Promise<Anime> => {
        const response = await apiRequest<Anime>({
            url: `/anime/${id}`,
            method: 'GET',
            useAuth: false,
        });
        return response.data;
    },

    /**
     * Обновляет данные аниме (если требуеться авторизация)
     * @param id АЙДИ аниме
     * @param data - данные для обновления
     * @returns Обновлённые данные
     */
    updateAnime: async (id: string, data: Record<string, any>): Promise<Anime> => {
        const response = await apiRequest<Anime>({
            url: `/anime/${id}`,
            method: 'PATCH',
            data,
            useAuth: true,
        });
        return response.data;
    },
};