"use client";

import React, { useState, useEffect } from 'react';
import AnimeCard from '@/entities/CalendarCard/CalendarCard';
import { Button } from '@/shared/shadcn-ui/button';
import { ChevronRight } from "lucide-react";
import { endpoints } from "@/shared/api/config";

const mockAnimeData = [
    {
        image: "https://animego.me/upload/anime/images/676c95f46c3d0879885789.jpg",
        rating: "8.7",
        title: "Демон против проклятий",
        episodeInfo: "Серия 13",
        timeInfo: "12:00",
        episodeTitle: "Битва в темноте" // Добавляем названия эпизодов
    },
    {
        image: "https://animego.me/upload/anime/images/665663fabd74c692489555.jpg",
        rating: "9.2",
        title: "Клинок, рассекающий демонов",
        episodeInfo: "Серия 8",
        timeInfo: "15:30",
        episodeTitle: "Путь самурая"
    },
    {
        image: "https://animego.me/upload/anime/images/67627d7674fda938995197.jpg",
        rating: "7.9",
        title: "Синий оркестр",
        episodeInfo: "Серия 21",
        timeInfo: "18:00",
        episodeTitle: "Мелодия судьбы"
    },
    {
        image: "https://animego.me/upload/anime/images/676179108a4fa943224395.jpg",
        rating: "8.4",
        title: "Магическая битва",
        episodeInfo: "Серия 5",
        timeInfo: "20:30",
        episodeTitle: "Заклинание разрушения"
    },
    {
        image: "https://animego.me/upload/anime/images/676d194be10ff551342542.jpg",
        rating: "8.8",
        title: "Атака титанов",
        episodeInfo: "Серия 17",
        timeInfo: "22:00",
        episodeTitle: "Последний рубеж"
    },
    {
        image: "https://animego.me/upload/anime/images/676aba08923a6590670860.jpg",
        rating: "7.6",
        title: "Благословение небожителей",
        episodeInfo: "Серия 9",
        timeInfo: "23:30",
        episodeTitle: "Божественное вмешательство"
    }
];

const Calendar = ({ date, showOnlyMine }) => {
    const [animeData, setAnimeData] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Имитация загрузки данных
        const fetchMockData = () => {
            setTimeout(() => {
                // Перемешиваем массив случайным образом
                const shuffledData = [...mockAnimeData]
                    .sort(() => Math.random() - 0.5)
                    .map(anime => ({
                        ...anime,
                        rating: (Math.random() * 3 + 7).toFixed(1), // Рандомный рейтинг от 7 до 10
                        episodeInfo: `Серия ${Math.floor(Math.random() * 24) + 1}`,
                        timeInfo: `${Math.floor(Math.random() * 24)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
                    }));
                setAnimeData(shuffledData);
                setIsLoading(false);
            }, 1000); // Имитация задержки загрузки
        };

        fetchMockData();
    }, [date]); // Перезагружаем при изменении даты

    return (
        <main className="flex flex-col mb-[30px] gap-3 items-center">

            <div className="container mx-auto px-2 py-5 flex flex-col">
                {isLoading ? (
                    <div className="flex flex-col gap-5 items-center justify-center w-full h-[353px] bg-[rgba(255,255,255,0.02)] rounded-[14px]">
                        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-white/5 fill-[#CCBAE4]"
                             viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor" />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill" />
                        </svg>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[20px]">
                        {animeData.map((anime, index) => (
                            <div
                                key={index}
                                onMouseEnter={() => setSelectedCard(index)}
                                onMouseLeave={() => setSelectedCard(null)}
                                className={`transition-opacity duration-300 ${
                                    selectedCard !== null && selectedCard !== index ? 'opacity-40' : 'opacity-100'
                                }`}
                            >
                                <AnimeCard
                                    image={anime.image}
                                    rating={anime.rating}
                                    title={anime.title}
                                    episodeInfo={anime.episodeInfo}
                                    timeInfo={anime.timeInfo}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default Calendar;
