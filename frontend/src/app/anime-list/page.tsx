"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { atom, useAtom } from "jotai";
import useSWR from "swr";
import AnimeList from "@/components/anime-list/AnimeList";
import FilterSidebar from "@/components/anime-list/FilterSidebar";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Report } from "@/components/report/report";
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
 * Интерфейс дефолтных параметров фильтров
 * @interface DefaultFilterParams
 */
interface DefaultFilterParams {
  sort?: string;
  status?: string;
  genre?: string;
}

/**
 * Пропсы компонента AnimeListPage
 * @interface AnimeListPageProps
 */
interface AnimeListPageProps {}

/**
 * Компонент страницы списка аниме
 * @description Отображает страницу с списком аниме и боковой панелью фильтров
 * @returns {JSX.Element}
 */
const AnimeListPage: React.FC<AnimeListPageProps> = React.memo(() => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [auth] = useAtom(authAtom);

  // Загрузка дефолтных параметров фильтров (опционально через API)
  const { data: defaultFilters, error: filtersError } = useSWR<DefaultFilterParams>(
    auth.isAuthenticated ? "/api/filters/default" : null,
    (url) => axiosInstance.get(url).then((res) => res.data),
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    // Установка дефолтных параметров, если их нет
    if (searchParams.toString() === "") {
      const params = new URLSearchParams();
      params.set("sort", defaultFilters?.sort || "popularity");
      params.set("status", defaultFilters?.status || "all");
      params.set("genre", defaultFilters?.genre || "all");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, pathname, router, defaultFilters]);

  return (
    <>
      <Header />
      <Report />
      <main className="min-h-screen bg-[#030303]">
        <div className="container px-[20px] py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Основной контент */}
              <div className="flex-1">
                <AnimeList />
              </div>

              {/* Боковая панель */}
              <div className="w-full lg:w-[300px] shrink-0">
                <div className="lg:top-[100px]">
                  <FilterSidebar />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
});

AnimeListPage.displayName = "AnimeListPage";
export default AnimeListPage;