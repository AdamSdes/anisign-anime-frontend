'use client';
import React, { useState } from 'react';
import { Card, Image, Select, SelectItem } from "@nextui-org/react";
import { AButton } from "@/shared/anisign-ui/Button";
import Link from "next/link";
import InfoItem from "@/widgets/AnimeDetails/InfoItem";
import ImageGallery from "@/widgets/AnimeDetails/ImageGallery";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    Play,
    Plus,
    Check,
    Star,
    Clock,
    Ban,
    ChevronDown,
    X,
    Pause
} from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const CharacterTooltip = ({ id, name, imageUrl }) => {
    const [isImageLoading, setIsImageLoading] = React.useState(true);
    const [imageError, setImageError] = React.useState(false);

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        href={`/character/${id}`}
                        className="text-[#CCBAE4] hover:underline cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {name}
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[300px] p-4 space-y-2">
                    <div className="flex gap-4">
                        <div className="w-[100px] h-[100px] rounded-lg bg-white/5 overflow-hidden">
                            {imageUrl && !imageError ? (
                                <Image
                                    src={imageUrl}
                                    alt={name}
                                    className="w-full h-full object-cover"
                                    onLoadStart={() => setIsImageLoading(true)}
                                    onLoad={() => setIsImageLoading(false)}
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/50">
                                    No Image
                                </div>
                            )}
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

// Добавляем компонент AnimeTooltip
const AnimeTooltip = ({ id, name }) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        href={`/anime/${id}`}
                        className="text-[#CCBAE4] hover:underline cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {name}
                    </Link>
                </TooltipTrigger>
                <TooltipContent 
                    side="top" 
                    className="max-w-[300px] p-4 space-y-2 bg-black/90 backdrop-blur-xl border border-white/5"
                >
                    <p className="text-sm text-white/70">Перейти к аниме</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

// Обновляем функцию transformDescription
const transformDescription = (description) => {
    if (!description) return '';

    // Разбиваем текст на части, сохраняя разметку персонажей и аниме
    const parts = description.split(/(\[character=\d+\][^\[]+\[\/character\]|\[anime=\d+\][^\[]+\[\/anime\])/g);

    return parts.map((part, index) => {
        const characterMatch = part.match(/\[character=(\d+)\]([^\[]+)\[\/character\]/);
        const animeMatch = part.match(/\[anime=(\d+)\]([^\[]+)\[\/anime\]/);

        if (characterMatch) {
            const [_, id, name] = characterMatch;
            return <CharacterTooltip key={`char-${index}`} id={id} name={name} />;
        }

        if (animeMatch) {
            const [_, id, name] = animeMatch;
            return <AnimeTooltip key={`anime-${index}`} id={id} name={name} />;
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

const ScrollToPlayerButton = () => {
    const handleClick = (e) => {
        e.preventDefault();
        const playerSection = document.getElementById('player');
        if (playerSection) {
            playerSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <motion.button
            whileHover={{ opacity: 0.8 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleClick}
            className="w-full flex items-center justify-center gap-2 h-[54px] bg-[#CCBAE4] hover:opacity-90 text-black font-medium rounded-xl px-5 transition-all duration-300"
        >
            <Play className="h-5 w-5" />
            <span>Смотреть</span>
        </motion.button>
    );
};

const ListButton = () => {
    const [status, setStatus] = useState(null);

    const listStatuses = [
        { id: 'watching', label: 'Смотрю', icon: Play, color: '#CCBAE4' },
        { id: 'completed', label: 'Просмотрено', icon: Check, color: '#86EFAC' },
        { id: 'planned', label: 'В планах', icon: Clock, color: '#93C5FD' },
        { id: 'dropped', label: 'Бросил', icon: X, color: '#FDA4AF' },
        { id: 'on_hold', label: 'Отложено', icon: Pause, color: '#FCD34D' },
    ];

    const activeStatus = listStatuses.find(s => s.id === status);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <motion.button
                    whileHover={{ opacity: 0.8 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                        backgroundColor: activeStatus ? `${activeStatus.color}10` : 'rgba(255,255,255,0.02)',
                        borderColor: activeStatus ? `${activeStatus.color}20` : 'rgba(255,255,255,0.1)',
                    }}
                    className="relative w-full flex items-center justify-between h-[60px] hover:bg-opacity-10 
                        text-white/90 font-medium rounded-xl px-5 border transition-all duration-300"
                >
                    <div className="flex items-center gap-2">
                        {activeStatus ? (
                            <>
                                <activeStatus.icon
                                    className="h-5 w-5"
                                    style={{ color: activeStatus.color }}
                                />
                                <span style={{ color: `${activeStatus.color}` }}>
                                    {activeStatus.label}
                                </span>
                            </>
                        ) : (
                            <>
                                <Plus className="h-5 w-5" />
                                <span>Добавить в список</span>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {activeStatus && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setStatus(null);
                                }}
                                className="w-6 h-6 flex items-center justify-center rounded-full bg-black/50 
                                    hover:bg-black/70 transition-colors"
                            >
                                <X className="w-4 h-4" style={{ color: activeStatus.color }} />
                            </button>
                        )}
                        <ChevronDown 
                            className="h-4 w-4" 
                            style={{ color: activeStatus ? activeStatus.color : 'currentColor' }} 
                        />
                    </div>
                </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[315px] bg-[#060606]/95 rounded-[14px] backdrop-blur-xl border-white/5">
                {listStatuses.map((item) => (
                    <DropdownMenuItem
                        key={item.id}
                        onClick={() => setStatus(item.id)}
                        style={{
                            backgroundColor: status === item.id ? `${item.color}10` : 'transparent',
                        }}
                        className={`
                            flex items-center gap-2 py-3 rounded-[14px] text-[15px] cursor-pointer
                            hover:bg-opacity-10 hover:bg-white
                            transition-colors duration-200
                        `}
                    >
                        <item.icon
                            className="h-4 w-4"
                            style={{ color: item.color }}
                        />
                        <span className="text-white/90">{item.label}</span>
                        {status === item.id && (
                            <Check className="h-4 w-4 ml-auto" style={{ color: item.color }} />
                        )}
                    </DropdownMenuItem>
                ))}
                {status && (
                    <>
                        <DropdownMenuSeparator className="bg-white/5" />
                        <DropdownMenuItem
                            onClick={() => setStatus(null)}
                            className="flex items-center gap-2 rounded-[14px] py-3 text-[15px] cursor-pointer text-white/90 hover:text-red-400 hover:bg-red-500/5"
                        >
                            <Ban className="h-4 w-4 text-red-400" />
                            <span>Удалить из списка</span>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const AnimeDetailsSkeleton = () => {
    return (
        <div className="flex flex-col lg:flex-row gap-8 relative animate-pulse">
            {/* Left Column Skeleton */}
            <div className="flex flex-col gap-6 lg:sticky lg:top-24 h-fit">
                <Skeleton className="w-[315px] h-[454px] rounded-[16px] bg-white/5" />
                <div className="flex flex-col gap-3 w-full max-w-[315px]">
                    <Skeleton className="w-full h-[54px] rounded-xl bg-white/5" />
                    <Skeleton className="w-full h-[60px] rounded-xl bg-white/5" />
                </div>
            </div>

            {/* Center Column Skeleton */}
            <div className="flex w-full flex-col gap-[30px]">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-8 w-[300px] bg-white/5" />
                        <Skeleton className="h-4 w-[200px] bg-white/5" />
                    </div>
                    <Skeleton className="h-10 w-16 rounded-[40px] bg-white/5" />
                </div>

                <div className="flex gap-2 flex-wrap">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-8 w-24 rounded-full bg-white/5" />
                    ))}
                </div>

                <Skeleton className="w-full h-[1px] bg-white/5" />

                <div className="flex flex-col gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-4 w-full bg-white/5" />
                    ))}
                </div>
            </div>

            {/* Right Column Skeleton */}
            <div className="hidden lg:block w-[1px] min-h-[624px] bg-white/5" />
            <div className="flex flex-col gap-[20px]">
                <div className="flex flex-col w-[320px] gap-[10px]">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="flex justify-between items-center">
                            <Skeleton className="h-4 w-20 bg-white/5" />
                            <Skeleton className="h-4 w-32 bg-white/5" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function AnimeDetails({ anime, genres, isLoading }) {
    if (isLoading) return <AnimeDetailsSkeleton />;
    if (!anime) return null;

    const getGenreName = (genreId) => {
        if (!genres) return '...';
        const genre = genres.find(g => String(g.genre_id) === String(genreId));
        return genre ? genre.russian || genre.name : '...';
    };

    return (
        <motion.section
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="relative"
        >
            <div className="flex flex-col lg:flex-row gap-8 relative">
                {/* Левая колонка */}
                <motion.article
                    variants={itemVariants}
                    className="flex flex-col gap-6 lg:sticky lg:top-24 h-fit"
                >
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="w-[315px] h-[454px] rounded-[16px]" aria-labelledby="anime-title">
                            <Image
                                removeWrapper
                                alt={anime.russian || anime.russian}
                                className="w-full h-full object-cover"
                                src={anime.poster_url}
                            />
                        </Card>
                    </motion.div>

                    {/* Кнопки действий */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col gap-3 w-full max-w-[315px]"
                    >
                        <ScrollToPlayerButton />
                        <ListButton />
                    </motion.div>
                </motion.article>

                {/* Центр с основной информацией об аниме */}
                <motion.article
                    variants={itemVariants}
                    className="flex w-full flex-col gap-[30px]"
                >
                    {anime.nextEpisodeAt && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-between items-center p-5 bg-[#BFF6F9]/5 rounded-[14px]"
                        >
                            <p className="text-[#BFF6F9]/60 text-[14px]">Следующий эпизод</p>
                            <p className="text-[#BFF6F9] text-[14px]">{new Date(anime.nextEpisodeAt).toLocaleString()}</p>
                        </motion.div>
                    )}

                    <motion.header
                        variants={itemVariants}
                        className="flex justify-between items-center"
                    >
                        <div className="flex flex-col gap-2">
                            <h1 id="anime-title" className="text-[32px] font-bold">{anime.russian || anime.russian}</h1>
                            <p className="opacity-60 text-[12px]">{anime.english}</p>
                        </div>
                        <div className="bg-[#FDE5B9]/10 h-fit text-[#FDE5B9] flex items-center rounded-[40px] w-fit px-[15px] py-[10px]">
                            {anime.score}
                        </div>
                    </motion.header>
                    
                    <div className='flex gap-2 flex-wrap'>                   
                        {anime.genre_ids?.map((genreId) => (
                            <span 
                                key={genreId}
                                className="px-3 flex py-2 border border-white/5 text-white/60 rounded-full"
                            >
                                {getGenreName(genreId)}
                            </span>
                        ))}
                    </div>

                    <motion.div variants={itemVariants} className="w-full h-[1px] bg-white/5" />

                    <motion.div variants={itemVariants}>
                        {anime.description && anime.description.trim() ? (
                            <p className="opacity-80 text-[14px]">{transformDescription(anime.description)}</p>
                        ) : (
                            <div className="h-[220px] bg-[rgba(255,255,255,0.02)] border border-[2px] flex flex-col border-dashed border-white/5 rounded-[14px] flex items-center justify-center">
                                <p className="text-white/50">😢</p>
                                <p className="text-white/50">Описание отсутствует</p>
                            </div>
                        )}
                    </motion.div>
                </motion.article>

                {/* Вертикальная разделительная линия на больших экранах */}
                <div className="hidden lg:block w-[1px] min-h-[624px] bg-white/5"></div>

                {/* Правая колонка с дополнительной информацией */}
                <motion.aside
                    variants={itemVariants}
                    className="flex flex-col gap-[20px]"
                >
                    <motion.div
                        variants={containerVariants}
                        className="flex flex-col w-[320px] gap-[10px]"
                    >
                        {[
                            { label: "Тип", value: transformValue('kind', anime.kind) },
                            { label: "Эпизодов", value: anime.episodes },
                            { label: "Статус", value: transformValue('status', anime.status) },
                            { label: "Рейтинг", value: transformValue('rating', anime.rating) },
                            { label: "Длительность", value: `${anime.duration} мин.` },
                            { label: "Сезон", value: transformValue('season', anime.season) || "Неизвестно" },
                            { label: "Дата выхода", value: new Date(anime.aired_on).toLocaleDateString() },
                            { label: "Дата завершения", value: anime.released_on ? new Date(anime.released_on).toLocaleDateString() : null }
                        ].map((item, index) => (
                            <motion.div
                                key={item.label}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: index * 0.1 }}
                            >
                                <InfoItem label={item.label} value={item.value} />
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.aside>
            </div>
        </motion.section>
    );
}
