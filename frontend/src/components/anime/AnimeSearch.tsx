'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search } from 'lucide-react';
import useDebounce from '@/hooks/useDebounceHook';

interface AnimeSearchProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export default function AnimeSearch({ onSearch, initialQuery = '' }: AnimeSearchProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(searchQuery, 500);
  // Создаем ref для отслеживания первого рендера за пределами useEffect
  const isFirstRender = useRef(true);

  // Обработчик изменения поискового запроса
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  // Отправка запроса после задержки ввода и только если длина запроса >= 2 символов
  useEffect(() => {
    // Пропускаем первый рендер, чтобы избежать лишнего вызова onSearch при инициализации
    if (isFirstRender.current) {
      isFirstRender.current = false;

      // Если есть начальный запрос, вызываем onSearch только для него
      if (initialQuery && initialQuery.length >= 2) {
        onSearch(initialQuery);
      }
      return;
    }

    // Если запрос пустой, отправляем пустую строку для сброса поиска
    if (debouncedQuery === '') {
      onSearch('');
      return;
    }

    // Отправляем запрос только если длина >= 2 символов
    if (debouncedQuery.length >= 2) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch, initialQuery]);

  return (
    <div className='relative w-full mb-6'>
      <div className='relative'>
        <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
          <Search className='h-4 w-4 text-muted-foreground' />
        </div>
        <input
          type='text'
          className='w-full py-3 pl-10 pr-24 bg-background/60 border border-white/5 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 transition-all'
          placeholder='Поиск аниме...'
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {searchQuery.length === 1 && (
          <div className='absolute inset-y-0 right-0 flex items-center pr-3'>
            <span className='text-xs bg-white text-black px-2 py-1 rounded-full'>
              Мин. 2 символа
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
