'use client';

import React from 'react';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip/tooltip';

interface CharacterTooltipProps {
  id: string;
  name: string;
  imageUrl?: string;
}

interface AnimeTooltipProps {
  id: string;
  name: string;
}

/**
 * Компонент тултипа для персонажа
 * @param props Пропсы персонажа
 */
export const CharacterTooltip: React.FC<CharacterTooltipProps> = ({ id, name, imageUrl }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={`/character/${id}`} className="text-[#CCBAE4] hover:underline cursor-pointer">
            {name}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[300px] p-4">
          <div className="flex gap-4 items-center">
            {imageUrl && (
              <img src={imageUrl} alt={name} className="w-12 h-12 object-cover rounded" loading="lazy" />
            )}
            <p>Персонаж: {name}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

/**
 * Компонент тултипа для аниме
 * @param props Пропсы аниме
 */
export const AnimeTooltip: React.FC<AnimeTooltipProps> = ({ id, name }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={`/anime/${id}`} className="text-[#CCBAE4] hover:underline cursor-pointer">
            {name}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[300px] p-4">
          <p>Перейти к аниме: {name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

/**
 * Трансформация описания в React-компоненты с тултипами
 * @param description Исходное описание
 * @returns React-узлы с преобразованным текстом
 */
export const transformDescription = (description: string): React.ReactNode => {
  if (!description) return '';

  const parts = description.split(/(\[character=\d+\][^\[]+\[\/character\]|\[anime=\d+\][^\[]+\[\/anime\])/g);

  return parts.map((part, index) => {
    const characterMatch = part.match(/\[character=(\d+)\]([^\[]+)\[\/character\]/);
    const animeMatch = part.match(/\[anime=(\d+)\]([^\[]+)\[\/anime\]/);

    if (characterMatch) {
      const [, id, name] = characterMatch;
      return <CharacterTooltip key={`char-${index}`} id={id} name={name} />;
    }

    if (animeMatch) {
      const [, id, name] = animeMatch;
      return <AnimeTooltip key={`anime-${index}`} id={id} name={name} />;
    }

    return part;
  });
};