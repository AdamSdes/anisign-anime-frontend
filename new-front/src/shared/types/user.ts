export interface User {
    id: string;
    username: string;
    email?: string;
    nickname: string | null;
    user_avatar: string | null;
    user_banner: string | null;
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