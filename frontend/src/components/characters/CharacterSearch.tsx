'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

interface CharacterSearchProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
  isSearching?: boolean;
}

export default function CharacterSearch({ onSearch, initialQuery = '', isSearching = false }: CharacterSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const hasInitialized = useRef(false);

  // Инициализируем только один раз
  if (!hasInitialized.current && initialQuery && initialQuery !== query) {
    setQuery(initialQuery);
    hasInitialized.current = true;
  }

  // Дебаунсированный поиск
  const debouncedSearch = useCallback((searchQuery: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      onSearch(searchQuery);
    }, 600);
  }, [onSearch]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      
      // Автоматический поиск с дебаунсом
      debouncedSearch(value.trim());
    },
    [debouncedSearch]
  );

  const handleClear = useCallback(() => {
    setQuery('');
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    onSearch('');
  }, [onSearch]);

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <div className='relative'>
      <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5' />
      <input
        type='text'
        value={query}
        onChange={handleInputChange}
        placeholder='Поиск персонажей...'
        className='w-full h-12 pl-12 pr-12 bg-white/[0.02] border border-white/10 rounded-xl text-white/90 placeholder:text-white/40 focus:outline-none focus:border-[#CCBAE4]/50 focus:ring-1 focus:ring-[#CCBAE4]/20 transition-all'
        autoComplete="off"
        spellCheck="false"
      />
      <div className='absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2'>
        {isSearching && (
          <Loader2 className='w-4 h-4 text-[#CCBAE4] animate-spin' />
        )}
        {query && !isSearching && (
          <button
            type='button'
            onClick={handleClear}
            className='text-white/40 hover:text-white/60 transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        )}
      </div>
    </div>
  );
}
