'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, List } from 'lucide-react';
import AnimeCard from './AnimeCard';
import { Button } from "@/shared/shadcn-ui/button";
import SearchBar from './SearchBar';
import Pagination from './Pagination'; // Добавляем этот импорт
import Link from "next/link";

const transformValue = (key, value) => {
    const transformations = {
        kind: {
            tv: 'ТВ Сериал',
            tv_special: 'ТВ Спешл',
            movie: 'Фильм',
            ova: 'OVA',
            ona: 'ONA',
            special: 'Спешл',
            music: 'Клип'
        },
        status: {
            released: 'Вышел',
            ongoing: 'Онгоинг',
            announced: 'Анонсировано'
        },
        rating: {
            g: 'G',
            pg: 'PG',
            pg_13: 'PG-13',
            r: 'R-17',
            r_plus: 'R+',
            rx: 'Rx'
        },
        season: (value) => {
            const [season, year] = value.split('_');
            const seasons = {
                winter: 'Зима',
                spring: 'Весна',
                summer: 'Лето',
                fall: 'Осень'
            };
            return `${seasons[season]} ${year}`;
        }
    };

    if (key === 'season' && value) {
        return transformations.season(value);
    }

    if (key in transformations && value in transformations[key]) {
        return transformations[key][value];
    }
    return value;
};

const transformDescription = (description) => {
    if (!description) return '';
    
    // Разбиваем текст на части, сохраняя разметку персонажей
    const parts = description.split(/(\[character=\d+\][^\[]+\[\/character\])/g);
    
    return parts.map((part, index) => {
        const match = part.match(/\[character=(\d+)\]([^\[]+)\[\/character\]/);
        if (match) {
            const [_, id, name] = match;
            return (
                <Link
                    key={index}
                    href={`/character/${id}`}
                    className="text-[#CCBAE4] hover:underline"
                    onClick={(e) => e.stopPropagation()}
                >
                    {name}
                </Link>
            );
        }
        return part;
    });
};

const AnimeCardSkeleton = ({ index }) => (
    <div className="relative group animate-fadeIn">
        <div className="animate-pulse">
            <div className="relative">
                <div className="w-full aspect-[3/4] rounded-[14px] bg-white/5" />
            </div>
            <div className="mt-3 space-y-2">
                <div className="h-4 bg-white/5 rounded w-3/4" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
            </div>
        </div>
    </div>
);

// Добавляем функцию getGenreName как в AnimeDetails
const getGenreName = (genreId, genres) => {
    if (!genres) return '...';
    // Используем genre_id для сравнения
    const genre = genres.find(g => g.genre_id === String(genreId));
    return genre ? genre.russian || genre.name : '...';
};

// Модифицируем компонент AnimeListItem чтобы он принимал genres
const AnimeListItem = ({ anime, genres }) => (
    <Link href={`/anime/${anime.anime_id}`}>
        <div className="group flex gap-6 p-5 rounded-xl bg-white/[0.02] hover:bg-[#0A0A0A] border border-transparent
            hover:border-white/5 transition-all duration-300">
            <div className="relative w-[120px] flex-shrink-0">
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                    <img
                        src={anime.poster_url}
                        alt={anime.russian || anime.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0
                        group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                {anime.score && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full
                        bg-black/60 backdrop-blur-sm border border-white/10">
                        <svg width="12" height="12" viewBox="0 0 24 24" className="text-[#CCBAE4]">
                            <path fill="currentColor" d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z"/>
                        </svg>
                        <span className="text-xs font-medium text-white">{anime.score}</span>
                    </div>
                )}
            </div>
            <div className="flex-1 min-w-0 py-1">
                <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-[15px] font-medium leading-snug text-white/90 group-hover:text-white
                        transition-colors duration-200">
                        {anime.russian || anime.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-white/40">
                        <span>{new Date(anime.aired_on).getFullYear()}</span>
                        <span>•</span>
                        <span className="text-xs font-medium bg-white/5 px-2 py-0.5 rounded-full">
                            {transformValue('kind', anime.kind)}
                        </span>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                    {anime.genre_ids?.map((genreId) => (
                        <span
                            key={genreId}
                            className="px-2 py-1 border text-[12px] rounded-full border-white/5 text-white/60
                                     hover:text-white/80 hover:border-white/10 transition-colors duration-200"
                        >
                            {getGenreName(genreId, genres)}
                        </span>
                    ))}
                </div>

                {anime.description && (
                    <div className="text-[13px] leading-relaxed text-white/50 group-hover:text-white/60 
                        transition-colors duration-200 line-clamp-3">
                        {transformDescription(anime.description)}
                    </div>
                )}

                <div className="flex items-center gap-4 mt-4">
                    {anime.episodes && (
                        <div className="flex items-center gap-2 text-xs text-white/40">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M21 7V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V7C3 4 4.5 2 8 2H16C19.5 2 21 4 21 7Z"
                                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                    strokeLinejoin="round"/>
                                <path
                                    d="M16 2V9C16 9.27 15.89 9.52 15.71 9.71L11.3 14.3C11.13 14.47 10.89 14.57 10.64 14.57C10.39 14.57 10.15 14.47 9.98 14.3L8.71 13.03C8.54 12.86 8.44 12.62 8.44 12.37C8.44 12.12 8.54 11.88 8.71 11.71L13.12 7.12C13.31 6.93 13.56 6.83 13.83 6.83H21"
                                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                    strokeLinejoin="round"/>
                            </svg>
                            <span>{anime.episodes} эпизодов</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-white/40">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z"
                                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M15.71 15.18L12.61 13.33C12.07 13.01 11.63 12.24 11.63 11.61V7.51001"
                                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{anime.duration}</span>
                    </div>
                </div>
            </div>
        </div>
    </Link>
);

const AnimeList = () => {
    const [animeList, setAnimeList] = useState([]);
    const [genres, setGenres] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hoveredId, setHoveredId] = useState(null);
    const [viewMode, setViewMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('animeListViewMode') || 'grid';
        }
        return 'grid';
    });
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;
    const limit = 20;
    const [totalCount, setTotalCount] = useState(0);
    const [displayLimit, setDisplayLimit] = useState(limit); // Добавляем новый state

    // Обновляем handleSearch для работы с результатами поиска
    const handleSearch = (searchResults) => {
        if (searchResults === null) {
            // Если поиск пуст, загружаем обычный список аниме
            fetchAnimeList();
        } else {
            // Обрабатываем результаты поиска с учетом новой структуры
            setAnimeList(searchResults.anime_list || []);
            setTotalCount(searchResults.total_count || 0);
            setLoading(false);
        }
    };

    // Обновляем функцию загрузки списка аниме
    const fetchAnimeList = async () => {
        try {
            setLoading(true);
            const [animeResponse, genresResponse] = await Promise.all([
                fetch(`http://localhost:8000/anime/get-anime-list?page=${currentPage}&limit=${limit}`),
                fetch('http://localhost:8000/genre/get-list-genres')
            ]);
            const animeData = await animeResponse.json();
            const genresData = await genresResponse.json();
            
            // Теперь используем anime_list из ответа
            setAnimeList(animeData.anime_list || []);
            setTotalCount(animeData.total_count || 0);
            setGenres(genresData);
        } catch (error) {
            console.error('Error fetching data:', error);
            setAnimeList([]); // В случае ошибки устанавливаем пустой массив
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    // Функция для загрузки дополнительных аниме
    const loadMore = async () => {
        try {
            const response = await fetch(`http://localhost:8000/anime/get-anime-list?page=${currentPage}&limit=${displayLimit + 10}`);
            const data = await response.json();
            setAnimeList(data.anime_list || []);
            setDisplayLimit(prev => prev + 10);
        } catch (error) {
            console.error('Error loading more anime:', error);
        }
    };

    // Функция для скрытия дополнительных аниме
    const showLess = () => {
        setDisplayLimit(limit);
        setAnimeList(prev => prev.slice(0, limit));
    };

    useEffect(() => {
        fetchAnimeList();
    }, [currentPage]);

    // Добавляем функцию handleViewModeChange
    const handleViewModeChange = (mode) => {
        setViewMode(mode);
        if (typeof window !== 'undefined') {
            localStorage.setItem('animeListViewMode', mode);
        }
    };

    // Добавим компонент для пустого состояния
    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 mb-6 rounded-full bg-white/5 flex items-center justify-center">
                <svg className="w-10 h-10 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            <h3 className="text-xl font-medium text-white/80 mb-2">Аниме не найдено</h3>
            <p className="text-white/50 max-w-[400px]">
                Попробуйте изменить поисковый запрос или сбросить фильтры
            </p>
        </div>
    );

    if (loading) {
        return (
            <>
                <SearchBar 
                    setSearch={handleSearch}
                    viewMode={viewMode}
                    setViewMode={handleViewModeChange}
                />
                <div className={viewMode === 'grid' 
                    ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
                    : "flex flex-col gap-4"
                }>
                    {[...Array(limit)].map((_, index) => (
                        <AnimeCardSkeleton key={index} index={index} />
                    ))}
                </div>
            </>
        );
    }

    return (
        <div className="space-y-6">
            <SearchBar 
                setSearch={handleSearch}
                viewMode={viewMode}
                setViewMode={handleViewModeChange}
            />
            
            {(!animeList || animeList.length === 0) ? (
                <EmptyState />
            ) : (
                <>
                    <div className={`
                        transition-all duration-300
                        ${viewMode === 'grid' 
                            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
                            : "flex flex-col gap-4"
                        }
                    `}>
                        <AnimatePresence mode="popLayout">
                            {animeList.slice(0, displayLimit).map((anime) => (
                                <motion.div 
                                    key={anime.anime_id} // Изменяем key на anime_id
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    className="transition-opacity duration-300"
                                    style={{
                                        opacity: hoveredId === null || hoveredId === anime.id ? 1 : 0.3,
                                    }}
                                    onMouseEnter={() => setHoveredId(anime.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                >
                                    {viewMode === 'grid' ? (
                                        <AnimeCard anime={anime} genres={genres} />
                                    ) : (
                                        <AnimeListItem anime={anime} genres={genres} />
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <Pagination 
                        currentPage={currentPage}
                        totalCount={totalCount}
                        pageSize={limit}
                    />
                    <div className="mb-5"></div>
                </>
            )}
        </div>
    );
};

// Удаляем компонент ViewModeToggle, так как теперь он в SearchBar

export default AnimeList;
