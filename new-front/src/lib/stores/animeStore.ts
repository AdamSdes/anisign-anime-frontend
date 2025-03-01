import { atom, useAtom } from 'jotai';
import { Anime, AnimeListResponse } from '@/shared/types/anime';
import { apiRequest } from '../api';

interface AnimeState {
  animeList: Anime[];
  currentAnime: Anime | null;
  totalCount: number;
  page: number;
  pages: number;
  loading: boolean;
  error: string | null;
}

const animeAtom = atom<AnimeState>({
  animeList: [],
  currentAnime: null,
  totalCount: 0,
  page: 1,
  pages: 1,
  loading: false,
  error: null,
});

export function useAnimeStore() {
  const [state, setState] = useAtom(animeAtom);

  const fetchAnimeList = async (params: Record<string, any> = {}) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await apiRequest<AnimeListResponse>({
        url: '/anime',
        method: 'get',
        params: { ...params, page: params.page || state.page, limit: params.limit || 20 },
        useAuth: false,
      });
      setState({
        animeList: response.data.anime_list,
        currentAnime: null,
        totalCount: response.data.total_count,
        page: response.data.page,
        pages: response.data.pages,
        loading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
    }
  };

  const fetchAnimeDetails = async (id: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await apiRequest<Anime>({
        url: `/anime/${id}`,
        method: 'get',
        useAuth: false,
      });
      setState((prev) => ({
        ...prev,
        currentAnime: response.data,
        loading: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
    }
  };

  return { ...state, fetchAnimeList, fetchAnimeDetails };
}