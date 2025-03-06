"use client";

import React from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimeCard } from "./AnimeCard";
import { mergeClass } from "@/lib/utils/mergeClass";

// Интерфейс данных аниме для календаря
interface Anime {
  id: number;
  image: string;
  rating: string;
  title: string;
  episodeInfo: string;
  timeInfo: string;
  episodeTitle?: string;
}

// Интерфейс дня недели
interface Day {
  value: string; 
  label: string; 
  date: Date; 
}

// Интерфейс пропсов компонента CalendarList
interface CalendarListProps {
  currentDate: Date; 
  showMyAnime: boolean; 
}

// Варианты анимации для списка аниме
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: { opacity: 0 },
};

/**
 * Компонент списка календаря аниме
 * @description Отображает вкладки с днями недели и аниме для каждого дня
 * @param {CalendarListProps} props - Пропсы компонента
 */
export const CalendarList: React.FC<CalendarListProps> = React.memo(
  ({ currentDate, showMyAnime }) => {
    /**
     * Получение названия дня недели с числом
     * @param date - Дата
     * @returns Строка с названием дня и числом (например, "Понедельник 10")
     */
    const getDayName = (date: Date): string =>
      date.toLocaleDateString("ru-RU", {
        weekday: "long",
        day: "numeric",
      });

    /**
     * Генерация дней недели
     * @returns Массив дней недели с вкладками
     */
    const getDaysOfWeek = (): Day[] => {
      const days: Day[] = [];
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);

      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        days.push({
          value: `day-${i}`,
          label: getDayName(date),
          date,
        });
      }
      return days;
    };

    // Моковые данные для демонстрации (TODO: заменить на API)
    const mockAnimes: Anime[] = [
      {
        id: 1,
        image: "/mock/anime1.jpg",
        rating: "8.7",
        title: "Тестовое аниме",
        episodeInfo: "Серия 1",
        timeInfo: "12:00",
      },
      {
        id: 2,
        image: "/mock/anime1.jpg",
        rating: "8.7",
        title: "Тестовое аниме 2",
        episodeInfo: "Серия 2",
        timeInfo: "14:00",
      },
      {
        id: 3,
        image: "/mock/anime1.jpg",
        rating: "8.7",
        title: "Тестовое аниме 3",
        episodeInfo: "Серия 3",
        timeInfo: "16:00",
      },
      {
        id: 4,
        image: "/mock/anime1.jpg",
        rating: "8.7",
        title: "Тестовое аниме 4",
        episodeInfo: "Серия 4",
        timeInfo: "18:00",
      },
    ];

    const days = getDaysOfWeek();

    return (
      <Tabs defaultValue={days[0].value} className="w-full">
        <TabsList className="w-full h-auto bg-white/[0.02] rounded-xl p-1 mb-6">
          <div className="grid grid-cols-7 gap-1 w-full">
            {days.map((day) => (
              <TabsTrigger
                key={day.value}
                value={day.value}
                className={mergeClass(
                  "flex flex-col gap-1 rounded-lg py-3 px-1",
                  "text-[14px] text-white/60",
                  "data-[state=active]:text-white data-[state=active]:bg-white/5",
                  day.date.toDateString() === new Date().toDateString() &&
                    "ring-1 ring-[#CCBAE4]/30"
                )}
              >
                <span className="font-medium">{day.label.split(" ")[0]}</span>
                <span className="text-sm opacity-60">
                  {day.label.split(" ")[1]}
                </span>
              </TabsTrigger>
            ))}
          </div>
        </TabsList>

        {days.map((day) => (
          <TabsContent key={day.value} value={day.value} className="mt-0">
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {mockAnimes.map((anime) => (
                <AnimeCard
                  key={anime.id}
                  id={anime.id}
                  image={anime.image}
                  rating={anime.rating}
                  title={anime.title}
                  episodeInfo={anime.episodeInfo}
                  timeInfo={anime.timeInfo}
                />
              ))}
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>
    );
  }
);

CalendarList.displayName = "CalendarList";

export default CalendarList;