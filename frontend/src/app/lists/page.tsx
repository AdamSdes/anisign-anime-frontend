"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Clock, Check, X, Pause, LayoutGrid, Table2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { atom, useAtom } from "jotai";
import useSWR from "swr";
import { axiosInstance } from "@/lib/axios/axiosConfig";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/header/Header";
import { Report } from "@/components/report/report";
import Footer from "@/components/footer/Footer";
import { CircularRating } from "@/components/ui/circularRating";

// Атом для состояния аутентификации (из предыдущих файлов)
export const authAtom = atom<{
  isAuthenticated: boolean;
  user: { username: string; nickname?: string; user_avatar?: string; isPro?: boolean } | null;
}>({
  isAuthenticated: false,
  user: null,
});

// Атом для фильтрации списков
export const listsFilterAtom = atom<{
  activeTag: string;
}>({
  activeTag: "Watching",
});

/**
 * Интерфейс элемента аниме
 * @interface AnimeItem
 */
interface AnimeItem {
  anime_id: string;
  title: string;
  russian: string;
  poster_url: string;
  kind: string;
  episodes: number;
  score: string;
}

/**
 * Интерфейс количества элементов в списках
 * @interface ListCounts
 */
interface ListCounts {
  [key: string]: number;
}

/**
 * Компонент страницы списков пользователя
 * @description Отображает списки аниме пользователя с фильтрацией и переключением режимов отображения
 * @returns {JSX.Element}
 */
const ListsPage: React.FC = React.memo(() => {
  const [auth] = useAtom(authAtom);
  const [listsFilter, setListsFilter] = useAtom(listsFilterAtom);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const tags = [
    { id: "Watching", label: "Cмотрю", icon: Eye, color: "#CCBAE4" },
    { id: "Completed", label: "Просмотрел", icon: Check, color: "#86EFAC" },
    { id: "Plan to Watch", label: "Планирую", icon: Clock, color: "#93C5FD" },
    { id: "Dropped", label: "Бросил", icon: X, color: "#FDA4AF" },
    { id: "On Hold", label: "Отложил", icon: Pause, color: "#FCD34D" },
  ];

  // SWR для загрузки количества элементов в списках
  const { data: listCounts, error: countsError } = useSWR<ListCounts>(
    auth.isAuthenticated ? "/api/anime_save_list/counts" : null,
    async () => {
      const counts: ListCounts = {};
      for (const tag of tags) {
        const response = await axiosInstance.get(
          `/anime_save_list/get-anime-list-by-name/${encodeURIComponent(tag.id)}`
        );
        counts[tag.id] = response.data.anime_ids?.length || 0;
      }
      return counts;
    },
    { revalidateOnFocus: false }
  );

  // SWR для загрузки списка аниме
  const { data: animeList, error: listError, isLoading } = useSWR<AnimeItem[]>(
    auth.isAuthenticated ? `/api/anime_save_list/${listsFilter.activeTag}` : null,
    async (url) => {
      const response = await axiosInstance.get(
        `/anime_save_list/get-anime-list-by-name/${encodeURIComponent(listsFilter.activeTag)}`
      );
      const animeIds = response.data.anime_ids || [];
      if (animeIds.length === 0) return [];

      const animeDetails = await Promise.all(
        animeIds.map((id: string) =>
          axiosInstance.get(`/anime/id/${id}`).then((res: { data: { title: any; name: any; russian: any; title_russian: any; poster_url: any; image_url: any; kind: any; type: any; episodes: any; score: any; }; }) => ({
            anime_id: id,
            title: res.data.title || res.data.name || "Без названия",
            russian: res.data.russian || res.data.title_russian || "",
            poster_url: res.data.poster_url || res.data.image_url || "",
            kind: res.data.kind || res.data.type || "unknown",
            episodes: res.data.episodes || 0,
            score: res.data.score || "0",
          }))
        )
      );
      return animeDetails;
    },
    { revalidateOnFocus: false }
  );

  const filteredAnimeList = (animeList || []).filter((anime) =>
    [anime.title, anime.russian].some((field) =>
      field.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const renderSkeletons = useCallback(
    () => (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
      >
        {[...Array(10)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="relative w-full aspect-[3/4] rounded-[14px] bg-white/[0.02]" />
            <div className="mt-3 space-y-2">
              <div className="h-4 bg-white/[0.02] rounded-md" />
              <div className="h-3 bg-white/[0.02] rounded-md w-2/3" />
            </div>
          </div>
        ))}
      </motion.div>
    ),
    []
  );

  const renderGridView = useCallback(
    () => (
      <motion.div
        key="grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4"
      >
        {filteredAnimeList.map((anime) => (
          <motion.div
            key={anime.anime_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="group"
          >
            <Link href={`/anime/${anime.anime_id}`} className="block relative">
              {anime.score && (
                <div className="absolute top-2 left-2 z-30 flex items-center gap-1 bg-black/80 backdrop-blur-sm rounded-full px-2.5 py-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" className="text-yellow-400">
                    <path
                      fill="currentColor"
                      d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-white">{Number(anime.score).toFixed(1)}</span>
                </div>
              )}
              <div className="relative w-full aspect-[3/4] rounded-[14px] overflow-hidden bg-white/5">
                <Image
                  src={anime.poster_url}
                  alt={anime.russian || anime.title}
                  fill
                  className="object-cover transition-all duration-300 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              </div>
              <div className="mt-3 space-y-2">
                <h3 className="text-sm font-medium line-clamp-2 text-white/90">
                  {anime.russian || anime.title}
                </h3>
                <p className="text-xs text-white/50">
                  {anime.kind === "tv" ? "TV Сериал" : anime.kind.toUpperCase()}
                  {anime.episodes > 0 && ` • ${anime.episodes} эп.`}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    ),
    [filteredAnimeList]
  );

  const renderListView = useCallback(
    () => (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-x-auto rounded-xl border border-white/5"
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="py-3 px-4 text-left font-medium text-white/40">Постер</th>
              <th className="py-3 px-4 text-left font-medium text-white/40">Название</th>
              <th className="py-3 px-4 text-left font-medium text-white/40">Тип</th>
              <th className="py-3 px-4 text-left font-medium text-white/40">Эпизоды</th>
              <th className="py-3 px-4 text-left font-medium text-white/40">Оценка</th>
            </tr>
          </thead>
          <tbody>
            {filteredAnimeList.map((anime) => (
              <tr
                key={anime.anime_id}
                className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
              >
                <td className="py-3 px-4">
                  <Link href={`/anime/${anime.anime_id}`} className="block w-[50px]">
                    <div className="relative aspect-[185/247] rounded-md overflow-hidden bg-white/[0.02] border border-white/5">
                      <Image
                        src={anime.poster_url}
                        alt={anime.russian || anime.title}
                        fill
                        className="object-cover"
                        sizes="50px"
                      />
                    </div>
                  </Link>
                </td>
                <td className="py-3 px-4">
                  <Link href={`/anime/${anime.anime_id}`} className="hover:text-[#CCBAE4] transition-colors">
                    <div className="font-medium text-white/80">{anime.russian || anime.title}</div>
                    <div className="text-xs text-white/40">{anime.title}</div>
                  </Link>
                </td>
                <td className="py-3 px-4 text-white/60 capitalize">
                  {anime.kind === "tv" ? "TV Сериал" : anime.kind.toUpperCase()}
                </td>
                <td className="py-3 px-4 text-white/60">{anime.episodes > 0 ? `${anime.episodes} эп.` : "Онгоинг"}</td>
                <td className="py-3 px-4 w-[100px]">
                  {anime.score ? (
                    <div className="flex items-center justify-center">
                      <CircularRating
                        score={parseFloat(anime.score)}
                        size={40}
                        className="opacity-75 hover:opacity-100 transition-opacity"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="text-white/40">—</span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    ),
    [filteredAnimeList]
  );

  if (!auth.isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white/60">Войдите, чтобы просматривать списки</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <Report />
      <div className="container mx-auto px-4 py-8">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
          {/* Заголовок и переключатели */}
          <div className="flex items-center justify-between">
            <h1 className="text-[32px] font-bold text-white/90">Мои списки</h1>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode("grid")}
                className={`w-10 h-10 rounded-xl ${
                  viewMode === "grid" ? "bg-white/[0.08] text-white" : "text-white/60 hover:bg-white/[0.04]"
                }`}
              >
                <LayoutGrid className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode("table")}
                className={`w-10 h-10 rounded-xl ${
                  viewMode === "table" ? "bg-white/[0.08] text-white" : "text-white/60 hover:bg-white/[0.04]"
                }`}
              >
                <Table2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Поиск */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
            <Input
              placeholder="Поиск по спискам"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-[58px] pl-12 bg-white/[0.02] border-white/5 rounded-xl text-white/90 placeholder:text-white/40"
            />
          </div>

          {/* Теги */}
          <div className="flex gap-2 flex-wrap">
            {tags.map((tag) => (
              <Button
                key={tag.id}
                onClick={() => setListsFilter({ activeTag: tag.id })}
                className={`h-[45px] px-4 rounded-xl flex items-center gap-2 transition-all duration-300 ${
                  listsFilter.activeTag === tag.id
                    ? "bg-white/[0.08] text-white"
                    : "bg-white/[0.02] hover:bg-white/[0.04] text-white/60"
                }`}
              >
                <tag.icon className="h-4 w-4" style={{ color: tag.color }} />
                <span>{tag.label}</span>
                <span className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[12px] ml-1">
                  {listCounts?.[tag.id] || 0}
                </span>
              </Button>
            ))}
          </div>

          {/* Список аниме */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              renderSkeletons()
            ) : listError ? (
              <div className="text-center py-8 text-white/40">Ошибка загрузки списка аниме</div>
            ) : (
              <div className="space-y-8">
                {viewMode === "grid" ? renderGridView() : renderListView()}
                {!filteredAnimeList.length && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-12 text-white/60"
                  >
                    <p className="text-3xl mb-3">🍜</p>
                    <p>В этом списке пока нет аниме</p>
                    <p className="text-sm mt-1">Самое время добавить что-нибудь интересное!</p>
                  </motion.div>
                )}
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <Footer />
    </>
  );
});

ListsPage.displayName = "ListsPage";
export default ListsPage;