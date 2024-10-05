'use client';
import React from 'react';
import { Card, Image, Select, SelectItem } from "@nextui-org/react";
import { AButton } from "@/shared/anisign-ui/Button";
import Link from "next/link";
import InfoItem from "@/widgets/AnimeDetails/InfoItem";
import animeData from '/animeData.json';
import { ScrollShadow } from "@nextui-org/scroll-shadow";

export default function AnimeDetails() {
    const { title, originalTitle, rating, description, nextEpisode, tags, infoItems, users } = animeData.animeDetails;

    return (
        <main className="container mx-auto max-w-[1400px] px-4 py-10">
            <section className="flex flex-col lg:flex-row gap-[38px] justify-between">
                {/* Левая колонка с изображением и кнопками */}
                <article className="flex flex-col gap-5 items-center lg:items-start">
                    <Card className="w-[315px] h-[454px] rounded-[16px]" aria-labelledby="anime-title">
                        <Image
                            isZoomed
                            removeWrapper
                            alt={`${title} cover`}
                            className="w-full h-full object-cover"
                            src="https://animego.org/upload/anime/images/64f0dbe500423242175587.jpg"
                        />
                    </Card>

                    <div className="flex flex-col gap-5 w-full max-w-[315px]">
                        {/* Выпадающий список пользователей */}
                        <Select
                            items={users}
                            placeholder="Добавить в список"
                            className="max-w-xs"
                            variant=""
                            classNames={{
                                label: "group-data-[filled=true]:-translate-y-5",
                                trigger: "min-h-16 bg-[rgba(255,255,255,0.03)]",
                                listboxWrapper: "max-h-[400px]",
                            }}
                            renderValue={(items) => items.map((item) => (
                                <div key={item.key} className="flex items-center gap-2">
                                    <Image
                                        className="flex-shrink-0"
                                        size="sm"
                                        src={item.data.avatar}
                                        alt={item.data.name}
                                    />
                                    <div className="flex flex-col">
                                        <span>{item.data.name}</span>
                                    </div>
                                </div>
                            ))}
                        >
                            {(user) => (
                                <SelectItem key={user.id} textValue={user.name}>
                                    <div className="flex gap-2 p-2 items-center">
                                        <Image alt={user.name} size="sm" src={user.avatar} />
                                        <div className="flex flex-col">
                                            <span className="text-small">{user.name}</span>
                                        </div>
                                    </div>
                                </SelectItem>
                            )}
                        </Select>

                        {/* Кнопки отзывов */}
                        <div className="flex gap-3 justify-between">
                            <AButton color="border" className="h-[65px]">
                                26 Отзывов
                            </AButton>
                            <AButton color="gray" className="h-[65px]">
                                Написать отзыв
                            </AButton>
                        </div>
                    </div>
                </article>

                {/* Центр с основной информацией об аниме */}
                <article className="flex w-full flex-col gap-[30px]">
                    {/* Следующий эпизод */}
                    <div className="flex justify-between items-center p-5 bg-[#BFF6F9]/5 rounded-[14px]">
                        <p className="text-[#BFF6F9]/60 text-[14px]">Следующий эпизод</p>
                        <p className="text-[#BFF6F9] text-[14px]">{nextEpisode.date} {nextEpisode.day} {nextEpisode.time}, {nextEpisode.episodeNumber}</p>
                    </div>

                    {/* Заголовок и рейтинг */}
                    <header className="flex justify-between items-center">
                        <div className="flex flex-col gap-2">
                            <h1 id="anime-title" className="text-[32px] font-bold">{title}</h1>
                            <p className="opacity-60 text-[12px]">{originalTitle}</p>
                        </div>
                        <div className="bg-[#FDE5B9]/10 h-fit text-[#FDE5B9] flex items-center rounded-[40px] w-fit px-[15px] py-[10px]">
                            {rating}
                        </div>
                    </header>

                    {/* Теги */}
                    <nav className="flex flex-wrap gap-[10px]">
                        {tags.map(tag => (
                            <Link
                                key={tag}
                                href="/"
                                className="px-[15px] h-[43px] flex items-center border rounded-[40px] text-[14px] text-white/60 border-white/5 hover:bg-[rgba(255,255,255,0.02)]"
                            >
                                {tag}
                            </Link>
                        ))}
                    </nav>

                    {/* Описание аниме */}
                    <ScrollShadow hideScrollBar className="w-full h-[150px]">
                        <p className="opacity-80">{description}</p>
                    </ScrollShadow>
                </article>

                {/* Вертикальная разделительная линия на больших экранах */}
                <div className="hidden lg:block w-[1px] min-h-[624px] bg-white/5"></div>

                {/* Правая колонка с дополнительной информацией */}
                <aside className="flex flex-col gap-[20px]">
                    <div className="flex flex-col gap-[10px]">
                        <InfoItem label="Тип" value={infoItems.type} />
                        <InfoItem label="Эпизодов" value={infoItems.episodes} />
                        <InfoItem label="Статус" value={infoItems.status} />
                        <InfoItem label="Ограничения" value={infoItems.ageRestriction} />
                        <InfoItem label="Студия" value={infoItems.studio} />
                        <InfoItem label="Выпуск" value={infoItems.duration} />
                        <InfoItem label="Снят по манге" value={infoItems.basedOn} />
                    </div>

                    {/* Похожие аниме */}
                    <div className="p-4 flex flex-col w-full rounded-[14px] gap-3 bg-[#CCBAE4]/10 hover:bg-[rgba(255,255,255,0.02)] transition-all duration-300 border border-white/5">
                        <p className="text-white/70">Подборка от пользователей: аниме, похожие на это <span className="text-[#CCBAE4]">(24 шт.)</span></p>
                        <AButton color="gray">Похожие аниме</AButton>
                    </div>
                </aside>
            </section>
        </main>
    );
}
