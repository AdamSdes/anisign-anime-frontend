'use client';
import React from 'react';
import { Card, Image, Select, SelectItem } from "@nextui-org/react";
import { AButton } from "@/shared/anisign-ui/Button";
import Link from "next/link";
import InfoItem from "@/widgets/AnimeDetails/InfoItem";
import ImageGallery from "@/widgets/AnimeDetails/ImageGallery";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

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

export default function AnimeDetails({ anime }) {
    if (!anime) return null;

    return (
        <section className="flex flex-col lg:flex-row gap-[38px] justify-between">
            {/* Левая колонка с изображением и кнопками */}
            <article className="flex flex-col gap-5 items-center lg:items-start">
                <Card className="w-[315px] h-[454px] rounded-[16px]" aria-labelledby="anime-title">
                    <Image
                        isZoomed
                        removeWrapper
                        alt={anime.russian || anime.russian}
                        className="w-full h-full object-cover"
                        src={anime.poster_url}
                    />
                </Card>

                <div className="flex flex-col gap-5 w-full max-w-[315px]">
                    <div className="flex gap-3 justify-between">
                        <AButton color="border" className="h-[65px]">
                            Отзывы
                        </AButton>
                        <AButton color="gray" className="h-[65px]">
                            Написать отзыв
                        </AButton>
                    </div>
                </div>
            </article>

            {/* Центр с основной информацией об аниме */}
            <article className="flex w-full flex-col gap-[30px]">
                {anime.nextEpisodeAt && (
                    <div className="flex justify-between items-center p-5 bg-[#BFF6F9]/5 rounded-[14px]">
                        <p className="text-[#BFF6F9]/60 text-[14px]">Следующий эпизод</p>
                        <p className="text-[#BFF6F9] text-[14px]">{new Date(anime.nextEpisodeAt).toLocaleString()}</p>
                    </div>
                )}

                {/* Заголовок и рейтинг */}
                <header className="flex justify-between items-center">
                    <div className="flex flex-col gap-2">
                        <h1 id="anime-title" className="text-[32px] font-bold">{anime.russian || anime.russian}</h1>
                        <p className="opacity-60 text-[12px]">{anime.english}</p>
                    </div>
                    <div className="bg-[#FDE5B9]/10 h-fit text-[#FDE5B9] flex items-center rounded-[40px] w-fit px-[15px] py-[10px]">
                        {anime.score}
                    </div>
                </header>

                {/* Описание аниме */}
                <ScrollShadow hideScrollBar className="w-full h-[150px]">
                    <p className="opacity-80">{anime.description}</p>
                </ScrollShadow>
            </article>

            {/* Вертикальная разделительная линия на больших экранах */}
            <div className="hidden lg:block w-[1px] min-h-[624px] bg-white/5"></div>

            {/* Правая колонка с дополнительной информацией */}
            <aside className="flex flex-col gap-[20px]">
                <div className="flex flex-col w-[320px] gap-[10px]">
                    <InfoItem label="Тип" value={transformValue('kind', anime.kind)} />
                    <InfoItem label="Эпизодов" value={anime.episodes} />
                    <InfoItem label="Статус" value={transformValue('status', anime.status)} />
                    <InfoItem label="Рейтинг" value={transformValue('rating', anime.rating)} />
                    <InfoItem label="Длительность" value={`${anime.duration} мин.`} />
                    <InfoItem label="Сезон" value={transformValue('season', anime.season)} />
                    <InfoItem label="Дата выхода" value={new Date(anime.aired_on).toLocaleDateString()} />
                    {anime.released_on && (
                        <InfoItem label="Дата завершения" value={new Date(anime.released_on).toLocaleDateString()} />
                    )}
                </div>
            </aside>
        

        </section>
    );
}
