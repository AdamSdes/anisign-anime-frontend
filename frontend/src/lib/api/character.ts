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

export async function getCharacterList(page: number, limit: number = 50): Promise<Character[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/character/get-character-list?page=${page}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching character list:', error);
    throw error;
  }
}

export async function searchCharacters(query: string, limit: number = 20): Promise<Character[]> {
  if (!query) return [];
  
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/character/name/${encodedQuery}`
    );
    
    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (Array.isArray(data)) {
      return data.slice(0, limit);
    } else if (data.items && Array.isArray(data.items)) {
      return data.items.slice(0, limit);
    } else if (data.character_list && Array.isArray(data.character_list)) {
      return data.character_list.slice(0, limit);
    } else {
      console.warn('Unexpected API response format:', data);
      return [];
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error searching characters:', error.message);
    } else {
      console.error('Unknown error during character search');
    }
    return [];
  }
}

export async function getCharacterById(id: string): Promise<Character | null> {
  try {
    // Используем character_id для запроса
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/character/${id.split('-')[0]}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching character:', error);
    throw error;
  }
}
