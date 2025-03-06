export interface Character {
    id: string;
    character_id: string;
    name: string;
    russian: string;
    japanese: string | null;
    description: string;
    poster_url: string;
  }
  
  export interface SearchResponse {
    items: Character[];
    total: number;
  }