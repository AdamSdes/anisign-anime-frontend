"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { atom, useAtom } from "jotai";
import useSWR from "swr";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { Image } from "@/components/ui/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getAvatarUrl } from "@/lib/utils/avatar";
import { Search, X, Calendar, Eye, Star } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { motion, AnimatePresence } from "framer-motion";
import { axiosInstance } from "@/lib/axios/axiosConfig";

/**
 * Атом для состояния аутентификации
 * @type {Atom<{ isAuthenticated: boolean; user: { username: string; token?: string; ... } | null }>}
 */
export const authAtom = atom<{
  isAuthenticated: boolean;
  user: { username: string; token?: string; nickname?: string; user_avatar?: string; banner?: string; isPro?: boolean } | null;
}>({
  isAuthenticated: false,
  user: null,
});

/**
 * Интерфейс данных аниме
 * @interface Anime
 */
interface Anime {
  anime_id: string;
  name: string;
  russian: string;
  english: string;
  kind: string;
  episodes: number;
  aired_on: string;
  poster_url: string;
  score: number;
}

/**
 * Интерфейс данных пользователя для поиска
 * @interface UserSearchResult
 */
interface UserSearchResult {
  username: string;
  user_avatar: string;
  user_banner: string;
  nickname: string;
  id: string;
}

/**
 * Пропсы компонента SearchModal
 * @interface SearchModalProps
 */
interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Компонент модального окна поиска
 * @description Отображает модальное окно для поиска аниме и пользователей с анимацией и фильтрацией
 * @param {SearchModalProps} props - Пропсы компонента
 * @returns {JSX.Element}
 */
export const SearchModal: React.FC<SearchModalProps> = React.memo(({ isOpen, onClose }) => {
  const router = useRouter();
  const [auth] = useAtom(authAtom);
  const [query, setQuery] = React.useState("");
  const [searchType, setSearchType] = React.useState<"anime" | "users">("anime");
  const debouncedSearch = useDebounce(query, 500);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const kindTransformations: Record<string, string> = {
    tv: "ТВ Сериал",
    tv_special: "ТВ Спешл",
    movie: "Фильм",
    ova: "OVA",
    ona: "ONA",
    special: "Спешл",
    music: "Клип",
  };

  const getTransformedKind = (kind: string): string => kindTransformations[kind] || kind.toUpperCase();

  // Загрузка данных через SWR
  const { data: searchResults, error, isLoading } = useSWR<
    { anime_list?: Anime[]; user_list?: UserSearchResult[] } | null
  >(
    debouncedSearch.length >= 2 && auth.isAuthenticated
      ? `/api/search/${searchType}/${encodeURIComponent(debouncedSearch)}`
      : null,
    (url) =>
      axiosInstance
        .get(url, {
          headers: { Authorization: `Bearer ${auth.user?.token || localStorage.getItem("token")}` },
        })
        .then((res: { data: any; }) => res.data),
    { revalidateOnFocus: false }
  );

  const animeResults = searchResults?.anime_list?.slice(0, 5) || [];
  const userResults = searchResults?.user_list?.slice(0, 5) || [];

  const handleClose = useCallback(() => {
    onClose();
    setQuery("");
  }, [onClose]);

  const handleSelect = (item: string | number, type: "anime" | "users") => {
    if (type === "anime") {
      router.push(`/anime/${item}`);
    } else {
      router.push(`/profile/${item}`);
    }
    handleClose();
  };

  const handleSearchTypeChange = () => {
    setQuery("");
    setSearchType(searchType === "anime" ? "users" : "anime");
  };

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleClose();
    }
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleClose();
      }
      if (e.key === "Escape") {
        handleClose();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [handleClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          onClick={handleOutsideClick}
        >
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24">
            <motion.div
              ref={modalRef}
              className="relative w-full max-w-[640px] mx-4"
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            >
              <Command className="rounded-xl border border-white/5 bg-[#060606]/95 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center border-b border-white/5 px-4">
                  <Search className="h-5 w-5 text-white/40" />
                  <Command.Input
                    ref={inputRef}
                    value={query}
                    onValueChange={setQuery}
                    placeholder={searchType === "anime" ? "Поиск аниме..." : "Поиск пользователей..."}
                    className="flex-1 bg-transparent px-4 py-5 outline-none placeholder:text-white/40 text-[15px] text-white/90"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSearchTypeChange}
                      className="px-3 py-1 text-sm text-white/60 hover:text-white/90 transition-colors"
                    >
                      {searchType === "anime" ? "Аниме" : "Пользователи"}
                    </button>
                    <button onClick={handleClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                      <X className="h-5 w-5 text-white/40" />
                    </button>
                  </div>
                </div>

                <Command.List className="max-h-[400px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  <AnimatePresence mode="sync">
                    <motion.div
                      key={searchType}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                    >
                      {query.length < 2 ? (
                        <div className="py-16 text-center">
                          <Search className="h-8 w-8 text-white/20 mx-auto mb-4" />
                          <p className="text-white/40 text-sm">
                            {searchType === "anime"
                              ? "Начните вводить название аниме..."
                              : "Начните вводить имя пользователя..."}
                          </p>
                        </div>
                      ) : isLoading ? (
                        <div className="p-4 space-y-4">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex gap-4 items-center animate-pulse">
                              <div className="w-[100px] h-[140px] rounded-lg bg-white/5" />
                              <div className="flex-1 space-y-3">
                                <div className="h-4 w-2/3 bg-white/5 rounded" />
                                <div className="h-3 w-1/2 bg-white/5 rounded" />
                                <div className="h-3 w-1/3 bg-white/5 rounded" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : error || (!animeResults.length && !userResults.length) ? (
                        <div className="py-16 text-center">
                          <p className="text-white/40 text-sm">Ничего не найдено</p>
                        </div>
                      ) : searchType === "anime" ? (
                        animeResults.map((anime) => (
                          <Command.Item
                            key={anime.anime_id}
                            value={anime.russian || anime.english || ""}
                            onSelect={() => handleSelect(anime.anime_id, "anime")}
                            className="px-4 py-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                          >
                            <div className="flex gap-4">
                              <div className="relative w-[100px] h-[140px] rounded-lg overflow-hidden bg-white/5">
                                <Image
                                  src={anime.poster_url}
                                  alt={anime.russian || anime.english}
                                  className="object-cover"
                                  sizes="100px"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-[15px] font-medium text-white/90 mb-2">
                                  {anime.russian || anime.english || anime.name}
                                </h4>
                                <div className="flex items-center gap-4 text-[13px] text-white/40 mb-3">
                                  <div className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(anime.aired_on).getFullYear()}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Eye className="h-4 w-4" />
                                    <span>{anime.episodes} эп.</span>
                                  </div>
                                  {anime.score > 0 && (
                                    <div className="flex items-center gap-1.5">
                                      <Star className="h-4 w-4" />
                                      <span>{anime.score.toFixed(2)}</span>
                                    </div>
                                  )}
                                </div>
                                <p className="text-[13px] text-white/40">
                                  {getTransformedKind(anime.kind)}
                                </p>
                              </div>
                            </div>
                          </Command.Item>
                        ))
                      ) : (
                        userResults.map((user) => (
                          <Command.Item
                            key={user.id}
                            value={user.username}
                            onSelect={() => handleSelect(user.username, "users")}
                            className="px-4 py-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                          >
                            <div className="flex gap-4 items-center">
                              <Avatar className="w-[50px] h-[50px]">
                                <AvatarImage src={getAvatarUrl(user.user_avatar)} alt={user.username} />
                                <AvatarFallback>
                                  {user.nickname?.[0]?.toUpperCase() || user.username[0].toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-[15px] font-medium text-white/90">
                                  {user.nickname || user.username}
                                </h4>
                                <p className="text-[13px] text-white/40">@{user.username}</p>
                              </div>
                            </div>
                          </Command.Item>
                        ))
                      )}
                    </motion.div>
                  </AnimatePresence>
                </Command.List>
              </Command>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

SearchModal.displayName = "SearchModal";
export default SearchModal;