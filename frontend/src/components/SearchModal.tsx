'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Command } from 'cmdk';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Image } from "@/components/ui/image";
import { axiosInstance } from '@/lib/api/axiosConfig';
import { Search, X, Calendar, Eye, Star } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchResult {
  anime_id: string;
  name: string;
  russian: string;
  score: string;
  episodes: number;
  episodes_aired: number;
  aired_on: string;
  poster_url: string;
}

interface UserSearchResult {
  username: string;
  user_avatar: string;
  user_banner: string;
  nickname: string;
  id: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'anime' | 'users'>('anime');
  const [animeResults, setAnimeResults] = useState<SearchResult[]>([]);
  const [userResults, setUserResults] = useState<UserSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearch = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedSearch.length < 2) {
        setAnimeResults([]);
        setUserResults([]);
        return;
      }

      setIsLoading(true);
      try {
        if (searchType === 'anime') {
          const response = await axiosInstance.get(`/anime/search?search=${debouncedSearch}`);
          setAnimeResults(response.data.slice(0, 5));
          setUserResults([]);
        } else {
          try {
            const response = await axiosInstance.get(`/user/search?username=${debouncedSearch}`);
            if (response.data && Array.isArray(response.data)) {
              setUserResults(response.data.slice(0, 5));
            } else if (response.data) {
              setUserResults([response.data]);
            } else {
              setUserResults([]);
            }
            setAnimeResults([]);
          } catch (userError) {
            console.error('Error in user search:', userError);
            // Try single user endpoint as fallback
            try {
              const singleUserResponse = await axiosInstance.get(`/user/get-user-by-username/${debouncedSearch}`);
              if (singleUserResponse.data) {
                setUserResults([singleUserResponse.data]);
              } else {
                setUserResults([]);
              }
            } catch (singleUserError) {
              console.error('Error in single user search:', singleUserError);
              setUserResults([]);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        setAnimeResults([]);
        setUserResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedSearch, searchType]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onClose();
      }

      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [onClose]);

  const handleSelect = (item: string, type: 'anime' | 'users') => {
    if (type === 'anime') {
      router.push(`/anime/${item}`);
    } else {
      router.push(`/profile/${item}`);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
        >
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-[640px] mx-4"
            >
              <Command className="rounded-xl border border-white/5 bg-[#060606]/95 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center border-b border-white/5 px-4">
                  <Search className="h-5 w-5 text-white/40" />
                  <Command.Input
                    ref={inputRef}
                    value={query}
                    onValueChange={setQuery}
                    placeholder={searchType === 'anime' ? "Поиск аниме..." : "Поиск пользователей..."}
                    className="flex-1 bg-transparent px-4 py-5 outline-none placeholder:text-white/40 text-[15px] text-white/90"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSearchType(searchType === 'anime' ? 'users' : 'anime')}
                      className="px-3 py-1 text-sm text-white/60 hover:text-white/90 transition-colors"
                    >
                      {searchType === 'anime' ? 'Аниме' : 'Пользователи'}
                    </button>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5 text-white/40" />
                    </button>
                  </div>
                </div>

                <Command.List className="max-h-[400px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {query.length < 2 ? (
                    <div className="py-16 text-center">
                      <Search className="h-8 w-8 text-white/20 mx-auto mb-4" />
                      <p className="text-white/40 text-sm">
                        {searchType === 'anime' 
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
                  ) : searchType === 'anime' ? (
                    animeResults.length === 0 ? (
                      <div className="py-16 text-center">
                        <p className="text-white/40 text-sm">Ничего не найдено</p>
                      </div>
                    ) : (
                      animeResults.map((anime) => (
                        <Command.Item
                          key={anime.anime_id}
                          value={anime.name}
                          onSelect={() => handleSelect(anime.anime_id, 'anime')}
                          className="px-4 py-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                        >
                          <div className="flex gap-4">
                            <div className="relative w-[100px] h-[140px] rounded-lg overflow-hidden bg-white/5">
                              <Image
                                src={anime.poster_url}
                                alt={anime.russian || anime.name}
                                className="object-cover"
                                fill
                                sizes="100px"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-[15px] font-medium text-white/90 mb-2">
                                {anime.russian || anime.name}
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
                                {anime.score && (
                                  <div className="flex items-center gap-1.5">
                                    <Star className="h-4 w-4" />
                                    <span>{anime.score}</span>
                                  </div>
                                )}
                              </div>
                              <p className="text-[13px] text-white/40">
                                {anime.name}
                              </p>
                            </div>
                          </div>
                        </Command.Item>
                      ))
                    )
                  ) : (
                    userResults.length === 0 ? (
                      <div className="py-16 text-center">
                        <p className="text-white/40 text-sm">Пользователь не найден</p>
                      </div>
                    ) : (
                      userResults.map((user) => (
                        <Command.Item
                          key={user.id}
                          value={user.username}
                          onSelect={() => handleSelect(user.username, 'users')}
                          className="px-4 py-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                        >
                          <div className="flex gap-4 items-center">
                            <div className="relative w-[50px] h-[50px] rounded-full overflow-hidden bg-white/5">
                              <Image
                                src={user.user_avatar}
                                alt={user.username}
                                className="object-cover"
                                fill
                                sizes="50px"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-[15px] font-medium text-white/90">
                                {user.nickname || user.username}
                              </h4>
                              <p className="text-[13px] text-white/40">
                                @{user.username}
                              </p>
                            </div>
                          </div>
                        </Command.Item>
                      ))
                    )
                  )}
                </Command.List>
              </Command>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
