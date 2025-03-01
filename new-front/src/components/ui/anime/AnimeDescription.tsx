import { Anime } from '@/shared/types/anime';
import { transformDescription } from '@/lib/utils/transforms';
import { useTranslations } from 'next-intl';

interface AnimeDescriptionProps {
    anime: Anime;
    className?: string;
}
export function AnimeDescription({ anime, className }: AnimeDescriptionProps) {
    const t = useTranslations('common');
    if (!anime.description) {
        return (
            <p className={className || 'text-white/40'}>
                {t('noDescription')}
            </p>
        );
    }
    return (
        <div className={className || 'space-y-2'}>
            <h3 className="text-[15px] font-medium text-white/90">
                {t('description')}
            </h3>
            <p className="text-[13px] leading-relaxed text-white/70 line-clamp-4">
                {transformDescription(anime.description)}
            </p>  
        </div>
    );
}