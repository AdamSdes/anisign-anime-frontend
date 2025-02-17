'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Anime } from '@/services/api/anime'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Calendar, MonitorPlay, Users } from 'lucide-react'
import { Genre } from '@/types/anime';
import { genresMap } from '@/lib/data/genres';

const kindTransformations: Record<string, string> = {
    tv: 'ТВ Сериал',
    tv_special: 'ТВ Спешл',
    movie: 'Фильм',
    ova: 'OVA',
    ona: 'ONA',
    special: 'Спешл',
    music: 'Клип'
};

const getTransformedKind = (kind: string): string => {
    return kindTransformations[kind] || kind.toUpperCase();
};

interface AnimeCardProps {
    anime: Anime;
    genres?: Genre[];
    priority?: boolean;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime, genres, priority = false }) => {
    const [imgError, setImgError] = useState(false)
    const [imgLoading, setImgLoading] = useState(true)

    const getYear = (date: string) => {
        return new Date(date).getFullYear()
    }

    const truncateTitle = (title: string, maxLength: number = 21) => {
        if (title.length <= maxLength) return title;
        return title.slice(0, maxLength) + '...';
    }

    const getGenreName = (genreId: string) => {
        const genre = genresMap[genreId];
        return genre ? genre.russian || genre.name : '';
    };

    const renderTooltipContent = () => {
        return (
            <div className="w-[340px] space-y-5 p-1">
                {/* Header with Title and Score */}
                <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                        <h3 className="text-[15px] font-medium leading-tight text-white/90">
                            {anime.russian || anime.name}
                        </h3>
                        {anime.score && (
                            <div className="flex items-center gap-1.5 bg-white/[0.08] px-2.5 py-1 rounded-lg">
                                <Star className="w-3.5 h-3.5 text-[#E4DBBA]" />
                                <span className="text-sm font-medium text-[#E4DBBA]">
                                    {Number(anime.score).toFixed(1)}
                                </span>
                            </div>
                        )}
                    </div>
                    <p className="text-[13px] text-white/40 leading-tight">{anime.name}</p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                        <span className="text-[11px] uppercase tracking-wider text-white/40 font-medium">Тип</span>
                        <p className="text-[13px] text-white/90 font-medium">{getTransformedKind(anime.kind)}</p>
                    </div>
                    {anime.episodes > 0 && (
                        <div className="space-y-1.5">
                            <span className="text-[11px] uppercase tracking-wider text-white/40 font-medium">Эпизоды</span>
                            <p className="text-[13px] text-white/90 font-medium">{anime.episodes} эп.</p>
                        </div>
                    )}
                    {anime.aired_on && (
                        <div className="space-y-1.5">
                            <span className="text-[11px] uppercase tracking-wider text-white/40 font-medium">Год</span>
                            <p className="text-[13px] text-white/90 font-medium">{getYear(anime.aired_on)}</p>
                        </div>
                    )}
                </div>

                {/* Genres */}
                {anime.genre_ids && anime.genre_ids.length > 0 && (
                    <div className="space-y-2">
                        <span className="text-[11px] uppercase tracking-wider text-white/40 font-medium">Жанры</span>
                        <div className="flex flex-wrap gap-1.5">
                            {anime.genre_ids
                                .map(genreId => ({ id: genreId, name: getGenreName(genreId) }))
                                .filter(genre => genre.name) // Фильтруем жанры с пустыми именами
                                .map(genre => (
                                    <span
                                        key={genre.id}
                                        className="px-2.5 py-1 text-[12px] rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white/90"
                                    >
                                        {genre.name}
                                    </span>
                                ))}
                        </div>
                    </div>
                )}

                {/* Description Section */}
                {anime.description && (
                    <div className="space-y-2">
                        <span className="text-[11px] uppercase tracking-wider text-white/40 font-medium">Описание</span>
                        <p className="text-[13px] leading-relaxed text-white/70 line-clamp-4">
                            {anime.description}
                        </p>
                    </div>
                )}
            </div>
        )
    }

    return (
        <TooltipProvider>
            <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                    <Link href={`/anime/${anime.anime_id}`}>
                        <div className="group relative">
                            {/* Score Badge */}
                            {anime.score && (
                                <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-black backdrop-blur-sm rounded-full px-2.5 py-1">
                                    <svg width="14" height="14" viewBox="0 0 24 24" className="text-white">
                                        <path fill="currentColor" d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z"/>
                                    </svg>
                                    <span className="text-sm font-medium text-white">{anime.score.toFixed(1)}</span>
                                </div>
                            )}

                            {/* Image Container */}
                            <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-white/5">
                                {imgLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                                        <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
                                    </div>
                                )}
                                
                                {!imgError ? (
                                    <Image
                                        src={anime.poster_url}
                                        alt={anime.russian || anime.english}
                                        fill
                                        priority={priority}
                                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                        className={`object-cover transition-transform duration-300 scale-105 group-hover:scale-110 ${
                                            imgLoading ? 'opacity-0' : 'opacity-100'
                                        }`}
                                        onError={() => {
                                            setImgError(true)
                                            setImgLoading(false)
                                        }}
                                        onLoad={() => setImgLoading(false)}
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                                        <span className="text-white/40">Нет изображения</span>
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="mt-3 space-y-1">
                                <h3 className="text-sm font-medium line-clamp-2 text-white/90 group-hover:text-white">
                                    {truncateTitle(anime.russian || anime.english)}
                                </h3>
                                <div className="flex items-center text-xs text-white/50 gap-2">
                                    <span>{getTransformedKind(anime.kind)}</span>
                                    {anime.aired_on && (
                                        <>
                                            <div className="w-1 h-1 rounded-full bg-white/20" />
                                            <span>{getYear(anime.aired_on)}</span>
                                        </>
                                    )}
                                    {anime.episodes > 0 && (
                                        <>
                                            <div className="w-1 h-1 rounded-full bg-white/20" />
                                            <span>{anime.episodes} эп.</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Link>
                </TooltipTrigger>
                <TooltipContent 
                    side="right" 
                    className="bg-[#060606] border border-white/5 p-6 rounded-xl"
                    sideOffset={16}
                >
                    {renderTooltipContent()}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default AnimeCard
