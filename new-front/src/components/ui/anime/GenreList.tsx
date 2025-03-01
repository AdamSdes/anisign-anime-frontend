import { Anime, Genre } from '@/shared/types/anime';
import { useTranslations } from 'next-intl';

interface GenreListProps {
    anime: Anime;
    genres: Genre[];
    className?: string;
}

export function GenreList({ anime, genres, className}: GenreListProps) {
    const t = useTranslations('common');
    if (!anime.genre_ids || anime.genre_ids.length === 0) {
        return (
            <p className={className || 'text-white/40'}>
                {t('noGenre')}
            </p>
        );
    }
    return (
        <div className={className || 'flex flex-wrap gap-2'}>
            {anime.genre_ids.map((genreId) => {
                const genre = genres.find((g) => g.genre_id === genreId);
                if (!genre) return null;
                return (
                    <span 
                        key={genreId}
                        className="px-2.5 py-1 text-[12px] rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/70 hover:bg-white/[0.06] hover:text-white/90 transition-colors duration-200"
                    >
                        {genre.russian || genre.name || t('unknown')}
                    </span>
                );
            })}
        </div>
    );
}