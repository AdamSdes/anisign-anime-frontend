import { Anime } from '@/shared/types/anime';
import { useTranslations } from 'next-intl';

interface AnimePosterProps {
    anime: Anime;
    className?: string;
}
export function AnimePoster({ anime, className }: AnimePosterProps) {
    const t = useTranslations('common');
    return (
        <div className={className || 'relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-white/5'}>
            <img 
                src={anime.poster_url || '#'} 
                alt={anime.russian || anime.name}
                className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                    (e.target as HTMLImageElement).src=".../public/anime.png";
                }} 
            />
        </div>
    );
}