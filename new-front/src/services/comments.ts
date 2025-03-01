import { Comment } from '@/shared/types/comment';
import { apiRequest } from '@/lib/api';

export const commentsService = {
    /**
     * Получает список коментариев для конкретного аниме
     * @param animeId АЙДИ АНИМЕ
     * @param params Параметры запросов
     * @returns
     */
    getComments: async (
        animeId: string,
        params: Record<string, any> = {}
    ): Promise<{ comments: Comment[]; totalCount: number; page: number; pages: number }> => {
        const response = await apiRequest({
            url: `/anime/${animeId}/comments`,
            method: 'GET',
            params: {...params, page: params.page|| 1, limit: params.limit || 10 },
            useAuth: false,
        });
        return response.data;
    },

    /**
     * Создаёт новый кометарий
     * @param animeId АЙДИ АНИМЕ
     * @param data Данные коментария
     * @returns
     */
    createComment: async (
        animeId: string,
        data: { text: string; rating?: number }
    ): Promise<Comment> => {
        const response = await apiRequest({
            url: `/anime/${animeId}/comments`,
            method: 'POST',
            data,
            useAuth: true,
        });
        return response.data;
    },

    /**
     * Обновляет существующий комментарий
     * @param animeId АЙДИ Аниме
     * @param commentId АЙДИ коментария
     * @param data Данные коментария
     * @returns
     */
    updateComment: async (
        animeId: string,
        commentId: string,
        data: Partial<{ text: string; rating?: number }>
    ): Promise<Comment> => {
        const response = await apiRequest({
            url: `/anime/${animeId}/comments/${commentId}`,
            method: 'PATCH',
            data,
            useAuth: true,
        });
        return response.data;
    },

    /**
     * Удаляет комментарий
     * @param animeId АЙДИ Аниме
     * @param commentId АЙДИ коментария
     * @returns
     */
    deleteComment: async (animeId: string, commentId: string): Promise<void> => {
        const response = await apiRequest({
            url: `/anime/${animeId}/comments/${commentId}`,
            method: 'DELETE',
            useAuth: true,
        });
        return response.data;
    },
};