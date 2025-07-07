'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Anime } from '@/types/anime';
import { getGenreName } from '@/data/genres';
import ScreenshotGallery from './ScreenshotGallery';
import { VideoPlayer } from './VideoPlayer';
import RelatedAnime from './RelatedAnime';
import { getFullImageUrl } from '@/utils/imageUtils';
import { Eye, Check, Clock, Pause, X, Plus, ChevronDown, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import animeSaveListService from '@/services/animeSaveListService';
import viewHistoryService from '@/services/viewHistoryService';
import CommentSection from './CommentSection';
import CharacterDescription from '@/components/characters/CharacterDescription';

interface AnimeDetailsProps {
  anime: Anime;
}

/**
 * Вспомогательная функция для описания рейтинга
 */
const getRatingDescription = (rating: string): string => {
  const descriptions: Record<string, string> = {
    g: 'Нет возрастных ограничений. Демонстрация любому возрасту.',
    pg: 'Рекомендуется присутствие родителей при просмотре.',
    pg_13: 'Детям до 13 лет просмотр не желателен.',
    r: 'Лицам до 17 лет обязательно присутствие взрослого.',
    r_plus: 'Лицам до 18 лет просмотр запрещён.',
    rx: 'Хентай. Откровенный материал только для взрослых.',
  };
  return descriptions[rating] || 'Рейтинг не указан';
};

/**
 * Вспомогательная функция для общей длительности
 */
const getTotalDuration = (duration: number, episodes: number): string => {
  if (!duration || !episodes || episodes === 1) return '';
  const totalMinutes = duration * episodes;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `Общая длительность: ${hours} ч. ${minutes} мин.`;
};

/**
 * Форматирование даты
 */
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Цвет для статуса
 */
const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    ongoing: '#4CAF50',
    released: '#CCBAE4',
    announced: '#FFA726',
    anons: '#FFA726',
  };
  return colors[status] || '#CCBAE4';
};

/**
 * Компонент детальной информации об аниме
 */
const AnimeDetails: React.FC<AnimeDetailsProps> = ({ anime }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated } = useAuth();
  const [isAddingToList, setIsAddingToList] = useState(false);
  const [isCheckingList, setIsCheckingList] = useState(true); // Состояние для проверки списка
  const [open, setOpen] = useState(false); // Состояние для управления Popover
  const [currentList, setCurrentList] = useState<string | null>(null); // Текущий список, в котором находится аниме

  // Константы типов списков аниме
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
  const LIST_ICONS = {
    [LIST_TYPES.WATCHING]: <Eye size={16} />,
    [LIST_TYPES.COMPLETED]: <Check size={16} />,
    [LIST_TYPES.PLANNED]: <Clock size={16} />,
    [LIST_TYPES.ON_HOLD]: <Pause size={16} />,
    [LIST_TYPES.DROPPED]: <X size={16} />,
  };

  // Названия списков для отображения
  const LIST_NAMES = {
    [LIST_TYPES.WATCHING]: 'Смотрю',
    [LIST_TYPES.COMPLETED]: 'Просмотрено',
    [LIST_TYPES.PLANNED]: 'Запланировано',
    [LIST_TYPES.ON_HOLD]: 'Отложено',
    [LIST_TYPES.DROPPED]: 'Брошено',
  };

  // Цвета для иконок
  const ICON_COLORS = {
    [LIST_TYPES.WATCHING]: 'rgb(204, 186, 228)',
    [LIST_TYPES.COMPLETED]: 'rgb(134, 239, 172)',
    [LIST_TYPES.PLANNED]: 'rgb(147, 197, 253)',
    [LIST_TYPES.ON_HOLD]: 'rgb(252, 211, 77)',
    [LIST_TYPES.DROPPED]: 'rgb(253, 164, 175)',
  };

  // Добавление аниме в историю просмотров при посещении страницы
  useEffect(() => {
    const addToViewHistory = async () => {
      if (!isAuthenticated || !user || !anime) return;

      // Используем ID аниме (UUID формат)
      const animeId = anime.id;
      if (!animeId) {
        console.error('ID аниме не найден:', anime);
        return;
      }

      try {
        await viewHistoryService.addAnimeToViewHistory(user.id, animeId);
        console.log('Аниме добавлено в историю просмотров');
      } catch {
        console.error('Ошибка при добавлении аниме в историю просмотров');
        // Не показываем ошибку пользователю, чтобы не прерывать просмотр
      }
    };

    addToViewHistory();
  }, [anime, user, isAuthenticated]);

  // Проверка, в каком списке находится аниме
  useEffect(() => {
    let isMounted = true;

    const checkAnimeInLists = async () => {
      if (!isAuthenticated || !user || !anime) {
        setIsCheckingList(false);
        return;
      }

      const animeId = anime.anime_id || anime.id;
      if (!animeId) {
        setIsCheckingList(false);
        return;
      }

      setIsCheckingList(true);

      try {
        // Получаем все списки пользователя
        const allLists = await animeSaveListService.getAllUserLists(user.id);

        if (!isMounted) return;

        // Ищем аниме в полученных списках
        for (const list of allLists) {
          if (list && list.anime_ids && list.anime_ids.includes(animeId)) {
            setCurrentList(list.list_name);
            console.log('Аниме найдено в списке:', list.list_name);
            setIsCheckingList(false);
            return;
          }
        }

        // Если аниме не найдено ни в одном списке
        setCurrentList(null);
      } catch (error) {
        if (isMounted) {
          console.error('Ошибка при проверке списков:', error);
          setCurrentList(null);
        }
      } finally {
        if (isMounted) {
          setIsCheckingList(false);
        }
      }
    };

    checkAnimeInLists();

    // Cleanup функция
    return () => {
      isMounted = false;
    };
  }, [anime.anime_id, anime.id, user?.id, isAuthenticated, anime, user]); // Добавлены недостающие зависимости

  // Обработчик удаления аниме из списка
  const handleRemoveFromList = async () => {
    if (!isAuthenticated || !user || !currentList) return;

    const animeId = anime?.anime_id || anime?.id;
    if (!anime || !animeId) return;

    setIsAddingToList(true);

    try {
      console.log('Удаляем аниме из списка. ID аниме:', animeId);
      await animeSaveListService.removeAnimeFromList(animeId);

      // Обновляем состояние
      setCurrentList(null);
      toast.success('Аниме удалено из списка');
    } catch {
      console.error('Ошибка при удалении аниме из списка');
      toast.error('Не удалось удалить аниме из списка');
    } finally {
      setIsAddingToList(false);
    }
  };

  // Обработчик добавления аниме в список
  const handleAddToList = async (listType: string) => {
    console.log('handleAddToList вызван с типом:', listType);
    console.log('Данные аниме:', anime);

    if (!isAuthenticated) {
      console.log('Пользователь не авторизован');
      toast.error('Для добавления в список необходимо авторизоваться');
      return;
    }

    if (!user) {
      console.log('Данные пользователя отсутствуют');
      toast.error('Не удалось получить данные пользователя');
      return;
    }

    // Проверяем, какой ID использовать: anime_id или id
    const animeId = anime?.anime_id || anime?.id;

    if (!anime || !animeId) {
      console.log('ID аниме отсутствует');
      toast.error('Не удалось получить данные аниме');
      return;
    }

    console.log('Используемый ID аниме:', animeId);
    setIsAddingToList(true);
    setOpen(false); // Закрываем Popover после нажатия

    try {
      console.log('Проверяем существование списка:', listType);
      console.log('ID пользователя:', user.id);

      // Проверяем существование списка и создаем его при необходимости
      try {
        const existingList = await animeSaveListService.getAnimeListByName(listType, user.id);
        console.log('Список существует:', existingList);
      } catch {
        console.log('Список не существует, создаем новый');
        // Если список не существует, создаем новый
        const newList = await animeSaveListService.createAnimeList(listType);
        console.log('Создан новый список:', newList);
      }

      // Если аниме уже в другом списке, удаляем его оттуда
      if (currentList && currentList !== listType) {
        try {
          await animeSaveListService.removeAnimeFromList(animeId);
          console.log('Аниме удалено из списка:', currentList);
        } catch {
          console.error('Ошибка при удалении аниме из списка');
        }
      }

      console.log('Добавляем аниме в список. ID аниме:', animeId, 'Список:', listType);
      // Добавляем аниме в список
      const result = await animeSaveListService.addAnimeToList(animeId, listType);
      console.log('Результат добавления:', result);

      // Обновляем текущий список
      setCurrentList(listType);

      toast.success(
        `Аниме ${currentList ? 'перемещено' : 'добавлено'} в список "${LIST_NAMES[listType]}"`
      );
    } catch (err) {
      console.error('Ошибка при добавлении аниме в список:', err);
      toast.error('Не удалось добавить аниме в список. Пожалуйста, попробуйте позже.');
    } finally {
      setIsAddingToList(false);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleWatchClick = () => {
    // Прокручиваем к секции с плеером
    if (playerRef.current) {
      playerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (!anime) {
    return <div className='w-full h-[500px] flex items-center justify-center'></div>;
  }

  return (
    <section className='relative'>
      <div className='container px-5 flex flex-col lg:flex-row gap-8 relative'>
        {/* Left Column - Poster */}
        <article className='flex flex-col gap-3 lg:top-24 h-fit'>
          <div className='w-[280px] overflow-hidden rounded-[14px] relative group'>
            <Image
              alt={anime.russian || anime.english}
              className={`w-full h-[400px] object-cover transition-transform duration-500 scale-105  ${
                !imageLoaded ? 'opacity-0' : 'opacity-100'
              }`}
              src={getFullImageUrl(anime.poster_url)}
              width={280}
              height={400}
              unoptimized={true}
              onLoad={handleImageLoad}
              style={{ transition: 'opacity 0.3s ease-in-out' }}
            />
            {!imageLoaded && (
              <div className='absolute inset-0 bg-white/[0.02] animate-pulse rounded-[14px]'></div>
            )}
          </div>
          {/* Кнопка смотреть */}
          <button
            className='flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-[#DEDEDF]/5 text-white/90 hover:opacity-60 transition-all duration-300'
            onClick={handleWatchClick}
          >
            <svg
              width='25px'
              height='25px'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                d='M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM10.6935 15.8458L15.4137 13.059C16.1954 12.5974 16.1954 11.4026 15.4137 10.941L10.6935 8.15419C9.93371 7.70561 9 8.28947 9 9.21316V14.7868C9 15.7105 9.93371 16.2944 10.6935 15.8458Z'
                fill='#FFFFFFCC'
              />
            </svg>
            <span className='font-medium text-[#FFFFFFCC]'>Смотреть</span>
          </button>
          {/* Кнопка добавить в список (с выпадающим меню) */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                className={`relative flex items-center justify-start px-4 gap-2 w-full py-4 rounded-xl border ${
                  !currentList ? 'bg-white/[0.03] border-white/10' : ''
                } text-white/80 transition-all duration-300`}
                style={
                  currentList
                    ? {
                        border: `1px solid ${ICON_COLORS[currentList]
                          .replace('rgb', 'rgba')
                          .replace(')', ', 0.3)')}`,
                        background: `linear-gradient(0deg, rgba(0,0,0,0.95), rgba(0,0,0,0.95)), ${ICON_COLORS[currentList]}`,
                      }
                    : {}
                }
                disabled={isAddingToList || isCheckingList}
              >
                {isCheckingList ? (
                  <div className='flex items-center justify-center w-full'>
                    <Loader2 className='animate-spin h-5 w-5 text-white/60' />
                  </div>
                ) : currentList ? (
                  <>
                    <span style={{ color: ICON_COLORS[currentList] }}>
                      {LIST_ICONS[currentList]}
                    </span>
                    <span style={{ color: ICON_COLORS[currentList] }}>
                      {LIST_NAMES[currentList]}
                    </span>
                    <div className='absolute right-4 flex items-center gap-3'>
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromList();
                        }}
                        className='flex items-center justify-center w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 transition-colors cursor-pointer'
                      >
                        {isAddingToList ? (
                          <Loader2 className='animate-spin h-4 w-4' />
                        ) : (
                          <X size={16} />
                        )}
                      </span>
                      <ChevronDown size={16} className='opacity-60' />
                    </div>
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    <span>Добавить в список</span>
                    <ChevronDown size={16} className='absolute right-4 opacity-60' />
                  </>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent
              className='w-[280px] bg-[#0A0A0A]/95 backdrop-blur-md text-white rounded-xl shadow-xl border border-white/10 p-1.5'
              align='center'
              sideOffset={5}
            >
              <div className='flex flex-col w-full gap-1'>
                {Object.values(LIST_TYPES).map((listType) => (
                  <button
                    key={listType}
                    className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg hover:bg-white/[0.05] transition-colors text-left ${
                      currentList === listType ? 'bg-white/[0.03]' : ''
                    }`}
                    onClick={() => handleAddToList(listType)}
                  >
                    <span style={{ color: ICON_COLORS[listType] }}>{LIST_ICONS[listType]}</span>
                    <span
                      className='text-[14px]'
                      style={{
                        color: currentList === listType ? ICON_COLORS[listType] : undefined,
                      }}
                    >
                      {LIST_NAMES[listType]}
                    </span>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </article>

        {/* Center Column - Main Info */}
        <article className='flex w-full flex-col gap-8'>
          {anime.status === 'ongoing' && anime.nextEpisodeAt && (
            <div className='flex items-center justify-between p-5 bg-white/[0.02] rounded-xl'>
              <div className='flex items-center gap-3'>
                <div className='flex items-center justify-center w-10 h-10 rounded-full bg-[#FFE7B7]/10'>
                  <svg width='20' height='20' viewBox='0 0 24 24' className='text-[#FFE7B7]'>
                    <path
                      fill='currentColor'
                      d='M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m4.2 14.2L11 13V7h1.5v5.2l4.5 2.7l-.8 1.3Z'
                    />
                  </svg>
                </div>
                <div className='space-y-1'>
                  <div className='flex items-center gap-2'>
                    <span className='text-[14px] font-medium text-white/90'>Следующий эпизод</span>
                    <span
                      className='inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium text-white'
                      style={{ backgroundColor: getStatusColor(anime.status) }}
                    >
                      {anime.status === 'ongoing'
                        ? 'Онгоинг'
                        : anime.status === 'released'
                        ? 'Вышел'
                        : 'Анонс'}
                    </span>
                  </div>
                  <p className='text-[12px] text-white/40'>До выхода нового эпизода</p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <div className='px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5'>
                  <p className='text-[14px] font-medium text-white/90'>
                    {new Date(anime.nextEpisodeAt).toLocaleString('ru-RU', {
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}

          <header className='flex justify-between items-start gap-4'>
            <div className='flex flex-col gap-2'>
              <h1 className='text-[32px] font-bold text-white/90'>
                {anime.russian || anime.english}
              </h1>
              <p className='text-white/40 text-[14px]'>{anime.english}</p>
            </div>
            {anime.score > 0 && (
              <div className='bg-[#FFE4A0]/5 px-4 py-2 rounded-xl'>
                <span className='text-[#FFE4A0] font-medium'>{anime.score.toFixed(1)}</span>
              </div>
            )}
          </header>

          <div className='flex gap-2 flex-wrap'>
            {anime.genre_ids?.map((genreId: string, index: number) => {
              console.log('Жанр ID:', genreId);
              return (
                <span
                  key={index}
                  className='px-4 py-2 bg-white/[0.02] border border-white/5 text-white/60 rounded-xl text-[14px] hover:bg-white/[0.04] transition-colors'
                >
                  {getGenreName(genreId) || genreId}
                </span>
              );
            })}
          </div>

          <div className='w-full h-[1px] bg-white/5' />

          {anime.description && (
            <div className='container mx-auto mt-8 space-y-4'>
              <h2 className='text-lg font-medium text-white/90'>Описание</h2>
              <div className='text-white/70 text-sm leading-relaxed'>
                <CharacterDescription description={anime.description} />
              </div>
            </div>
          )}
        </article>

        {/* Vertical Divider Line */}
        <div className='hidden lg:block w-[1px] bg-white/5' />

        {/* Right Column - Additional Info */}
        <aside className='hidden lg:block min-w-[320px] space-y-4'>
          {anime.kind && (
            <div className='bg-white/[0.02] border border-white/5 rounded-xl p-5'>
              <div className='flex justify-between items-center'>
                <span className='text-white/40 text-[14px]'>Тип</span>
                <span className='text-white/80 text-[14px]'>
                  {anime.kind === 'tv'
                    ? 'TV Сериал'
                    : anime.kind === 'movie'
                    ? 'Фильм'
                    : anime.kind === 'ova'
                    ? 'OVA'
                    : anime.kind === 'ona'
                    ? 'ONA'
                    : anime.kind === 'special'
                    ? 'Спешл'
                    : anime.kind === 'tv_special'
                    ? 'TV Спешл'
                    : anime.kind}
                </span>
              </div>
            </div>
          )}
          {anime.episodes > 0 && (
            <div className='bg-white/[0.02] border border-white/5 rounded-xl p-5'>
              <div className='flex justify-between items-center'>
                <span className='text-white/40 text-[14px]'>Эпизодов</span>
                <span className='text-white/80 text-[14px] font-medium'>{anime.episodes}</span>
              </div>
            </div>
          )}
          {anime.status && (
            <div className='bg-white/[0.02] border border-white/5 rounded-xl p-5'>
              <div className='flex justify-between items-center'>
                <span className='text-white/40 text-[14px]'>Статус</span>
                <span className='text-white/80 text-[14px]'>
                  {anime.status === 'ongoing'
                    ? 'Онгоинг'
                    : anime.status === 'released'
                    ? 'Вышел'
                    : anime.status === 'anons'
                    ? 'Анонс'
                    : anime.status}
                </span>
              </div>
            </div>
          )}
          {anime.rating && (
            <div className='bg-white/[0.02] border border-white/5 rounded-xl p-5'>
              <div className='flex flex-col gap-2'>
                <div className='flex justify-between items-center'>
                  <span className='text-white/40 text-[14px]'>Рейтинг</span>
                  <span className='text-white/80 text-[14px] font-medium'>
                    {anime.rating === 'g'
                      ? 'G'
                      : anime.rating === 'pg'
                      ? 'PG'
                      : anime.rating === 'pg_13'
                      ? 'PG-13'
                      : anime.rating === 'r'
                      ? 'R'
                      : anime.rating === 'r_plus'
                      ? 'R+'
                      : anime.rating === 'rx'
                      ? 'Rx'
                      : anime.rating}
                  </span>
                </div>
                <span className='text-white/30 text-[12px]'>
                  {getRatingDescription(anime.rating)}
                </span>
              </div>
            </div>
          )}
          {anime.duration > 0 && (
            <div className='bg-white/[0.02] border border-white/5 rounded-xl p-5'>
              <div className='flex flex-col gap-2'>
                <div className='flex justify-between items-center'>
                  <span className='text-white/40 text-[14px]'>Длительность серии</span>
                  <span className='text-white/80 text-[14px]'>{anime.duration} мин.</span>
                </div>
                <span className='text-white/30 text-[12px]'>
                  {getTotalDuration(anime.duration, anime.episodes)}
                </span>
              </div>
            </div>
          )}
          {anime.season && (
            <div className='bg-white/[0.02] border border-white/5 rounded-xl p-5'>
              <div className='flex justify-between items-center'>
                <span className='text-white/40 text-[14px]'>Сезон</span>
                <span className='text-white/80 text-[14px]'>
                  {(() => {
                    // Разделяем сезон и год, если они в формате "season_year"
                    const parts = anime.season.split('_');
                    const seasonName = parts[0];
                    const year = parts.length > 1 ? parts[1] : '';

                    // Переводим название сезона
                    let russianSeason = '';
                    switch (seasonName) {
                      case 'summer':
                        russianSeason = 'Лето';
                        break;
                      case 'fall':
                        russianSeason = 'Осень';
                        break;
                      case 'winter':
                        russianSeason = 'Зима';
                        break;
                      case 'spring':
                        russianSeason = 'Весна';
                        break;
                      default:
                        russianSeason = seasonName;
                    }

                    // Возвращаем сезон с годом или без
                    return year ? `${russianSeason} ${year}` : russianSeason;
                  })()}
                </span>
              </div>
            </div>
          )}
          {(anime.aired_on || anime.released_on) && (
            <div className='bg-white/[0.02] border border-white/5 rounded-xl p-5 space-y-3'>
              {anime.aired_on && (
                <div className='flex justify-between items-center'>
                  <span className='text-white/40 text-[14px]'>Начало показа</span>
                  <span className='text-white/80 text-[14px]'>{formatDate(anime.aired_on)}</span>
                </div>
              )}
              {anime.released_on && (
                <div className='flex justify-between items-center'>
                  <span className='text-white/40 text-[14px]'>Завершение</span>
                  <span className='text-white/80 text-[14px]'>{formatDate(anime.released_on)}</span>
                </div>
              )}
            </div>
          )}
        </aside>
      </div>

      {/* Галерея скриншотов */}
      {anime.screenshots && anime.screenshots.length > 0 ? (
        <div className='container px-5 mt-10'>
          <ScreenshotGallery screenshots={anime.screenshots} maxToShow={5} />
        </div>
      ) : null}

      {/* Видеоплеер */}
      {anime.anime_id ? (
        <div className='container px-5 py-15' ref={playerRef}>
          <VideoPlayer
            animeId={anime.anime_id}
            totalEpisodes={anime.episodes || 12}
            animeName={anime.russian || anime.english || ''}
            id={anime.id}
          />
        </div>
      ) : null}

      {/* Связанные аниме */}
      {anime.related_anime_ids && anime.related_anime_ids.length > 0 ? (
        <div className='container px-5'>
          <RelatedAnime
            relatedIds={anime.related_anime_ids}
            relatedTexts={anime.related_anime_texts}
          />
        </div>
      ) : null}

      {/* Комментарии */}
      <div className='container px-5 mt-10'>
        <CommentSection animeId={anime.id} />
      </div>
    </section>
  );
};

export default AnimeDetails;
