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
        <button 
            onClick={handleClick}
            className="w-full flex items-center justify-center gap-2 h-[54px] bg-[#CCBAE4] hover:opacity-90 text-black font-medium rounded-xl px-5 transition-all duration-300"
        >
            <Play className="h-5 w-5" />
            <span>Смотреть</span>
        </button>
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
                <button 
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
                </button>
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

export default function AnimeDetails({ anime }) {
    if (!anime) return null;

    return (
        <section className="relative">
            <div className="flex flex-col lg:flex-row gap-8 relative">
                {/* Левая колонка */}
                <article className="flex flex-col gap-6 lg:sticky lg:top-24 h-fit">
                    <Card className="w-[315px] h-[454px] rounded-[16px]" aria-labelledby="anime-title">
                        <Image
                            removeWrapper
                            alt={anime.russian || anime.russian}
                            className="w-full h-full object-cover"
                            src={anime.poster_url}
                        />
                    </Card>

                    {/* Кнопки действий */}
                    <div className="flex flex-col gap-3 w-full max-w-[315px]">
                        <ScrollToPlayerButton />
                        <ListButton />
                    </div>
                </article>

                {/* Центр с основной информацией об аниме */}
                <article className="flex w-full flex-col gap-[30px]">
                    {anime.nextEpisodeAt && (
                        <div className="flex justify-between items-center p-5 bg-[#BFF6F9]/5 rounded-[14px]">
                            <p className="text-[#BFF6F9]/60 text-[14px]">Следующий эпизод</p>
                            <p className="text-[#BFF6F9] text-[14px]">{new Date(anime.nextEpisodeAt).toLocaleString()}</p>
                        </div>
                    )}

                    {/* Заголовок и рейтинг */}
                    <header className="flex justify-between items-center">
                        <div className="flex flex-col gap-2">
                            <h1 id="anime-title" className="text-[32px] font-bold">{anime.russian || anime.russian}</h1>
                            <p className="opacity-60 text-[12px]">{anime.english}</p>
                        </div>
                        <div className="bg-[#FDE5B9]/10 h-fit text-[#FDE5B9] flex items-center rounded-[40px] w-fit px-[15px] py-[10px]">
                            {anime.score}
                        </div>
                    </header>

                    <div className="flex flex-wrap items-center gap-3">
                        <Link href='/' className='p-3 border text-[14px] rounded-full border-white/5'>Комедия</Link>
                        <Link href='/' className='p-3 border text-[14px] rounded-full border-white/5'>Приключения</Link>
                        <Link href='/' className='p-3 border text-[14px] rounded-full border-white/5'>Сверхъестественное</Link>
                        <Link href='/' className='p-3 border text-[14px] rounded-full border-white/5'>Фэнтези</Link>
                    </div>

                    <div className="w-full h-[1px] bg-white/5"></div>

                    {/* Описание аниме */}
                        {anime.description && anime.description.trim() ? (
                            <p className="opacity-80 text-[14px]">{transformDescription(anime.description)}</p>
                        ) : (
                            <div className="h-[220px] bg-[rgba(255,255,255,0.02)] border border-[2px] flex flex-col border-dashed border-white/5 rounded-[14px] flex items-center justify-center">
                                <p className="text-white/50">😢</p>
                                <p className="text-white/50">Описание отсутствует</p>
                            </div>
                        )}
                </article>

                {/* Вертикальная разделительная линия на больших экранах */}
                <div className="hidden lg:block w-[1px] min-h-[624px] bg-white/5"></div>

                {/* Правая колонка с дополнительной информацией */}
                <aside className="flex flex-col gap-[20px]">
                    <div className="flex flex-col w-[320px] gap-[10px]">
                        <InfoItem label="Тип" value={transformValue('kind', anime.kind)} />
                        <InfoItem label="Эпизодов" value={anime.episodes} />
                        <InfoItem label="Статус" value={transformValue('status', anime.status)} />
                        <InfoItem label="Рейтинг" value={transformValue('rating', anime.rating)} />
                        <InfoItem label="Длительность" value={`${anime.duration} мин.`} />
                        <InfoItem label="Сезон" value={transformValue('season', anime.season)  || "Неизвестно" } />
                        <InfoItem label="Дата выхода" value={new Date(anime.aired_on).toLocaleDateString()} />
                        {anime.released_on && (
                            <InfoItem label="Дата завершения" value={new Date(anime.released_on).toLocaleDateString()} />
                        )}
                    </div>
                </aside>
            </div>
        </section>
    );
}
