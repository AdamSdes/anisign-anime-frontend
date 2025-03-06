'use client';

import { useState, useCallback, useRef } from 'react';
import { axiosInstance } from '@/lib/axios/axiosConfig';
import { useToast } from '@/lib/toast/logicToast';

export type AnimeListName = 'Watching' | 'Completed' | 'On Hold' | 'Dropped' | 'Plan to Watch';

type ListCache = {
  [key in AnimeListName]?: { data: { anime_ids: number[] }; timestamp: number };
};

/**
 * Хук для работы со списками аниме
 */
export const useAnimeListSave = () => {
  const [isCheckingList, setIsCheckingList] = useState(false);
  const [isUpdatingList, setIsUpdatingList] = useState(false);
  const listCache = useRef<ListCache>({});
  const { toast } = useToast();
  const CACHE_DURATION = 30000;

  const isCacheValid = (listName: AnimeListName) => {
    const cache = listCache.current[listName];
    return cache && Date.now() - cache.timestamp < CACHE_DURATION;
  };

  const updateCache = (listName: AnimeListName, data: { anime_ids: number[] }) => {
    listCache.current[listName] = { data, timestamp: Date.now() };
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
      console.error('Ошибка создания списка:', error);
      return false;
    }
  };

  const getAnimeList = useCallback(async (listName: AnimeListName) => {
    if (isCacheValid(listName)) return listCache.current[listName]?.data;

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
      console.error('Ошибка получения списка аниме:', error);
      return null;
    } finally {
      setIsCheckingList(false);
    }
  }, []);

  const addAnimeToList = async (listName: AnimeListName, animeId: number) => {
    setIsUpdatingList(true);
    try {
      const list = await getAnimeList(listName);
      if (!list) await createList(listName);

      await axiosInstance.put(`/anime_save_list/put_anime_id_in_list/${encodeURIComponent(listName)}`, null, {
        params: { anime_id: animeId.toString() },
      });

      invalidateCache(listName);
      toast({ title: 'Успех', description: `Аниме добавлено в список "${listName}"` });
      return true;
    } catch (error) {
      console.error('Ошибка добавления аниме в список:', error);
      toast({ title: 'Ошибка', description: 'Не удалось добавить аниме в список' });
      return false;
    } finally {
      setIsUpdatingList(false);
    }
  };

  const removeAnimeFromList = async (animeId: number) => {
    setIsUpdatingList(true);
    try {
      await axiosInstance.delete('/anime_save_list/delete-anime-id-from-list', {
        params: { anime_id: animeId.toString() },
      });

      Object.keys(listCache.current).forEach((key) => invalidateCache(key as AnimeListName));
      toast({ title: 'Успех', description: 'Аниме удалено из списка' });
      return true;
    } catch (error) {
      console.error('Ошибка удаления аниме из списка:', error);
      toast({ title: 'Ошибка', description: 'Не удалось удалить аниме из списка' });
      return false;
    } finally {
      setIsUpdatingList(false);
    }
  };

  const deleteAllLists = async () => {
    try {
      await axiosInstance.delete('/anime_save_list/delete-anime-list-all');
      listCache.current = {};
      toast({ title: 'Успех', description: 'Все списки удалены' });
      return true;
    } catch (error) {
      console.error('Ошибка удаления всех списков:', error);
      toast({ title: 'Ошибка', description: 'Не удалось удалить списки' });
      return false;
    }
  };

  return { isCheckingList, isUpdatingList, getAnimeList, addAnimeToList, removeAnimeFromList, deleteAllLists };
};