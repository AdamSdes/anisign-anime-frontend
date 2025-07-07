/**
 * Функции для работы с баннерами
 */

import { API_BASE_URL } from '@/config/api';

/**
 * Типы размеров баннера
 */
export type BannerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Соответствие размеров баннера классам Tailwind
 */
export const BANNER_SIZE_MAP: Record<BannerSize, string> = {
  sm: 'h-[150px]',
  md: 'h-[200px]',
  lg: 'h-[300px]',
  xl: 'h-[400px]',
  full: 'h-[300px] md:h-[400px] lg:h-[500px]',
};

/**
 * API для работы с баннерами
 */
const API_URL = API_BASE_URL;

/**
 * Получить полный URL баннера
 * Добавляет временную метку для обхода кеша
 * @param banner_url URL баннера
 * @param timestamp Временная метка для обхода кеша
 * @returns Полный URL баннера
 */
export const getFullBannerUrl = (banner_url?: string, timestamp?: number): string => {
  // Если URL баннера не задан, возвращаем пустую строку
  if (!banner_url || banner_url.trim() === '') return '';

  // Добавляем параметр времени
  const timeParam = timestamp ? `?t=${timestamp}` : '';

  // Если URL уже является абсолютным, возвращаем его с добавлением временной метки
  if (banner_url.startsWith('http://') || banner_url.startsWith('https://')) {
    return `${banner_url}${timeParam}`;
  }

  // Убедимся, что путь начинается с /, если нет - добавим
  const normalizedPath = banner_url.startsWith('/') ? banner_url : `/${banner_url}`;

  // Если URL относительный, добавляем базовый URL
  return `${API_URL}${normalizedPath}${timeParam}`;
};

/**
 * Сгенерировать градиент для баннера на основе имени пользователя
 * @param username Имя пользователя
 * @returns CSS строка градиента
 */
export const generateBannerGradient = (username?: string): string => {
  if (!username) return 'linear-gradient(135deg, #1a1a1a 0%, #060606 100%)';

  // Генерируем простой хеш из имени пользователя
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Используем хеш для получения цветов
  const h1 = Math.abs(hash) % 360;
  const h2 = (h1 + 40) % 360;
  const s1 = 20 + (Math.abs(hash >> 8) % 30); // От 20% до 50% насыщенности
  const s2 = 20 + (Math.abs(hash >> 4) % 30);
  const l1 = 5 + (Math.abs(hash >> 16) % 10); // От 5% до 15% яркости
  const l2 = 5 + (Math.abs(hash >> 12) % 10);

  return `linear-gradient(135deg, hsl(${h1}, ${s1}%, ${l1}%) 0%, hsl(${h2}, ${s2}%, ${l2}%) 100%)`;
};

// Кеш для баннеров - предотвращает ненужные запросы одних и тех же баннеров
// Значения имеют ограниченное время жизни для периодического обновления
interface CacheEntry {
  url: string;
  timestamp: number;
  expires: number;
}

const bannerCache: Map<string, CacheEntry> = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 минут

/**
 * Получить URL баннера из кеша или сгенерировать новый
 * @param banner_url URL баннера
 * @param forceRefresh Принудительно обновить кеш
 * @returns Полный URL баннера с временной меткой
 */
export const getCachedBannerUrl = (banner_url?: string, forceRefresh = false): string => {
  // Если URL баннера не задан или пустой, возвращаем пустую строку
  if (!banner_url || banner_url.trim() === '') return '';

  const now = Date.now();
  const cacheKey = banner_url;

  // Если нужно принудительное обновление или кеш устарел или отсутствует, обновляем запись
  if (
    forceRefresh ||
    !bannerCache.has(cacheKey) ||
    (bannerCache.has(cacheKey) && bannerCache.get(cacheKey)!.expires < now)
  ) {
    // При принудительном обновлении используем уникальный timestamp для гарантированного обхода кеша
    const timestamp = forceRefresh ? now + Math.random() * 1000 : now;
    try {
      const fullUrl = getFullBannerUrl(banner_url, Math.floor(timestamp));
      bannerCache.set(cacheKey, {
        url: fullUrl,
        timestamp: Math.floor(timestamp),
        expires: now + CACHE_TTL,
      });
    } catch (error) {
      console.error('Ошибка при формировании URL баннера:', error);
      // В случае ошибки возвращаем пустую строку
      return '';
    }
  }

  return bannerCache.get(cacheKey)!.url;
};
