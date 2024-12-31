'use client';
import Image from "next/image";
import Link from "next/link";
import { useState } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

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

const AnimeCard = ({ anime }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href={`/anime/${anime.anime_id}`} className="block relative">
                        {anime.score && (
                            <div className="absolute top-2 left-2 z-30 flex items-center gap-1 bg-black backdrop-blur-sm rounded-full px-2.5 py-1.5">
                                <svg width="14" height="14" viewBox="0 0 24 24" className="text-yellow-400">
                                    <path fill="currentColor" d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z"/>
                                </svg>
                                <span className="text-sm font-medium text-white">{anime.score}</span>
                            </div>
                        )}
                        <div className="relative group">
                            <div className="relative w-full aspect-[3/4] rounded-[14px] overflow-hidden">
                                {!imgError ? (
                                    <img
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        alt={anime.russian || anime.russian}
                                        src={anime.poster_url}
                                        onError={() => setImgError(true)}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-default-100">
                                        <span className="text-default-500">Изображение недоступно</span>
                                    </div>
                                )}
                            </div>
                            <div className="mt-3 space-y-2">
                                <h3 className="text-sm font-medium line-clamp-2">
                                    {(anime.russian || anime.russian).length > 24 
                                        ? (anime.russian || anime.russian).substring(0, 24) + '...'
                                        : (anime.russian || anime.russian)
                                    }
                                </h3>
                                <p className="text-xs text-white/50">{new Date(anime.released_on).getFullYear()} • {transformValue('kind', anime.kind)}</p>
                            </div>
                        </div>
                    </Link>
                </TooltipTrigger>
                <TooltipContent 
                    side="right"
                    sideOffset={20}
                    className="max-w-[400px] p-6 space-y-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
                >
                    <div className="space-y-3">
                        <h4 className="font-medium text-base">{anime.russian || anime.russian}</h4>
                        <div className="flex gap-2 text-sm text-white/50">
                            <span>{transformValue('kind', anime.kind)}</span>
                            <span>•</span>
                            <span>{new Date(anime.released_on).getFullYear()}</span>
                            {anime.episodes && (
                                <>
                                    <span>•</span>
                                    <span>{anime.episodes} эп.</span>
                                </>
                            )}
                        </div>
                        {anime.genres && (
                            <div className="flex flex-wrap gap-1.5">
                                {anime.genres.map((genre, index) => (
                                    <span 
                                        key={index}
                                        className="px-3 py-1.5 text-sm rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        )}
                        {anime.description && (
                            <p className="text-sm text-white/70 line-clamp-4">
                                {anime.description}
                            </p>
                        )}
                        {anime.score && (
                            <div className="flex items-center gap-3 text-sm">
                                <div className="flex items-center gap-1.5">
                                    <svg width="16" height="16" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z"/>
                                    </svg>
                                    <span>{anime.score}</span>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                                    {transformValue('status', anime.status)}
                                </span>
                            </div>
                        )}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default AnimeCard;
