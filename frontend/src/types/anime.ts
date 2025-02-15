export interface Genre {
    id: string;
    genre_id: string;
    russian: string;
    name: string;
}

export interface Anime {
    anime_id: number;
    english: string;
    russian: string;
    name: string;
    kind: string;
    score: number;
    status: string;
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
