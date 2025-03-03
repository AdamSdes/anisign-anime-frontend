export interface Character {
    id: string;
    name: string;
    russian?: string;
    description?: string;
    image_url?: string;
    roles?: string[];
}

export interface CharacterResponse {
    characters: Character[];
    total: number;
    page: number;
    limit: number;
}