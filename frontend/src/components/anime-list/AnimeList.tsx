"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useSWR from "swr";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { axiosInstance } from "@/lib/axios/axiosConfig";
import { AnimeCard } from "./AnimeCard";
import { AnimeCardSkeleton } from "./AnimeCardSkeleton";
import { Pagination } from "./Pagination";
import { Search, searchQueryAtom } from "./Search";
import { useAtom } from "jotai";
import { Anime, Genre } from "@/shared/types/anime";

const paginationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3,
      duration: 0.5,
    },
  },
};

/**
 * Функция загрузки данных с учётом фильтров
 * @param url - URL эндпоинта API
 * @returns Все аниме
 */
const fetchAllAnime = async (url: string) => {
  const params = new URLSearchParams(url.split("?")[1] || "");
  const limit = 1000000;
  let page = 1;
  let allAnime: Anime[] = [];
  let totalPages = 1;

  console.log("=== Fetch Process Started ===");
  console.log("Initial Fetching with full URL:", url);
  console.log("Initial Fetching with params:", Object.fromEntries(params));

  try {
    while (page <= totalPages) {
      params.set("page", page.toString());
      params.set("limit", limit.toString());

      // Исправляем параметры
      if (params.get("status") === "all") params.delete("status");
      if (params.get("genre") === "all") params.delete("genre");

      const fullUrl = `/anime/get-anime-list-filtered?${params.toString()}`;
      console.log("Constructed URL before request:", fullUrl);
      console.log("Params before request:", Object.fromEntries(params));

      const response = await axiosInstance.get<{
        anime_list: Anime[];
        pagination?: { page: number; pages: number; total: number; per_page: number };
      }>(fullUrl, {
        timeout: 10000,
      });

      const data = response.data;
      console.log(`Page ${page} API Response:`, {
        anime_list_length: data.anime_list.length,
        pagination: data.pagination,
        first_anime: data.anime_list[0]?.aired_on || "No first anime",
        last_anime: data.anime_list[data.anime_list.length - 1]?.aired_on || "No last anime",
      });

      allAnime = [...allAnime, ...data.anime_list];
      totalPages = data.pagination?.pages || 1;
      page++;
    }

    console.log("All Anime Fetched:", allAnime.length);
    console.log("=== Fetch Process Completed ===");
    return { animeList: allAnime };
  } catch (error) {
    console.error("=== Fetch Error Occurred ===");
    console.error("Fetch Error Details:", {
      config: (error as any).config ? (error as any).config.url : "No config",
      response: (error as any).response ? (error as any).response.data : "No response",
      status: (error as any).response ? (error as any).response.status : "No status",
      request: (error as any).request ? "Request sent but no response" : "Request failed to send",
    });
    throw error;
  }
};

/**
 * Функция загрузки жанров через SWR
 * @param url - URL эндпоинта API
 * @returns Массив жанров
 */
const genreFetcher = (url: string) => axiosInstance.get<Genre[]>(url).then((res) => res.data);

/**
 * Компонент списка аниме
 */
export const AnimeList: React.FC = React.memo(() => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [hasResetFilters, setHasResetFilters] = useState(false);

  const isDetailPage = pathname.match(/^\/anime\/[0-9]+$/);
  const swrKey = !isDetailPage ? `/anime/get-anime-list-filtered?${searchParams.toString()}` : null;

  const { data: animeData, error: animeError, isLoading: isAnimeLoading, isValidating, mutate } = useSWR(
    swrKey,
    fetchAllAnime,
    {
      dedupingInterval: 0,
      revalidateOnFocus: true,
      keepPreviousData: false,
    }
  );

  const { data: genres, error: genresError, isLoading: isGenresLoading } = useSWR(
    "/genre/get-list-genres",
    genreFetcher,
    {
      dedupingInterval: 60000,
      revalidateOnFocus: false,
    }
  );

  const isLoading = isAnimeLoading || isGenresLoading || isValidating;
  const hasError = animeError || genresError;
  let allAnime = animeData?.animeList || [];

  // Сброс фильтров 
  useEffect(() => {
    if (pathname === "/anime" && !hasResetFilters && allAnime.length === 0 && !isLoading) {
      console.log("No anime fetched with current params, resetting filters...");
      router.replace("/anime?page=1");
      setHasResetFilters(true);
      setSearchQuery(""); 
      mutate();
      console.log("Reset filters to default, new URL:", "/anime?page=1", "Triggering mutate");
    }
  }, [pathname, router, searchParams, hasResetFilters, allAnime, isLoading, mutate, setSearchQuery]);

  // Клиентский поиск по имени
  if (searchQuery) {
    const searchTerm = searchQuery.toLowerCase().trim();
    allAnime = allAnime.filter((anime) =>
      (anime.russian?.toLowerCase() || "").includes(searchTerm) ||
      (anime.name?.toLowerCase() || "").includes(searchTerm)
    );
    console.log("After client-side search, filtered count:", allAnime.length);
  }

  // Фильтрация по годам
  const startYear = searchParams.get("start_year");
  const endYear = searchParams.get("end_year");
  if (startYear && endYear) {
    const start = parseInt(startYear);
    const end = parseInt(endYear);
    if (!isNaN(start) && !isNaN(end) && start <= end) {
      allAnime = allAnime.filter((anime) => {
        if (!anime.aired_on) {
          console.log("Skipping anime due to missing aired_on:", anime.russian);
          return true; 
        }
        try {
          const year = new Date(anime.aired_on).getFullYear();
          return year >= start && year <= end;
        } catch (e) {
          console.error("Error parsing aired_on date:", e, anime.aired_on);
          return false;
        }
      });
      console.log("After client-side year filter, filtered count:", allAnime.length);
    }
  }

  // Клиентская сортировка
  const sortBy = searchParams.get("sort") || "score";
  const order = searchParams.get("order") || "desc";
  const sortedAnime = [...allAnime].sort((a, b) => {
    let valueA, valueB;
    switch (sortBy) {
      case "aired_on":
        valueA = a.aired_on ? new Date(a.aired_on).getTime() : 0;
        valueB = b.aired_on ? new Date(b.aired_on).getTime() : 0;
        return order === "desc" ? valueB - valueA : valueA - valueB;
      case "score":
        valueA = a.score || 0;
        valueB = b.score || 0;
        return order === "desc" ? valueB - valueA : valueA - valueB;
      case "russian":
        valueA = a.russian || "";
        valueB = b.russian || "";
        return order === "desc" ? valueB.localeCompare(valueA) : valueA.localeCompare(valueB);
      default:
        return 0;
    }
  });
  console.log("After sorting, sortedAnime count:", sortedAnime.length);

  // Клиентская пагинация
  const itemsPerPage = 30;
  const totalItems = sortedAnime.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1", 10) || 1
  );

  // Корректировка текущей страницы, если она больше totalPages
  useEffect(() => {
    const pageFromParams = parseInt(searchParams.get("page") || "1", 10);
    const validPage = Math.min(Math.max(1, pageFromParams), totalPages || 1);
    if (validPage !== currentPage) {
      setCurrentPage(validPage);
    }
  }, [searchParams, totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAnime = sortedAnime.slice(startIndex, endIndex);

  console.log("AnimeList state:", {
    isLoading,
    hasError,
    totalItems,
    totalPages,
    currentPage,
    currentAnimeLength: currentAnime.length,
    currentAnime: currentAnime.map((a) => ({
      id: a.anime_id,
      russian: a.russian,
      poster_url: a.poster_url,
      score: a.score,
      aired_on: a.aired_on,
    })),
    searchParams: searchParams.toString(),
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.replace(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isDetailPage) return null;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Search />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {Array(30)
            .fill(0)
            .map((_, index) => (
              <AnimeCardSkeleton key={index} />
            ))}
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="text-center text-red-500">
        Произошла ошибка при загрузке аниме: {hasError.message}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Search />
      {!currentAnime.length ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-16 h-16 mb-6 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" className="text-white/40">
              <path
                fill="currentColor"
                d="M20.84 2.18L16.91 2.96L19.65 6.5L21.62 6.1L20.84 2.18M13.97 3.54L12 3.93L14.75 7.46L16.71 7.07L13.97 3.54M9.07 4.5L7.1 4.89L9.85 8.43L11.81 8.03L9.07 4.5M4.16 5.5L3.18 5.69A2 2 0 0 0 1.61 8.04L2 9.16L4.86 9.64L4.16 5.5M2 18.54L2.39 19.66A2 2 0 0 0 4.74 21.23L6 20.85L5.46 19.42L5.46 14.29L2.47 14.29L2 18.54M22 13.54L22 11.54C22 10.54 21.22 9.75 20.22 9.75L7.22 9.75C6.22 9.75 5.44 10.54 5.44 11.54L5.44 13.54C5.44 14.54 6.22 15.32 7.22 15.32L20.22 15.32C21.22 15.32 22 14.54 22 13.54Z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white/80 mb-2">Список аниме пуст</h3>
          <p className="text-sm text-white/40 text-center max-w-md">
            По вашему запросу ничего не найдено. Попробуйте изменить параметры фильтрации или поиска
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {currentAnime.map((anime, index) => (
            <AnimeCard key={anime.anime_id || index} anime={anime} genres={genres} priority={index < 4} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <motion.div
          variants={paginationVariants}
          initial="hidden"
          animate="visible"
          className="sticky bottom-2 z-10 flex items-center justify-center"
        >
          <div className="w-fit rounded-xl border border-white/10 bg-[#060606]/95 backdrop-blur-sm p-2 shadow-lg">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
});

AnimeList.displayName = "AnimeList";

export default AnimeList;