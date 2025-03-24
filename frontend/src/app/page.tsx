"use client";

import React from "react";
import { atom, useAtom } from "jotai";
import useSWR from "swr";
import Header from "@/components/header/Header";
import { Report, ReportProps } from "@/components/report/report";
import { AnimeCarousel } from "@/components/anime-carousel/anime-carousel";
import Calendar from "@/components/calendar/Calendar";
import RecentComments from "@/components/comments/RecentComments";
import Footer from "@/components/footer/Footer";
import { axiosInstance } from "@/lib/axios/axiosConfig";

// Атом для состояния аутентификации
export const authAtom = atom<{
  isAuthenticated: boolean;
  user: { username: string; nickname?: string; user_avatar?: string; banner?: string; isPro?: boolean } | null;
}>({
  isAuthenticated: false,
  user: null,
});

/**
 * Интерфейс данных отчёта
 * @interface ReportData
 */
interface ReportData {
  totalAnime: number;
  recentActivity: string[];
}

/**
 * Интерфейс данных комментариев
 * @interface CommentsData
 */
interface CommentsData {
  comments: Array<any>; // Типизируйте более конкретно, если структура комментариев известна
}

/**
 * Пропсы компонента Home
 * @interface HomeProps
 */
interface HomeProps {}

/**
 * Компонент главной страницы
 * @description Отображает главную страницу с хедером, отчётом, каруселью аниме, календарем, комментариями и футером
 * @returns {JSX.Element}
 */
const Home: React.FC<HomeProps> = React.memo(() => {
  const [auth] = useAtom(authAtom);

  // Пример SWR для динамической загрузки данных отчёта
  const { data: reportData, error: reportError, isLoading: reportLoading } = useSWR<ReportData>(
    auth.isAuthenticated ? "/api/report" : null,
    (url) => axiosInstance.get(url).then((res) => res.data),
    { revalidateOnFocus: false }
  );

  // Пример SWR для комментариев (можно настроить под конкретный API)
  const { data: commentsData, error: commentsError, isLoading: commentsLoading } = useSWR<CommentsData>(
    auth.isAuthenticated ? "/api/comments/" : null,
    (url) => axiosInstance.get(url).then((res) => res.data),
    { revalidateOnFocus: false }
  );

  // Подготовленные данные для компонента Report
  const reportProps: ReportProps = {
    className: "",
  };

  return (
    <main className="min-h-screen">
      <Header className="" />
      <Report 
        className=""
      />
      <AnimeCarousel />
      <div className="w-full container h-[1px] bg-white/5"></div>
      <Calendar />
      <RecentComments />
      <Footer />
    </main>
  );
});

Home.displayName = "Home";
export default Home;