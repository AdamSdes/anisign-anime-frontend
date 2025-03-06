import { axiosInstance as animeAxios } from "@/lib/axios/axiosConfig";
import { Anime } from "@/shared/types/anime";

export interface AnimeListResponse {
  total_count: number;
  anime_list: Anime[];
}

export interface AnimeFilters {
  sort_by?: 'score' | 'date' | 'name';
  sort_order?: 'asc' | 'desc';
  status?: 'anons' | 'ongoing' | 'released';
  rating?: 'g' | 'pg' | 'pg_13' | 'r' | 'r_plus' | 'none';
  kind?: 'movie' | 'ona' | 'ova' | 'special' | 'tv' | 'tv_special';
  genre_ids?: string[];
  start_year?: number;
  end_year?: number;
  page?: number;
  limit?: number;
}

/**
 * Получение списка аниме с фильтрами
 * @param filters Фильтры для запроса
 * @returns Ответ со списком аниме
 */
export const getAnimeList = async (filters: AnimeFilters = {}): Promise<AnimeListResponse> => {
  const { sort_by, sort_order, status, rating, kind, genre_ids, start_year, end_year, page = 1, limit = 30 } = filters;

  const filterParams = {
    filter_by_score: sort_by === 'score',
    filter_by_date: sort_by === 'date',
    filter_by_name: sort_by === 'name',
  };

  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(sort_order && { sort_order }),
    ...(status && { status }),
    ...(rating && { rating }),
    ...(kind && { kind }),
    ...(start_year && { start_year: String(start_year) }),
    ...(end_year && { end_year: String(end_year) }),
    ...(filterParams.filter_by_score && { filter_by_score: 'true' }),
    ...(filterParams.filter_by_date && { filter_by_date: 'true' }),
    ...(filterParams.filter_by_name && { filter_by_name: 'true' }),
  });

  if (genre_ids?.length) {
    genre_ids.forEach((id) => searchParams.append('genre_id', id));
  }

  const url = `/anime/get-anime-list-filtered?${searchParams.toString()}`;
  console.log('Request URL:', `${animeAxios.defaults.baseURL}${url}`);

  const { data } = await animeAxios.get<AnimeListResponse>(url);
  console.log('Received data:', data);
  return data;
};

/**
 * Получение аниме по ID
 * @param id Идентификатор аниме
 * @returns Данные аниме
 */
export const getAnimeById = async (id: number): Promise<Anime> => {
  const { data } = await animeAxios.get<Anime>(`/anime/${id}`);
  return data;
};

/**
 * Поиск аниме по названию
 * @param name Название аниме
 * @returns Ответ со списком аниме
 */
export const getAnimeByName = async (name: string): Promise<AnimeListResponse> => {
  const { data } = await animeAxios.get<AnimeListResponse>(`/anime/name/${name}`);
  return data;
};

/**
 * Объект API для работы с аниме
 */
export const animeApi = {
  getAnimeList,
  getAnimeById,
  getAnimeByName,
};