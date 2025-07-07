'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import AnimeCard from '@/components/anime/AnimeCard';
import animeSaveListService from '@/services/animeSaveListService';
import animeService from '@/services/animeService';
import viewHistoryService from '@/services/viewHistoryService';
import { Anime } from '@/types/anime';
import { useAuth } from '@/context/AuthContext';
import { Eye, Check, Clock, Pause, X, History } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger
} from '@/components/ui/sheet';

// Типы списков аниме
const LIST_TYPES = {
  WATCHING: 'Watching',
  COMPLETED: 'Completed',
  PLAN_TO_WATCH: 'Plan to Watch',
  ON_HOLD: 'On Hold',
  DROPPED: 'Dropped',
};

// Русские названия типов списков
const LIST_NAMES_RU = {
  [LIST_TYPES.WATCHING]: 'Смотрю',
  [LIST_TYPES.COMPLETED]: 'Просмотрено',
  [LIST_TYPES.PLAN_TO_WATCH]: 'Запланировано',
  [LIST_TYPES.ON_HOLD]: 'Отложено',
  [LIST_TYPES.DROPPED]: 'Брошено',
};

// Иконки для каждого типа списка
const LIST_ICONS = {
  [LIST_TYPES.WATCHING]: Eye,
  [LIST_TYPES.COMPLETED]: Check,
  [LIST_TYPES.PLAN_TO_WATCH]: Clock,
  [LIST_TYPES.ON_HOLD]: Pause,
  [LIST_TYPES.DROPPED]: X,
};

// Цвета для иконок
const ICON_COLORS = {
  [LIST_TYPES.WATCHING]: 'rgb(204, 186, 228)',
  [LIST_TYPES.COMPLETED]: 'rgb(134, 239, 172)',
  [LIST_TYPES.PLAN_TO_WATCH]: 'rgb(147, 197, 253)',
  [LIST_TYPES.ON_HOLD]: 'rgb(252, 211, 77)',
  [LIST_TYPES.DROPPED]: 'rgb(253, 164, 175)',
};

interface AnimeSaveListSectionProps {
  userId: string;
  isOwnProfile: boolean;
}

/**
 * История просмотров пользователя
 */
const WatchHistory: React.FC<{ userId: string }> = ({ userId }) => {
  const [history, setHistory] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  
  // Получение истории просмотров
  useEffect(() => {
    const fetchWatchHistory = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await viewHistoryService.getViewHistory(userId);
        
        // Если API вернул готовый список анимe
        if (response.animes && response.animes.length > 0) {
          // Фильтруем дубликаты по ID аниме
          const uniqueAnime = filterUniqueAnime(response.animes);
          setHistory(uniqueAnime);
        } 
        // Если API вернул только ID аниме, то получаем детали по каждому
        else if (response.user_view_history && 
                response.user_view_history.length > 0 && 
                response.user_view_history[0].anime_id_list && 
                response.user_view_history[0].anime_id_list.length > 0) {
          
          // Получаем уникальные ID аниме с помощью Set
          const uniqueAnimeIds: string[] = [...new Set(response.user_view_history[0].anime_id_list as string[])];
          const animeDetailsPromises = uniqueAnimeIds.map(async (id: string) => {
            try {
              // Получаем подробную информацию о каждом аниме
              const animeDetails = await animeService.getAnimeById(id);
              return animeDetails;
            } catch (err) {
              console.error(`Ошибка при получении деталей аниме ${id}:`, err);
              return null;
            }
          });
          
          const animeDetails = await Promise.all(animeDetailsPromises);
          // Фильтруем null значения на случай, если какие-то запросы не удались
          setHistory(animeDetails.filter(anime => anime !== null));
        } else {
          setHistory([]);
        }
      } catch (err) {
        console.error('Ошибка при получении истории просмотров:', err);
        setError('Не удалось загрузить историю просмотров');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWatchHistory();
  }, [userId]);

  // Функция для фильтрации уникальных аниме по ID
  const filterUniqueAnime = (animeList: Anime[]): Anime[] => {
    const uniqueIds = new Set<string>();
    return animeList.filter(anime => {
      const id = anime.id || anime.anime_id;
      if (uniqueIds.has(id)) {
        return false;
      }
      uniqueIds.add(id);
      return true;
    });
  };

  // Вспомогательные функции для работы с аниме
  function getYear(anime: Anime): string {
    if (anime.aired_on) {
      return new Date(anime.aired_on).getFullYear().toString();
    }
    return '';
  };

  function formatKind(kind: string): string {
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

  // Рендер элемента истории просмотров
  const renderHistoryItem = (anime: Anime, index: number) => {
    return (
      <Link
        key={`watch-history-${anime.id || anime.anime_id}-${index}`}
        href={`/anime/${anime.anime_id}`}
        className='flex gap-3 p-3 rounded-xl bg-[#0A0A0A]/70 hover:bg-[#0A0A0A] transition-colors'
      >
        <div className='w-[60px] h-[80px] relative overflow-hidden rounded-lg'>
          <Image 
            src={anime.poster_url} 
            alt={anime.russian || anime.english || 'Аниме'} 
            className='object-cover'
            fill
            sizes="60px"
            unoptimized={true}
          />
        </div>
        <div className='flex flex-col justify-center'>
          <h3 className='text-sm text-white/90 font-medium line-clamp-1'>
            {anime.russian || anime.english}
          </h3>
          <div className='flex items-center gap-2 mt-1'>
            {getYear(anime) && (
              <span className='text-[11px] text-white/50'>{getYear(anime)}</span>
            )}
            {getYear(anime) && anime.kind && (
              <div className='size-1 rounded-full bg-white/20'></div>
            )}
            {anime.kind && (
              <span className='text-[11px] text-white/50'>{formatKind(anime.kind)}</span>
            )}
            {(anime.episodes > 0) && (
              <>
                <div className='size-1 rounded-full bg-white/20'></div>
                <span className='text-[11px] text-white/50'>{anime.episodes} эп.</span>
              </>
            )}
          </div>
        </div>
      </Link>
    );
  };

  // Рендер элемента истории просмотров для Sheet (с фиксированным размером)
  const renderSheetHistoryItem = (anime: Anime, index: number) => {
    return (
      <Link
        key={`watch-history-sheet-${anime.id || anime.anime_id}-${index}`}
        href={`/anime/${anime.anime_id}`}
        className='flex gap-3 p-3 rounded-xl bg-[#0A0A0A]/70 hover:bg-[#0A0A0A] transition-colors'
      >
        <div style={{ width: '70px', height: '98px' }} className='relative overflow-hidden rounded-lg'>
          <Image 
            src={anime.poster_url} 
            alt={anime.russian || anime.english || 'Аниме'} 
            className='object-cover'
            fill
            sizes="70px"
            unoptimized={true}
          />
        </div>
        <div className='flex flex-col justify-center'>
          <h3 className='text-sm text-white/90 font-medium line-clamp-1'>
            {anime.russian || anime.english}
          </h3>
          <div className='flex items-center gap-2 mt-1'>
            {getYear(anime) && (
              <span className='text-[11px] text-white/50'>{getYear(anime)}</span>
            )}
            {getYear(anime) && anime.kind && (
              <div className='size-1 rounded-full bg-white/20'></div>
            )}
            {anime.kind && (
              <span className='text-[11px] text-white/50'>{formatKind(anime.kind)}</span>
            )}
            {(anime.episodes > 0) && (
              <>
                <div className='size-1 rounded-full bg-white/20'></div>
                <span className='text-[11px] text-white/50'>{anime.episodes} эп.</span>
              </>
            )}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between mb-5'>
        <div className='flex items-center gap-2'>
          <div className='w-6 h-6 rounded-full bg-white/5 flex items-center justify-center'>
            <History className='w-4 h-4 text-white/60' />
          </div>
          <h2 className='text-white/90 text-sm font-medium'>История просмотров</h2>
          <span className='text-white/40 text-xs'>({history.length})</span>
        </div>
        {history.length > 0 && (
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <button
                className='inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-[#0A0A0A] h-9 px-4 py-2 text-xs text-white/60 hover:text-white/90 transition-colors'
              >
                Показать всё
              </button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className='bg-[#060606] border-white/10 text-white/90 overflow-y-auto p-5'
            >
              <SheetHeader className='mb-4'>
                <div className='flex items-center gap-2 mb-2'>
                  <div className='w-7 h-7 rounded-full bg-white/5 flex items-center justify-center'>
                    <History className='w-4 h-4 text-white/60' />
                  </div>
                  <SheetTitle className='text-white/90 text-lg font-medium'>История просмотров</SheetTitle>
                </div>
                <div className='text-white/40 text-xs'>
                  Всего просмотрено: {history.length} аниме
                </div>
              </SheetHeader>
              <div className='space-y-3 mt-6 pr-1'>
                {history.length === 0 ? (
                  <div className='p-6 rounded-xl bg-[#0A0A0A] text-white/70 text-sm flex flex-col items-center justify-center'>
                    <div className='w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3'>
                      <History className='w-6 h-6 text-white/20' />
                    </div>
                    <p>История просмотров пуста</p>
                  </div>
                ) : (
                  // Отзеркаливаем порядок - последние просмотренные аниме будут первыми
                  [...history].reverse().map((anime, index) => (
                    renderSheetHistoryItem(anime, index)
                  ))
                )}
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>

      {isLoading ? (
        <div className='space-y-3'>
          {[...Array(3)].map((_, index) => (
            <div key={index} className='flex gap-3 p-3 rounded-xl bg-[#0A0A0A]/70'>
              <Skeleton className='w-[60px] h-[80px] rounded-lg bg-[#0A0A0A]' />
              <div className='flex-1 space-y-2 py-2'>
                <Skeleton className='w-3/4 h-4 rounded bg-[#0A0A0A]' />
                <Skeleton className='w-1/2 h-3 rounded bg-[#0A0A0A]' />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className='p-6 rounded-xl bg-[#0A0A0A] text-white/70 text-sm flex flex-col items-center justify-center'>
          <div className='w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3'>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/20">
              <path d="M12 9V13L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p>{error}</p>
        </div>
      ) : history.length === 0 ? (
        <div className='p-6 rounded-xl bg-[#0A0A0A] text-white/70 text-sm flex flex-col items-center justify-center'>
          <div className='w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3'>
            <History className='w-6 h-6 text-white/20' />
          </div>
          <p>История просмотров пуста</p>
        </div>
      ) : (
        <div className='space-y-3'>
          {/* Отзеркаливаем порядок - последние просмотренные аниме будут первыми */}
          {[...history].reverse().slice(0, 5).map((anime, index) => renderHistoryItem(anime, index))}
        </div>
      )}
    </div>
  );
};

/**
 * Компонент для отображения списков сохраненных аниме в профиле пользователя
 * @param {AnimeSaveListSectionProps} props - Пропсы компонента
 * @returns {JSX.Element}
 */
export const AnimeSaveListSection: React.FC<AnimeSaveListSectionProps> = ({
  userId,
  isOwnProfile,
}) => {
  const [activeTab, setActiveTab] = useState<string>(LIST_TYPES.WATCHING);
  const [animeDetails, setAnimeDetails] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Состояние для хранения счетчиков всех списков
  const [listCounts, setListCounts] = useState<Record<string, number>>({});

  // Функция для загрузки счетчиков всех списков
  const fetchAllListCounts = useCallback(async () => {
    try {
      const lists = Object.values(LIST_TYPES);
      const countsPromises = lists.map(async (listName) => {
        try {
          const list = await animeSaveListService.getAnimeListByName(listName, userId);
          return { listName, count: list.anime_ids.length };
        } catch (error) {
          console.error(`Ошибка при получении счетчика для списка ${listName}:`, error);
          return { listName, count: 0 };
        }
      });

      const results = await Promise.all(countsPromises);
      const countsMap = results.reduce((acc, { listName, count }) => {
        acc[listName] = count;
        return acc;
      }, {} as Record<string, number>);

      setListCounts(countsMap);
    } catch (error) {
      console.error('Ошибка при загрузке счетчиков:', error);
    }
  }, [userId]);

  // Загружаем все счетчики при первой загрузке компонента
  useEffect(() => {
    fetchAllListCounts();
  }, [fetchAllListCounts]);

  // Функция для получения списка аниме
  const fetchAnimeList = useCallback(
    async (listName: string) => {
      setIsLoading(true);
      setError(null);

      try {
        // Получаем список сохраненных id аниме
        const list = await animeSaveListService.getAnimeListByName(listName, userId);

        // Обновляем счетчик для текущего списка
        setListCounts(prev => ({
          ...prev,
          [listName]: list.anime_ids.length
        }));

        // Если в списке есть id аниме, запрашиваем подробную информацию о каждом аниме
        if (list && list.anime_ids && list.anime_ids.length > 0) {
          // Получаем детали для каждого аниме последовательно
          const details = await Promise.all(
            list.anime_ids.map(async (id) => {
              try {
                const animeDetails = await animeService.getAnimeById(id);
                return animeDetails;
              } catch (error) {
                console.error(`Ошибка при получении данных аниме ID ${id}:`, error);
                return null;
              }
            })
          );

          // Фильтруем null значения (если запрос по какому-то id не удался)
          setAnimeDetails(details.filter((anime): anime is Anime => anime !== null));
        } else {
          setAnimeDetails([]);
        }
      } catch (error) {
        console.error('Ошибка при загрузке списка аниме:', error);

        // Если список не существует и это профиль пользователя, создаем новый список
        if (isOwnProfile && user) {
          try {
            await animeSaveListService.createAnimeList(listName);
            setAnimeDetails([]);

            // Обновляем счетчик для созданного списка
            setListCounts(prev => ({
              ...prev,
              [listName]: 0
            }));
          } catch (createError) {
            setError('Не удалось создать список. Пожалуйста, попробуйте позже.');
            console.error('Ошибка при создании списка:', createError);
          }
        } else {
          setError(
            'Не удалось загрузить список. Возможно, он не существует или произошла ошибка сервера.'
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
    [userId, isOwnProfile, user]
  );

  // Загружаем список при изменении активной вкладки
  useEffect(() => {
    fetchAnimeList(activeTab);
  }, [activeTab, fetchAnimeList]);

  // Обработчик изменения вкладки
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className='w-full mt-20'>
      <h2 className='text-xl font-semibold mb-6 text-white/90'>Списки аниме</h2>

      <div className='flex flex-col lg:flex-row gap-8'>
        {/* ЛЕВАЯ КОЛОНКА - Списки сохраненных аниме */}
        <div className='w-full lg:w-2/3'>
          <Tabs
            defaultValue={LIST_TYPES.WATCHING}
            value={activeTab}
            onValueChange={handleTabChange}
          >
            {/* Кастомные кнопки вкладок */}
            <div className='flex gap-2 flex-wrap mb-6'>
              {Object.values(LIST_TYPES).map((listType) => {
                const IconComponent = LIST_ICONS[listType];
                const isActive = activeTab === listType;
                const count = listCounts[listType] || 0;

                return (
                  <button
                    key={listType}
                    onClick={() => handleTabChange(listType)}
                    className={`justify-center whitespace-nowrap text-sm font-medium 
                      focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring 
                      disabled:pointer-events-none disabled:opacity-50 
                      [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 
                      shadow py-2 h-[45px] px-4 rounded-xl flex items-center gap-2 
                      transition-all duration-300 
                      ${
                        isActive
                          ? 'bg-white/[0.08] text-white hover:bg-primary/90'
                          : 'bg-white/[0.02] hover:bg-white/[0.04] text-white/60'
                      }`}
                  >
                    <IconComponent className='h-4 w-4' style={{ color: ICON_COLORS[listType] }} />
                    <span>{LIST_NAMES_RU[listType]}</span>
                    <span className='px-2 py-0.5 rounded-md bg-white/[0.04] text-[12px] ml-1'>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Содержимое вкладок */}
            {Object.values(LIST_TYPES).map((listType) => (
              <TabsContent key={listType} value={listType} className='pt-4'>
                {isLoading ? (
                  <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                    {[...Array(4)].map((_, index) => (
                      <div key={index} className='flex flex-col gap-2'>
                        <Skeleton className='w-full h-[250px] rounded-xl bg-[#0A0A0A]' />
                        <Skeleton className='w-3/4 h-4 rounded bg-[#0A0A0A]' />
                        <Skeleton className='w-1/2 h-3 rounded bg-[#0A0A0A]' />
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className='p-4 rounded-lg bg-red-500/10 text-white/70'>{error}</div>
                ) : animeDetails.length === 0 ? (
                  <div className='flex flex-col items-center justify-center min-h-[200px] text-white/60'>
                    <p className='text-3xl mb-3'>🍜</p>
                    <p>{isOwnProfile ? 'В этом списке пока нет аниме' : 'В этом списке пока нет аниме'}</p>
                    {isOwnProfile && <p className='text-sm mt-1'>Самое время добавить что-нибудь интересное!</p>}
                  </div>
                ) : (
                  <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4'>
                    {animeDetails.map((anime) => (
                      <AnimeCard key={anime.anime_id} anime={anime} />
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Разделитель */}
        <div className='hidden lg:block w-px h-auto self-stretch bg-white/[0.06]'></div>

        {/* ПРАВАЯ КОЛОНКА - История просмотров */}
        <div className='w-full lg:w-1/3'>
          <WatchHistory userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default AnimeSaveListSection;
