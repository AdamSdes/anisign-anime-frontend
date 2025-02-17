"use client";
import Image from 'next/image';
import Link from 'next/link';
import { FC, useState } from 'react';
import { Character } from '@/lib/api/character';

interface CharacterCardProps extends Character {}

export const CharacterCard: FC<CharacterCardProps> = ({ 
  character_id,
  name, 
  russian, 
  japanese, 
  poster_url
}) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);

  const truncateTitle = (title: string, maxLength: number = 21) => {
    if (!title) return '';
    if (title.length <= maxLength) return title;
    return title.slice(0, maxLength) + '...';
  };

  return (
    <Link href={`/characters/${character_id}`}>
      <div className="group relative">
        {/* Image Container */}
        <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-white/5">
          {imgLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/5">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            </div>
          )}
          
          {!imgError ? (
            <Image
              src={poster_url}
              alt={russian || name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              className={`object-cover transition-transform duration-300 scale-105 group-hover:scale-110 ${
                imgLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onError={() => {
                setImgError(true);
                setImgLoading(false);
              }}
              onLoad={() => setImgLoading(false)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-white/5">
              <span className="text-white/40">Нет изображения</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-3 space-y-1.5">
          <h3 className="text-sm font-medium line-clamp-1 text-white/90 group-hover:text-white transition-colors">
            {truncateTitle(russian || name)}
          </h3>
          <div className="space-y-1">
            {name && name !== russian && (
              <p className="text-xs text-white/50 line-clamp-1">
                {truncateTitle(name)}
              </p>
            )}
            {japanese && (
              <p className="text-xs text-white/30 line-clamp-1 font-japanese">
                {truncateTitle(japanese)}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
