'use client';

import { useState, useEffect } from 'react';
import { AnimeFilters as AnimeFiltersType } from '@/types/anime';

interface AnimeFiltersProps {
  filters: AnimeFiltersType;
  onFilterChange: (filters: AnimeFiltersType) => void;
  onReset: () => void;
}

export default function AnimeFilters({ filters, onFilterChange, onReset }: AnimeFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<AnimeFiltersType>(filters);

  // Обновляем локальные фильтры при изменении внешних фильтров
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Обработчик изменения фильтров
  const handleFilterChange = (key: keyof AnimeFiltersType, value: string | boolean | string[] | number | undefined) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Применение фильтров
  const applyFilters = () => {
    onFilterChange(localFilters);
    setIsOpen(false);
  };

  // Сброс фильтров
  const handleReset = () => {
    setLocalFilters({});
    onReset();
    setIsOpen(false);
  };

  // Предопределенные типы аниме
  const predefinedKinds = [
    { id: 'tv', name: 'TV Сериал' },
    { id: 'movie', name: 'Фильм' },
    { id: 'ova', name: 'OVA' },
    { id: 'ona', name: 'ONA' },
    { id: 'special', name: 'Спешл' }
  ];

  // Предопределенные статусы аниме
  const predefinedStatuses = [
    { id: 'ongoing', name: 'Онгоинг' },
    { id: 'released', name: 'Вышло' },
    { id: 'anons', name: 'Анонс' }
  ];

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
        <h2 className="text-white text-xl font-medium">Список аниме</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-[#1e1e1e] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors"
        >
          Фильтры {Object.keys(filters).length > 0 && `(${Object.keys(filters).length})`}
        </button>
      </div>

      {isOpen && (
        <div className="bg-[#121212] rounded-xl p-4 mb-6 border border-[#2a2a2a]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Фильтр по типу */}
            <div>
              <h3 className="text-white font-medium mb-2">Тип</h3>
              <div className="flex flex-wrap gap-2">
                {predefinedKinds.map((kind) => (
                  <button
                    key={kind.id}
                    onClick={() => handleFilterChange('kind', localFilters.kind === kind.id ? undefined : kind.id)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      localFilters.kind === kind.id
                        ? 'bg-white text-black'
                        : 'bg-[#1e1e1e] text-white hover:bg-[#2a2a2a]'
                    }`}
                  >
                    {kind.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Фильтр по статусу */}
            <div>
              <h3 className="text-white font-medium mb-2">Статус</h3>
              <div className="flex flex-wrap gap-2">
                {predefinedStatuses.map((status) => (
                  <button
                    key={status.id}
                    onClick={() => handleFilterChange('status', localFilters.status === status.id ? undefined : status.id)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      localFilters.status === status.id
                        ? 'bg-white text-black'
                        : 'bg-[#1e1e1e] text-white hover:bg-[#2a2a2a]'
                    }`}
                  >
                    {status.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Сортировка */}
            <div>
              <h3 className="text-white font-medium mb-2">Сортировка</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleFilterChange('sort_by', 'score')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    localFilters.sort_by === 'score'
                      ? 'bg-white text-black'
                      : 'bg-[#1e1e1e] text-white hover:bg-[#2a2a2a]'
                  }`}
                >
                  По рейтингу
                </button>
                <button
                  onClick={() => handleFilterChange('sort_by', 'aired_on')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    localFilters.sort_by === 'aired_on'
                      ? 'bg-white text-black'
                      : 'bg-[#1e1e1e] text-white hover:bg-[#2a2a2a]'
                  }`}
                >
                  По дате
                </button>
                <button
                  onClick={() => handleFilterChange('sort_by', 'name')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    localFilters.sort_by === 'name'
                      ? 'bg-white text-black'
                      : 'bg-[#1e1e1e] text-white hover:bg-[#2a2a2a]'
                  }`}
                >
                  По названию
                </button>
              </div>
            </div>
          </div>

          {/* Кнопки применения и сброса фильтров */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-transparent text-white border border-[#2a2a2a] rounded-lg hover:bg-[#1e1e1e] transition-colors"
            >
              Сбросить
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
            >
              Применить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
