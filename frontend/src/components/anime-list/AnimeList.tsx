"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import useSWR from "swr";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { axiosInstance } from "@/lib/axios/axiosConfig";
import { AnimeCard } from "./AnimeCard";
import { AnimeCardSkeleton } from "./AnimeCardSkeleton";
import { Pagination } from "./Pagination";
import { Search, searchQueryAtom } from "./Search";
import { useAtom } from "jotai";
import { atom } from 'jotai';
import { Anime, Genre } from "@/shared/types/anime";

interface AnimeState {
  totalPages: number;
  loadedAnime: Record<number, Anime[]>;
  loadedPages: Set<number>;
  isInitialized: boolean;
}

export const animeStateAtom = atom<AnimeState>({
  totalPages: 0,
  loadedAnime: {},
  loadedPages: new Set<number>(),
  isInitialized: false
});

const formatDateTime = (): string => {
  const now = new Date();
  return now.toISOString()
    .replace('T', ' ')
    .slice(0, 19);
};

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

const fetchAnimeForPage = async (
  baseUrl: string,
  page: number,
  itemsPerPage: number
): Promise<{ anime: Anime[]; totalCount: number }> => {
  const params = new URLSearchParams(baseUrl.split("?")[1] || "");
  params.set("page", page.toString());
  params.set("limit", itemsPerPage.toString());

  if (params.get("status") === "all") params.delete("status");
  if (params.get("genre") === "all") params.delete("genre");

  const url = `/anime/get-anime-list-filtered?${params.toString()}`;
  
  console.log(`[${formatDateTime()}] Fetching page ${page}...`);
  
  try {
    const response = await axiosInstance.get<{
      total_count: number;
      anime_list: Anime[];
    }>(url, {
      timeout: 10000,
    });

    console.log(`[${formatDateTime()}] Successfully fetched page ${page}`);
    return {
      anime: response.data.anime_list,
      totalCount: response.data.total_count,
    };
  } catch (error) {
    console.error(`[${formatDateTime()}] Error fetching page ${page}:`, {
      error_message: (error as any).message,
      status: (error as any).response?.status,
    });
    throw error;
  }
};

const fetchAllAnime = async (
  url: string,
  setAnimeState: (value: AnimeState | ((prev: AnimeState) => AnimeState)) => void,
  targetPage: number
): Promise<{ anime: Anime[]; totalCount: number }> => {
  console.log(`[${formatDateTime()}] Starting anime fetch process`);
  console.log(`Initial URL: ${url}`);
  console.log(`Target Page: ${targetPage}`);

  try {
    const targetPageData = await fetchAnimeForPage(url, targetPage, 30);
    const totalPages = Math.ceil(targetPageData.totalCount / 30);

    setAnimeState((prevState: AnimeState) => ({
      ...prevState,
      totalPages,
      loadedAnime: {
        ...prevState.loadedAnime,
        [targetPage]: targetPageData.anime
      },
      loadedPages: new Set([...Array.from(prevState.loadedPages), targetPage]),
      isInitialized: true
    }));

    const loadRemainingPages = async (currentState: AnimeState) => {
      const pagesToLoad = Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter(page => page !== targetPage);

      for (const page of pagesToLoad) {
        if (!currentState.loadedPages.has(page)) {
          try {
            const { anime } = await fetchAnimeForPage(url, page, 30);
            setAnimeState((prevState: AnimeState) => {
              const newState = {
                ...prevState,
                loadedAnime: {
                  ...prevState.loadedAnime,
                  [page]: anime
                },
                loadedPages: new Set([...Array.from(prevState.loadedPages), page])
              };
              return newState;
            });
            await new Promise(resolve => setTimeout(resolve, 300));
          } catch (error) {
            console.error(`[${formatDateTime()}] Error loading page ${page}:`, error);
          }
        }
      }
    };

    setAnimeState((prevState: AnimeState) => {
      loadRemainingPages(prevState);
      return prevState;
    });

    return targetPageData;
  } catch (error) {
    console.error(`[${formatDateTime()}] Fetch Error:`, {
      error_message: (error as any).message,
      status: (error as any).response?.status,
    });
    throw error;
  }
};

const genreFetcher = (url: string) => axiosInstance.get<Genre[]>(url).then((res) => res.data);

export const AnimeList: React.FC = React.memo(() => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery] = useAtom(searchQueryAtom);
  const [animeState, setAnimeState] = useAtom(animeStateAtom);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1", 10));

  const isDetailPage = pathname.match("/^\/anime\/[0-9]+$/");
  const swrKey = !isDetailPage ? `/anime/get-anime-list-filtered?${searchParams.toString()}` : null;

  const { error: animeError, isValidating } = useSWR(
    swrKey,
    (url) => fetchAllAnime(url, setAnimeState, currentPage),
    {
      dedupingInterval: 0,
      revalidateOnFocus: false,
      keepPreviousData: true,
      revalidateIfStale: false
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

  
  const displayedAnime = useMemo(() => {
    // Получаем все загруженные аниме
    const allLoadedAnime = Object.values(animeState.loadedAnime).flat();
    
    // Применяем поиск ко всем загруженным аниме
    let searchFiltered = [...allLoadedAnime];
    if (searchQuery) {
      const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/);
      searchFiltered = searchFiltered.filter((anime) => {
        const russianName = (anime.russian || "").toLowerCase();
        const englishName = (anime.name || "").toLowerCase();
        return searchTerms.every(term => 
          russianName.includes(term) || englishName.includes(term)
        );
      });
    }

    // Применяем фильтрацию по годам
    const startYear = searchParams.get("start_year");
    const endYear = searchParams.get("end_year");
    let yearFiltered = searchFiltered;
    if (startYear && endYear) {
      const start = parseInt(startYear);
      const end = parseInt(endYear);
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        yearFiltered = yearFiltered.filter((anime) => {
          if (!anime.aired_on) return false;
          try {
            const year = new Date(anime.aired_on).getFullYear();
            return year >= start && year <= end;
          } catch {
            return false;
          }
        });
      }
    }

    // Получаем параметры сортировки
    const sortBy = searchParams.get("sort") || "score";
    const order = searchParams.get("order") || "desc";

    // Создаем копию для сортировки
    const sorted = [...yearFiltered].sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case "aired_on":
          valueA = a.aired_on ? new Date(a.aired_on).getTime() : -Infinity;
          valueB = b.aired_on ? new Date(b.aired_on).getTime() : -Infinity;
          return order === "desc" ? valueB - valueA : valueA - valueB;
        
        case "score":
          valueA = a.score ?? -Infinity;
          valueB = b.score ?? -Infinity;
          return order === "desc" ? valueB - valueA : valueA - valueB;
        
        case "russian":
          valueA = a.russian?.toLowerCase() || "";
          valueB = b.russian?.toLowerCase() || "";
          return order === "desc" 
            ? valueB.localeCompare(valueA, 'ru')
            : valueA.localeCompare(valueB, 'ru');
        
        case "name":
          valueA = a.name?.toLowerCase() || "";
          valueB = b.name?.toLowerCase() || "";
          return order === "desc"
            ? valueB.localeCompare(valueA, 'en')
            : valueA.localeCompare(valueB, 'en');
        
        default:
          return 0;
      }
    });

    return sorted;
  }, [animeState.loadedAnime, searchQuery, searchParams]);

  const currentPageAnime = useMemo(() => {
    // Если страница загружена и нет поиска/фильтрации, используем кэшированные данные
    if (animeState.loadedAnime[currentPage] && !searchQuery && 
        !searchParams.get("start_year") && !searchParams.get("end_year")) {
      console.log(`[${formatDateTime()}] Using cached data for page ${currentPage}`);
      return animeState.loadedAnime[currentPage];
    }

    // Иначе используем отфильтрованные и отсортированные данные
    console.log(`[${formatDateTime()}] Using filtered data for page ${currentPage}`);
    const itemsPerPage = 30;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return displayedAnime.slice(startIndex, endIndex);
  }, [
    displayedAnime,
    currentPage,
    animeState.loadedAnime,
    searchQuery,
    searchParams
  ]);
  const handlePageChange = async (page: number) => {
    console.log(`[${formatDateTime()}] Changing to page ${page}`);
    setCurrentPage(page);
    
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.replace(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (!animeState.loadedPages.has(page) && swrKey) {
      console.log(`[${formatDateTime()}] Priority loading page ${page}`);
      try {
        const { anime, totalCount } = await fetchAnimeForPage(swrKey, page, 30);
        setAnimeState((prevState: AnimeState) => ({
          ...prevState,
          totalPages: Math.ceil(totalCount / 30),
          loadedAnime: {
            ...prevState.loadedAnime,
            [page]: anime
          },
          loadedPages: new Set([...Array.from(prevState.loadedPages), page])
        }));
        console.log(`[${formatDateTime()}] Successfully loaded page ${page}`);
      } catch (error) {
        console.error(`[${formatDateTime()}] Error loading page ${page}:`, error);
      }
    } else {
      console.log(`[${formatDateTime()}] Page ${page} already loaded`);
    }
  };

  if (!animeState.isInitialized && isValidating) {
    return (
      <div className="space-y-8">
        <Search />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {Array(30).fill(0).map((_, index) => (
            <AnimeCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (animeError || genresError) {
    return (
      <div className="text-center text-red-500">
        Произошла ошибка при загрузке: {(animeError || genresError)?.message}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Search />
      {!currentPageAnime.length ? (
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
          {currentPageAnime.map((anime, index) => (
            <AnimeCard 
              key={anime.anime_id || index} 
              anime={anime} 
              genres={genres} 
              priority={index < 4} 
            />
          ))}
        </div>
      )}

      {animeState.totalPages > 1 && (
        <motion.div
          variants={paginationVariants}
          initial="hidden"
          animate="visible"
          className="sticky bottom-2 z-10 flex items-center justify-center"
        >
          <div className="w-fit rounded-xl border border-white/10 bg-[#060606]/95 backdrop-blur-sm p-2 shadow-lg">
            <Pagination
              currentPage={currentPage}
              totalPages={animeState.totalPages}
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