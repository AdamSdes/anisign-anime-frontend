'use client';

import React, { useState, useEffect } from 'react';
import { AnimeFilters as AnimeFiltersType } from '@/types/anime';
import FilterSection from './FilterSection';
import FilterButton from './FilterButton';
import { MultiSelect } from '@/components/ui/multi-select';
import { Slider } from '@/components/ui/slider';
import animeService from '@/services/animeService';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, Check, User, Info, FileType, FilterX } from 'lucide-react';
import { useAnimeFilters } from '@/context/AnimeFiltersContext';

export default function AnimeFiltersSidebar() {
  const { filters, setFilters, resetFilters } = useAnimeFilters();
  const [localFilters, setLocalFilters] = useState<AnimeFiltersType>(filters);
  const MIN_YEAR = 1965;
  const MAX_YEAR = 2025;
  const [yearRange, setYearRange] = useState<[number, number]>([
    localFilters.start_year || MIN_YEAR, 
    localFilters.end_year || MAX_YEAR
  ]);

  // Синхронизация локальных фильтров с глобальными
  useEffect(() => {
    setLocalFilters(filters);
    setYearRange([
      filters.start_year || MIN_YEAR,
      filters.end_year || MAX_YEAR
    ]);
  }, [filters]);

  // Обработчик изменения фильтров
  const handleFilterChange = (
    key: keyof AnimeFiltersType,
    value: string | boolean | string[] | number | undefined
  ) => {
    const newFilters = { ...localFilters };

    if (key === 'genre_ids') {
      // Для жанров используем прямое присваивание, включая случай undefined
      newFilters.genre_ids = value as string[] | undefined;
    } else {
      if (newFilters[key] === value || value === undefined) {
        newFilters[key] = undefined;
      } else {
        switch (key) {
          case 'kind':
          case 'rating':
          case 'status':
          case 'sort_by':
          case 'season':
            newFilters[key] = value as string;
            break;
          case 'start_year':
          case 'end_year':
          case 'year':
            newFilters[key] = value as number;
            break;
          case 'has_translation':
          case 'filter_by_score':
          case 'filter_by_date':
          case 'filter_by_name':
            newFilters[key] = value as boolean;
            break;
          default:
            break;
        }
      }
    }

    setLocalFilters(newFilters);
    setFilters(newFilters);
  };

  // Статусы аниме
  const statuses = [
    { id: 'anons', name: 'Анонс' },
    { id: 'ongoing', name: 'Онгоинг' },
    { id: 'released', name: 'Завершено' },
  ];

  // Типы аниме
  const kinds = [
    { id: 'ona', name: 'ONA' },
    { id: 'movie', name: 'Фильм' },
    { id: 'ova', name: 'OVA' },
    { id: 'pv', name: 'PV' },
    { id: 'cm', name: 'CM' },
    { id: 'tv', name: 'TV Сериал' },
    { id: 'tv_special', name: 'TV Спешл' },
    { id: 'special', name: 'Спешл' },
  ];

  // Возрастной рейтинг
  const ratings = [
    { id: 'g', name: 'G' },
    { id: 'none', name: 'Нет' },
    { id: 'pg', name: 'PG' },
    { id: 'r_plus', name: 'R+' },
    { id: 'r', name: 'R' },
    { id: 'pg_13', name: 'PG-13' },
  ];

  // Сортировка
  const sortOptions = [
    { id: 'score', name: 'Рейтингу', filter: 'filter_by_score' },
    { id: 'aired_on', name: 'Дате выхода', filter: 'filter_by_date' },
    { id: 'russian', name: 'Названию', filter: 'filter_by_name' },
  ];

  // Иконки для разделов
  const sortIcon = <ChevronDown className="w-4 h-4 text-white/60" />;

  const statusIcon = <Check className="w-4 h-4 text-white/60" />;

  const genreIcon = <User className="w-4 h-4 text-white/60" />;

  const ratingIcon = <Info className="w-4 h-4 text-white/60" />;

  const kindIcon = <FileType className="w-4 h-4 text-white/60" />;

  const yearIcon = <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white/60" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H5V10h14zm0-11H5V5h14z"/><path fill="currentColor" d="M7 12h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/></svg>;

  // Обработчик сортировки
  const handleSortOptionClick = (option: (typeof sortOptions)[0]) => {
    const newFilters = { ...localFilters } as AnimeFiltersType & {
      filter_by_score?: boolean;
      filter_by_date?: boolean;
      filter_by_name?: boolean;
    };

    // Reset all filter flags
    newFilters.filter_by_score = false;
    newFilters.filter_by_date = false;
    newFilters.filter_by_name = false;

    if (newFilters.sort_by === option.id) {
      delete newFilters.sort_by;
    } else {
      newFilters.sort_by = option.id;

      if (option.filter) {
        // Safely set the filter flag
        if (
          option.filter === 'filter_by_score' ||
          option.filter === 'filter_by_date' ||
          option.filter === 'filter_by_name'
        ) {
          newFilters[option.filter] = true;
        }
      }
    }

    setLocalFilters(newFilters);
    setFilters(newFilters);
  };

  const getSortIcon = (optionId: string) => {
    if (localFilters.sort_by !== optionId) return null;

    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className='ml-1 w-3 h-3'
      >
        <path d='m18 15-6-6-6 6' />
      </svg>
    );
  };

  // Получаем список жанров из API
  const { data: genresData } = useQuery({
    queryKey: ['genres'],
    queryFn: async () => {
      return await animeService.getGenres();
    },
    staleTime: 1000 * 60 * 60, // 1 час
  });

  // Форматируем жанры для компонента MultiSelect
  const genreOptions = genresData
    ? genresData.map((genre: { genre_id: string; name: string; russian: string; id: string }) => ({
        label: genre.russian || genre.name,
        value: String(genre.genre_id), // Преобразуем в строку
      }))
    : [];

  return (
    <div className='flex flex-col'>
      <div className='flex-1 overflow-y-auto scrollbar-hide'>
        <div className='mt-4 flex flex-col md:mt-0'>
          <FilterSection
            title='Сортировка по'
            icon={sortIcon}
            hasActiveFilters={!!localFilters.sort_by}
            defaultOpen={true}
          >
            <div className='flex flex-wrap gap-2'>
              {sortOptions.map((option) => (
                <FilterButton
                  key={option.id}
                  isActive={localFilters.sort_by === option.id}
                  onClick={() => handleSortOptionClick(option)}
                >
                  <div className='flex items-center'>
                    {option.name}
                    {getSortIcon(option.id)}
                  </div>
                </FilterButton>
              ))}
            </div>
          </FilterSection>

          <FilterSection
            title='Статус'
            defaultOpen={true}
            icon={statusIcon}
            hasActiveFilters={!!localFilters.status}
          >
            <div className='flex flex-wrap gap-2'>
              {statuses.map((status) => (
                <FilterButton
                  key={status.id}
                  isActive={localFilters.status === status.id}
                  onClick={() => handleFilterChange('status', status.id)}
                >
                  {status.name}
                </FilterButton>
              ))}
            </div>
          </FilterSection>

          <FilterSection
            title='Жанры'
            defaultOpen={true}
            icon={genreIcon}
            hasActiveFilters={localFilters.genre_ids && localFilters.genre_ids.length > 0}
          >
            <MultiSelect
              options={genreOptions}
              onValueChange={(values) => {
                // Фильтруем пустые значения и преобразуем все значения в строки
                const filteredValues = values
                  .map((value) => (value !== null && value !== undefined ? String(value) : ''))
                  .filter((value) => value !== '');

                // Если после фильтрации нет жанров, устанавливаем undefined вместо пустого массива
                const genreValues = filteredValues.length > 0 ? filteredValues : undefined;
                handleFilterChange('genre_ids', genreValues);
              }}
              defaultValue={
                localFilters.genre_ids ? localFilters.genre_ids.map((id) => String(id)) : []
              }
              placeholder='Выберите жанр/жанры...'
              className='bg-white/5 text-white/80 hover:bg-white/10 h-[50px] rounded-xl border-none'
              variant='default'
            />
          </FilterSection>

          <FilterSection
            title='Возрастной рейтинг'
            icon={ratingIcon}
            hasActiveFilters={!!localFilters.rating}
          >
            <div className='flex flex-wrap gap-2'>
              {ratings.map((rating) => (
                <FilterButton
                  key={rating.id}
                  isActive={localFilters.rating === rating.id}
                  onClick={() => handleFilterChange('rating', rating.id)}
                >
                  {rating.name}
                </FilterButton>
              ))}
            </div>
          </FilterSection>

          <FilterSection title='Тип' icon={kindIcon} hasActiveFilters={!!localFilters.kind}>
            <div className='flex flex-wrap gap-2'>
              {kinds.map((kind) => (
                <FilterButton
                  key={kind.id}
                  isActive={localFilters.kind === kind.id}
                  onClick={() => handleFilterChange('kind', kind.id)}
                >
                  {kind.name}
                </FilterButton>
              ))}
            </div>
          </FilterSection>

          <FilterSection
            title='Год'
            icon={yearIcon}
            hasActiveFilters={!!localFilters.start_year || !!localFilters.end_year}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <input
                  className="flex rounded-md border border-border bg-white/5 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-auto w-14 p-1 text-center focus-visible:ring-0 focus-visible:ring-offset-0 text-white/80"
                  maxLength={4}
                  value={yearRange[0]}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (!isNaN(value) && value >= MIN_YEAR && value <= yearRange[1]) {
                      const newRange: [number, number] = [value, yearRange[1]];
                      setYearRange(newRange);
                      handleFilterChange('start_year', value);
                    }
                  }}
                />
                <Slider
                  min={MIN_YEAR}
                  max={MAX_YEAR}
                  step={1}
                  value={yearRange}
                  onValueChange={(values: number[]) => {
                    if (values.length === 2) {
                      const newRange: [number, number] = [values[0], values[1]];
                      setYearRange(newRange);
                      handleFilterChange('start_year', newRange[0]);
                      handleFilterChange('end_year', newRange[1]);
                    }
                  }}
                  className="flex-1"
                />
                <input
                  className="flex rounded-md border border-border bg-white/5 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-auto w-14 p-1 text-center focus-visible:ring-0 focus-visible:ring-offset-0 text-white/80"
                  maxLength={4}
                  value={yearRange[1]}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (!isNaN(value) && value <= MAX_YEAR && value >= yearRange[0]) {
                      const newRange: [number, number] = [yearRange[0], value];
                      setYearRange(newRange);
                      handleFilterChange('end_year', value);
                    }
                  }}
                />
              </div>
            </div>
          </FilterSection>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          resetFilters();
        }}
        className='group relative mt-4 h-[60px] w-full overflow-hidden rounded-xl bg-[#FF5C5C]/5 p-4 text-sm font-medium text-[#FF5C5C] transition-all hover:bg-[#FF5C5C]/10'
      >
        <div className='relative z-10 flex items-center justify-center gap-2'>
          <FilterX className="h-4 w-4" />
          Сбросить фильтры
        </div>
        <div className='absolute inset-0 -z-10 bg-gradient-to-r from-[#FF5C5C]/0 via-[#FF5C5C]/5 to-[#FF5C5C]/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100'></div>
      </button>
    </div>
  );
}
