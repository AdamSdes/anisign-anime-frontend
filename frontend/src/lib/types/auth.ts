import { LoginSchema, RegisterSchema } from '../validations/auth';

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
}

export interface RegisterData {
  username: string;
  password: string;
  confirm_password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  hydrated: boolean;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  setHydrated: (value: boolean) => void;
  login: (token: string) => void;
  logout: () => Promise<void>;
  checkSession: () => Promise<boolean>;
  initAuth: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
}