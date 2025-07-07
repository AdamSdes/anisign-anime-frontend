import { useState, useEffect } from 'react';
import animeService from '@/services/animeService';
import { Anime } from '@/types/anime';

/**
 * Хук для получения данных аниме по ID
 * @param id ID аниме
 * @returns Объект с данными аниме, статусом загрузки и ошибкой
 */
export function useAnimeById(id: string) {
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        setLoading(true);
        const data = await animeService.getAnimeById(id);
        setAnime(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching anime by ID:', err);
        setError('Не удалось загрузить данные об аниме');
        setAnime(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnime();
    }
  }, [id]);

  return { anime, loading, error };
}
