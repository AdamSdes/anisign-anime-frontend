import { Anime } from '@/shared/types/anime';
import { transformValue } from '@/lib/utils/transforms';
import { useTranslations } from 'next-intl';
import { Star, Calendar } from '@/shared/icons';

interface InfoBlocProps {
    anime: Anime;
    className?: string;
}
export function InfoBlock({ anime, className }: InfoBlocProps) {
    const t = useTranslations('common');
    return (
        <div className={className || 'flex flex-wraap gap-4'}>
            {anime.score && (
                <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#E4DBBA]" />
                    <span className="text-sm font-medium text-white/80">
                        {t('rating', { score: Number(anime.score).toFixed(1) })}
                    </span>
                </div>
            )}
            {anime.aired_on && (
                <div className="flex items-center gap-2 text-sm text-white/60">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(anime.aired_on).getFullYear()}</span>
                </div>
            )}
            {anime.kind && (
                <div className="flex items-center gap-2 text-sm text-white/60">
                    <span>{transformValue('kind', anime.kind)}</span>
                </div>
            )}
            {anime.episodes && (
                <div className="flex items-center gap-2 text-sm text-white/60">
                    <span>{anime.episodes} {t('episodes')}</span>
                </div>
            )}
        </div>
    );
}