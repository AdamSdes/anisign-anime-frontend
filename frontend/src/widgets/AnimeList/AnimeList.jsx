import { useState, useEffect } from 'react';
import AnimeCard from './AnimeCard';
import { Pagination } from "@nextui-org/react";

const AnimeList = () => {
    const [animeList, setAnimeList] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const limit = 5;

    useEffect(() => {
        const fetchAnime = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:8000/anime/get-anime-list?page=${page}&limit=${limit}`);
                const data = await response.json();
                setAnimeList(data);
            } catch (error) {
                console.error('Error fetching anime:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnime();
    }, [page]);

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {[...Array(limit)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                        <div className="bg-default-100 rounded-[14px]" style={{ aspectRatio: '3 / 4' }}></div>
                        <div className="mt-2 space-y-2">
                            <div className="h-4 bg-default-100 rounded w-3/4"></div>
                            <div className="h-3 bg-default-100 rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {animeList.map((anime) => (
                    <AnimeCard key={anime.id} anime={anime} />
                ))}
            </div>
            <div className="flex justify-center">
                <Pagination
                    total={10}
                    page={page}
                    onChange={setPage}
                />
            </div>
        </div>
    );
};

export default AnimeList;
