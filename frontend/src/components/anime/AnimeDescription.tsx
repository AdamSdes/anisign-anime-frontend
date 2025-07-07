'use client';

import React, { useState, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import animeService from '@/services/animeService';
import Image from 'next/image';
import Link from 'next/link';
import { Anime } from '@/types/anime';

interface AnimeDescriptionProps {
  description: string;
}

interface ParsedAnimeLink {
  id: string;
  title: string;
  fullMatch: string;
}

interface AnimePreview {
  id: string;
  data: Anime | null;
  loading: boolean;
  error: boolean;
}

/**
 * Компонент tooltip для предварительного просмотра аниме
 */
const AnimePreviewTooltip: React.FC<{ anime: Anime }> = ({ anime }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="w-80 bg-[#0A0A0A]/95 backdrop-blur-md rounded-xl overflow-hidden border border-white/10">
      {/* Баннер */}
      <div className="relative h-32 overflow-hidden">
        {anime.poster_url && (
          <>
            <Image
              src={anime.poster_url}
              alt={anime.russian || anime.english || ''}
              fill
              className={`object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              unoptimized={true}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-white/5 animate-pulse" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </>
        )}
        
        {/* Рейтинг в углу */}
        {anime.score > 0 && (
          <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm rounded-full px-2 py-1">
            <span className="text-yellow-400 text-sm font-medium">{anime.score.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Информация */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-white/95 leading-tight line-clamp-2">
            {anime.russian || anime.english}
          </h3>
          {anime.russian && anime.english && anime.russian !== anime.english && (
            <p className="text-xs text-white/60 mt-1">{anime.english}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {anime.kind && (
            <div>
              <span className="text-white/50">Тип:</span>
              <span className="ml-1 text-white/80">
                {anime.kind === 'tv' ? 'TV Сериал' : 
                 anime.kind === 'movie' ? 'Фильм' : 
                 anime.kind === 'ova' ? 'OVA' : 
                 anime.kind === 'ona' ? 'ONA' : 
                 anime.kind === 'special' ? 'Спешл' : anime.kind}
              </span>
            </div>
          )}
          
          {anime.status && (
            <div>
              <span className="text-white/50">Статус:</span>
              <span className="ml-1 text-white/80">
                {anime.status === 'ongoing' ? 'Онгоинг' : 
                 anime.status === 'released' ? 'Завершено' : 
                 anime.status === 'anons' ? 'Анонс' : anime.status}
              </span>
            </div>
          )}
          
          {anime.episodes > 0 && (
            <div>
              <span className="text-white/50">Эпизоды:</span>
              <span className="ml-1 text-white/80">{anime.episodes}</span>
            </div>
          )}
          
          {anime.aired_on && (
            <div>
              <span className="text-white/50">Год:</span>
              <span className="ml-1 text-white/80">
                {new Date(anime.aired_on).getFullYear()}
              </span>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-white/10">
          <span className="text-xs text-white/60">Нажмите, чтобы перейти к аниме</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Компонент ссылки на аниме с tooltip'ом
 */
const AnimeLink: React.FC<{ 
  animeId: string; 
  title: string; 
  preview: AnimePreview | null;
  onPreviewLoad: (id: string) => void;
}> = ({ animeId, title, preview, onPreviewLoad }) => {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered && !preview) {
      onPreviewLoad(animeId);
    }
  }, [isHovered, preview, animeId, onPreviewLoad]);

  const content = (
    <Link 
      href={`/anime/${animeId}`}
      className="text-[#CCBAE4] hover:text-[#CCBAE4]/80 transition-colors cursor-pointer font-semibold"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {title}
    </Link>
  );

  if (preview?.data) {
    return (
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent side="top" className="p-0">
          <AnimePreviewTooltip anime={preview.data} />
        </TooltipContent>
      </Tooltip>
    );
  }

  if (preview?.loading) {
    return (
      <span className="text-[#CCBAE4]/60 cursor-wait font-semibold">
        {title}
      </span>
    );
  }

  return content;
};

/**
 * Основной компонент для отображения описания с интерактивными ссылками
 */
export const AnimeDescription: React.FC<AnimeDescriptionProps> = ({ description }) => {
  const [animePreviews, setAnimePreviews] = useState<Record<string, AnimePreview>>({});

  // Функция для парсинга ссылок на аниме
  const parseAnimeLinks = (text: string): ParsedAnimeLink[] => {
    const animeRegex = /\[anime=(\d+)\]([^[]+)\[\/anime\]/g;
    const links: ParsedAnimeLink[] = [];
    let match;

    while ((match = animeRegex.exec(text)) !== null) {
      links.push({
        id: match[1],
        title: match[2],
        fullMatch: match[0],
      });
    }

    return links;
  };

  // Функция для загрузки предварительного просмотра аниме
  const loadAnimePreview = async (animeId: string) => {
    if (animePreviews[animeId]) return;

    setAnimePreviews(prev => ({
      ...prev,
      [animeId]: { id: animeId, data: null, loading: true, error: false }
    }));

    try {
      const animeData = await animeService.getAnimeById(animeId);
      
      setAnimePreviews(prev => ({
        ...prev,
        [animeId]: { id: animeId, data: animeData, loading: false, error: false }
      }));
    } catch (error) {
      console.error(`Ошибка при загрузке аниме ${animeId}:`, error);
      
      setAnimePreviews(prev => ({
        ...prev,
        [animeId]: { id: animeId, data: null, loading: false, error: true }
      }));
    }
  };

  // Функция для рендеринга текста с интерактивными ссылками
  const renderDescriptionWithLinks = (text: string) => {
    const animeLinks = parseAnimeLinks(text);
    
    if (animeLinks.length === 0) {
      return <div dangerouslySetInnerHTML={{ __html: text }} />;
    }

    let lastIndex = 0;
    const elements: React.ReactNode[] = [];

    animeLinks.forEach((link, index) => {
      const linkIndex = text.indexOf(link.fullMatch, lastIndex);
      
      // Добавляем текст до ссылки
      if (linkIndex > lastIndex) {
        const beforeText = text.substring(lastIndex, linkIndex);
        elements.push(
          <span key={`text-${index}`} dangerouslySetInnerHTML={{ __html: beforeText }} />
        );
      }

      // Добавляем интерактивную ссылку
      elements.push(
        <AnimeLink
          key={`anime-${link.id}-${index}`}
          animeId={link.id}
          title={link.title}
          preview={animePreviews[link.id] || null}
          onPreviewLoad={loadAnimePreview}
        />
      );

      lastIndex = linkIndex + link.fullMatch.length;
    });

    // Добавляем оставшийся текст
    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex);
      elements.push(
        <span key="text-end" dangerouslySetInnerHTML={{ __html: remainingText }} />
      );
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

export default AnimeDescription;
