'use client';
import Link from "next/link";
import { useState } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const CharacterCard = ({ character }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href={`/character/${character.character_id}`} className="block group">
                        <div className="relative">
                            <div className="relative w-full aspect-[3/4] rounded-[14px] overflow-hidden">
                                {!imgError ? (
                                    <img
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        alt={character.russian || character.name}
                                        src={character.poster_url}
                                        onError={() => setImgError(true)}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                                        <span className="text-white/50">Нет изображения</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <div className="mt-3 space-y-1">
                                <h3 className="text-sm font-medium text-white/90 group-hover:text-white transition-colors duration-200">
                                    {character.russian || character.name}
                                </h3>
                                <p className="text-xs text-white/50">{character.japanese}</p>
                            </div>
                        </div>
                    </Link>
                </TooltipTrigger>
                <TooltipContent 
                    side="right"
                    sideOffset={20}
                    className="w-[400px] p-6 space-y-4 bg-black/95 backdrop-blur border border-white/5"
                >
                    <div className="space-y-3">
                        <h4 className="font-medium text-base text-white/90">
                            {character.russian || character.name}
                        </h4>
                        <p className="text-sm text-white/50">{character.japanese}</p>
                        {character.description && (
                            <p className="text-sm text-white/70 line-clamp-3">
                                {character.description}
                            </p>
                        )}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default CharacterCard;
