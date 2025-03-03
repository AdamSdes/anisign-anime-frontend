import { Anime } from '@/shared/types/anime';
import { useTranslations } from 'next-intl';

interface NextEpisodeProps {
    anime: Anime;
    className?: string;
}
export function NextEpisode({ anime, className }: NextEpisodeProps) {
    const t = useTranslations('common');
    if (!anime.next_episode_at) {
        return (
            <p className={className || 'text-white/40'}>
                {t('noNextEpisode')}
            </p>
        )
    }
    const NextEpisodeDate = new Date(anime.next_episode_at);
    const formattedDate = NextEpisodeDate.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
    });
    return (
        <div className={className || 'flex items-center gap-2 text-sm text-white/60'}>
            <span>
                {t('nextEpisode')} {formattedDate}
            </span>
        </div>
    )
}