export interface Character {
  character_id: string;
  japanese: string;
  description: string;
  poster_url: string;
  name: string;
  russian: string;
  id: string;
}

export interface CharacterListResponse {
  total_count: number;
  characters: Character[];
}

export interface CharacterSearchResponse {
  total_count: number;
  character_list: Character[];
}
