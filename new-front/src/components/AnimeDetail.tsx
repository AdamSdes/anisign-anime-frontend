import { Anime, Genre } from '@/shared/types/anime';
import { AnimeDescription } from '@/components/ui/anime/AnimeDescription';
import { AnimeHeader } from '@/components/ui/anime/AnimeHeader';
import { AnimePoster } from '@/components/ui/anime/AnimePoster';
import { GenreList } from '@/components/ui/anime/GenreList';
import { InfoBlock } from '@/components/ui/anime/InfoBlock';
import { NextEpisode } from '@/components/ui/anime/NextEpisode';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

interface AnimeDetailProps {
    anime: Anime;
    genres: Genre[];
    className?: string;
}
export function AnimeDetails({ anime, genres, className }: AnimeDetailProps) {
    const t = useTranslations('common');
    return (
        <motion.div 
            className={className || 'space-y-8'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <AnimePoster anime={anime} className="w-full" />
            <div className="space-y-6">
                <AnimeHeader anime={anime} />
                <AnimeDescription anime={anime} />
                <GenreList anime={anime} genres={genres} />
                <InfoBlock anime={anime} />
                <NextEpisode anime={anime} />
            </div>
        </motion.div>
    );
}