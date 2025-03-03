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
    pages: number;
    page: number;
    total_count: number;
    anime_list: Anime[];
  }

  export interface ReleaseEntry {
    anime_id: number;
    name: string;
    episode_number: number;
    release_date: string;
  }

  export interface ReleaseCalendar {
    [day: string]: ReleaseEntry[];
  }

  export interface Episode {
    number: number;
    duration: string;
    release_date: string;
  }

  export interface ViewHistory {
    anime_id: number;
    episode_number: number;
    watched_at: string;
  }