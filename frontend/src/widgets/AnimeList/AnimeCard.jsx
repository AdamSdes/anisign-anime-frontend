import Link from 'next/link';
import { useState } from 'react';
import {Image} from "@nextui-org/image";

const transformValue = (key, value) => {
    const transformations = {
        kind: {
            tv: 'ТВ Сериал',
            tv_special: 'ТВ Спешл',
            movie: 'Фильм',
            ova: 'OVA',
            ona: 'ONA',
            special: 'Спешл',
            music: 'Клип'
        },
        status: {
            released: 'Вышел',
            ongoing: 'Онгоинг',
            announced: 'Анонсировано'
        },
        rating: {
            g: 'G',
            pg: 'PG',
            pg_13: 'PG-13',
            r: 'R-17',
            r_plus: 'R+',
            rx: 'Rx'
        },
        season: (value) => {
            const [season, year] = value.split('_');
            const seasons = {
                winter: 'Зима',
                spring: 'Весна',
                summer: 'Лето',
                fall: 'Осень'
            };
            return `${seasons[season]} ${year}`;
        }
    };

    if (key === 'season' && value) {
        return transformations.season(value);
    }

    if (key in transformations && value in transformations[key]) {
        return transformations[key][value];
    }
    return value;
};

const AnimeCard = ({ anime }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="relative flex w-full flex-col gap-2">
            <div className="relative w-full overflow-hidden rounded-[14px] bg-muted" style={{ aspectRatio: '3 / 4' }}>
                <Link href={`/anime/${anime.anime_id}`}>
                    <div className="">
                        {!imgError ? (
                            <img
                                isZoomed
                                className="w-full h-full object-cover"
                                alt={anime.russian || anime.russian}
                                src={anime.poster_url}
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-default-100">
                                <span className="text-default-500">Изображение недоступно</span>
                            </div>
                        )}
                    </div>
                </Link>
            </div>
            <div className="flex flex-col gap-1">
                <Link href={`/anime/${anime.anime_id}`}>
                    <h3 className="font-semibold text-[14px] line-clamp-2 hover:text-primary transition-colors">
                        {(anime.russian || anime.russian).length > 24 
                            ? (anime.russian || anime.russian).substring(0, 24) + '...'
                            : (anime.russian || anime.russian)
                        }
                    </h3>
                </Link>
                <div className="flex gap-2 text-sm text-default-500">
                    <span>{new Date(anime.released_on).getFullYear()}</span>
                    <span>•</span>
                    <span>{transformValue('kind', anime.kind)}</span>
                </div>
            </div>
        </div>
    );
};

export default AnimeCard;
