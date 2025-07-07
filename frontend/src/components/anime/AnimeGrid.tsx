'use client';

import { Anime } from '@/types/anime';
import AnimeCard from './AnimeCard';
import { memo } from 'react';
import AnimePagination from './AnimePagination';

interface AnimeGridProps {
  animeList: Anime[];
  isLoading: boolean;
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

// Мемоизируем компонент для предотвращения лишних перерендеров
const AnimeGrid = memo(function AnimeGrid({
  animeList,
  isLoading,
  showPagination = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
}: AnimeGridProps) {
  // Если данные загружаются, показываем скелетон
  if (isLoading) {
    return (
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6'>
        {Array.from({ length: 30 }).map((_, index) => (
          <div key={index} className='animate-pulse'>
            <div className='relative w-full' style={{ paddingBottom: '142.857%' }}>
              <div className='absolute inset-0 bg-white/5 rounded-md'></div>
            </div>
            <div className='mt-3 h-[19px] bg-white/5 rounded w-3/4'></div>
            <div className='mt-2 h-[16px] bg-white/5 rounded w-1/2'></div>
          </div>
        ))}
      </div>
    );
  }

  // Если список пуст, показываем сообщение
  if (animeList.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <h3 className='text-white text-xl font-medium mb-2'>Ничего не найдено</h3>
        <p className='text-white/60'>
          Попробуйте изменить параметры фильтрации или сбросить фильтры
        </p>
      </div>
    );
  }

  // Отображаем сетку аниме с плавной анимацией
  return (
    <div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 mb-8'>
        {animeList.map((anime, index) => (
          <AnimeCard key={anime.anime_id} anime={anime} index={index} />
        ))}
      </div>
      {showPagination && (
        <AnimePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
});

export default AnimeGrid;
