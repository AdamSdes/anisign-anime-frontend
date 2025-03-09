export interface Genre {
  id: string;
  genre_id: string;
  russian: string;
  name: string;
}

export interface Anime {
  date_of_broadcast: any;
  id: any;
  duration: any;
  season: any;
  anime_id: number;
  english: string;
  russian: string;
  name: string;
  kind: string;
  score: number;
  status: 'ongoing' | 'released' | 'announced';
  episodes: number;
  episodes_aired: number;
  aired_on: string; 
  released_on: string; 
  rating: string;
  description: string;
  franchise: string;
  poster_url: string;
  genre_ids: string[];
}

export interface TooltipAnimeProps {
  children: React.ReactNode;
  anime: {
    russian: string;
    name: string;
    score?: number;
    aired_on: string;
    kind: string;
    episodes?: number;
    description?: string;
    genre_ids?: string[];
  };
}