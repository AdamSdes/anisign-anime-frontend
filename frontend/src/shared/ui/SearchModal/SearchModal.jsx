'use client'
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Search, Command, Star, Loader2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import Link from "next/link"


// Функция для обрезки текста
const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
};

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

// Add getGenreName helper function that uses genres prop
const getGenreName = (genreId, genres) => {
    if (!genres) return '...';
    const genre = genres.find(g => String(g.genre_id) === String(genreId));
    return genre ? genre.russian || genre.name : '...';
};

// Обновленный компонент карточки аниме
const AnimeCard = ({ anime, genres }) => (
    <Link href={`/anime/${anime.anime_id}`}>
        <div className="group flex items-start gap-4 p-2 rounded-xl transition-all duration-300 hover:bg-white/[0.03]">
            <div className="aspect-[3/4] w-[100px] flex-shrink-0">
                <img
                    src={anime.poster_url || anime.image}
                    alt={anime.title || anime.name}
                    className="w-full h-full object-cover rounded-lg transition-all duration-300 group-hover:opacity-60"
                />
            </div>
            <div className="flex flex-col gap-5">
                <div className="flex-1 min-w-0 py-1">
                    <div className="flex items-center gap-2">
                        <div className="bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full 
            bg-black/60 backdrop-blur-md border border-white/10">
                            <Star className="w-3 h-3 text-[#CCBAE4]" />
                            <span className="text-xs font-medium">{anime.score || '?'}</span>
                        </div>
                        <h3 className="text-[15px] font-medium leading-snug text-white/90 group-hover:text-white 
                    transition-colors duration-200">
                            {truncateText(anime.russian || anime.name, 60)}
                        </h3>
                    </div>
                </div>

                    <div className="flex gap-2 text-sm text-white/50">
                        <span>{transformValue('kind', anime.kind)}</span>
                        <span>•</span>
                        <span>{new Date(anime.aired_on).getFullYear()}</span>
                        {anime.episodes && (
                            <>
                                <span>•</span>
                                <span>{anime.episodes} эп.</span>
                            </>
                        )}
                    </div>
                <div className='flex gap-2 flex-wrap'>
                    {anime.genre_ids?.map((genreId) => (
                        <span
                            key={genreId}
                            className="flex px-2 py-1 border text-[12px] border-white/5 text-white/60 rounded-full"
                        >
                            {getGenreName(genreId, genres)}
                        </span>
                    ))}
                </div>
            </div>

        </div>
    </Link>
);

// Обновленный компонент карточки персонажа
const CharacterCard = ({ character }) => (
    <div className="group relative flex items-start gap-4 p-2 rounded-xl transition-all duration-300 
      hover:bg-white/[0.03]">
        <div className="relative aspect-[3/4] w-[90px] flex-shrink-0">
            <img
                src={character.image}
                alt={character.name}
                className="w-full h-full object-cover rounded-lg transition-all duration-300 
          group-hover:ring-2 ring-[#CCBAE4]/20"
            />
        </div>
        <div className="flex-1 min-w-0 py-1">
            <h3 className="text-[15px] font-medium text-white/90 group-hover:text-white 
          transition-colors duration-200 mb-1.5">
                {truncateText(character.name, 40)}
            </h3>
            <p className="text-[13px] text-white/40 group-hover:text-white/50 transition-colors duration-200">
                {character.animeTitle}
            </p>
        </div>
    </div>
);

const EmptyState = ({ searchTerm }) => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="relative w-16 h-16 mb-4">
            <Search className="w-16 h-16 text-white/10" />
        </div>
        <p className="text-[15px] text-white/40 mb-2">
            {searchTerm ? 'Ничего не найдено' : 'Начните поиск'}
        </p>
        {searchTerm && (
            <p className="text-[13px] text-white/30">
                Попробуйте изменить поисковый запрос
            </p>
        )}
    </div>
);

const SearchModal = () => {
    const [open, setOpen] = useState(false)
    const [activeCategory, setActiveCategory] = useState('Аниме')
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState(null)
    const [isSearching, setIsSearching] = useState(false)
    const abortControllerRef = useRef(null)
    const debounceTimerRef = useRef(null)
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        const down = (e) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => {
            document.removeEventListener("keydown", down)
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current)
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
        }
    }, [])

    // Add useEffect for fetching genres
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch('http://localhost:8000/genre/get-list-genres');
                const data = await response.json();
                setGenres(data);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };

        fetchGenres();
    }, []);

    const performSearch = useCallback(async (searchTerm) => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }

        if (!searchTerm.trim()) {
            setSearchResults(null)
            return
        }

        abortControllerRef.current = new AbortController()

        try {
            setIsSearching(true)
            const response = await fetch(
                `http://localhost:8000/anime/name/${encodeURIComponent(searchTerm)}`,
                { signal: abortControllerRef.current.signal }
            )
            const data = await response.json()
            setSearchResults(data)
        } catch (error) {
            if (error.name === 'AbortError') {
                return
            }
            console.error('Error fetching search results:', error)
            setSearchResults({ total_count: 0, anime_list: [] })
        } finally {
            setIsSearching(false)
        }
    }, [])

    const handleSearchChange = (e) => {
        const value = e.target.value
        setSearchTerm(value)

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current)
        }

        debounceTimerRef.current = setTimeout(() => {
            performSearch(value)
        }, 400)
    }

    const filteredComponents = useMemo(() => {
        if (activeCategory === 'Аниме') {
            // Limit results to 10 items
            const allResults = searchResults?.anime_list || [];
            return allResults.slice(0, 10);
        }
        return [];
    }, [activeCategory, searchResults])

    return (
        <>
            <Button
                variant="ghost"
                className="h-[46px] bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 
          rounded-full gap-3 text-white/60 transition-all duration-300 hover:border-white/10"
                onClick={() => setOpen(true)}
            >
                <Search className="w-4 h-4" />
                <span className="text-sm">Поиск</span>
                <kbd className="hidden md:flex h-6 items-center px-2 text-[11px] font-medium 
          bg-white/[0.02] rounded-md text-white/30">⌘K</kbd>
            </Button>

            <Dialog modal open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[850px] p-0 gap-0 rounded-2xl border border-white/[0.05] 
          bg-[#060606]">
                    <div className="flex items-center px-4 h-16 border-b border-white/[0.05] relative">
                        <Search className={`w-5 h-5 transition-opacity duration-200 ${isSearching ? 'opacity-0' : 'text-white/30'}`} />
                        {isSearching && (
                            <Loader2 className="absolute left-4 w-5 h-5 animate-spin text-white/30" />
                        )}
                        <Input
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Поиск аниме..."
                            className="border-0 focus-visible:ring-0 bg-[#060606] focus-visible:ring-offset-0  focus:outline-none bg-none"
                        />
                    </div>

                    <div className="relative max-h-[600px] overflow-y-auto">
                        {(!searchResults?.anime_list || filteredComponents.length === 0) ? (
                            <EmptyState searchTerm={searchTerm} />
                        ) : (
                            <div className="grid grid-cols-1 divide-y divide-white/[0.03]">
                                {filteredComponents.map((item, index) => (
                                    <div key={index} className="p-2">
                                        <AnimeCard anime={item} genres={genres} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default SearchModal;
