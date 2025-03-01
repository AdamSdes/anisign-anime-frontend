'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Anime, AnimeListResponse } from '@/shared/types/anime';
import { Genre } from '@/shared/types/anime';
import { AnimeCard } from '@/components/ui/anime-card/AnimeCard';
import { Pagination } from '@/components/ui/pagination/Pagination';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

interface AnimeListProps {
    animeList: Anime[];
    genres: Genre[];
    pagination: {
        page: number;
        pages: number;
    };
    className?: string;
}
export function AnimeList({ animeList, genres, pagination, className }: AnimeListProps) {
    const t = useTranslations('common');
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [currentPage, setCurrentPage] = useState(pagination.page);
    
    const createQueryString = useCallback((name: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set(name, value);
        return params.toString();
    }, [searchParams]);
    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        const query = createQueryString('page', page.toString());
        router.push(`${pathname}?${query}`, { scroll: false });
    }, [router, pathname, createQueryString]);
    useEffect(() => {
        setCurrentPage(pagination.page);
    }, [pagination.page]);

    if (!animeList.length) {
        return (
            <motion.div
                className={className || 'flex flex-col items-center justify-center py-16 px-4'}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 120, damping: 15 }}
            >
                <h3 className="text-lg font-medium text-white/80 mb-2">
                    {t('noAnimeFound')}
                </h3>
                <p className="text-sm text-white/40 text-center max-w-md">
                    {t('tryDifferentFilters')}
                </p>
            </motion.div>
        );
    }
    return (
        <motion.div
            className={className || 'space-y-8'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
                {animeList.map((anime) => (
                    <AnimeCard key={anime.anime_id} anime={anime} genres={genres} priority={animeList.indexOf(anime) === 0} />
                ))}
            </div>
            {pagination && pagination.pages > 1 && (
                <motion.div
                    className="sticky bottom-2 z-10 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="w-fit rounded-xl border border-white/10 bg-[#060606]/95 backdrop-blur-sm p-2 shadow-lg">
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={pagination.pages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}