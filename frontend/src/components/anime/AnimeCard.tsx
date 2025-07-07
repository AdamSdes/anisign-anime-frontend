'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { Anime } from '@/types/anime';
import { useAuth } from '@/context/AuthContext';
import { Eye, Check, Clock, Pause, X } from 'lucide-react';
import animeSaveListService from '@/services/animeSaveListService';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AnimeTooltip from './AnimeTooltip';

interface AnimeCardProps {
  anime: Anime;
  index?: number; // Для staggered анимации
}

export default function AnimeCard({ anime, index = 0 }: AnimeCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const [listType, setListType] = useState<string | null>(null);

  // Плавное появление карточки с задержкой
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 50); // 50мс задержка между карточками

    return () => clearTimeout(timer);
  }, [index]);

  // Константы типов списков аниме с useMemo чтобы избежать перерендеров
  const LIST_TYPES = useMemo(
    () => ({
      WATCHING: 'Watching',
      COMPLETED: 'Completed',
      PLANNED: 'Plan to Watch',
      ON_HOLD: 'On Hold',
      DROPPED: 'Dropped',
    }),
    []
  );

  // Иконки для списков
  const LIST_ICONS: Record<string, React.ReactNode> = {
    [LIST_TYPES.WATCHING]: <Eye size={14} />,
    [LIST_TYPES.COMPLETED]: <Check size={14} />,
    [LIST_TYPES.PLANNED]: <Clock size={14} />,
    [LIST_TYPES.ON_HOLD]: <Pause size={14} />,
    [LIST_TYPES.DROPPED]: <X size={14} />,
  };

  // Цвета для иконок
  const ICON_COLORS = {
    [LIST_TYPES.WATCHING]: 'rgb(204, 186, 228)',
    [LIST_TYPES.COMPLETED]: 'rgb(134, 239, 172)',
    [LIST_TYPES.PLANNED]: 'rgb(147, 197, 253)',
    [LIST_TYPES.ON_HOLD]: 'rgb(252, 211, 77)',
    [LIST_TYPES.DROPPED]: 'rgb(253, 164, 175)',
  };

  // Функция для обработки ошибки загрузки изображения с мемоизацией
  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true); // Считаем загруженным даже при ошибке
  }, []);

  // Функция для обработки успешной загрузки изображения
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  // Проверка, в каком списке находится аниме
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const checkAnimeLists = async () => {
      if (!isAuthenticated || !user || !anime) return;

      const animeId = anime.anime_id || anime.id;
      if (!animeId) {
        console.log('ID аниме не найден:', anime);
        return;
      }

      // Дебаунсинг - задержка перед выполнением запроса
      timeoutId = setTimeout(async () => {
        if (!isMounted) return;

        try {
          // Получаем все списки пользователя с коротким таймаутом
          const allLists = await animeSaveListService.getAllUserLists(user.id);

          if (!isMounted) return;

          // Проверяем, в каком списке находится аниме
          for (const list of allLists) {
            if (list && list.anime_ids && list.anime_ids.includes(animeId)) {
              setListType(list.list_name);
              return;
            }
          }

          // Если аниме не найдено ни в одном списке
          setListType(null);
        } catch (error) {
          if (isMounted) {
            console.error('Ошибка при проверке списков аниме:', error);
            setListType(null);
          }
        }
      }, 100); // 100мс задержка для дебаунсинга
    };

    checkAnimeLists();

    // Cleanup функция
    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [anime.anime_id, anime.id, user?.id, isAuthenticated, anime, user]); // Добавлены недостающие зависимости

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
                      alt='Poster'
                      fill
                      sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
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

                      {listType && LIST_ICONS[listType] && (
                        <div className='bg-black/80 backdrop-blur-sm rounded-full w-7 h-7 flex items-center justify-center'>
                          <span style={{ color: ICON_COLORS[listType] }}>{LIST_ICONS[listType]}</span>
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
      
      <TooltipContent side="right" className="p-4">
        <AnimeTooltip anime={anime} />
      </TooltipContent>
    </Tooltip>
  );
}
