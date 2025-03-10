"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { atom, useAtom } from "jotai";
import { Search } from "lucide-react";
import Header from "@/components/header/Header";
import { Report } from "@/components/report/report";
import Footer from "@/components/footer/Footer";
import { CharacterCard } from "@/components/CharacterCard";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
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
 * Интерфейс данных персонажа
 * @interface Character
 */
interface Character {
  id: string;
  name: string;
  russian: string;
  japanese: string;
  poster_url: string;
  character_id: string;
}

/**
 * Интерфейс для результата пагинации
 */
interface PaginatedResult {
  items: Character[];
  nextPage?: number;
}

/**
 * Пропсы компонента CharactersPage
 * @interface CharactersPageProps
 */
interface CharactersPageProps {}

/**
 * Компонент страницы персонажей
 * @description Отображает список персонажей с поиском и бесконечной загрузкой
 * @returns {JSX.Element}
 */
const CharactersPage: React.FC<CharactersPageProps> = React.memo(() => {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [auth] = useAtom(authAtom);

  // Запрос для поиска
  const {
    data: searchResults,
    isLoading: isSearching,
    error: searchError,
  } = useQuery<Character[]>({
    queryKey: ["character-search", debouncedSearch],
    queryFn: () => axiosInstance.get(`/character/search?q=${debouncedSearch}`).then((res) => res.data),
    enabled: debouncedSearch.length > 0,
  });

  // Запрос для бесконечного списка
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error: listError,
  } = useInfiniteQuery<PaginatedResult>({
    queryKey: ["characters-infinite", auth.isAuthenticated],
    queryFn: ({ pageParam }) =>
      axiosInstance
        .get(`/character/get-character-list?page=${pageParam}&limit=50`)
        .then((res) => ({
          items: res.data as Character[],
          nextPage: res.data.length === 50 ? (pageParam as number) + 1 : undefined,
        })),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    enabled: debouncedSearch.length === 0 && auth.isAuthenticated,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage && !debouncedSearch) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage, debouncedSearch]);

  const allCharacters = debouncedSearch
    ? searchResults || []
    : data?.pages.flatMap((page) => page.items) || [];

  const error = searchError || listError;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Report />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6 mb-8">
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-white/90">Персонажи</h1>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-white/40" />
              </div>
              <input
                type="text"
                placeholder="Поиск персонажей..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-white/[0.02] border border-white/5 rounded-xl text-white/80 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all duration-200"
              />
              {isSearching && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="text-center py-8 text-red-400">
            <div>
              Ошибка загрузки данных: {error instanceof Error ? error.message : "Неизвестная ошибка"}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={debouncedSearch ? "search" : "list"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-6"
          >
            {allCharacters.map((character: Character, index: number) => (
              <motion.div
                key={character.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.1, 1) }}
              >
                <CharacterCard {...character} />
              </motion.div>
            ))}
            {debouncedSearch && searchResults && searchResults.length === 20 && (
              <div className="col-span-full text-center py-4 text-white/60">
                Показаны первые 20 результатов. Уточните поиск для более точных результатов.
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {((status === "pending" && !debouncedSearch) || (isFetchingNextPage && !debouncedSearch)) && (
          <div className="text-center py-8 text-white/60">Загрузка...</div>
        )}

        {!debouncedSearch && <div ref={loadMoreRef} className="h-10" />}
      </main>
      <Footer />
    </div>
  );
});

CharactersPage.displayName = "CharactersPage";
export default CharactersPage;