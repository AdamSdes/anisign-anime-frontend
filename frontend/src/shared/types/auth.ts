export interface LoginData {
  username: string;
  password: string;
  remember_me?: boolean;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface ApiError {
  detail: string;
}

export interface User {
  id: string;
  username: string;
  nickname?: string;
  user_avatar?: string;
  user_banner?: string;
  email?: string; 
  isPro?: boolean;
}

export interface RegisterData {
  username: string;
  password: string;
  confirm_password: string;
}