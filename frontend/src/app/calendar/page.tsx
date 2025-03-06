"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { atom, useAtom } from "jotai";
import useSWR from "swr";
import Header from "@/components/header/Header";
import { Report } from "@/components/report/report";
import Footer from "@/components/footer/Footer";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import CalendarList from "@/components/calendar/CalendarList";
import { axiosInstance } from "@/lib/axios/axiosConfig";

// Атом для состояния аутентификации
export const authAtom = atom<{
  isAuthenticated: boolean;
  user: { username: string; nickname?: string; user_avatar?: string; banner?: string; isPro?: boolean } | null;
}>({
  isAuthenticated: false,
  user: null,
});

// Атом для состояния календаря
export const calendarAtom = atom<{
  showMyAnime: boolean;
  currentDate: Date;
}>({
  showMyAnime: false,
  currentDate: new Date(),
});

/**
 * Интерфейс данных релиза
 * @interface Release
 */
interface Release {
  id: string;
  animeId: string;
  title: string;
  releaseDate: string;
  episode: number;
}

/**
 * Пропсы компонента CalendarPage
 * @interface CalendarPageProps
 */
interface CalendarPageProps {}

/**
 * Компонент страницы календаря
 * @description Отображает календарь выходов серий аниме с навигацией и фильтром
 * @returns {JSX.Element}
 */
const CalendarPage: React.FC<CalendarPageProps> = React.memo(() => {
  const router = useRouter();
  const [auth] = useAtom(authAtom);
  const [calendar, setCalendar] = useAtom(calendarAtom);

  // SWR для загрузки данных релизов
  const { data: releases, error: releasesError, isLoading: releasesLoading } = useSWR<Release[]>(
    auth.isAuthenticated ? `/api/calendar/releases?date=${format(calendar.currentDate, "yyyy-MM-dd")}` : null,
    (url) => axiosInstance.get(url).then((res) => res.data),
    { revalidateOnFocus: false }
  );

  const handlePrevWeek = () => {
    setCalendar((prev) => ({
      ...prev,
      currentDate: new Date(prev.currentDate.setDate(prev.currentDate.getDate() - 7)),
    }));
  };

  const handleNextWeek = () => {
    setCalendar((prev) => ({
      ...prev,
      currentDate: new Date(prev.currentDate.setDate(prev.currentDate.getDate() + 7)),
    }));
  };

  const formatDateRange = () => {
    const startOfWeek = new Date(calendar.currentDate);
    startOfWeek.setDate(calendar.currentDate.getDate() - calendar.currentDate.getDay() + 1);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const formatDate = (date: Date) =>
      date.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });

    return `${formatDate(startOfWeek)} — ${formatDate(endOfWeek)}`;
  };

  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <Report />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Заголовок */}
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/5">
                <CalendarDays className="w-5 h-5 text-white/60" />
              </div>
              <h1 className="text-xl font-semibold text-white/90">Календарь выхода серий</h1>
            </div>
            <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 px-4 py-2 rounded-xl">
              <label className="text-[14px] text-white/60 cursor-pointer select-none" htmlFor="my-anime-switch">
                Показывать только мои аниме
              </label>
              <Switch
                id="my-anime-switch"
                checked={calendar.showMyAnime}
                onCheckedChange={(checked) => setCalendar((prev) => ({ ...prev, showMyAnime: checked }))}
                className="data-[state=checked]:bg-[#CCBAE4] data-[state=unchecked]:bg-white/10"
              />
            </div>
          </motion.div>

          {/* Навигация по датам */}
          <motion.div
            className="flex items-center gap-4 bg-white/[0.02] border border-white/5 rounded-xl p-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevWeek}
              className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex-shrink-0"
            >
              <ChevronLeft className="h-5 w-5 text-white/60" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex-1 h-10 justify-center font-normal text-white/90 hover:text-white/90 hover:bg-white/5 transition-colors"
                >
                  <span className="text-[15px]">{formatDateRange()}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-[#060606] border-white/5">
                <Calendar
                  mode="single"
                  selected={calendar.currentDate}
                  onSelect={(date) =>
                    date && setCalendar((prev) => ({ ...prev, currentDate: date }))
                  }
                  initialFocus
                  locale={ru}
                />
              </PopoverContent>
            </Popover>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextWeek}
              className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex-shrink-0"
            >
              <ChevronRight className="h-5 w-5 text-white/60" />
            </Button>
          </motion.div>

          {/* Контент календаря */}
          {releasesLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-white/10 border-t-white/60 rounded-full animate-spin" />
            </div>
          ) : releasesError || !releases ? (
            <div className="text-center py-10 text-white/40">Не удалось загрузить данные календаря</div>
          ) : (
            <CalendarList currentDate={calendar.currentDate} showMyAnime={calendar.showMyAnime} />
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
});

CalendarPage.displayName = "CalendarPage";
export default CalendarPage;