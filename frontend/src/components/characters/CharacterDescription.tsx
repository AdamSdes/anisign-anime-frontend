'use client';

import React, { useState, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import characterService from '@/services/characterService';
import Image from 'next/image';
import Link from 'next/link';
import { Character } from '@/types/character';

interface CharacterDescriptionProps {
  description: string;
}

interface ParsedCharacterLink {
  id: string;
  title: string;
  fullMatch: string;
}

interface CharacterPreview {
  id: string;
  data: Character | null;
  loading: boolean;
  error: boolean;
}

/**
 * Компонент tooltip для предварительного просмотра персонажа
 */
const CharacterPreviewTooltip: React.FC<{ character: Character }> = ({ character }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className='w-80 bg-[#0A0A0A]/95 backdrop-blur-md rounded-xl overflow-hidden border border-white/10'>
      {/* Изображение персонажа */}
      <div className='relative h-40 overflow-hidden'>
        {character.poster_url && (
          <>
            <Image
              src={character.poster_url}
              alt={character.russian || character.name}
              fill
              className={`object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              unoptimized={true}
            />
            {!imageLoaded && <div className='absolute inset-0 bg-white/5 animate-pulse' />}
            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />
          </>
        )}
      </div>

      {/* Информация о персонаже */}
      <div className='p-4 space-y-3'>
        <div>
          <h3 className='font-semibold text-white/95 leading-tight line-clamp-2'>
            {character.russian || character.name}
          </h3>
          {character.japanese && character.japanese !== (character.russian || character.name) && (
            <p className='text-xs text-white/60 mt-1'>{character.japanese}</p>
          )}
        </div>

        {character.description && (
          <div className='space-y-2'>
            <p className='text-xs text-white/70 line-clamp-4 leading-relaxed'>
              {character.description
                .replace(/<[^>]*>/g, '')
                .replace(/\[spoiler(?:=[^\]]+)?\].*?\[\/spoiler\]/g, '[Скрыто]')
                .replace(/\[url=.*?\].*?\[\/url\]/g, '')
                .replace(/\[character=.*?\].*?\[\/character\]/g, '')
                .substring(0, 200)}
              ...
            </p>
          </div>
        )}

        <div className='pt-2 border-t border-white/10'>
          <span className='text-xs text-white/60'>Нажмите, чтобы перейти к персонажу</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Компонент ссылки на персонажа с tooltip'ом
 */
const CharacterLink: React.FC<{
  characterId: string;
  title: string;
  preview: CharacterPreview | null;
  onPreviewLoad: (id: string) => void;
}> = ({ characterId, title, preview, onPreviewLoad }) => {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered && !preview) {
      onPreviewLoad(characterId);
    }
  }, [isHovered, preview, characterId, onPreviewLoad]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const content = (
    <Link
      href={`/characters/${characterId}`}
      className='text-[#CCBAE4] hover:text-[#CCBAE4]/80 transition-colors cursor-pointer font-semibold inline-block relative z-[100]'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {title}
    </Link>
  );

  if (preview?.data) {
    return (
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side='top' className='p-0 z-[110]'>
          <CharacterPreviewTooltip character={preview.data} />
        </TooltipContent>
      </Tooltip>
    );
  }

  if (preview?.loading) {
    return <span className='text-[#CCBAE4]/60 cursor-wait font-semibold'>{title}</span>;
  }

  return content;
};

/**
 * Основной компонент для отображения описания с интерактивными ссылками
 */
export const CharacterDescription: React.FC<CharacterDescriptionProps> = ({ description }) => {
  const [characterPreviews, setCharacterPreviews] = useState<Record<string, CharacterPreview>>({});

  // Функция для парсинга ссылок на персонажей
  const parseCharacterLinks = (text: string): ParsedCharacterLink[] => {
    const characterRegex = /\[character=(\d+)\]([^[]+)\[\/character\]/g;
    const links: ParsedCharacterLink[] = [];
    let match;

    while ((match = characterRegex.exec(text)) !== null) {
      links.push({
        id: match[1],
        title: match[2],
        fullMatch: match[0],
      });
    }

    return links;
  };

  // Функция для загрузки предварительного просмотра персонажа
  const loadCharacterPreview = async (characterId: string) => {
    if (characterPreviews[characterId]) return;

    setCharacterPreviews((prev) => ({
      ...prev,
      [characterId]: { id: characterId, data: null, loading: true, error: false },
    }));

    try {
      const characterData = await characterService.getCharacterById(characterId);

      setCharacterPreviews((prev) => ({
        ...prev,
        [characterId]: { id: characterId, data: characterData, loading: false, error: false },
      }));
    } catch (error) {
      console.error(`Ошибка при загрузке персонажа ${characterId}:`, error);

      setCharacterPreviews((prev) => ({
        ...prev,
        [characterId]: { id: characterId, data: null, loading: false, error: true },
      }));
    }
  };

  // Функция для рендеринга текста с интерактивными ссылками
  const renderDescriptionWithLinks = (text: string) => {
    // Обрабатываем URL ссылки
    const processedText = text.replace(
      /\[url=(.*?)\](.*?)\[\/url\]/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">$2</a>'
    );

    const characterLinks = parseCharacterLinks(processedText);

    if (characterLinks.length === 0) {
      return <div dangerouslySetInnerHTML={{ __html: processedText }} />;
    }

    let lastIndex = 0;
    const elements: React.ReactNode[] = [];

    characterLinks.forEach((link, index) => {
      const linkIndex = processedText.indexOf(link.fullMatch, lastIndex);

      // Добавляем текст до ссылки
      if (linkIndex > lastIndex) {
        const beforeText = processedText.substring(lastIndex, linkIndex);
        elements.push(
          <span key={`text-${index}`} dangerouslySetInnerHTML={{ __html: beforeText }} />
        );
      }

      // Добавляем интерактивную ссылку
      elements.push(
        <CharacterLink
          key={`character-${link.id}-${index}`}
          characterId={link.id}
          title={link.title}
          preview={characterPreviews[link.id] || null}
          onPreviewLoad={loadCharacterPreview}
        />
      );

      lastIndex = linkIndex + link.fullMatch.length;
    });

    // Добавляем оставшийся текст
    if (lastIndex < processedText.length) {
      const remainingText = processedText.substring(lastIndex);
      elements.push(<span key='text-end' dangerouslySetInnerHTML={{ __html: remainingText }} />);
    }

    return <>{elements}</>;
  };

  if (!description || !description.trim()) {
    return (
      <div className='h-[220px] rounded-xl flex items-center justify-center'>
        <div className='text-center space-y-2'>
          <p className='text-[24px]'>😢</p>
          <p className='text-white/40'>Описание отсутствует</p>
        </div>
      </div>
    );
  }

  return (
    <div className='text-white/70 text-[15px] leading-relaxed'>
      {renderDescriptionWithLinks(description)}
    </div>
  );
};

export default CharacterDescription;
