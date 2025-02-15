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
                <TooltipTrigger asChild>
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
                <TooltipTrigger asChild>
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

export const parseDescription = (description: string): React.ReactNode => {
    if (!description) return '';

    const parts = description.split(/(\[character=\d+\][^\[]+\[\/character\]|\[anime=\d+\][^\[]+\[\/anime\])/g);

    return parts.map((part, index) => {
        const characterMatch = part.match(/\[character=(\d+)\]([^\[]+)\[\/character\]/);
        const animeMatch = part.match(/\[anime=\d+\]([^\[]+)\[\/anime\]/);

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
