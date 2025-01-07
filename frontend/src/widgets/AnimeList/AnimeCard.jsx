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

const CharacterTooltip = ({ id, name }) => {
    // В будущем здесь будет запрос к API для получения данных персонажа
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link 
                        href={`/character/${id}`} 
                        className="text-primary hover:underline cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {name}
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[300px] p-4 space-y-2">
                    <div className="flex gap-4">
                        <div className="w-[100px] h-[100px] rounded-lg bg-white/5 overflow-hidden">
                            {/* В будущем здесь будет изображение персонажа */}
                            <div className="w-full h-full flex items-center justify-center text-white/50">
                                No Image
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium text-base">{name}</h3>
                            <p className="text-sm text-white/70">Персонаж аниме</p>
                        </div>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

const transformDescription = (description) => {
    if (!description) return '';
    
    // Разбиваем текст на части, сохраняя разметку персонажей
    const parts = description.split(/(\[character=\d+\][^\[]+\[\/character\])/g);
    
    return parts.map((part, index) => {
        const match = part.match(/\[character=(\d+)\]([^\[]+)\[\/character\]/);
        if (match) {
            const [_, id, name] = match;
            return <CharacterTooltip key={index} id={id} name={name} />;
        }
        return part;
    });
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

const AnimeCard = ({ anime, genres }) => {
    const [imgError, setImgError] = useState(false);
    const [imgLoading, setImgLoading] = useState(true); // Добавляем состояние загрузки

    const getGenreName = (genreId) => {
        if (!genres || !Array.isArray(genres)) return '';
        const genre = genres.find(g => String(g.genre_id) === String(genreId));
        return genre ? genre.russian || genre.name : '';
    };

    // Функция для форматирования рейтинга
    const formatScore = (score) => {
        if (!score) return null;
        return Number(score).toFixed(1);
    };

    // Функция транслитерации
    const transliterate = (text) => {
        const ru = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e',
            'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k',
            'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
            'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts',
            'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
            'э': 'e', 'ю': 'yu', 'я': 'ya'
        };

        return text.toLowerCase().split('').map(char => ru[char] || char).join('');
    };

    // Обновляем функцию для генерации URL
    const generateAnimeUrl = (anime) => {
        const title = anime.russian || anime.name || '';
        const slug = transliterate(title)
            .replace(/[^a-z0-9\s]/g, '') // Оставляем только латинские буквы, цифры и пробелы
            .trim()
            .replace(/\s+/g, ' ') // Нормализуем пробелы
            .replace(/ /g, '-'); // Заменяем пробелы на дефисы

        return `/anime/${anime.anime_id}${slug ? '-' + slug : ''}`;
    };

    return (
        <TooltipProvider>
            <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                    <Link href={generateAnimeUrl(anime)} className="block relative">
                        {anime.score && (
                            <div className="absolute top-2 left-2 z-30 flex items-center gap-1 bg-black backdrop-blur-sm rounded-full px-2.5 py-1.5">
                                <svg width="14" height="14" viewBox="0 0 24 24" className="white">
                                    <path fill="currentColor" d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z"/>
                                </svg>
                                <span className="text-sm font-medium text-white">{formatScore(anime.score)}</span>
                            </div>
                        )}
                        <div className="relative group">
                            <div className="relative w-full aspect-[3/4] rounded-[14px] overflow-hidden bg-white/5">
                                {/* Лоадер */}
                                {imgLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                                        <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
                                    </div>
                                )}
                                
                                {!imgError ? (
                                    <img
                                        className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${
                                            imgLoading ? 'opacity-0' : 'opacity-100'
                                        }`}
                                        alt={anime.russian || anime.name}
                                        src={anime.poster_url}
                                        onError={() => {
                                            setImgError(true);
                                            setImgLoading(false);
                                        }}
                                        onLoad={() => setImgLoading(false)}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-white/40">Изображение недоступно</span>
                                    </div>
                                )}
                            </div>
                            <div className="mt-3 space-y-2">
                                <h3 className="text-sm font-medium line-clamp-2">
                                    {anime.russian || anime.name}
                                </h3>
                                <p className="text-xs text-white/50">{new Date(anime.aired_on).getFullYear()} • {transformValue('kind', anime.kind)}</p>
                            </div>
                        </div>
                    </Link>
                </TooltipTrigger>
                <TooltipContent 
                    side="right"
                    sideOffset={20}
                    className="w-[400px] rounded-[14px] p-6 space-y-4 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-[#060606] border border-white/5 shadow-xl animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                >
                    <div className="space-y-3">
                        <div className="flex items-start justify-between">
                            <h4 className="font-medium text-base text-white/90">{anime.russian || anime.name}</h4>
                            {anime.score && (
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-yellow-400/10">
                                    <svg width="12" height="12" viewBox="0 0 24 24" className="text-yellow-400">
                                        <path fill="currentColor" d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z"/>
                                    </svg>
                                    <span className="text-sm font-medium text-yellow-400">{formatScore(anime.score)}</span>
                                </div>
                            )}
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
                        {anime.description && (
                            <div className="text-sm text-white/70 line-clamp-3">
                                {transformDescription(anime.description)}
                            </div>
                        )}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default AnimeCard;
