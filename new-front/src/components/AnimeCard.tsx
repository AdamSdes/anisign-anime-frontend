'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Anime } from '@/shared/types/anime';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Star, Calendar } from '@/shared/icons';
import { animeService } from '@/services/anime';

interface AnimeCardProps {
  animeId: string;
  className?: string;
}

export function AnimeCard({ animeId, className }: AnimeCardProps) {
  const t = useTranslations('common');
  const router = useRouter();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const data = await animeService.getAnimeDetails(animeId);
        setAnime(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || t('errorLoadingAnime'));
        } else {
          setError(t('errorLoadingAnime'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [animeId, t]);

  if (loading) {
    return (
      <div className={className || 'w-full max-w-sm h-96 bg-black/90 animate-pulse rounded-xl border border-white/5'}>
        <div className="h-3/4 bg-white/5 rounded-t-xl" />
        <div className="h-1/4 p-4 space-y-2">
          <div className="h-4 bg-white/5 rounded" />
          <div className="h-3 bg-white/5 rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className={className || 'w-full max-w-sm h-96 flex flex-col items-center justify-center bg-black/90 rounded-xl border border-white/5'}>
        <p className="text-sm text-white/60">
          {error || t('animeNotFound')}
        </p>
      </div>
    );
  }

  const handleClick = () => {
    router.push(`/anime/${animeId}`);
  };

  const formatReleaseDate = (releaseDate: string | null): string => {
    if (!releaseDate) {
      return t('noReleaseDate');
    }
    try {
      return new Date(releaseDate).toLocaleDateString();
    } catch (error) {
      return t('invalidDate'); 
    }
  };

  return (
    <div
      className={className || 'w-full max-w-sm h-96 bg-black/90 rounded-xl border border-white/5 shadow-lg hover:shadow-xl transition-shadow cursor-pointer'}
      onClick={handleClick}
    >
      <div className="relative h-3/4">
        <Image
          src={anime.poster_url || '/placeholder-anime.png'}
          alt={anime.russian || anime.name}
          fill
          className="rounded-t-xl object-cover"
        />
      </div>
      <div className="h-1/4 p-4 space-y-2">
        <h3 className="text-lg font-medium text-white/90 line-clamp-1">
          {anime.russian || anime.name}
        </h3>
        <div className="flex items-center gap-2 text-sm text-white/60">
          <Star className="text-yellow-500" />
          <span>{anime.rating || t('noRating')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/60">
          <Calendar className="text-gray-400" />
          <span>{formatReleaseDate(anime.released_on)}</span>
        </div>
      </div>
    </div>
  );
}