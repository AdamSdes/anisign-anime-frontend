'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useCallback, useEffect } from 'react';
import { Character } from '@/types/character';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface CharacterCardProps {
  character: Character;
  index?: number;
}

const CharacterTooltip: React.FC<{ character: Character }> = ({ character }) => {
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

export default function CharacterCard({ character, index = 0 }: CharacterCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Плавное появление карточки с задержкой
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 50);

    return () => clearTimeout(timer);
  }, [index]);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  return (
    <Tooltip delayDuration={500}>
      <TooltipTrigger asChild>
        <div
          className={`group relative flex w-full flex-col gap-2 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{
            transitionDelay: imageLoaded ? '0ms' : `${index * 50}ms`,
          }}
        >
          <div style={{ position: 'relative', width: '100%', paddingBottom: '142.857%' }}>
            <div
              className='relative w-full overflow-hidden rounded-xl bg-muted'
              style={{ position: 'absolute', inset: 0 }}
            >
              <Link
                className='absolute left-0 top-0 flex size-full items-center justify-center rounded-md bg-secondary/20'
                href={`/characters/${character.character_id}`}
              >
                {!imageError ? (
                  <>
                    <Image
                      src={character.poster_url}
                      alt={character.russian || character.name}
                      fill
                      sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
                      className={`size-full object-cover !transition-all duration-500 scale-105 group-hover:scale-115 ${
                        imageLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                      onError={handleImageError}
                      onLoad={handleImageLoad}
                      priority={index < 12}
                      unoptimized={true}
                    />

                    {!imageLoaded && (
                      <div className='absolute inset-0 bg-white/5 animate-pulse rounded-xl' />
                    )}
                  </>
                ) : (
                  <div className='w-full h-full flex items-center justify-center bg-[#1e1e1e] text-white/50'>
                    <div className='text-center space-y-2'>
                      <svg
                        width='32'
                        height='32'
                        viewBox='0 0 24 24'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        className='mx-auto'
                      >
                        <path
                          d='M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z'
                          stroke='currentColor'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                        <path
                          d='M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22'
                          stroke='currentColor'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                      <p className='text-xs'>Нет изображения</p>
                    </div>
                  </div>
                )}
              </Link>
            </div>
          </div>

          <Link
            className={`mt-1 truncate transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            href={`/characters/${character.character_id}`}
          >
            <label className='text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer leading-5'>
              {character.russian || character.name}
            </label>
            {character.japanese && (
              <div className='mt-1 flex cursor-pointer items-center gap-2'>
                <label className='font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-xs text-muted-foreground line-clamp-1'>
                  {character.japanese}
                </label>
              </div>
            )}
          </Link>
        </div>
      </TooltipTrigger>

      <TooltipContent side='right' className='p-0'>
        <CharacterTooltip character={character} />
      </TooltipContent>
    </Tooltip>
  );
}
