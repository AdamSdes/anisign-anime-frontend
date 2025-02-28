import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Anime } from '@/shared/types/anime';

type TranslationFunction = ReturnType<typeof useTranslations>;

interface CalendarProps {
    animeReleases: Anime[];
}

/**
 * Компонент календаря с релизами
 * @param animeReleases Список аниме с датами релизов
 */
const Calendar = ({ animeReleases }: CalendarProps) => {
    const t = useTranslations('common') as TranslationFunction;
    const [selectedDay, setSelectedDay] = useState(new Date().getDay());
    const daysOfWeek = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
      ].map((day) => t(`day_${day}`));
    const filteredAnime = animeReleases.filter((anime) => {
        let releaseDay: number | null = null;
        if (anime.next_episode_at) {
            releaseDay = new Date(anime.next_episode_at).getDay();
        }
        return releaseDay === selectedDay;
    });
    return (
        <div className="calendar background-placeholder">
            <div className="calendar-day-buttons">
                {daysOfWeek.map((day, index) => (
                    <button 
                        key={day}
                        onClick={() => setSelectedDay(index)}
                        className={`${selectedDay === index ? 'calendar-day-button-active' : 'calendar-day-button calendar-day-button-inactive'}`}
                    >
                        {day}
                    </button>
                ))}
            </div>
            <div className="anime-grid">
                {filteredAnime.map((anime) => (
                    <div 
                        key={anime.anime_id}
                        className="calendar-anime-card animate-pulse skeleton"
                    >
                        <div className="animate-pulse skeleton h-48 w-full rounded-md"></div>
                        <img 
                            src={anime.poster_url || '.../public/anime.png'} 
                            alt={anime.russian || anime.name}
                            className="card-image hidden skeleton-loaded"
                            loading="lazy"
                            onLoad={(e) => e.currentTarget.className = 'card-image skeleton-loaded'} 
                        />
                        <p className="card-title">{anime.russian || anime.name}</p>
                        <p className="card-info">
                            {anime.next_episode_at ? new Date(anime.next_episode_at).toLocaleTimeString() : 'Дата неизвестна'}
                        </p>    
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar;