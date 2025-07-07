export interface Comment {
  id: string;
  anime_id: string;
  user_id: string;
  text: string;
  comment_type: 'comment' | 'reply';
  reply_to_comment_id?: string | null;
  likes: number;
  user_liked_list?: string[] | null;
  created_at: string;
  updated_at: string;
  id_of_anime: string | null;
}

export interface CreateCommentRequest {
  anime_id: string;
  comment_text: string;
  reply_to_comment_id?: string;
}

export interface UpdateCommentRequest {
  text: string;
}
