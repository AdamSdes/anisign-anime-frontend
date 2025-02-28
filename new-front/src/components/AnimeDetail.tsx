import { Anime } from '@/shared/types/anime';
import AnimeDescription from './anime/AnimeDescription';
import AnimeHeader from './anime/AnimeHeader';
import AnimePoster from './anime/AnimePoster';
import GenreList from './anime/GenreList';
import InfoBlock from './anime/InfoBlock';
import NextEpisode from './anime/NextEpisode';
import Button from '@/components/ui/button';
import { useTranslations } from 'next-intl';

type TranslationFunction = ReturnType<typeof useTranslations>;

interface AnimeDetailProps {
    anime: Anime;
}

/**
 * Компонент деталей аниме
 * @param anime Данные аниме
 */
const AnimeDetail = ({ anime }: AnimeDetailProps) => {
    const t = useTranslations('anime') as TranslationFunction;
    return (
        <div className="anime-detail">
            <div className="flex flex-col md:flex-row gap-6">
                <AnimePoster posterUrl={anime.poster_url} altText={anime.russian} />
                <div className="anime-detail-content">
                    <AnimeHeader name={anime.name} russian={anime.russian} />
                    <GenreList genreIds={anime.genre_ids} />
                    <div className="animedetail-genres">
                        <span className="anime-detail-rating">{anime.rating}</span>
                    </div>
                    <InfoBlock
                        score={anime.score}
                        status={anime.status}
                        kind={anime.status}
                        episodes={anime.episodes}
                    />
                    <AnimeDescription description={anime.description} />
                    <NextEpisode NextEpisodeAt={anime.next_episode_at} animeId={anime.anime_id} userId={anime.anime_id} />
                </div>
            </div>
            <div className="anime-detail-episodes">
                <h2 className="anime-detail-episodes-title">{t('episodes')}</h2>
                <div className="anime-detail-episodes-grid">
                    {Array.from({ length: anime.episodes }, (_, i) => i + 1).map((episodeNum) => (
                        <div 
                            key={episodeNum}
                            className="anime-detail-episode animate-pulse skeleton"
                        >
                            <span className="text-white">Серия {episodeNum}</span>
                            <Button
                                variant="primary"
                                //TODO: Заменить АПИ на нормальный
                                onClick={() => {
                                    fetch(`/api/anime/update-current-episode/${anime.anime_id}/for-user/1`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ episode: episodeNum }),
                                    });
                                }}
                            >
                                {t('watch')}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnimeDetail;