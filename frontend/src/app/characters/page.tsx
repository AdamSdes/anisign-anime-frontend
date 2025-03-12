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

// Атом состояния аутентификации
export const authAtom = atom({
  isAuthenticated: false,
  user: null,
});

/**
 * Интерфейс данных персонажа
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
 * Компонент страницы персонажей
 */
const CharactersPage: React.FC = React.memo(() => {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [auth] = useAtom(authAtom);

  // Запрос для поиска персонажей
  const { data: searchResults, isLoading: isSearching } = useQuery<Character[]>({
    queryKey: ["character-search", debouncedSearch],
    queryFn: () =>
      axiosInstance.get(`/character/name/${debouncedSearch}`).then((res) => res.data),
    enabled: !!debouncedSearch,
  });

  // Запрос для бесконечной прокрутки
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error: listError,
  } = useInfiniteQuery<PaginatedResult>({
    queryKey: ["characters-infinite", auth.isAuthenticated],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axiosInstance.get(
        `/character/get-character-list?page=${pageParam as number}&limit=50`
      );
      const items = response.data as Character[];
      console.log(`Fetched page ${pageParam}:`, {
        itemsCount: items.length,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          russian: item.russian,
        })),
      });
      return {
        items,
        nextPage: items.length === 50 ? (pageParam as number) + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    enabled: debouncedSearch.length === 0,
  });
  
  // Автозагрузка при пересечении loadMoreRef
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage && !debouncedSearch) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage, debouncedSearch]);

  const allCharacters = debouncedSearch ? searchResults || [] : data?.pages.flatMap((page) => page.items) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Report />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6 mb-8">
          <h1 className="text-3xl font-bold text-white/90">Персонажи</h1>
          <div className="relative">
            <Search className="absolute inset-y-0 left-4 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Поиск персонажей..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-white/[0.02] border border-white/5 rounded-xl text-white/80 placeholder:text-white/40 focus:ring-2 focus:ring-white/10 transition-all duration-200"
            />
          </div>
        </div>

        {listError && (
          <div className="text-center py-8 text-red-400">
            Ошибка загрузки данных: {listError.message}
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
            {allCharacters.length > 0 ? (
              allCharacters.map((character) => (
                <motion.div key={character.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <CharacterCard {...character} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-white/60">
                Персонажей не найдено. Попробуйте изменить запрос или обновить данные.
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {status === "pending" && !debouncedSearch && (
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
