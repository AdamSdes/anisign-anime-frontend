'use client';

import { useState, useCallback, useRef } from 'react';
import { axiosInstance } from '@/lib/api/axiosConfig';
import { toast } from 'sonner';

export type AnimeListName = 'Watching' | 'Completed' | 'On Hold' | 'Dropped' | 'Plan to Watch';

type ListCache = {
  [key in AnimeListName]?: {
    data: { anime_ids: number[] };
    timestamp: number;
  };
};

export const useAnimeListSave = () => {
  const [isCheckingList, setIsCheckingList] = useState(false);
  const [isUpdatingList, setIsUpdatingList] = useState(false);
  const listCache = useRef<ListCache>({});
  const CACHE_DURATION = 30000; // 30 seconds cache

  const isCacheValid = (listName: AnimeListName) => {
    const cache = listCache.current[listName];
    return cache && (Date.now() - cache.timestamp) < CACHE_DURATION;
  };

  const updateCache = (listName: AnimeListName, data: { anime_ids: number[] }) => {
    listCache.current[listName] = {
      data,
      timestamp: Date.now()
    };
  };

  const invalidateCache = (listName: AnimeListName) => {
    delete listCache.current[listName];
  };

  const createList = async (listName: AnimeListName) => {
    try {
      await axiosInstance.post(`/anime_save_list/create-anime-save-list/${encodeURIComponent(listName)}`);
      updateCache(listName, { anime_ids: [] });
      return true;
    } catch (error) {
      console.error('Error creating list:', error);
      return false;
    }
  };

  const getAnimeList = useCallback(async (listName: AnimeListName) => {
    // Check cache first
    if (isCacheValid(listName)) {
      return listCache.current[listName]?.data;
    }

    setIsCheckingList(true);
    try {
      const response = await axiosInstance.get(`/anime_save_list/get-anime-list-by-name/${encodeURIComponent(listName)}`);
      updateCache(listName, response.data);
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        await createList(listName);
        return { anime_ids: [] };
      }
      console.error('Error fetching anime list:', error);
      return null;
    } finally {
      setIsCheckingList(false);
    }
  }, []);

  const addAnimeToList = async (listName: AnimeListName, animeId: number) => {
    setIsUpdatingList(true);
    try {
      const list = await getAnimeList(listName);
      if (!list) {
        await createList(listName);
      }

      await axiosInstance.put(`/anime_save_list/put_anime_id_in_list/${encodeURIComponent(listName)}`, null, {
        params: {
          anime_id: animeId.toString()
        }
      });
      
      // Update cache
      invalidateCache(listName);
      toast.success(`Аниме добавлено в список "${listName}"`);
      return true;
    } catch (error) {
      console.error('Error adding anime to list:', error);
      toast.error('Не удалось добавить аниме в список');
      return false;
    } finally {
      setIsUpdatingList(false);
    }
  };

  const removeAnimeFromList = async (animeId: number) => {
    setIsUpdatingList(true);
    try {
      await axiosInstance.delete('/anime_save_list/delete-anime-id-from-list', {
        params: {
          anime_id: animeId.toString()
        }
      });

      // Invalidate all caches since we don't know which list was affected
      Object.keys(listCache.current).forEach(key => {
        invalidateCache(key as AnimeListName);
      });

      toast.success('Аниме удалено из списка');
      return true;
    } catch (error) {
      console.error('Error removing anime from list:', error);
      toast.error('Не удалось удалить аниме из списка');
      return false;
    } finally {
      setIsUpdatingList(false);
    }
  };

  const deleteAllLists = async () => {
    try {
      await axiosInstance.delete('/anime_save_list/delete-anime-list-all');
      // Clear entire cache
      listCache.current = {};
      toast.success('Все списки удалены');
      return true;
    } catch (error) {
      console.error('Error deleting all lists:', error);
      toast.error('Не удалось удалить списки');
      return false;
    }
  };

  return {
    isCheckingList,
    isUpdatingList,
    getAnimeList,
    addAnimeToList,
    removeAnimeFromList,
    deleteAllLists
  };
};
