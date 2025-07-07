'use client';

import { Character } from '@/types/character';
import CharacterCard from './CharacterCard';
import { memo } from 'react';
import AnimePagination from '@/components/anime/AnimePagination';

interface CharacterGridProps {
  characters: Character[];
  isLoading: boolean;
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const CharacterGrid = memo(function CharacterGrid({
  characters,
  isLoading,
  showPagination = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
}: CharacterGridProps) {
  if (isLoading) {
    return (
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6'>
        {Array.from({ length: 24 }).map((_, index) => (
          <div key={index} className='animate-pulse'>
            <div className='relative w-full' style={{ paddingBottom: '133.33%' }}>
              <div className='absolute inset-0 bg-white/5 rounded-xl'></div>
            </div>
            <div className='mt-3 space-y-2'>
              <div className='h-4 bg-white/5 rounded w-3/4'></div>
              <div className='h-3 bg-white/5 rounded w-1/2'></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <div className='w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4'>
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='text-white/30'
          >
            <path
              d='M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </div>
        <h3 className='text-white text-xl font-medium mb-2'>Персонажи не найдены</h3>
        <p className='text-white/60'>
          Попробуйте изменить поисковый запрос или проверьте правильность написания
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 mb-8'>
        {characters.map((character, index) => (
          <CharacterCard key={character.character_id} character={character} index={index} />
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

export default CharacterGrid;
