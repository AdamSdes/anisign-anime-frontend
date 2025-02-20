'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface RelatedAnime {
    anime_id: string;
    name: string;
    russian: string;
    poster_url: string;
    relation_type: string;
    kind: string;
    aired_on: string;
    episodes?: number;
    score?: number;
}

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

interface RelatedAnimeProps {
    relatedAnime: RelatedAnime[];
}

const RelatedAnime: React.FC<RelatedAnimeProps> = ({ relatedAnime }) => {
    const [showAll, setShowAll] = useState(false);
    const INITIAL_SHOW_COUNT = 8;

    if (!relatedAnime || relatedAnime.length === 0) {
        return null;
    }

    const getYear = (date: string) => {
        if (!date) return null;
        return new Date(date).getFullYear();
    };

    const truncateTitle = (title: string, maxLength: number = 21) => {
        if (!title) return '';
        if (title.length <= maxLength) return title;
        return title.slice(0, maxLength) + '...';
    };

    const displayedAnime = showAll ? relatedAnime : relatedAnime.slice(0, INITIAL_SHOW_COUNT);
    const hasMore = relatedAnime.length > INITIAL_SHOW_COUNT;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" className="text-white/60">
                    <path fill="currentColor" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1M8 13h8v-2H8zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                </svg>
                <h3 className="text-[16px] font-semibold">Связанные аниме</h3>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-6">
                    {displayedAnime.map((anime) => (
                        <Link 
                            href={`/anime/${anime.anime_id}`} 
                            key={anime.anime_id} 
                            className="group relative flex flex-col"
                        >
                            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-white/[0.02] border border-white/5">
                                <Image
                                    src={anime.poster_url}
                                    alt={anime.russian || anime.name}
                                    fill
                                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Info Overlay */}
                                <div className="absolute top-2 left-2 right-2 flex items-start justify-between gap-2">
                                    {/* Rating Badge */}
                                    {anime.score && (
                                        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
                                            <svg width="12" height="12" viewBox="0 0 24 24" className="text-yellow-400">
                                                <path fill="currentColor" d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z"/>
                                            </svg>
                                            <span className="text-xs font-medium text-white">{anime.score.toFixed(1)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Title and Details */}
                            <div className="mt-3 space-y-1.5">
                                {/* Relation Type - Moved here */}
                                <div className="text-[11px] font-medium text-white/40">
                                    {anime.relation_type}
                                </div>
                                
                                <h4 className="text-sm font-medium text-white/90 line-clamp-2 group-hover:text-white transition-colors">
                                    {truncateTitle(anime.russian || anime.name)}
                                </h4>
                                
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-white/40">
                                    <span className="capitalize">{getTransformedKind(anime.kind)}</span>
                                    {anime.aired_on && (
                                        <>
                                            <span className="w-1 h-1 rounded-full bg-white/20" />
                                            <span>{getYear(anime.aired_on)}</span>
                                        </>
                                    )}
                                    {anime.episodes && anime.episodes > 0 && (
                                        <>
                                            <span className="w-1 h-1 rounded-full bg-white/20" />
                                            <span>{anime.episodes} эп.</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Show More/Less Button */}
                {hasMore && (
                    <div className="flex justify-center pt-2">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="group w-full justify-center flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 transition-all duration-200"
                        >
                            <span className="text-[14px] text-white/60 group-hover:text-white/90 transition-colors">
                                {showAll ? 'Скрыть' : `Показать ещё ${relatedAnime.length - INITIAL_SHOW_COUNT}`}
                            </span>
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                className={`text-white/40 transition-transform duration-200 ${showAll ? 'rotate-180' : ''}`}
                            >
                                <path
                                    fill="currentColor"
                                    d="m12 15.4l-6-6L7.4 8l4.6 4.6L16.6 8L18 9.4z"
                                />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RelatedAnime;