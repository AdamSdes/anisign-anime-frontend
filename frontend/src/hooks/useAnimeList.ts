'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react';
import { useSearchParams } from 'next/navigation'
import { getAnimeList, getAnimeByName, type Anime, type AnimeFilters } from '@/services/api/anime';

export interface AnimeFilters {
    page?: number
    limit?: number
    search?: string
    genre?: string
    year?: string
    status?: string
    sort_by?: string
    sort_order?: string
    rating?: string
    kind?: string
    start_year?: number
    end_year?: number
    genre_ids?: string[]
}

const ITEMS_PER_PAGE = 30

export const useAnimeList = () => {
    const searchParams = useSearchParams()
    const page = Number(searchParams.get('page')) || 1
    const search = searchParams.get('search') || ''
    const sort = searchParams.get('sort') as AnimeFilters['sort_by']
    const order = searchParams.get('order') as AnimeFilters['sort_order']
    const status = searchParams.get('status') as AnimeFilters['status']
    const rating = searchParams.get('rating') as AnimeFilters['rating']
    const kind = searchParams.get('kind') as AnimeFilters['kind']
    const genreIds = searchParams.getAll('genre_id')
    const years = searchParams.getAll('years')

    const { data, isLoading, error } = useQuery({
        queryKey: ['animeList', page, search, sort, order, status, rating, kind, ...genreIds, ...years],
        queryFn: async () => {
            if (search) {
                const result = await getAnimeByName(search)
                // Реализуем пагинацию на фронтенде для поиска
                const startIndex = (page - 1) * ITEMS_PER_PAGE
                const endIndex = startIndex + ITEMS_PER_PAGE
                return {
                    total_count: result.total_count,
                    anime_list: result.anime_list.slice(startIndex, endIndex)
                }
            }
            return getAnimeList({
                page,
                limit: ITEMS_PER_PAGE,
                sort_by: sort,
                sort_order: order,
                status,
                rating,
                kind,
                genre_ids: genreIds.length > 0 ? genreIds : undefined,
                start_year: years[0] ? Number(years[0]) : undefined,
                end_year: years[1] ? Number(years[1]) : undefined
            })
        }
    })

    console.log('Current data:', data)
    console.log('Loading:', isLoading)
    console.log('Error:', error)

    return {
        animeList: data?.anime_list || [],
        pagination: data ? {
            page,
            pages: Math.ceil(data.total_count / ITEMS_PER_PAGE)
        } : null,
        isLoading,
        error
    }
};

export const useAnimeFilters = () => {
    const { data: kinds = [] } = useQuery({
        queryKey: ['anime-kinds'],
        queryFn: async () => {
            return [
                'tv',
                'movie',
                'ova',
                'ona',
                'special',
                'tv_13',
                'tv_24',
                'tv_48'
            ]
        }
    })

    const { data: statuses = [] } = useQuery({
        queryKey: ['anime-statuses'],
        queryFn: async () => {
            return [
                'ongoing',
                'finished',
                'upcoming'
            ]
        }
    });

    const { data: ratings = [] } = useQuery({
        queryKey: ['anime-ratings'],
        queryFn: async () => {
            return [
                'g',
                'pg',
                'pg_13',
                'r',
                'r_plus',
                'rx'
            ]
        }
    });

    return {
        kinds,
        statuses,
        ratings
    };
};
