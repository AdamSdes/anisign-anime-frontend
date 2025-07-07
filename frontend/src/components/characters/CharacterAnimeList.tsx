'use client';

import { useQuery } from '@tanstack/react-query';
import characterService from '@/services/characterService';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useCallback, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Anime } from '@/types/anime';

interface CharacterAnimeListProps {
  characterId: string;
}

export default function CharacterAnimeList({ characterId }: CharacterAnimeListProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['character-anime', characterId],
    queryFn: () => characterService.getAnimeByCharacterId(characterId),
    staleTime: 1000 * 60 * 10, // 10 минут
    enabled: !!characterId,
  });

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className='animate-pulse'>
                <div style={{ paddingBottom: '142.857%' }} className='relative w-full'>
                  <div className='absolute inset-0 bg-white/5 rounded-xl'></div>
                </div>
                <div className='mt-2 space-y-2'>
                  <div className='h-4 bg-white/5 rounded w-3/4'></div>
                  <div className='h-3 bg-white/5 rounded w-1/2'></div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  if (error || !data || data.anime_list.length === 0) {
    return (
      <div className='text-center py-12'>
        <div className='w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='text-white/40'
          >
            <path
              d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <circle
              cx='12'
              cy='12'
              r='4'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </div>
        <p className='text-white/50 text-sm'>Информация об аниме не найдена</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
        {data.anime_list.map((anime: Anime, index: number) => (
          <AnimeCard key={anime.id} anime={anime} index={index} />
        ))}
      </div>
    </div>
  );
}

interface AnimeCardProps {
  anime: Anime;
  index: number;
}

function AnimeCard({ anime, index }: AnimeCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Плавное появление карточки с задержкой
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 50);

    return () => clearTimeout(timer);
  }, [index]);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  // Форматирование названия типа аниме
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

  // Получение года выхода
  const getYear = (): string => {
    if (anime.aired_on) {
      return new Date(anime.aired_on).getFullYear().toString();
    }
    return '';
  };

  return (
    <Tooltip delayDuration={500}>
      <TooltipTrigger asChild>
        <div
          className={`group relative flex w-full flex-col gap-2 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{
            transitionDelay: imageLoaded ? '0ms' : `${index * 50}ms`,
          }}
        >
          <div style={{ position: 'relative', width: '100%', paddingBottom: '142.857%' }}>
            <div
              className='relative w-full overflow-hidden rounded-xl bg-muted'
              style={{ position: 'absolute', inset: 0 }}
            >
              <Link
                className='absolute left-0 top-0 flex size-full items-center justify-center rounded-md bg-secondary/20'
                href={`/anime/${anime.anime_id}`}
              >
                {!imageError ? (
                  <>
                    <Image
                      src={anime.poster_url}
                      alt={anime.russian || anime.english}
                      fill
                      sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
                      className={`size-full object-cover !transition-all duration-500 scale-105 group-hover:scale-115 ${
                        imageLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                      onError={handleImageError}
                      onLoad={handleImageLoad}
                      priority={index < 12}
                      unoptimized={true}
                    />

                    {!imageLoaded && (
                      <div className='absolute inset-0 bg-white/5 animate-pulse rounded-xl' />
                    )}

                    <div
                      className={`absolute top-2 right-2 flex flex-col gap-1.5 items-end z-10 transition-opacity duration-300 ${
                        imageLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      {anime.score > 0 && (
                        <div className='bg-black rounded-full w-10 h-7 flex items-center justify-center'>
                          <span className='text-white/80 text-xs font-medium'>
                            {anime.score.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className='w-full h-full flex items-center justify-center bg-[#1e1e1e] text-white/50'>
                    Нет изображения
                  </div>
                )}
              </Link>
            </div>
          </div>

          <Link
            className={`mt-1 truncate transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            href={`/anime/${anime.anime_id}`}
          >
            <label className='text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer leading-5'>
              {anime.russian || anime.english}
            </label>
            <div className='mt-1 flex cursor-pointer items-center gap-2'>
              {getYear() && (
                <label className='font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-xs text-muted-foreground'>
                  {getYear()}
                </label>
              )}
              {getYear() && anime.kind && (
                <div className='size-1 rounded-full bg-muted-foreground'></div>
              )}
              {anime.kind && (
                <label className='font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-xs text-muted-foreground'>
                  {formatKind(anime.kind)}
                </label>
              )}
            </div>
          </Link>
        </div>
      </TooltipTrigger>

      <TooltipContent side='right' className='p-4 max-w-80'>
        <div className='space-y-3'>
          <div>
            <h3 className='font-semibold text-white/95 leading-tight'>
              {anime.russian || anime.english}
            </h3>
            {anime.english && anime.english !== anime.russian && (
              <p className='text-xs text-white/60 mt-1'>{anime.english}</p>
            )}
          </div>

          {anime.description && (
            <div className='pt-2 border-t border-white/10'>
              <p className='text-xs text-white/70 leading-relaxed line-clamp-4'>
                {anime.description
                  .replace(/<[^>]*>/g, '')
                  .replace(/\[spoiler(?:=[^\]]+)?\].*?\[\/spoiler\]/g, '[Скрыто]')
                  .replace(/\[url=.*?\].*?\[\/url\]/g, '')
                  .replace(/\[character=.*?\].*?\[\/character\]/g, '')
                  .substring(0, 200)}
                ...
              </p>
            </div>
          )}

          <div className='pt-2 border-t border-white/10'>
            <span className='text-xs text-white/60'>Нажмите, чтобы перейти к аниме</span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
