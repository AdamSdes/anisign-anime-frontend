'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { Image } from "@/components/ui/image";
import { axiosInstance } from '@/lib/api/axiosConfig';
import { Search, X, Calendar, Eye, Star } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getAvatarUrl } from '@/utils/avatar';
import { Anime } from '@/types/anime';

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

const kindTransformations: Record<string, string> = {
  tv: 'ТВ Сериал',
  tv_special: 'ТВ Спешл',
  movie: 'Фильм',
  ova: 'OVA',
  ona: 'ONA',
  special: 'Спешл',
  music: 'Клип'
};

const getTransformedKind = (kind: string): string => {
  return kindTransformations[kind] || kind.toUpperCase();
};

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'anime' | 'users'>('anime');
  const [animeResults, setAnimeResults] = useState<Anime[]>([]);
  const [userResults, setUserResults] = useState<UserSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearch = useDebounce(query, 500);
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
          try {
            const response = await axiosInstance.get(`/anime/name/${encodeURIComponent(debouncedSearch)}`);
            console.log('Anime search response:', response.data);
            if (response.data && response.data.anime_list) {
              console.log('First anime in list:', JSON.stringify(response.data.anime_list[0], null, 2));
              setAnimeResults(response.data.anime_list.slice(0, 5));
            } else {
              setAnimeResults([]);
            }
          } catch (animeError) {
            console.error('Error in anime search:', animeError);
            setAnimeResults([]);
          }
          setUserResults([]);
        } else {
          try {
            const response = await axiosInstance.get(`/user/name/${debouncedSearch}`);
            console.log('User search response:', response.data);
            if (response.data && response.data.user_list) {
              console.log('User list:', response.data.user_list);
              setUserResults(response.data.user_list.slice(0, 5));
            } else {
              console.log('No user list in response');
              setUserResults([]);
            }
            setAnimeResults([]);
          } catch (userError) {
            console.error('Error in user search:', userError);
            setUserResults([]);
          }
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        setAnimeResults([]);
        setUserResults([]);
      } finally {
        console.log('Setting isLoading to false');
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

  const handleSelect = (item: string | number, type: 'anime' | 'users') => {
    if (type === 'anime') {
      router.push(`/anime/${item}`);
    } else {
      router.push(`/profile/${item}`);
    }
    onClose();
  };

  if (!isOpen) return null;

  const EmptyState = () => (
    <div className="py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
        <Search className="h-8 w-8 text-white/20" />
      </div>
      <p className="text-white/40 text-[15px]">
        {query.length < 2
          ? searchType === 'anime' 
            ? "Начните вводить название аниме..."
            : "Начните вводить имя пользователя..."
          : searchType === 'anime' 
            ? "Ничего не найдено" 
            : "Пользователь не найден"
        }
      </p>
    </div>
  );

  const LoadingState = () => (
    <div className="px-4 space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex gap-4 items-center animate-pulse">
          <div className="w-[120px] h-[170px] rounded-xl bg-white/5" />
          <div className="flex-1 space-y-4">
            <div className="h-5 w-2/3 bg-white/5 rounded-lg" />
            <div className="h-4 w-1/2 bg-white/5 rounded-lg" />
            <div className="flex gap-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="h-8 w-20 bg-white/5 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm transition-all duration-200">
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20" onClick={onClose}>
        <div className="relative w-full max-w-[700px] mx-4" onClick={(e) => e.stopPropagation()}>
          <Command shouldFilter={false} className="rounded-2xl border border-white/5 bg-[#060606]/95 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="flex items-center border-b border-white/5 px-6">
              <Search className="h-5 w-5 text-white/30" />
              <Command.Input
                ref={inputRef}
                value={query}
                onValueChange={setQuery}
                placeholder={searchType === 'anime' ? "Поиск аниме..." : "Поиск пользователей..."}
                className="flex-1 bg-transparent px-4 py-6 outline-none placeholder:text-white/30 text-[15px] text-white/90"
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSearchType(searchType === 'anime' ? 'users' : 'anime')}
                  className={`px-4 py-1.5 rounded-full text-sm transition-all duration-200 ${
                    searchType === 'anime' 
                      ? 'bg-white/10 text-white' 
                      : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  {searchType === 'anime' ? 'Аниме' : 'Пользователи'}
                </button>
                <div className="w-[1px] h-6 bg-white/5" />
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors group"
                >
                  <X className="h-5 w-5 text-white/40 group-hover:text-white/60 transition-colors" />
                </button>
              </div>
            </div>

            <Command.List className="max-h-[600px] overflow-y-auto py-4 px-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {query.length < 2 || (searchType === 'anime' ? animeResults.length === 0 : userResults.length === 0) ? (
                <EmptyState />
              ) : isLoading ? (
                <LoadingState />
              ) : (
                <Command.Group>
                  {searchType === 'anime' && animeResults.map((anime) => (
                    <Command.Item
                      key={anime.anime_id}
                      value={anime.russian || anime.english || ''}
                      onSelect={() => handleSelect(anime.anime_id, 'anime')}
                      className="px-4 py-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all group"
                    >
                      <div className="flex gap-4">
                        <div className="relative w-[120px] h-[170px] rounded-xl overflow-hidden bg-white/5 group-hover:shadow-lg transition-all">
                          <Image
                            src={anime.poster_url}
                            alt={anime.russian || anime.english}
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            fill="true"
                            sizes="120px"
                          />
                          {anime.score > 0 && (
                            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5">
                              <Star className="h-3 w-3 text-[#FFE4A0]" />
                              <span className="text-xs font-medium text-[#FFE4A0]">{anime.score.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 py-1">
                          <h4 className="text-[15px] font-medium text-white/90 mb-2 group-hover:text-white transition-colors">
                            {anime.russian || anime.english || anime.name}
                          </h4>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="px-3 py-1.5 text-xs rounded-lg bg-white/5 text-white/60">
                              {getTransformedKind(anime.kind)}
                            </span>
                            {anime.episodes > 0 && (
                              <span className="px-3 py-1.5 text-xs rounded-lg bg-white/5 text-white/60">
                                {anime.episodes} эпизодов
                              </span>
                            )}
                            {anime.aired_on && (
                              <span className="px-3 py-1.5 text-xs rounded-lg bg-white/5 text-white/60">
                                {new Date(anime.aired_on).getFullYear()}
                              </span>
                            )}
                          </div>
                          {anime.description && (
                            <p className="text-sm text-white/40 line-clamp-2">
                              {anime.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </Command.Item>
                  ))}

                  {searchType === 'users' && userResults.map((user) => (
                    <Command.Item
                      key={user.id}
                      value={user.username}
                      onSelect={() => handleSelect(user.username, 'users')}
                      className="px-4 py-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all group"
                    >
                      <div className="flex gap-4 items-center">
                        <Avatar className="w-14 h-14 rounded-xl border-2 border-transparent group-hover:border-white/10 transition-all">
                          <AvatarImage
                            src={getAvatarUrl(user.user_avatar)}
                            alt={user.username}
                            className="object-cover"
                          />
                          <AvatarFallback className="text-lg font-medium">
                            {user.nickname?.[0]?.toUpperCase() || user.username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[15px] font-medium text-white/90 group-hover:text-white transition-colors">
                            {user.nickname || user.username}
                          </h4>
                          <p className="text-sm text-white/40">
                            @{user.username}
                          </p>
                        </div>
                      </div>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}
            </Command.List>
          </Command>
        </div>
      </div>
    </div>
  );
}
