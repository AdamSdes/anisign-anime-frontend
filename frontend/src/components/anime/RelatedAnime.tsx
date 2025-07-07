'use client';

import { useEffect, useState } from 'react';
import AnimeCard from './AnimeCard';
import { Anime } from '@/types/anime';
import axios from 'axios';

interface RelatedAnimeProps {
  relatedIds: string[] | null;
  relatedTexts: string[] | null;
}

export default function RelatedAnime({ relatedIds, relatedTexts }: RelatedAnimeProps) {
  const [relatedAnime, setRelatedAnime] = useState<(Anime & { relation: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchRelatedAnime = async () => {
      if (!relatedIds || relatedIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // Получаем данные для всех связанных аниме
        const animePromises = relatedIds.map(async (id, index) => {
          try {
            const response = await axios.get<Anime>(`http://localhost:8000/anime/id/${id}`);
            return {
              ...response.data,
              relation:
                relatedTexts && relatedTexts[index] ? relatedTexts[index] : 'Связанное аниме',
            };
          } catch {
            console.log(`Аниме с ID ${id} не найдено`);
            return null;
          }
        });

        const animeResultsWithNulls = await Promise.all(animePromises);
        // Фильтруем несуществующие аниме и проверяем, что есть poster_url
        const animeResults = animeResultsWithNulls.filter(
          (anime): anime is Anime & { relation: string } =>
            anime !== null && !!anime.poster_url && anime.poster_url.trim() !== ''
        );

        setRelatedAnime(animeResults);
      } catch (error) {
        console.error('Ошибка при получении связанных аниме:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedAnime();
  }, [relatedIds, relatedTexts]);

  if (!relatedIds || relatedIds.length === 0) {
    return null;
  }

  return (
    <div className='mt-16'>
      <h2 className='text-xl font-bold mb-6 text-white/90'>Связанные аниме</h2>

      {loading ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5'>
          {[...Array(Math.min(relatedIds.length, 5))].map((_, index) => (
            <div
              key={index}
              className='w-full h-[300px] bg-white/[0.02] rounded-xl animate-pulse'
            ></div>
          ))}
        </div>
      ) : (
        <>
          {relatedAnime.length > 0 ? (
            <>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-5'>
                {(showAll ? relatedAnime : relatedAnime.slice(0, 7)).map((anime, index) => (
                  <div key={index} className='flex flex-col'>
                    <AnimeCard anime={anime} />
                    <span className='mt-2 text-sm text-white/50'>{anime.relation}</span>
                  </div>
                ))}
              </div>

              {relatedAnime.length > 7 && (
                <div className='flex justify-center mt-8'>
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className='px-5 w-full items-center justify-center flex py-2.5 bg-white/[0.03] text-white/80 rounded-xl hover:bg-white/[0.08] transition-all flex items-center gap-2'
                  >
                    {showAll ? (
                      <>
                        <svg
                          width='20'
                          height='20'
                          viewBox='0 0 24 24'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M18 15L12 9L6 15'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                        Скрыть
                      </>
                    ) : (
                      <>
                        <svg
                          width='20'
                          height='20'
                          viewBox='0 0 24 24'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M6 9L12 15L18 9'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                        Показать ещё ({relatedAnime.length - 7})
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className='h-[150px] rounded-xl flex items-center justify-center'>
              <div className='text-center space-y-2'>
                <p className='text-[24px]'>🔍</p>
                <p className='text-white/40'>Связанные аниме не найдены</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
