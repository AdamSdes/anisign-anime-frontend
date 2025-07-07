'use client';

import { useState, useEffect, useCallback, useRef, useMemo, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import animeService from '@/services/animeService';
import AnimeGrid from '@/components/anime/AnimeGrid';
import AnimeFiltersSidebar from '@/components/anime/AnimeFiltersSidebar';
import AnimeSearch from '@/components/anime/AnimeSearch';
import { useAnimeFilters } from '@/context/AnimeFiltersContext';

import Header from '@/features/header/Header';
import Report from '@/features/report/Report';
import Footer from '@/features/footer/Footer';

// Create a separate component that uses useSearchParams
function AnimePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Флаг для отслеживания, происходит ли обновление URL из-за изменения страницы
  const isPageChangeRef = useRef(false);
  // Дополнительный флаг для отслеживания, происходит ли обновление из-за изменения фильтров
  const isFilterChangeRef = useRef(false);
  // Флаг для отслеживания первого монтирования компонента
  const isFirstMount = useRef(true);
  const { filters, setFilters } = useAnimeFilters();

  // Получаем начальные значения из URL
  const initialPage = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
  const initialLimit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 30;
  const initialQuery = searchParams.get('query') || '';
  const initialFilters = useMemo(
    () => ({
      status: searchParams.get('status') || undefined,
      kind: searchParams.get('kind') || undefined,
      rating: searchParams.get('rating') || undefined,
      genre_ids: searchParams.getAll('genre_id').length
        ? searchParams.getAll('genre_id').map((id) => id)
        : undefined,
      start_year: searchParams.get('start_year')
        ? parseInt(searchParams.get('start_year')!)
        : undefined,
      end_year: searchParams.get('end_year') ? parseInt(searchParams.get('end_year')!) : undefined,
      sort_by: searchParams.get('sort_by') || undefined,
      filter_by_score: searchParams.get('filter_by_score') === 'true' ? true : undefined,
      filter_by_date: searchParams.get('filter_by_date') === 'true' ? true : undefined,
      filter_by_name: searchParams.get('filter_by_name') === 'true' ? true : undefined,
    }),
    [searchParams]
  );

  // Состояние компонента
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(initialLimit);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  // Инициализация фильтров из URL при первой загрузке
  useEffect(() => {
    if (isFirstMount.current) {
      console.log('[Init Effect] Initializing filters from URL');
      setFilters(initialFilters);
      isFirstMount.current = false;
    }
  }, [initialFilters, setFilters, limit]);

  // Обновляем URL при изменении фильтров или страницы
  useEffect(() => {
    console.log(
      '[URL Effect] Triggered with page:',
      page,
      'isPageChangeRef:',
      isPageChangeRef.current
    );

    // Создаем новый объект URLSearchParams
    const params = new URLSearchParams();

    // Добавляем параметры пагинации
    params.set('page', page.toString());
    params.set('limit', limit.toString());

    // Добавляем поисковый запрос, если он есть
    if (searchQuery) {
      params.set('query', searchQuery);
    }

    // Добавляем параметры сортировки
    if (filters.sort_by) {
      params.set('sort_by', filters.sort_by);
    }

    // Добавляем параметры фильтрации для сортировки
    if (filters.filter_by_score !== undefined) {
      params.set('filter_by_score', filters.filter_by_score.toString());
    }

    if (filters.filter_by_date !== undefined) {
      params.set('filter_by_date', filters.filter_by_date.toString());
    }

    if (filters.filter_by_name !== undefined) {
      params.set('filter_by_name', filters.filter_by_name.toString());
    }

    // Добавляем параметры фильтрации
    if (filters.status) {
      params.set('status', filters.status);
    }

    if (filters.kind) {
      params.set('kind', filters.kind);
    }

    if (filters.rating) {
      params.set('rating', filters.rating);
    }

    // Добавляем жанры как отдельные параметры
    if (filters.genre_ids && filters.genre_ids.length > 0) {
      // Фильтруем пустые или невалидные ID жанров
      const validGenreIds = filters.genre_ids.filter((id) => id && String(id).trim() !== '');

      // Добавляем только если есть валидные жанры
      if (validGenreIds.length > 0) {
        // Удаляем все существующие параметры genre_id
        params.delete('genre_id');
        // Добавляем каждый жанр как отдельный параметр genre_id
        validGenreIds.forEach((id) => {
          params.append('genre_id', String(id));
        });
      }
    }

    // Добавляем годы
    if (filters.start_year) {
      params.set('start_year', filters.start_year.toString());
    }

    if (filters.end_year) {
      params.set('end_year', filters.end_year.toString());
    }

    // Создаем новый URL
    const newUrl = `/anime?${params.toString()}`;

    // Проверяем, отличается ли новый URL от текущего
    const currentUrl = window.location.pathname + window.location.search;
    const decodedNewUrl = decodeURIComponent(newUrl);

    if (currentUrl !== decodedNewUrl) {
      console.log('[URL Effect] URL changed, updating from:', currentUrl, 'to:', decodedNewUrl);
      // Обновляем URL без перезагрузки страницы
      router.push(newUrl, { scroll: false });
    } else {
      console.log('[URL Effect] URL not changed, skipping update');
    }

    // Не сбрасываем флаг isPageChangeRef здесь, чтобы он сохранился для эффекта фильтров
  }, [page, filters, searchQuery, router, limit]);

  // Обработчик изменения страницы
  const handlePageChange = useCallback(
    (newPage: number) => {
      console.log('[handlePageChange] Changing page to:', newPage, 'current page:', page);
      // Устанавливаем флаг, что происходит изменение страницы
      isPageChangeRef.current = true;
      isFilterChangeRef.current = false; // Не изменяются фильтры
      console.log('[handlePageChange] Set isPageChangeRef to:', isPageChangeRef.current);
      setPage(newPage);
      // Прокручиваем страницу вверх при смене страницы
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [page]
  );

  // Обработчик изменения фильтров
  useEffect(() => {
    console.log(
      '[Filters Effect] Triggered, isPageChangeRef:',
      isPageChangeRef.current,
      'isFilterChangeRef:',
      isFilterChangeRef.current
    );

    // Если это изменение фильтров (не страницы), сбрасываем страницу на 1
    if (isFilterChangeRef.current && page !== 1) {
      console.log('[Filters Effect] Resetting page to 1');
      setPage(1);
    } else {
      console.log(
        '[Filters Effect] Not resetting page, isPageChangeRef:',
        isPageChangeRef.current,
        'page:',
        page
      );
    }

    // Сбрасываем флаги после использования
    isFilterChangeRef.current = false;
    isPageChangeRef.current = false;
  }, [filters, page]); // Убираем page из зависимостей

  // Обработчик поискового запроса
  const handleSearch = (query: string) => {
    console.log('[handleSearch] Search query:', query, 'isPageChangeRef:', isPageChangeRef.current);

    // Предотвращаем обработку пустого запроса при инициализации
    if (query === '' && searchQuery === '') {
      console.log('[handleSearch] Ignoring empty query on initialization');
      return;
    }

    // Устанавливаем запрос только если он пустой или имеет минимум 2 символа
    if (query === '' || query.length >= 2) {
      // Если запрос изменился, устанавлием флаг изменения фильтров
      if (query !== searchQuery) {
        isFilterChangeRef.current = true;
        isPageChangeRef.current = false;
      }

      setSearchQuery(query);
    }
  };

  // Запрос на получение данных с дебаунсом
  const { data, isLoading } = useQuery({
    queryKey: ['animeList', page, limit, searchQuery, filters],
    queryFn: async () => {
      console.log(
        '[Query] Fetching data with page:',
        page,
        'filters:',
        filters,
        'searchQuery:',
        searchQuery
      );

      // Если есть поисковый запрос, используем поиск
      if (searchQuery) {
        return await animeService.searchAnime(searchQuery, page, limit);
      }

      // Если есть фильтры, используем фильтрацию
      if (Object.values(filters).some((value) => value !== undefined)) {
        return await animeService.getFilteredAnimeList(page, limit, filters);
      }

      // Иначе получаем обычный список
      return await animeService.getAnimeList(page, limit);
    },
    staleTime: 1000 * 60 * 5, // 5 минут
    gcTime: 1000 * 60 * 10, // 10 минут
    retry: 2, // Повторить только 2 раза при ошибке
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Экспоненциальная задержка
  });

  return (
    <div className='min-h-screen flex flex-col'>
      <Suspense fallback={<div className='h-[100px] border-b border-white/5'></div>}>
        <Header />
      </Suspense>
      <Report />
      <main className='flex-grow container mx-auto px-4 py-8'>
        <div className='flex flex-col-reverse md:flex-row gap-8'>
          <div className='flex-grow'>
            <div className='mb-6'>
              <AnimeSearch initialQuery={searchQuery} onSearch={handleSearch} />
            </div>

            <AnimeGrid
              animeList={data?.anime_list || []}
              isLoading={isLoading}
              showPagination={!!(data?.total_count && !searchQuery && data.total_count > 0)}
              currentPage={page}
              totalPages={data?.total_count ? Math.ceil(data.total_count / limit) : 1}
              onPageChange={handlePageChange}
            />
          </div>

          <div className='md:w-64 lg:w-72 flex-shrink-0 md:ml-auto'>
            <AnimeFiltersSidebar />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Main component that uses Suspense
export default function AnimePage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex flex-col bg-[#060606]'>
          <div className='h-[100px] border-b border-white/5'></div>
          <div className='flex-grow container mx-auto px-4 py-8'>
            <div className='animate-pulse'>
              <div className='h-8 bg-white/5 rounded w-1/4 mb-6'></div>
              <div className='h-10 bg-white/5 rounded mb-8'></div>
              <div className='flex flex-col md:flex-row gap-8'>
                <div className='md:w-64 lg:w-72 flex-shrink-0'>
                  <div className='h-[500px] bg-white/5 rounded'></div>
                </div>
                <div className='flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                  {Array(12)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className='bg-white/5 rounded-lg'
                        style={{ paddingBottom: '142.857%' }}
                      ></div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <AnimePageContent />
    </Suspense>
  );
}
