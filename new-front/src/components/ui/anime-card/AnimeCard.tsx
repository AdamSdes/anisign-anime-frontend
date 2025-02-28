import Link from 'next/link';
import { Anime, Genre } from '@/shared/types/anime';
import { transformValue } from '@/lib/utils/transforms';
import { useTranslations } from 'next-intl';
import { Tooltip } from '@/components/ui/tooltip/Tooltip';
import { TooltipContent } from '@/components/ui/tooltip/TooltipContent';
import { TooltipTrigger } from '@/components/ui/tooltip/TooltipTrigger';
import { TooltipProvider } from '@/components/ui/tooltip/TooltipProvider';
import { useRef } from 'react';
import { Star, Calendar, Play } from '@/shared/icons';

interface AnimeCardProps {
  anime: Anime;
  genres: Genre[];
  priority?: boolean;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime, genres, priority = false }) => {
  const t = useTranslations('common');
  const triggerRef = useRef<HTMLAnchorElement>(null); 

  const getYear = (date: string) => new Date(date).getFullYear();
  const truncateTitle = (title: string, maxLength: number = 21) =>
    title.length <= maxLength ? title : `${title.slice(0, maxLength)}...`;
  const getGenreName = (genreId: string, genres: Genre[]): string =>
    genres.find((g) => g.genre_id === genreId)?.russian || genres.find((g) => g.genre_id === genreId)?.name || t('unknown');

  const renderTooltipContent = () => (
    <div className="w-[340px] space-y-5 p-1">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-medium leading-tight text-white/90">
            {anime.russian || anime.name}
          </h3>
          {anime.score && (
            <div className="flex items-center gap-1.5 bg-white/[0.08] px-2.5 py-1 rounded-lg">
              <Star className="w-3.5 h-3.5 text-[#E4DBBA]" />
              <span className="text-sm font-medium text-[#E4DBBA]">
                {Number(anime.score).toFixed(1)}
              </span>
            </div>
          )}
        </div>
        <p className="text-[13px] text-white/40 leading-tight">{anime.name}</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <span className="text-[11px] uppercase tracking-wider text-white/40 font-medium">{t('type')}</span>
          <p className="text-[13px] text-white/90 font-medium">{transformValue('kind', anime.kind)}</p>
        </div>
        {anime.episodes > 0 && (
          <div className="space-y-1.5">
            <span className="text-[11px] uppercase tracking-wider text-white/40 font-medium">{t('episodes')}</span>
            <p className="text-[13px] text-white/90 font-medium">{anime.episodes} {t('episodes')}</p>
          </div>
        )}
        {anime.aired_on && (
          <div className="space-y-1.5">
            <span className="text-[11px] uppercase tracking-wider text-white/40 font-medium">{t('year')}</span>
            <p className="text-[13px] text-white/90 font-medium">{getYear(anime.aired_on)}</p>
          </div>
        )}
      </div>
      {anime.genre_ids && anime.genre_ids.length > 0 && (
        <div className="space-y-2">
          <span className="text-[11px] uppercase tracking-wider text-white/40 font-medium">{t('genres')}</span>
          <div className="flex flex-wrap gap-1.5">
            {anime.genre_ids
              .map((genreId) => ({ id: genreId, name: getGenreName(genreId, genres) }))
              .filter((genre) => genre.name)
              .map((genre) => (
                <span
                  key={genre.id}
                  className="px-2.5 py-1 text-[12px] rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white/90"
                >
                  {genre.name}
                </span>
              ))}
          </div>
        </div>
      )}
      {anime.description && (
        <div className="space-y-2">
          <span className="text-[11px] uppercase tracking-wider text-white/40 font-medium">{t('description')}</span>
          <p className="text-[13px] leading-relaxed text-white/70 line-clamp-4">{anime.description}</p>
        </div>
      )}
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip delayDuration={700} skipDelayDuration={0}>
        <TooltipTrigger asChild>
          <Link href={`/anime/${anime.anime_id}`}>
            <div className="group relative">
              {anime.score && (
                <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-black backdrop-blur-sm rounded-full px-2.5 py-1">
                  <Star className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">{anime.score.toFixed(1)}</span>
                </div>
              )}
              <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-white/5">
                <img
                  src={anime.poster_url || '/images/anime-png.jpg'}
                  alt={anime.russian || anime.name}
                  className="object-cover transition-transform duration-300 scale-105 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/anime-png.jpg';
                  }}
                />
              </div>
              <div className="mt-3 space-y-1">
                <h3 className="text-sm font-medium line-clamp-2 text-white/90 group-hover:text-white">
                  {truncateTitle(anime.russian || anime.name)}
                </h3>
                <div className="flex items-center text-xs text-white/50 gap-2">
                  <span>{transformValue('kind', anime.kind)}</span>
                  {anime.aired_on && (
                    <>
                      <div className="w-1 h-1 rounded-full bg-white/20" />
                      <span>{getYear(anime.aired_on)}</span>
                    </>
                  )}
                  {anime.episodes > 0 && (
                    <>
                      <div className="w-1 h-1 rounded-full bg-white/20" />
                      <span>{anime.episodes} {t('episodes')}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </TooltipTrigger>
        <TooltipContent 
            triggerRef={
                triggerRef as unknown as React.RefObject<HTMLDivElement> 
            }
            side="right" 
            className="bg-[#060606] border border-white/5 p-6 rounded-xl" 
            sideOffset={16}
        >
          {renderTooltipContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};