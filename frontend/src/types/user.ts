export interface User {
  id: string;
  username: string;
  email?: string;
  password?: string; // Добавляем поле пароля (хотя обычно не используется на фронтенде)
  user_avatar?: string | null;
  user_banner?: string | null;
  avatar_url?: string | null; // Оставляем для обратной совместимости
  banner_url?: string; // Оставляем для обратной совместимости
  nickname?: string;
  role?: string;
  status?: string; // Добавляем поле статуса
  created_at?: string;
  updated_at?: string;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
}
