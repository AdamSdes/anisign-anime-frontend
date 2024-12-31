'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import AnimeCard from './AnimeCard';

const fadeIn = {
    hidden: { 
        opacity: 0,
        y: 20
    },
    show: { 
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
};

const AnimeCardSkeleton = ({ index }) => (
    <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="show"
        className="relative group"
    >
        <div className="animate-pulse">
            <div className="relative">
                <div className="w-full aspect-[3/4] rounded-[14px] bg-white/5" />
            </div>
            <div className="mt-3 space-y-2">
                <div className="h-4 bg-white/5 rounded w-3/4" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
            </div>
        </div>
    </motion.div>
);

const AnimeList = () => {
    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredId, setHoveredId] = useState(null);
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;
    const limit = 20;

    useEffect(() => {
        const fetchAnime = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8000/anime/get-anime-list?page=${currentPage}&limit=${limit}`);
                const data = await response.json();
                setAnimeList(data);
            } catch (error) {
                console.error('Error fetching anime:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnime();
    }, [currentPage]);

    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {[...Array(limit)].map((_, index) => (
                    <AnimeCardSkeleton key={index} index={index} />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                <AnimatePresence>
                    {animeList.map((anime) => (
                        <motion.div 
                            key={anime.id}
                            variants={fadeIn}
                            initial="hidden"
                            animate={{
                                opacity: hoveredId === null || hoveredId === anime.id ? 1 : 0.3,
                                y: 0,
                                transition: { duration: 0.3 }
                            }}
                            onHoverStart={() => setHoveredId(anime.id)}
                            onHoverEnd={() => setHoveredId(null)}
                        >
                            <AnimeCard anime={anime} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AnimeList;
