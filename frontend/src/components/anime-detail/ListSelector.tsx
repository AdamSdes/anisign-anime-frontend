"use client";

import React, { useEffect, useState, useCallback } from "react";
import { atom, useAtom } from "jotai";
import { Check, ChevronDown, X, Eye, Clock, Pause, Ban, Plus, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"; 
import { motion } from "framer-motion";
import useSWR from "swr";
import { axiosInstance } from "@/lib/axios/axiosConfig";
import { useAnimeListSave, type AnimeListName } from "@/hooks/useAnimeList";

// Интерфейс пользователя для состояния аутентификации
interface User {
  id?: string;
  [key: string]: any;
}

// Атом для хранения состояния аутентификации
export const authAtom = atom<{ isAuthenticated: boolean; user: User | null }>({
  isAuthenticated: false,
  user: null,
});

// Интерфейс данных списков аниме
interface AnimeListsData {
  [key: string]: { anime_ids: number[] };
}

// Пропсы компонента ListSelector
interface ListSelectorProps {
  animeId: number;
  onListChange?: (listName: string | null) => void;
}

// Список категорий
const ANIME_LISTS = [
  { name: "Watching" as AnimeListName, label: "Смотрю", icon: Eye, color: "#CCBAE4" },
  { name: "Completed" as AnimeListName, label: "Просмотрено", icon: Check, color: "#86EFAC" },
  { name: "On Hold" as AnimeListName, label: "Отложено", icon: Pause, color: "#FCD34D" },
  { name: "Dropped" as AnimeListName, label: "Брошено", icon: Ban, color: "#FDA4AF" },
  { name: "Plan to Watch" as AnimeListName, label: "В планах", icon: Clock, color: "#93C5FD" },
];

// Функция для получения данных через SWR
const fetcher = (url: string) => axiosInstance.get<AnimeListsData>(url).then((res) => res.data);

// Основной компонент
export const ListSelector: React.FC<ListSelectorProps> = React.memo(({ animeId, onListChange }) => {
  const [currentList, setCurrentList] = useState<AnimeListName | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [{ isAuthenticated }] = useAtom(authAtom);
  const { isCheckingList, isUpdatingList, getAnimeList, addAnimeToList, removeAnimeFromList } = useAnimeListSave();

  // Подключаем SWR для кэширования данных
  const { data: listsData } = useSWR<AnimeListsData>(
    isAuthenticated ? `http://localhost:8000/anime_save_list/get-anime-list-by-name` : null,
    fetcher,
    { dedupingInterval: 60000, revalidateOnFocus: false }
  );

  // Проверка текущего списка
  const checkCurrentList = useCallback(async () => {
    if (!isAuthenticated) {
      setCurrentList(null);
      onListChange?.(null);
      return;
    }

    try {
      if (listsData) {
        for (const list of ANIME_LISTS) {
          if (listsData[list.name]?.anime_ids.includes(animeId)) {
            setCurrentList(list.name);
            onListChange?.(list.name);
            return;
          }
        }
        setCurrentList(null);
        onListChange?.(null);
      } else {
        for (const list of ANIME_LISTS) {
          const animeList = await getAnimeList(list.name);
          if (animeList?.anime_ids?.includes(animeId)) {
            setCurrentList(list.name);
            onListChange?.(list.name);
            return;
          }
        }
        setCurrentList(null);
        onListChange?.(null);
      }
    } catch (error) {
      console.error("Ошибка при проверке списка:", error);
    }
  }, [animeId, isAuthenticated, listsData, getAnimeList, onListChange]);

  useEffect(() => {
    checkCurrentList();
  }, [checkCurrentList]);

  // Обработчик изменения списка
  const handleListChange = useCallback(
    async (listName: AnimeListName | null) => {
      if (isUpdatingList || currentList === listName) return;

      try {
        if (!listName && currentList) {
          if (await removeAnimeFromList(animeId)) {
            setCurrentList(null);
            onListChange?.(null);
          }
          return;
        }

        if (listName) {
          if (await addAnimeToList(listName, animeId)) {
            setCurrentList(listName);
            onListChange?.(listName);
          }
        }
      } catch (error) {
        console.error("Ошибка изменения списка:", error);
      } finally {
        setDropdownOpen(false);
      }
    },
    [animeId, currentList, isUpdatingList, addAnimeToList, removeAnimeFromList, onListChange]
  );

  // Обработчик удаления
  const handleRemoveFromList = useCallback(async () => {
    if (isUpdatingList || !currentList) return;

    try {
      if (await removeAnimeFromList(animeId)) {
        setCurrentList(null);
        onListChange?.(null);
        setDropdownOpen(false);
      }
    } catch (error) {
      console.error("Ошибка удаления:", error);
    }
  }, [animeId, currentList, isUpdatingList, removeAnimeFromList, onListChange]);

  const currentListData = ANIME_LISTS.find((list) => list.name === currentList);

  if (!isAuthenticated) {
    return <div className="text-gray-400">Требуется авторизация</div>;
  }

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <motion.button
          whileHover={{ opacity: 0.8 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-between h-[60px] bg-gray-800 border border-gray-600 rounded-xl px-5 text-white"
        >
          <div className="flex items-center gap-2">
            {currentListData ? (
              <>
                <currentListData.icon className="h-5 w-5" style={{ color: currentListData.color }} />
                <span>{currentListData.label}</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">Добавить в список</span>
              </>
            )}
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {ANIME_LISTS.map((list) => (
          <DropdownMenuItem key={list.name} onClick={() => handleListChange(list.name)}>
            <list.icon className="h-4 w-4 mr-2" style={{ color: list.color }} />
            {list.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleRemoveFromList}>
          <Trash2 className="h-4 w-4 mr-2 text-red-500" />
          Удалить из списка
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
