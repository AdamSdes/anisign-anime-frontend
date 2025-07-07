export interface Anime {
  id: string;
  anime_id: string;
  shikimori_id?: string;
  english: string;
  russian: string;
  kind: string;
  rating: string;
  score: number;
  status: string;
  episodes: number;
  episodesAired: number;
  duration: number;
  aired_on: string | null;
  released_on: string | null;
  season: string | null;
  poster_url: string;
  createdAt: string | null;
  updatedAt: string | null;
  nextEpisodeAt: string | null;
  isCensored: boolean;
  screenshots: string[];
  description: string | null;
  genre_ids: string[];
  related_anime_ids: string[] | null;
  related_anime_texts: string[] | null;
  character_ids: string[] | null;
}

export interface AnimeListResponse {
  total_count: number;
  anime_list: Anime[];
  limit?: number;
  page?: number;
}

export interface AnimeFilters {
  genre_ids?: string[];
  kind?: string;
  rating?: string;
  status?: string;
  start_year?: number;
  end_year?: number;
  sort_by?: string;
  filter_by_score?: boolean;
  filter_by_date?: boolean;
  filter_by_name?: boolean;
  season?: string; 
  year?: number; 
  has_translation?: boolean; 
}
