export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/docs';

// Маршруты приложения
export const ROUTES = {
  HOME: '/',
  ANIME: '/anime',
  ANIME_DETAIL: '/anime/[id]',
  PROFILE: '/profile',
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  CHARACTER: '/character/[id]',
} as const;

// Ограничения для форм
export const FORM_LIMITS = {
  MAX_USERNAME_LENGTH: 50,
  MAX_EMAIL_LENGTH: 255,
  MAX_PASSWORD_LENGTH: 100,
  MIN_PASSWORD_LENGTH: 8,
} as const;

// Статусы аниме (для мультиязычности)
export const ANIME_STATUSES = {
  ONGOING: 'ongoing',
  RELEASED: 'released',
  ANNOUNCED: 'announced',
} as const;

// Типы аниме (для мультиязычности)
export const ANIME_TYPES = {
  TV: 'tv',
  TV_SPECIAL: 'tv_special',
  MOVIE: 'movie',
  OVA: 'ova',
  ONA: 'ona',
  SPECIAL: 'special',
  MUSIC: 'music',
} as const;

export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_SORT = 'score_desc';