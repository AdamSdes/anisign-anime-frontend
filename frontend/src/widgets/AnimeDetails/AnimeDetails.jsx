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

const transformDescription = (description) => {
    if (!description) return '';

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
            whileHover={{ scale: 1.02 }}
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
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                        w-full flex items-center justify-between h-[60px] 
                        ${activeStatus
                            ? `bg-[${activeStatus.color}]/5 hover:bg-[${activeStatus.color}]/10`
                            : 'bg-[rgba(255,255,255,0.02)] hover:bg-white/5'
                        }
                        text-white/90 font-medium rounded-xl px-5 
                        border border-white/10 transition-all duration-300
                    `}
                >
                    <div className="flex items-center gap-2">
                        {activeStatus ? (
                            <>
                                <activeStatus.icon
                                    className="h-5 w-5"
                                    style={{ color: activeStatus.color }}
                                />
                                <span className="text-white/90">
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
                    <ChevronDown className="h-4 w-4" />
                </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[315px] bg-[#060606]/95 rounded-[14px] backdrop-blur-xl border-white/5">
                {listStatuses.map((item) => (
                    <DropdownMenuItem
                        key={item.id}
                        onClick={() => setStatus(item.id)}
                        className={`
                            flex items-center gap-2 py-3 rounded-[14px] text-[15px] cursor-pointer
                            ${status === item.id ? `bg-[${item.color}]/5` : `hover:bg-[${item.color}]/5`}
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

export default function AnimeDetails({ anime, genres }) {
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
