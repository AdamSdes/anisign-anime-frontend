'use client';

import { useState, useEffect, useCallback } from 'react';
import NewsCard from '@/features/news/NewsCard';
import { Skeleton } from '@/components/ui/skeleton';
import { newsService, NewsItem } from '@/services/newsService';
import { Button } from '@/components/ui/button';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { Loader2 } from 'lucide-react';

const NewsGrid = () => {
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка первой страницы новостей
  const loadInitialNews = async () => {
    setIsInitialLoading(true);
    setError(null);

    try {
      const response = await newsService.getNews(1);
      setAllNews(response.news);
      setCurrentPage(1);
      setHasNextPage(response.has_next_page);
    } catch (error) {
      console.error('Ошибка при загрузке новостей:', error);
      setError('Не удалось загрузить новости. Попробуйте позже.');
    } finally {
      setIsInitialLoading(false);
    }
  };

  // Загрузка следующей страницы
  const fetchNextPage = useCallback(async () => {
    if (isFetchingNextPage || !hasNextPage) return;

    setIsFetchingNextPage(true);

    try {
      const nextPage = currentPage + 1;
      const response = await newsService.getNews(nextPage);

      setAllNews((prev) => [...prev, ...response.news]);
      setCurrentPage(nextPage);
      setHasNextPage(response.has_next_page);
    } catch (error) {
      console.error('Ошибка при загрузке следующей страницы:', error);
    } finally {
      setIsFetchingNextPage(false);
    }
  }, [currentPage, hasNextPage, isFetchingNextPage]);

  // Хук для бесконечной прокрутки
  const { lastElementRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    threshold: 0.1,
    rootMargin: '200px',
  });

  useEffect(() => {
    loadInitialNews();
  }, []);

  if (isInitialLoading) {
    return (
      <div className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className='bg-white/[0.02] rounded-xl overflow-hidden border border-white/5'
            >
              <Skeleton className='w-full h-48' />
              <div className='p-4 space-y-2'>
                <Skeleton className='w-3/4 h-6' />
                <Skeleton className='w-full h-4' />
                <Skeleton className='w-full h-4' />
                <Skeleton className='w-1/2 h-4' />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-white/[0.02] border border-red-500/20 rounded-xl p-8 text-center'>
        <p className='text-red-400 mb-4'>{error}</p>
        <Button
          onClick={loadInitialNews}
          variant='outline'
          className='border-red-500/20 hover:bg-red-500/10'
        >
          Повторить попытку
        </Button>
      </div>
    );
  }

  if (allNews.length === 0) {
    return (
      <div className='bg-white/[0.02] border border-white/5 rounded-xl p-8 text-center'>
        <p className='text-white/60'>Новости пока не загружены</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Сетка новостей */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {allNews.map((item, index) => {
          // Добавляем ref к последнему элементу для триггера загрузки
          const isLastElement = index === allNews.length - 1;

          return (
            <div
              key={`news-${index}-${item.title.substring(0, 20)}`}
              ref={isLastElement ? lastElementRef : null}
            >
              <NewsCard news={item} />
            </div>
          );
        })}
      </div>

      {/* Индикатор загрузки следующей страницы */}
      {isFetchingNextPage && (
        <div className='flex justify-center items-center py-8'>
          <div className='flex items-center gap-3 text-white/60'>
            <Loader2 className='w-5 h-5 animate-spin' />
            <span className='text-sm'>Загружаем новые новости...</span>
          </div>
        </div>
      )}

      {/* Сообщение о том, что больше новостей нет */}
      {!hasNextPage && allNews.length > 0 && (
        <div className='flex justify-center items-center py-8'>
          <div className='bg-white/[0.02] border border-white/5 rounded-xl px-6 py-3'>
            <p className='text-white/60 text-sm text-center'>
              Вы просмотрели все доступные новости
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsGrid;
