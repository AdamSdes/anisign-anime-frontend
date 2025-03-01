'use client';

import { useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Select } from '@/components/ui/select/Select';
import { SelectContent } from '../ui/select/SelectContent';
import { SelectItem } from '../ui/select/SelectItem';
import { SelectTrigger } from '../ui/select/SelectTrigger';
import { SelectValue } from '../ui/select/SelectValue';
import { useTranslations } from 'next-intl';

export function SortFilter() {
    const t = useTranslations('common');
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
  
    const sortOptions = [
      { value: 'score_desc', label: t('sortByRatingDesc') },
      { value: 'score_asc', label: t('sortByRatingAsc') },
      { value: 'aired_on_desc', label: t('sortByYearDesc') },
      { value: 'aired_on_asc', label: t('sortByYearAsc') },
    ];
  
    const createQueryString = useCallback((name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.set('page', '1');
      return params.toString();
    }, [searchParams]);
  
    const handleSortChange = useCallback((value: string) => {
      const query = createQueryString('sort', value);
      router.push(`${pathname}?${query}`, { scroll: false });
    }, [router, pathname, createQueryString]);
  
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-white/80">
          {t('sort')}
        </h4>
        <Select onValueChange={handleSortChange} defaultValue={searchParams.get('sort') || 'score_desc'}>
          <SelectTrigger 
            className="w-full h-10 bg-white/[0.02] border border-white/5 rounded-xl text-white/60 focus:ring-2 focus:ring-[#CCBAE4]/50"
            onClick={() => {}} 
          >
            <SelectValue placeholder={t('selectSort')} />
          </SelectTrigger>
          <SelectContent 
            value={searchParams.get('sort') || 'score_desc'} 
            onValueChange={handleSortChange}
            className="bg-[#060606]/95 backdrop-blur-xl border border-white/5 rounded-xl"
          >
            {sortOptions.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value} 
                onSelect={handleSortChange} 
                className="text-white/80 hover:bg-white/[0.04]"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }