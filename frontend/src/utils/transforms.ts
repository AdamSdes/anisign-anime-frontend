'use client'
import React from 'react'
import Link from 'next/link'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface CharacterTooltipProps {
    id: string;
    name: string;
    imageUrl?: string;
}

interface AnimeTooltipProps {
    id: string;
    name: string;
}

export const CharacterTooltip = ({ id, name, imageUrl }: CharacterTooltipProps) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <Link
                        href={`/character/${id}`}
                        className="text-[#CCBAE4] hover:underline cursor-pointer"
                    >
                        {name}
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[300px] p-4">
                    <div className="flex gap-4">
                        <p>Персонаж: {name}</p>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export const AnimeTooltip = ({ id, name }: AnimeTooltipProps) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <Link
                        href={`/anime/${id}`}
                        className="text-[#CCBAE4] hover:underline cursor-pointer"
                    >
                        {name}
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[300px] p-4">
                    <p>Перейти к аниме</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export const transformDescription = (description: string): React.ReactNode => {
    if (!description) return '';

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

export const transformValue = (key: string, value: string | undefined): string | null => {
    if (!value) return null;

    const transformations: Record<string, Record<string, string>> = {
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
        }
    };

    if (key === 'season' && value) {
        const [season, year] = value.split('_');
        const seasons: Record<string, string> = {
            winter: 'Зима',
            spring: 'Весна',
            summer: 'Лето',
            fall: 'Осень'
        };
        return `${seasons[season]} ${year}`;
    }

    return transformations[key]?.[value] || value;
};
