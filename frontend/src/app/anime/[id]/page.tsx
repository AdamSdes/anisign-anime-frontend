'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/features/header/Header';
import Footer from '@/features/footer/Footer';
import AnimeDetails from '@/components/anime/AnimeDetails';
import Report from '@/features/report/Report';
import { useAnimeById } from '@/hooks/useAnimeById';
import AnimeDetailsSkeleton from '@/components/anime/AnimeDetailsSkeleton';
import CharacterDescription from '@/components/characters/CharacterDescription';

// Определяем типы для параметров маршрута
interface PageParams {
  id: string;
}

export default function AnimePage({ params }: { params: Promise<PageParams> }) {
  const resolvedParams = React.use(params);
  const animeId = resolvedParams.id;
  const { anime, loading, error } = useAnimeById(animeId);
  const [isClient, setIsClient] = useState(false);

  // Check if we're on the client side to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <Report />

      <main className='flex-1'>
        <div className='py-10'>
          {(!isClient || loading) && <AnimeDetailsSkeleton />}

          {isClient && !loading && (error || !anime) ? (
            <div className='w-full h-[500px] flex items-center justify-center'>
              <div className='text-white/60 flex flex-col items-center gap-3'>
                <svg
                  width='48'
                  height='48'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M12 8V13'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M11.9945 16H12.0035'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <span>Контент временно недоступен</span>
                <button
                  onClick={() => window.location.reload()}
                  className='mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm'
                >
                  Обновить страницу
                </button>
              </div>
            </div>
          ) : (
            isClient &&
            !loading &&
            anime && (
              <>
                <AnimeDetails anime={anime} />
              </>
            )
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
