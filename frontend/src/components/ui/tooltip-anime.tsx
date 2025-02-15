'use client'
import React from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Star, Clock, Film, Calendar, Tag, Activity } from "lucide-react"
import { transformValue } from '@/lib/utils/transforms'
import { genresMap } from '@/lib/data/genres' // Добавьте импорт мапы жанров

interface TooltipAnimeProps {
    children: React.ReactNode
    anime: {
        russian: string
        name: string
        score?: number
        aired_on: string
        kind: string
        episodes?: number
        description?: string
        genre_ids?: string[]
    }
}

export function TooltipAnime({ children, anime }: TooltipAnimeProps) {
    // Функция для получения названий жанров
    const getGenreNames = (genreIds?: string[]) => {
        if (!genreIds) return [];
        return genreIds.map(id => genresMap[id]?.russian || genresMap[id]?.name || '').filter(Boolean);
    };

    return (
        <TooltipProvider>
            <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent 
                    side="right"
                    align="start"
                    className="w-[380px] p-0 overflow-hidden bg-[#0A0A0A] backdrop-blur-xl border border-white/[0.03] rounded-xl shadow-xl"
                >
                    <div className="p-5 space-y-4">
                        {/* Заголовок */}
                        <div className="space-y-1.5">
                            <h3 className="font-medium text-[15px] text-white/90">
                                {anime.russian || anime.name}
                            </h3>
                            <p className="text-[13px] text-white/50 font-medium">
                                {anime.name}
                            </p>
                        </div>

                        {/* Основная информация */}
                        <div className="flex items-center gap-4 text-[13px]">
                            {anime.score && (
                                <div className="flex items-center gap-1.5 bg-white/[0.03] px-2.5 py-1.5 rounded-lg">
                                    <Star className="w-4 h-4 text-[#FFE4A0]" />
                                    <span className="text-white/90 font-medium">{Number(anime.score).toFixed(1)}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1.5 text-white/40">
                                <Clock className="w-4 h-4" />
                                <span>{transformValue('kind', anime.kind)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-white/40">
                                <Film className="w-4 h-4" />
                                <span>
                                    {anime.episodes ? `${anime.episodes} эп.` : '??'}
                                </span>
                            </div>
                        </div>

                        {/* Год и статус */}
                        <div className="flex items-center gap-3 text-[13px] text-white/40">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(anime.aired_on).getFullYear()}</span>
                            </div>
                            {anime.genre_ids && anime.genre_ids.length > 0 && (
                                <div className="flex items-center gap-1.5">
                                    <Tag className="w-4 h-4" />
                                    <span>{anime.genre_ids.length} жанров</span>
                                </div>
                            )}
                        </div>

                        {/* Обновленная секция с жанрами */}
                        {anime.genre_ids && anime.genre_ids.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {getGenreNames(anime.genre_ids).map((genre, index) => (
                                    <span 
                                        key={index}
                                        className="px-2 py-1 bg-white/[0.03] rounded-lg text-[11px] text-white/50"
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Разделитель */}
                        <div className="h-px bg-white/[0.03]" />

                        {/* Описание */}
                        {anime.description && (
                            <div className="relative">
                                <p className="text-[13px] leading-relaxed text-white/60 line-clamp-3">
                                    {anime.description}
                                </p>
                                <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
                            </div>
                        )}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
