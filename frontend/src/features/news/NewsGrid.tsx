'use client';

import { useState, useEffect } from 'react';
import NewsCard from '@/features/news/NewsCard';
import { Skeleton } from '@/components/ui/skeleton';

// Интерфейс для новостей
export interface NewsItem {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  date: string;
  category: string;
  source: string;
}

// Временные данные для новостей
const MOCK_NEWS: NewsItem[] = [
  {
    id: 1,
    title: 'Стартовал третий сезон «Магическая битва»',
    content:
      'Официально стартовал долгожданный третий сезон аниме «Магическая битва». Новые эпизоды будут выходить каждую неделю на Crunchyroll.',
    imageUrl:
      'https://cover.imglib.info/uploads/anime/23416/background/0a737da3-fee7-4708-a55b-601054fc7818.jpg',
    date: '2025-03-25',
    category: 'Анонсы',
    source: 'Crunchyroll',
  },
  {
    id: 2,
    title: 'Юта Окоцу получит отдельное аниме по манге «Магическая битва»',
    content:
      'Студия MAPPA анонсировала спин-офф аниме, посвященный Юте Окоцу из вселенной «Магическая битва», основанный на дополнительных главах манги.',
    imageUrl: 'https://i.imgur.com/UBx92t9.jpeg',
    date: '2025-03-23',
    category: 'Анонсы',
    source: 'MAPPA',
  },
  {
    id: 3,
    title: 'Объявлена дата выхода нового сезона «Атака титанов: Финальная часть»',
    content:
      'Студия MAPPA официально анонсировала дату выхода завершающей части аниме «Атака титанов». Зрители увидят финал легендарной истории уже осенью 2025 года.',
    imageUrl: 'https://i.imgur.com/HVPkWsh.jpeg',
    date: '2025-03-20',
    category: 'Даты выхода',
    source: 'MAPPA',
  },
  {
    id: 4,
    title: 'Вышел трейлер второго сезона «Человек-бензопила»',
    content:
      'Опубликован первый трейлер второго сезона аниме «Человек-бензопила». Продолжение истории Дэнджи будет показано летом 2025 года.',
    imageUrl: 'https://i.imgur.com/hGYsYaW.jpeg',
    date: '2025-03-18',
    category: 'Трейлеры',
    source: 'MAPPA',
  },
  {
    id: 5,
    title: 'Аниме «Голубой период» получит полнометражный фильм',
    content:
      'По манге «Голубой период» будет снят полнометражный фильм, который продолжит историю после событий аниме-сериала. Премьера запланирована на 2026 год.',
    imageUrl: 'https://i.imgur.com/2NF5u3q.jpeg',
    date: '2025-03-15',
    category: 'Анонсы',
    source: 'Seven Arcs',
  },
  {
    id: 6,
    title: 'Анонсирована аниме-адаптация манги «Сакамото наносит ответный удар»',
    content:
      'Манга «Сакамото наносит ответный удар» получит аниме-адаптацию. Производством займется студия Bridge, премьера запланирована на зиму 2026 года.',
    imageUrl: 'https://i.imgur.com/UBP8TBg.jpeg',
    date: '2025-03-12',
    category: 'Анонсы',
    source: 'Bridge',
  },
  {
    id: 7,
    title: 'Новый трейлер аниме «Тёмный дворецкий: Публичная школа»',
    content:
      'Вышел новый трейлер и постер продолжения аниме «Тёмный дворецкий», посвященного арке «Публичная школа». Премьера новых серий состоится летом 2025 года.',
    imageUrl: 'https://i.imgur.com/vSwn5GD.jpeg',
    date: '2025-03-10',
    category: 'Трейлеры',
    source: 'CloverWorks',
  },
  {
    id: 8,
    title: 'Хаяо Миядзаки работает над новым полнометражным фильмом',
    content:
      'Легендарный режиссер Хаяо Миядзаки, несмотря на объявление о завершении карьеры, начал работу над новым полнометражным анимационным фильмом для студии Ghibli.',
    imageUrl: 'https://i.imgur.com/iWYIXI4.jpeg',
    date: '2025-03-05',
    category: 'Индустрия',
    source: 'Studio Ghibli',
  },
];

const NewsGrid = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  // Эмуляция загрузки данных с сервера
  useEffect(() => {
    const loadNews = async () => {
      // В реальном проекте здесь был бы запрос к API
      // const response = await fetch('http://localhost:8000/news');
      // const data = await response.json();

      setTimeout(() => {
        setNews(MOCK_NEWS);
        setIsLoading(false);
      }, 1000);
    };

    loadNews();
  }, []);

  // Получаем уникальные категории для фильтра
  const categories = ['all', ...Array.from(new Set(MOCK_NEWS.map((item) => item.category)))];

  // Фильтруем новости по категории
  const filteredNews = filter === 'all' ? news : news.filter((item) => item.category === filter);

  return (
    <div className='space-y-6'>
      {/* Фильтры по категориям */}
      <div className='flex flex-wrap gap-2 mb-6'>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-4 py-2 text-sm rounded-lg transition-all ${
              filter === category
                ? 'bg-white text-[#060606] font-medium'
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            {category === 'all' ? 'Все новости' : category}
          </button>
        ))}
      </div>

      {/* Сетка новостей */}
      {isLoading ? (
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
      ) : (
        <>
          {filteredNews.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filteredNews.map((item) => (
                <NewsCard key={item.id} news={item} />
              ))}
            </div>
          ) : (
            <div className='bg-white/[0.02] border border-white/5 rounded-xl p-8 text-center'>
              <p className='text-white/60'>Новости в данной категории отсутствуют</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NewsGrid;
