import { Comment, CommentResponse } from '@/shared/types/comment';
import { apiRequest, getAnimeComments, postAnimeComment } from '@/lib/api';

export const commentsService = {
    /**
     * Получает список коментариев для конкретного аниме
     * @param animeId АЙДИ АНИМЕ
     * @param params Параметры запросов
     * @returns
     */
    getComments: async (animeId: string, params: { page?: number; limit?: number } = {}): Promise<CommentResponse> => {
        const response = await getAnimeComments(animeId, params.page || 1, params.limit || 10);
        return response.data; 
      },

    /**
     * Создаёт новый кометарий
     * @param animeId АЙДИ АНИМЕ
     * @param data Данные коментария
     * @returns
     */
    postComment: async (animeId: string, text: string): Promise<Comment> => { 
        const response = await postAnimeComment(animeId, text);
        return response.data;
      },

    /**
     * Обновляет существующий комментарий
     * @param animeId АЙДИ Аниме
     * @param commentId АЙДИ коментария
     * @param data Данные коментария
     * @returns
     */
    updateComment: async (animeId: string, commentId: string, data: Partial<Comment>): Promise<Comment> => {
        const response = await fetch(`/api/anime/${animeId}/comments/${commentId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Ошибка обновления комментария');
        return response.json();
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