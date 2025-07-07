/**
 * Утилиты для работы с аватарами пользователей
 */

import { API_BASE_URL } from '@/config/api';

/**
 * Формирует полный URL для аватара
 * @param avatarPath Путь или имя файла аватара
 * @param timestamp Метка времени для обновления аватара
 * @returns Полный URL для аватара
 */
export const getFullAvatarUrl = (avatarPath?: string, timestamp?: number): string => {
  if (!avatarPath) return '';

  // Если URL уже начинается с http или https, то считаем его полным
  if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
    return timestamp ? `${avatarPath}?t=${timestamp}` : avatarPath;
  }

  // Добавляем временную метку только если timestamp передан
  const timeParam = timestamp ? `?t=${timestamp}` : '';

  // Если путь начинается с "./", удаляем это и добавляем базовый URL
  if (avatarPath.startsWith('./')) {
    const cleanPath = avatarPath.substring(2);
    return `${API_BASE_URL}/${cleanPath}${timeParam}`;
  }

  // Если путь начинается с "/", удаляем первый слэш
  if (avatarPath.startsWith('/')) {
    return `${API_BASE_URL}${avatarPath}${timeParam}`;
  }

  // Если это относительный путь, добавляем базовый URL
  return `${API_BASE_URL}/${avatarPath}${timeParam}`;
};

/**
 * Генерирует инициалы пользователя
 * @param username Имя пользователя
 * @param nickname Никнейм пользователя
 * @returns Инициалы (максимум 2 символа)
 */
export const generateUserInitials = (username?: string, nickname?: string): string => {
  const displayName = nickname || username || 'U';

  // Разделяем по пробелам и берем первые буквы
  const words = displayName.trim().split(/\s+/);

  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  // Если одно слово, берем первые две буквы
  return displayName.substring(0, 2).toUpperCase();
};

/**
 * Генерирует цвет фона для аватара на основе имени пользователя
 * @returns CSS класс для цвета фона
 */
export const generateAvatarBgColor = (): string => {
  return 'bg-[#DEDEDF]';
};

/**
 * Размеры аватаров
 */
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export const AVATAR_SIZE_MAP: Record<AvatarSize, string> = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
  xl: 'w-20 h-20',
  '2xl': 'w-[120px] h-[120px]',
};
