"use client";

import * as React from "react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Пропсы тултипа для персонажа
interface CharacterTooltipProps {
  id: string;
  name: string;
  imageUrl?: string;
}

// Пропсы тултипа для аниме
interface AnimeTooltipProps {
  id: string;
  name: string;
}

/**
 * Компонент тултипа для персонажа
 * @param props Пропсы тултипа
 */
export const CharacterTooltip: React.FC<CharacterTooltipProps> = ({ id, name, imageUrl }) => {
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
  );
};

/**
 * Компонент тултипа для аниме
 * @param props Пропсы тултипа
 */
export const AnimeTooltip: React.FC<AnimeTooltipProps> = ({ id, name }) => {
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
  );
};

/**
 * Преобразование строки описания в React-элементы с тултипами
 * @param description Исходная строка описания
 * @returns React-узлы с тултипами или исходный текст
 */
export const parseDescription = (description: string): React.ReactNode => {
  if (!description) return "";

  const parts = description.split(
    /(\[character=\d+\][^\[]+\[\/character\]|\[anime=\d+\][^\[]+\[\/anime\])/g
  );

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