import { Url } from "next/dist/shared/lib/router/router";

export interface Genre {
    genre_id: string;
    name: string;
    russian: string;
  }
  
  export interface Anime {
    anime_id: number;
    name: string;
    russian: string | null;
    english: string | null;
    poster_url: string | null;
    score: number;
    status: 'released' | 'ongoing' | 'announced';
    episodes: number;
    episodes_aired?: number;
    duration: number;
    description: string;
    aired_on: string;
    released_on: string | null;
    next_episode_at: string | null;
    rating: 'g' | 'pg' | 'pg_13' | 'r' | 'r_plus' | 'rx';
    kind: 'tv' | 'tv_special' | 'movie' | 'ova' | 'ona' | 'special' | 'music';
    season: string;
    franchise?: string;
    genre_ids: string[];
    shikimoriId?: string;
    screenshots?: string[];
  }
  
  export interface AnimeListResponse {
    total_count: number;
    anime_list: Anime[];
  }