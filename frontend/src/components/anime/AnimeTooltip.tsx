'use client';

import React from 'react';
import { Anime } from '@/types/anime';
import { getGenreName } from '@/data/genres';

interface AnimeTooltipProps {
  anime: Anime;
}

/**
 * Компонент tooltip с информацией об аниме
 */
export const AnimeTooltip: React.FC<AnimeTooltipProps> = ({ anime }) => {
  // Форматирование типа аниме
  const formatKind = (kind: string): string => {
    switch (kind) {
      case 'tv':
        return 'TV Сериал';
      case 'movie':
        return 'Фильм';
      case 'ova':
        return 'OVA';
      case 'ona':
        return 'ONA';
      case 'special':
        return 'Спешл';
      case 'tv_special':
        return 'TV Спешл';
      default:
        return kind;
    }
  };

  // Форматирование статуса
  const formatStatus = (status: string): string => {
    switch (status) {
      case 'ongoing':
        return 'Онгоинг';
      case 'released':
        return 'Завершено';
      case 'anons':
        return 'Анонс';
      default:
        return status;
    }
  };

  // Получение года выхода
  const getYear = (): string => {
    if (anime.aired_on) {
      return new Date(anime.aired_on).getFullYear().toString();
    }
    return '';
  };

  // Получение жанров (максимум 3)
  const getGenres = (): string => {
    if (!anime.genre_ids || anime.genre_ids.length === 0) return '';

    const genres = anime.genre_ids
      .slice(0, 3)
      .map((genreId) => getGenreName(genreId) || genreId)
      .filter(Boolean);

    return genres.join(', ');
  };

  // Сокращение описания
  const getShortDescription = (): string => {
    if (!anime.description) return '';

    // Удаляем HTML теги и берем первые 150 символов
    const plainText = anime.description.replace(/<[^>]*>/g, '').trim();

    if (plainText.length <= 150) return plainText;

    return plainText.substring(0, 150) + '...';
  };

  return (
    <div className='w-80 space-y-3'>
      {/* Заголовок */}
      <div className='space-y-1'>
        <h3 className='font-semibold text-white/95 leading-tight'>
          {anime.russian || anime.english}
        </h3>
        {anime.russian && anime.english && anime.russian !== anime.english && (
          <p className='text-xs text-white/60'>{anime.english}</p>
        )}
      </div>

      {/* Основная информация */}
      <div className='grid grid-cols-2 gap-2 text-xs'>
        {anime.kind && (
          <div>
            <span className='text-white/50'>Тип:</span>
            <span className='ml-1 text-white/80'>{formatKind(anime.kind)}</span>
          </div>
        )}

        {anime.status && (
          <div>
            <span className='text-white/50'>Статус:</span>
            <span className='ml-1 text-white/80'>{formatStatus(anime.status)}</span>
          </div>
        )}

        {anime.episodes > 0 && (
          <div>
            <span className='text-white/50'>Эпизоды:</span>
            <span className='ml-1 text-white/80'>{anime.episodes}</span>
          </div>
        )}

        {getYear() && (
          <div>
            <span className='text-white/50'>Год:</span>
            <span className='ml-1 text-white/80'>{getYear()}</span>
          </div>
        )}
      </div>

      {/* Рейтинг */}
      {anime.score > 0 && (
        <div className='flex items-center gap-2'>
          <span className='text-white/50 text-xs'>Рейтинг:</span>
          <div className='flex items-center gap-1'>
            <span className='text-yellow-400 text-sm font-medium'>{anime.score.toFixed(1)}</span>
            <svg
              width='14'
              height='14'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='text-yellow-400'
            >
              <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
            </svg>
          </div>
        </div>
      )}

      {/* Жанры */}
      {getGenres() && (
        <div>
          <span className='text-white/50 text-xs'>Жанры:</span>
          <span className='ml-1 text-white/80 text-xs'>{getGenres()}</span>
        </div>
      )}

      {/* Описание */}
      {getShortDescription() && (
        <div className='pt-2 border-t border-white/10'>
          <p className='text-xs text-white/70 leading-relaxed'>{getShortDescription()}</p>
        </div>
      )}
    </div>
  );
};

export default AnimeTooltip;
