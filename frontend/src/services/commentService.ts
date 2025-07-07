import axiosInstance from '@/lib/axiosInterceptor';
import { Comment, CreateCommentRequest, UpdateCommentRequest } from '@/types/comment';

const commentService = {
  /**
   * Создать комментарий
   */
  async createComment(type: 'comment' | 'reply', data: CreateCommentRequest): Promise<Comment> {
    const params = new URLSearchParams({
      anime_id: data.anime_id,
      comment_text: data.comment_text,
    });

    if (data.reply_to_comment_id) {
      params.append('reply_to_comment_id', data.reply_to_comment_id);
    }

    const response = await axiosInstance.post<Comment>(
      `/comment/create-comment-for-anime/${type}?${params.toString()}`
    );

    // Диспатчим событие о создании нового комментария
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('commentCreated', {
          detail: { comment: response.data, animeId: data.anime_id },
        })
      );
    }

    return response.data;
  },

  /**
   * Получить все комментарии для аниме
   */
  async getCommentsForAnime(animeId: string): Promise<Comment[]> {
    const response = await axiosInstance.get<Comment[]>(
      `/comment/get-all-comments-for-anime/${animeId}`
    );
    return response.data;
  },

  /**
   * Обновить комментарий
   */
  async updateComment(commentId: string, data: UpdateCommentRequest): Promise<Comment> {
    const response = await axiosInstance.put<Comment>(
      `/comment/update-comment/${commentId}?text=${encodeURIComponent(data.text)}`
    );
    return response.data;
  },

  /**
   * Лайкнуть комментарий
   */
  async likeComment(commentId: string): Promise<Comment> {
    const response = await axiosInstance.put<Comment>(`/comment/like-comment/${commentId}`);
    return response.data;
  },

  /**
   * Убрать лайк с комментария
   */
  async dislikeComment(commentId: string): Promise<Comment> {
    const response = await axiosInstance.put<Comment>(`/comment/dislike-comment/${commentId}`);
    return response.data;
  },

  /**
   * Получить последние 3 комментария
   */
  async getLatestComments(): Promise<Comment[]> {
    const response = await axiosInstance.get<Comment[]>('/comment/get_3_latest_comments');
    return response.data;
  },
};

export default commentService;
