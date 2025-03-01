'use client';

import { useState, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox/Checkbox';
import { SortFilter } from './SortFilter';
import { StatusFilter } from './StatusFilter';
import { TypeFilter } from './TypeFilter';
import { useTranslations } from 'next-intl';
import { Genre } from '@/shared/types/anime';

interface FilterBlockProps {
  genres: Genre[];
  className?: string;
}

export function FilterBlock({ genres, className }: FilterBlockProps) {
  const t = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const createQueryString = useCallback((name: string, value: string | string[]) => {
    const params = new URLSearchParams(searchParams);
    if (Array.isArray(value) && value.length > 0) {
      params.set(name, value.join(','));
    } else if (typeof value === 'string' && value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    params.set('page', '1');
    return params.toString();
  }, [searchParams]);

  const handleGenreChange = useCallback((genreId: string, checked: boolean) => {
    setSelectedGenres((prev) => {
      const newGenres = checked
        ? [...prev, genreId]
        : prev.filter((id) => id !== genreId);
      const query = createQueryString('genres', newGenres);
      router.push(`${pathname}?${query}`, { scroll: false });
      return newGenres;
    });
  }, [router, pathname, createQueryString]);

  return (
    <div className={className || 'space-y-6 p-4 bg-[#060606]/95 backdrop-blur-xl rounded-xl border border-white/5'}>
      <h3 className="text-lg font-medium text-white/90">
        {t('filters')}
      </h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white/80">
            {t('genres')}
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {genres.map((genre) => (
              <label key={genre.genre_id} className="flex items-center gap-2">
                <Checkbox
                  id={`genre-${genre.genre_id}`}
                  checked={selectedGenres.includes(genre.genre_id)}
                  onCheckedChange={(checked) => handleGenreChange(genre.genre_id, checked as boolean)}
                  aria-label={genre.russian || genre.name}
                />
                <span className="text-sm text-white/60">
                  {genre.russian || genre.name}
                </span>
              </label>
            ))}
          </div>
        </div>
        <SortFilter />
        <StatusFilter />
        <TypeFilter />
      </div>
    </div>
  );
}