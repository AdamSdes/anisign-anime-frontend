// API Configuration
const isDevelopment = process.env.NODE_ENV === 'development';

// В разработке используем локальный сервер, в продакшене - удаленный
export const API_BASE_URL = isDevelopment ? 'http://localhost:8000' : 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    TOKEN: '/auth/token',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    GET_COOKIES: '/auth/get-cookies',
  },

  // User endpoints
  USER: {
    CURRENT: '/user/me',
    BY_NAME: '/user/name',
    UPDATE_AVATAR: '/user/update-my-avatar',
    BY_ID: '/user/by-id',
  },

  // Anime endpoints
  ANIME: {
    BY_ID: '/anime/id',
    SEARCH: '/anime/search',
    POPULAR: '/anime/popular',
    BY_YEAR_RANGE: '/anime/anime/by-year-range',
  },
} as const;

// Helper function to build full URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};
