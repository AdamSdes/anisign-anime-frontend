'use client'

import useSWR from "swr";
import { Genre } from "@/shared/types/genre";
import { genresMap } from "@/shared/data/genres";

const fetchGenres = async (): Promise<Record<string, Genre>> => {
    return genresMap;
};

/**
 * Хук для получения жанров + кэширование
 */
export function useGenres() {
    const { data, error, isLoading } = useSWR<Record<string, Genre>, Error>(
        'genres',
        fetchGenres,
        {
            revalidateOnFocus: false,
            dedupingInterval: 24 * 60 * 60 * 1000,
            revalidateOnMount: false,
            fallbackData: genresMap,
        }
    );
    return {
        genres: data,
        isLoading,
        error,
    };
}

/**
 * Хук для получение жанра по ID
 */
export function useGenreById(genreId: string) {
    const { genres, isLoading, error } = useGenres();
    return {
        genre: genres ? genres[genreId] : undefined,
        isLoading,
        error,
    };
}