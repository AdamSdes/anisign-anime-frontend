import { axiosInstance as animeAxios } from '@/lib/api/axiosConfig'

export interface Anime {
    anime_id: number
    english: string
    russian: string
    kind: string
    score: number
    status: string
    episodes: number
    episodes_aired: number
    aired_on: string
    released_on: string
    rating: string
    description: string
    franchise: string
    poster_url: string
}

export interface AnimeListResponse {
    total_count: number
    anime_list: Anime[]
}

export interface AnimeFilters {
    sort_by?: 'score' | 'date' | 'name'
    sort_order?: 'asc' | 'desc'
    status?: 'anons' | 'ongoing' | 'released'
    rating?: 'g' | 'pg' | 'pg_13' | 'r' | 'r_plus' | 'none'
    kind?: 'movie' | 'ona' | 'ova' | 'special' | 'tv' | 'tv_special'
    genre_ids?: string[]
    start_year?: number
    end_year?: number
    page?: number
    limit?: number
}

export const getAnimeList = async (filters: AnimeFilters = {}): Promise<AnimeListResponse> => {
    console.log('Making request to:', `${animeAxios.defaults.baseURL}/anime/get-anime-list-filtered`)
    console.log('With filters:', filters)

    // Определяем, какой тип сортировки включен
    const filterParams = {
        filter_by_score: false,
        filter_by_date: false,
        filter_by_name: false
    }

    if (filters.sort_by) {
        switch (filters.sort_by) {
            case 'score':
                filterParams.filter_by_score = true
                break
            case 'date':
                filterParams.filter_by_date = true
                break
            case 'name':
                filterParams.filter_by_name = true
                break
        }
    }

    // Формируем URLSearchParams для корректной передачи параметров
    const searchParams = new URLSearchParams()
    
    // Добавляем базовые параметры
    searchParams.append('page', String(filters.page || 1))
    searchParams.append('limit', String(filters.limit || 30))
    if (filters.sort_order) searchParams.append('sort_order', filters.sort_order)
    if (filters.status) searchParams.append('status', filters.status)
    if (filters.rating) searchParams.append('rating', filters.rating)
    if (filters.kind) searchParams.append('kind', filters.kind)
    if (filters.start_year) searchParams.append('start_year', String(filters.start_year))
    if (filters.end_year) searchParams.append('end_year', String(filters.end_year))
    
    // Добавляем параметры сортировки
    if (filterParams.filter_by_score) searchParams.append('filter_by_score', 'true')
    if (filterParams.filter_by_date) searchParams.append('filter_by_date', 'true')
    if (filterParams.filter_by_name) searchParams.append('filter_by_name', 'true')
    
    // Добавляем жанры
    if (filters.genre_ids && filters.genre_ids.length > 0) {
        filters.genre_ids.forEach(id => {
            searchParams.append('genre_id', id)
        })
    }

    console.log('Request URL:', `${animeAxios.defaults.baseURL}/anime/get-anime-list-filtered?${searchParams.toString()}`)

    const response = await animeAxios.get(`/anime/get-anime-list-filtered?${searchParams.toString()}`)

    console.log('Received data:', response.data)
    return response.data
}

export const getAnimeById = async (id: number): Promise<Anime> => {
    const response = await animeAxios.get(`/anime/${id}`)
    return response.data
}

export const getAnimeByName = async (name: string): Promise<AnimeListResponse> => {
    const response = await animeAxios.get(`/anime/name/${name}`)
    return response.data
}

// Экспортируем API объект для обратной совместимости
export const animeApi = {
    getAnimeList,
    getAnimeById,
    getAnimeByName
}
