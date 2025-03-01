'use client';

import { useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Select } from '@/components/ui/select/Select';
import { SelectContent } from '../ui/select/SelectContent';
import { SelectItem } from '../ui/select/SelectItem';
import { SelectTrigger } from '../ui/select/SelectTrigger';
import { SelectValue } from '../ui/select/SelectValue';
import { useTranslations } from 'next-intl';

export function TypeFilter() {
  const t = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const typeOptions = [
    { value: 'tv', label: t('tvSeries') },
    { value: 'tv_special', label: t('tvSpecial') },
    { value: 'movie', label: t('movie') },
    { value: 'ova', label: t('ova') },
    { value: 'ona', label: t('ona') },
    { value: 'special', label: t('special') },
    { value: 'music', label: t('musicVideo') },
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

  const handleTypeChange = useCallback((value: string) => {
    const query = createQueryString('type', value);
    router.push(`${pathname}?${query}`, { scroll: false });
  }, [router, pathname, createQueryString]);

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-white/80">
        {t('type')}
      </h4>
      <Select onValueChange={handleTypeChange} defaultValue={searchParams.get('type') || ''}>
        <SelectTrigger 
          className="w-full h-10 bg-white/[0.02] border border-white/5 rounded-xl text-white/60 focus:ring-2 focus:ring-[#CCBAE4]/50"
          onClick={() => {}} 
        >
          <SelectValue placeholder={t('selectType')} />
        </SelectTrigger>
        <SelectContent 
            value={searchParams.get('sort') || 'score_desc'} 
            onValueChange={handleTypeChange} 
            className="bg-[#060606]/95 backdrop-blur-xl border border-white/5 rounded-xl"
            >
          <SelectItem 
            value=""  
            onSelect={handleTypeChange} 
            className="text-white/80 hover:bg-white/[0.04]"
            >
            {t('allTypes')}
          </SelectItem>
          {typeOptions.map((option) => (
            <SelectItem 
                key={option.value} 
                value={option.value}  
                onSelect={handleTypeChange} 
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