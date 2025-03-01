'use client';

import { useState } from 'react';
import { FilterBlock } from './FilterBlock';
import { Genre } from '@/shared/types/anime';
import { useTranslations } from 'next-intl';

interface FilterSidebarProps {
    genres: Genre[];
}
const FilterSidebar = ({ genres }: FilterSidebarProps) => {
    const t = useTranslations('common');
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <FilterBlock genres={genres} className="w-full" />
        </div>
    )
}