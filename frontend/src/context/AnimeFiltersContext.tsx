'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AnimeFilters } from '@/types/anime';

// Тип для контекста фильтров
type AnimeFiltersContextType = {
  filters: AnimeFilters;
  setFilters: (filters: AnimeFilters) => void;
  resetFilters: () => void;
};

// Создаем контекст с начальным значением
const AnimeFiltersContext = createContext<AnimeFiltersContextType | undefined>(undefined);

// Провайдер контекста
export function AnimeFiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<AnimeFilters>({});

  // Функция для сброса фильтров
  const resetFilters = () => {
    setFilters({});
  };

  return (
    <AnimeFiltersContext.Provider value={{ filters, setFilters, resetFilters }}>
      {children}
    </AnimeFiltersContext.Provider>
  );
}

// Хук для использования контекста фильтров
export function useAnimeFilters() {
  const context = useContext(AnimeFiltersContext);
  if (context === undefined) {
    throw new Error('useAnimeFilters must be used within an AnimeFiltersProvider');
  }
  return context;
}
