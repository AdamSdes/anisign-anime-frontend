'use client'

import React, { useEffect, useState } from 'react'
import AnimeCard from './AnimeCard'
import AnimeCardSkeleton from './AnimeCardSkeleton'
import { useAnimeList } from '@/hooks/useAnimeList'
import Pagination from './Pagination'
import Search from './Search'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Genre } from '@/types/anime'
import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
}

const item = {
  hidden: { 
    opacity: 0,
    y: 20,
  },
  show: { 
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
}

const AnimeList = () => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { animeList, pagination, isLoading, error } = useAnimeList()
    const [genres, setGenres] = useState<Genre[]>([])
    const [isGenresLoading, setIsGenresLoading] = useState(true)

    useEffect(() => {
        const fetchGenres = async () => {
            setIsGenresLoading(true)
            try {
                const response = await fetch('http://localhost:8000/genre/get-list-genres')
                if (!response.ok) {
                    throw new Error('Failed to fetch genres')
                }
                const data = await response.json()
                setGenres(data)
            } catch (error) {
                console.error('Error fetching genres:', error)
            } finally {
                setIsGenresLoading(false)
            }
        }

        fetchGenres()
    }, [])

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', page.toString())
        router.replace(`${pathname}?${params.toString()}`)
    }

    if (isLoading || isGenresLoading) {
        return (
            <motion.div 
                className="space-y-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Search />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {Array(15).fill(0).map((_, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 0.3,
                                delay: index * 0.05,
                                ease: 'easeOut'
                            }}
                        >
                            <AnimeCardSkeleton />
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        )
    }

    if (error) {
        return (
            <motion.div 
                className="text-center text-red-500"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Произошла ошибка при загрузке аниме
            </motion.div>
        )
    }

    return (
        <motion.div 
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Search />
            
            {!animeList?.length ? (
                <motion.div
                    className="flex flex-col items-center justify-center py-16 px-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 15
                    }}
                >
                    <div className="w-16 h-16 mb-6 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" className="text-white/40">
                            <path fill="currentColor" d="M20.84 2.18L16.91 2.96L19.65 6.5L21.62 6.1L20.84 2.18M13.97 3.54L12 3.93L14.75 7.46L16.71 7.07L13.97 3.54M9.07 4.5L7.1 4.89L9.85 8.43L11.81 8.03L9.07 4.5M4.16 5.5L3.18 5.69A2 2 0 0 0 1.61 8.04L2 9.16L4.86 9.64L4.16 5.5M2 18.54L2.39 19.66A2 2 0 0 0 4.74 21.23L6 20.85L5.46 19.42L5.46 14.29L2.47 14.29L2 18.54M22 13.54L22 11.54C22 10.54 21.22 9.75 20.22 9.75L7.22 9.75C6.22 9.75 5.44 10.54 5.44 11.54L5.44 13.54C5.44 14.54 6.22 15.32 7.22 15.32L20.22 15.32C21.22 15.32 22 14.54 22 13.54Z"/>
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-white/80 mb-2">Список аниме пуст</h3>
                    <p className="text-sm text-white/40 text-center max-w-md">
                        По вашему запросу ничего не найдено. Попробуйте изменить параметры фильтрации или поиска
                    </p>
                </motion.div>
            ) : (
                <motion.div 
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
                    variants={container}
                    initial="hidden"
                    animate="show"
                >
                    {animeList?.map((anime, index) => (
                        <motion.div
                            key={anime.anime_id}
                            variants={item}
                            layout
                            whileHover={{ 
                                scale: 1.02,
                                transition: { duration: 0.2 }
                            }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <AnimeCard
                                anime={anime}
                                genres={genres}
                                priority={index < 4}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {pagination && pagination.pages > 1 && (
                <motion.div 
                    className="sticky bottom-2 z-10 flex items-center justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="w-fit rounded-xl border border-white/10 bg-[#060606]/95 backdrop-blur-sm p-2 shadow-lg">
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.pages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </motion.div>
            )}
        </motion.div>
    )
}

export default AnimeList
