"use client";

import React, { useCallback } from "react";
import { atom, useAtom } from "jotai";
import useSWR from "swr";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Table2, ArrowRight, Eye, Check, Clock, X, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Image } from "../ui/image";
import { CircularRating } from "@/components/ui/circularRating";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios/axiosConfig";

/**
 * Атом для состояния аутентификации
 * @type {Atom<{ isAuthenticated: boolean; user: { username: string; ... } | null }>}
 */
export const authAtom = atom<{
  isAuthenticated: boolean;
  user: { username: string; nickname?: string; user_avatar?: string; banner?: string; isPro?: boolean } | null;
}>({
  isAuthenticated: false,
  user: null,
});

/**
 * Интерфейс данных аниме
 * @interface AnimeItem
 */
interface AnimeItem {
  anime_id: string;
  name: string;
  russian: string;
  poster_url: string;
  kind: string;
  episodes: number;
  episodes_aired: number;
  score?: string;
}

/**
 * Интерфейс данных количества списков
 * @interface ListCounts
 */
interface ListCounts {
  [key: string]: number;
}

/**
 * Компонент списка аниме
 * @description Отображает список аниме пользователя с возможностью переключения режимов отображения
 * @returns {JSX.Element}
 */
export const AnimeList: React.FC = React.memo(() => {
  const [auth] = useAtom(authAtom);
  const [activeTag, setActiveTag] = React.useState("Watching");
  const [viewMode, setViewMode] = React.useState("grid");

  // Загрузка количества аниме в списках
  const { data: listCounts, error: countsError } = useSWR<ListCounts>(
    auth.user ? "/api/anime_save_list/counts" : null,
    (url) => axiosInstance.get(url).then((res: { data: any; }) => res.data),
    { revalidateOnFocus: false }
  );

  // Загрузка списка аниме
  const { data: animeList, error: listError, isLoading } = useSWR<AnimeItem[]>(
    auth.user && activeTag ? `/api/anime_save_list/get-anime-list-by-name/${encodeURIComponent(activeTag)}` : null,
    (url) =>
      axiosInstance
        .get(url)
        .then((res: { data: { anime_ids: never[]; }; }) => {
          const animeIds = res.data.anime_ids || [];
          return Promise.all(
            animeIds.map((id: string) =>
              axiosInstance.get(`/api/anime/id/${id}`).then((res: { data: any; }) => res.data)
            )
          );
        }),
    { revalidateOnFocus: false }
  );

  const tags = [
    { id: "Watching", label: "Смотрю", icon: Eye, color: "#CCBAE4" },
    { id: "Completed", label: "Просмотрел", icon: Check, color: "#86EFAC" },
    { id: "Plan to Watch", label: "Планирую", icon: Clock, color: "#93C5FD" },
    { id: "Dropped", label: "Бросил", icon: X, color: "#FDA4AF" },
    { id: "On Hold", label: "Отложил", icon: Pause, color: "#FCD34D" },
  ];

  const renderSkeletons = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
    >
      {[...Array(4)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="w-full aspect-[3/4] rounded-[14px] bg-white/5"></div>
          <div className="mt-3 space-y-2">
            <div className="h-4 bg-white/5 rounded-md"></div>
            <div className="h-4 w-2/3 bg-white/5 rounded-md"></div>
            <div className="h-3 w-1/2 bg-white/5 rounded-md"></div>
          </div>
        </div>
      ))}
    </motion.div>
  );

  const renderGridView = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
    >
      {animeList?.map((anime) => (
        <motion.div
          key={anime.anime_id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link href={`/anime/${anime.anime_id}`} className="block relative">
            {anime.score && (
              <div className="absolute top-2 left-2 z-30 flex items-center gap-1 bg-black backdrop-blur-sm rounded-full px-2.5 py-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" className="white">
                  <path fill="currentColor" d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z" />
                </svg>
                <span className="text-sm font-medium text-white">{Number(anime.score).toFixed(1)}</span>
              </div>
            )}
            <div className="relative group">
              <div className="relative w-full aspect-[3/4] rounded-[14px] overflow-hidden bg-white/5">
                <img
                  className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                  alt={anime.russian || anime.name}
                  src={anime.poster_url}
                />
              </div>
              <div className="mt-3 space-y-2">
                <h3 className="text-sm font-medium line-clamp-2">{anime.russian || anime.name}</h3>
                <p className="text-xs text-white/50">
                  {anime.kind === "tv" ? "TV Сериал" : anime.kind.toUpperCase()}
                  {anime.episodes > 1 && ` • ${anime.episodes} эп.`}
                </p>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );

  const renderTableView = () => (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5">
            <th className="py-3 px-4 text-left font-medium text-white/40">Постер</th>
            <th className="py-3 px-4 text-left font-medium text-white/40">Название</th>
            <th className="py-3 px-4 text-left font-medium text-white/40">Тип</th>
            <th className="py-3 px-4 text-left font-medium text-white/40">Эпизоды</th>
            <th className="py-3 px-4 text-left font-medium text-white/40">Оценка</th>
            <th className="py-3 px-4 text-left font-medium text-white/40">Действия</th>
          </tr>
        </thead>
        <tbody>
          {animeList?.map((anime) => (
            <tr key={anime.anime_id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
              <td className="py-3 px-4">
                <Link href={`/anime/${anime.anime_id}`} className="block w-[50px]">
                  <div className="relative aspect-[185/247] rounded-md overflow-hidden bg-white/[0.02] border border-white/5">
                    <Image
                      src={anime.poster_url}
                      alt={anime.russian || anime.name}
                      className="object-cover"
                      sizes="50px"
                    />
                  </div>
                </Link>
              </td>
              <td className="py-3 px-4">
                <Link href={`/anime/${anime.anime_id}`} className="hover:text-[#CCBAE4] transition-colors">
                  <div className="font-medium text-white/80">{anime.russian || anime.name}</div>
                  <div className="text-xs text-white/40">{anime.name}</div>
                </Link>
              </td>
              <td className="py-3 px-4 text-white/60 capitalize">
                {anime.kind === "tv" ? "TV Сериал" : (anime.kind || "Unknown").toUpperCase()}
              </td>
              <td className="py-3 px-4 text-white/60">
                {anime.episodes > 0 ? `${anime.episodes} эп.` : "Онгоинг"}
              </td>
              <td className="py-3 px-4 w-[100px]">
                {anime.score ? (
                  <div className="flex items-center justify-center">
                    <CircularRating score={Number(anime.score)} size={40} className="opacity-75 hover:opacity-100 transition-opacity" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span className="text-white/40">—</span>
                  </div>
                )}
              </td>
              <td className="py-3 px-4">
                <Link
                  href={`/anime/${anime.anime_id}`}
                  className="inline-flex px-3 py-1.5 text-xs font-medium text-white/60 hover:text-white/90 bg-white/[0.02] hover:bg-white/[0.04] rounded-lg border border-white/5 transition-all duration-200"
                >
                  Перейти
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (!auth.isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[400px]"
      >
        <p className="text-white/60">Войдите в аккаунт чтобы увидеть свои списки</p>
      </motion.div>
    );
  }

  if (countsError || listError) {
    toast.error("Не удалось загрузить список аниме");
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-[32px] font-bold text-white/90">Мои списки</h1>
          <Link href="/profile/lists">
            <Button
              variant="ghost"
              className="h-[45px] px-4 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-xl text-white/60 hover:text-white/90 transition-colors"
            >
              <span className="mr-2">Открыть список</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode("grid")}
            className={`w-10 h-10 rounded-xl ${
              viewMode === "grid" ? "bg-white/[0.08] text-white" : "text-white/60 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <LayoutGrid className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode("table")}
            className={`w-10 h-10 rounded-xl ${
              viewMode === "table" ? "bg-white/[0.08] text-white" : "text-white/60 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Table2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {tags.map((tag) => (
          <Button
            key={tag.id}
            onClick={() => setActiveTag(tag.id)}
            className={`h-[45px] px-4 rounded-xl flex items-center gap-2 transition-all duration-300 ${
              activeTag === tag.id
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

      <AnimatePresence mode="wait">
        {isLoading ? (
          renderSkeletons()
        ) : animeList?.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[200px] text-white/60"
          >
            <p className="text-3xl mb-3">🍜</p>
            <p>В этом списке пока нет аниме</p>
            <p className="text-sm mt-1">Самое время добавить что-нибудь интересное!</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === "grid" ? renderGridView() : renderTableView()}
          </AnimatePresence>
        )}
      </AnimatePresence>
    </div>
  );
});

AnimeList.displayName = "AnimeList";
export default AnimeList;