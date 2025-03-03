export interface User {
    created_at: string | number | Date;
    avatar_url: string;
    id: string;
    username: string;
    email: string;
    nickname: string | null;
    user_avatar?: string | null;
    friends?: User[];
    view_history?: ViewHistory[]
    user_banner?: string | null;
    isPro?: boolean;
  }
  
  export interface LoginData {
    username: string;
    password: string;
    remember_me?: boolean;
  }
  
  export interface LoginResponse {
    access_token: string;
    token_type: string;
  }
  
  export interface RegisterData {
    username: string;
    password: string;
    confirm_password: string;
  }

  export interface ViewHistory {
    id: string;
    duration: any;
    anime_title: string;
    anime_id: string;
    episode_id: string;
    watched_at: string;
    progress: number;
  }