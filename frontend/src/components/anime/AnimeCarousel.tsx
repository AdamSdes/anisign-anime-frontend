'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import animeService from '@/services/animeService';
import { Anime } from '@/types/anime';
import AnimeCard from './AnimeCard';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';

interface AnimeCarouselProps {
  title: string;
  limit?: number;
  filters?: {
    status?: string;
    kind?: string;
    rating?: string;
    genre_ids?: string[];
    start_year?: number;
    end_year?: number;
    sort_by?: string;
    filter_by_score?: boolean;
    filter_by_date?: boolean;
    filter_by_name?: boolean;
  };
}

export default function AnimeCarousel({ title, limit = 10, filters = {} }: AnimeCarouselProps) {
  // Преобразуем фильтры в строку для стабильного сравнения
  const filtersString = useMemo(() => JSON.stringify(filters), [filters]);
  
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    dragFree: true,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['animeCarousel', title, limit, filtersString],
    queryFn: async () => {
      // Если есть фильтры, используем метод для фильтрации
      if (Object.keys(filters).length > 0) {
        return await animeService.getFilteredAnimeList(1, limit, filters);
      }
      // Иначе используем обычный метод
      return await animeService.getAnimeList(1, limit);
    },
    staleTime: 1000 * 60 * 5, // 5 минут
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="mb-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-medium">{title}</h2>
        <Link 
          href="/anime" 
          className="ml-2 text-sm text-white/60 hover:text-white flex items-center gap-1 transition-colors"
        >
          Все аниме
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {isLoading && (
            Array(limit).fill(0).map((_, index) => (
              <div key={index} className="min-w-[180px] flex-[0_0_180px] md:min-w-[200px] md:flex-[0_0_200px]">
                <div className="animate-pulse">
                  <div className="rounded-md bg-white/5 w-full" style={{ paddingBottom: '142.857%' }}></div>
                  <div className="h-4 bg-white/5 rounded mt-2 w-3/4"></div>
                  <div className="h-3 bg-white/5 rounded mt-2 w-1/2"></div>
                </div>
              </div>
            ))
          )}

          {!isLoading && !isError && data?.anime_list?.map((anime: Anime) => (
            <div key={anime.anime_id} className="min-w-[180px] flex-[0_0_180px] md:min-w-[200px] md:flex-[0_0_200px]">
              <AnimeCard anime={anime} />
            </div>
          ))}

          {isError && (
            <div className="text-red-500 py-4">
              Произошла ошибка при загрузке данных
            </div>
          )}
        </div>
      </div>

      {/* Навигация и точки */}
      <div className="flex justify-between items-center mt-8">
        {/* Кнопки навигации слева */}
        <div className="flex gap-2">
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="p-2 rounded-full hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Предыдущий"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="p-2 rounded-full hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Следующий"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Точки справа */}
        <div className="flex items-center h-10 gap-2 bg-white/5 border border-white/10 px-4 rounded-full">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === selectedIndex 
                  ? 'bg-white' 
                  : 'bg-white/20 hover:bg-white/40'
              }`}
              onClick={() => scrollTo(index)}
              aria-label={`Перейти к слайду ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
