'use client'

import useSWR from "swr";
import { 
    getCharacterList,
    searchCharacters,
    getCharacterById,
 } from "@/services/character";
 import { Character } from '@/shared/types/character';

 export function useCharacterList(page: number, limit: number = 50) {
    const key = `/character/get-character-list?page=${page}&limit=${limit}`;
    const { data, error, isLoading } = useSWR<Character[], Error>(
        key,
        () => getCharacterList(page, limit),
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000,
        }
    );
    return {
        characters: data,
        isLoading,
        error,
    };
 }

 /**
  * Хук для поиска персонажей + кэширование
  */
 export function useSearchCharacters(query: string, limit: number = 20) {
    const key = query.trim() ? `/character/name/${encodeURIComponent(query)}` : null;
    const { data, error, isLoading } = useSWR<Character[], Error>(
        key,
        () => searchCharacters(query, limit),
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000,
        }
    );
    return {
        characters: data || [],
        isLoading,
        error,
    };
 }

 /**
  * Хук для получения персонажа по id + кэширование
  */
 export function useCharacterById(id: string) {
    const key = id ? `/character/${id.split('-')[0]}` : null;
    const { data, error, isLoading } = useSWR<Character | null, Error>(
        key,
        () => getCharacterById(id),
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000,
        }
    );
    return {
        character: data,
        isLoading,
        error,
    };
 }