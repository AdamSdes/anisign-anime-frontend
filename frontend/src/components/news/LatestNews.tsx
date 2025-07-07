'use client';

import { useState, useEffect } from 'react';
import { newsService, NewsItem } from '@/services/newsService';
import NewsCard from '@/features/news/NewsCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const LatestNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка последних новостей
  const loadLatestNews = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await newsService.getNews(1);
      // Берем только первые 3 новости
      setNews(response.news.slice(0, 3));
    } catch (error) {
      console.error('Ошибка при загрузке новостей:', error);
      setError('Не удалось загрузить новости');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLatestNews();
  }, []);

  return (
    <section className='py-12'>
      <div className='container mx-auto px-4'>
        {/* Заголовок секции */}
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h2 className='text-2xl font-bold text-white mb-2'>Последние новости</h2>
          </div>

          <Link
            className='text-sm text-white/60 hover:text-white/80 transition-colors'
            href='/news'
          >
            Все новости
          </Link>
        </div>

        {/* Сетка новостей */}
        {isLoading ? (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {Array.from({ length: 3 }).map((_, index) => (
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
        ) : error ? (
          <div className='bg-white/[0.02] border border-red-500/20 rounded-xl p-8 text-center'>
            <p className='text-red-400 mb-4'>{error}</p>
            <Button
              onClick={loadLatestNews}
              variant='outline'
              className='border-red-500/20 hover:bg-red-500/10'
            >
              Повторить попытку
            </Button>
          </div>
        ) : news.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {news.map((item, index) => (
              <NewsCard key={index} news={item} />
            ))}
          </div>
        ) : (
          <div className='bg-white/[0.02] border border-white/5 rounded-xl p-8 text-center'>
            <p className='text-white/60'>Новости пока не загружены</p>
          </div>
        )}

        {/* Кнопка "Все новости" внизу на мобильных */}
        {!isLoading && news.length > 0 && (
          <div className='mt-8 text-center md:hidden'>
            <Link href='/news'>
              <Button
                className='bg-white/10 hover:bg-white/20 text-white border-white/20'
                variant='outline'
              >
                Посмотреть все новости
                <ArrowRight className='w-4 h-4 ml-2' />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestNews;
