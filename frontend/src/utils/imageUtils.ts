import { API_BASE_URL } from '@/config/api';

/**
 * Получает полный URL для изображения
 * @param imagePath Путь к изображению (может быть относительным или полным)
 * @returns Полный URL изображения
 */
export const getFullImageUrl = (imagePath: string): string => {
  // Если URL уже полный (начинается с http или https), возвращаем как есть
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Если путь начинается с "/", убираем его
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  
  // Формируем полный URL
  return `${API_BASE_URL}/${cleanPath}`;
};
