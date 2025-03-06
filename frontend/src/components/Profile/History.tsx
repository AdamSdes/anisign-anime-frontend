"use client";

import React from "react";
import { atom, useAtom } from "jotai";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { PlayCircle, History as HistoryIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { axiosInstance } from "@/lib/axios/axiosConfig";

/**
 * Атом для состояния аутентификации
 * @type {Atom<{ isAuthenticated: boolean; user: { username: string; ... } | null }>}
 */
export const authAtom = atom<{
  isAuthenticated: boolean;
  user: { username: string; userId: string; nickname?: string; user_avatar?: string; banner?: string; isPro?: boolean; token?: string; } | null;
}>({
  isAuthenticated: false,
  user: null,
});

/**
 * Интерфейс данных аниме
 * @interface Anime
 */
interface Anime {
  id: string;
  anime_id: string;
  english: string;
  russian: string;
  episodes: number;
  episodesAired: number;
  poster_url: string;
  kind: string;
}

/**
 * Интерфейс истории просмотров
 * @interface ViewHistory
 */
interface ViewHistory {
  id: string;
  anime_id_list: string[];
  last_watched_at: string;
  is_finished: boolean | null;
  user_id: string;
}

/**
 * Интерфейс ответа API
 * @interface HistoryResponse
 */
interface HistoryResponse {
  user_view_history: ViewHistory[];
  animes: Anime[];
}

/**
 * Пропсы компонента History
 * @interface HistoryProps
 */
interface HistoryProps {
  userId: string;
}

/**
 * Компонент истории просмотров
 * @description Отображает историю просмотров пользователя с возможностью показать все записи
 * @param {HistoryProps} props - Пропсы компонента
 * @returns {JSX.Element}
 */
export const History: React.FC<HistoryProps> = React.memo(({ userId }) => {
  const router = useRouter();
  const [auth] = useAtom(authAtom);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  // Загрузка данных истории через SWR
  const { data: historyData, error, isLoading } = useSWR<HistoryResponse>(
    userId ? `/viewhistory/get-view-history-of-user/${userId}` : null,
    (url) =>
      axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${auth?.user?.token || localStorage.getItem("token")}`,
        },
      }).then((res: { data: any; }) => res.data),
    { revalidateOnFocus: false }
  );

  // Функции форматирования
  const getKindText = (kind: string) => {
    const kinds: { [key: string]: string } = {
      tv: "TV Сериал",
      movie: "Фильм",
      ova: "OVA",
      ona: "ONA",
      special: "Спешл",
      music: "Клип",
    };
    return kinds[kind] || kind;
  };

  const truncateText = (text: string, maxLength: number = 21) => {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
  };

  if (isLoading) return <div className="text-white/40">Загрузка...</div>;
  if (error) return <div className="text-red-500">Ошибка загрузки истории</div>;
  if (!historyData?.user_view_history.length) return <div className="text-white/40">История просмотров пуста</div>;

  const uniqueAnimeIds = [...new Set(historyData.user_view_history[0].anime_id_list)].reverse();
  const historyItems = uniqueAnimeIds
    .map((animeId) => {
      const anime = historyData.animes.find((a) => a.id === animeId);
      if (!anime) return null;

      return {
        id: anime.id,
        anime_id: anime.anime_id,
        title: truncateText(anime.russian || anime.english),
        episodes: `${anime.episodesAired}/${anime.episodes}`,
        image: anime.poster_url,
        kind: getKindText(anime.kind),
      };
    })
    .filter(Boolean);

  const HistoryItem = ({ item }: { item: any }) => (
    <div
      className="bg-[rgba(255,255,255,0.02)] border border-white/5 rounded-[14px] p-3 hover:bg-[rgba(255,255,255,0.04)] transition-all duration-300 cursor-pointer group w-full"
      onClick={() => router.push(`/anime/${item?.anime_id}`)}
    >
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <div className="relative shrink-0">
          <img
            src={item?.image}
            alt={item?.title}
            className="w-full sm:w-[100px] h-[60px] object-cover rounded-lg"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <PlayCircle className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-[14px] font-medium text-white/90 group-hover:text-white transition-colors duration-300 truncate">
            {item?.title}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <div className="px-3 py-1 h-fit rounded-full bg-[rgba(255,255,255,0.05)] text-[12px] text-white/60">
              {item?.episodes}
            </div>
            <span className="text-[12px] text-white/40">{item?.kind}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HistoryIcon className="w-5 h-5 text-white/40" />
          <h2 className="text-white/80 text-sm font-medium">История просмотров</h2>
          <span className="text-white/40 text-sm">({historyItems.length})</span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="text-xs text-white/40 hover:text-white/60 transition-colors"
            >
              Показать всё
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-[#0A0A0A] border-l border-white/5 overflow-y-auto">
            <SheetHeader className="mb-6">
              <div className="flex items-center gap-2">
                <HistoryIcon className="w-5 h-5 text-white/40" />
                <SheetTitle className="text-white/90 text-left">История просмотров</SheetTitle>
                <span className="text-white/40 text-sm">({historyItems.length})</span>
              </div>
            </SheetHeader>
            <div className="grid gap-3 pr-6 pb-20">
              {historyItems.map((item, index) => (
                <HistoryItem key={`${item?.id}-${index}-sheet`} item={item} />
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid gap-3">
        {historyItems.slice(0, 5).map((item, index) => (
          <HistoryItem key={`${item?.id}-${index}`} item={item} />
        ))}
      </div>
    </div>
  );
});

History.displayName = "History";
export default History;