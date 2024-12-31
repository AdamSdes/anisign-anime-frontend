'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import AnimeCard from './AnimeCard';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { 
        opacity: 0,
        y: 20
    },
    show: { 
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

const AnimeCardSkeleton = ({ index }) => (
    <motion.div
        variants={item}
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
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;
    const limit = 500;

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
            <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
            >
                {[...Array(limit)].map((_, index) => (
                    <AnimeCardSkeleton key={index} index={index} />
                ))}
            </motion.div>
        );
    }

    return (
        <div className="space-y-6">
            <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
            >
                {animeList.map((anime, index) => (
                    <motion.div key={anime.id} variants={item}>
                        <AnimeCard anime={anime} />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default AnimeList;
