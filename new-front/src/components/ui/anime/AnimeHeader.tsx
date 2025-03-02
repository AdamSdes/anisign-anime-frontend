import { Anime } from '@/shared/types/anime';
import { transformValue } from '@/lib/utils/transforms';
import { useTranslations } from 'next-intl';

interface AnimeHeaderProps {
    anime: Anime;
    className?: string;
}

export function AnimeHeader({ anime, className }: AnimeHeaderProps) {
    const t = useTranslations('common');
    return (
        <div className={className || 'space-y-2'}>
            <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white/90">
                    {anime.russian || anime.name}
                </h1>
                {anime.score && (
                    <div className="flex items-center gap-1 bg-white/[0.08] px-2.5 py-1 rounded-lg">
                        <span className="text-sm font-medium text-[#E4DBBA]">
                            {Number(anime.score).toFixed(1)}
                        </span>
                    </div>
                )}
            </div>
            <p className="text-sm text-white/60">
                {anime.english || transformValue('kind', anime.kind)}
            </p>
        </div>
    ); 
}