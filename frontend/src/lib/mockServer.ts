/**
 * Mock сервер для разработки
 * Используется когда основной API недоступен
 */

export interface MockUser {
  id: number;
  username: string;
  email: string;
  user_avatar?: string;
  user_banner?: string;
}

export interface MockAnime {
  id: number;
  name: string;
  poster_url: string;
  score: number;
  aired_on: string;
  kind: string;
}

// Mock данные
const mockUsers: MockUser[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    user_banner: '/api/mock/banner.jpg',
  },
];

const mockAnime: MockAnime[] = [
  {
    id: 1,
    name: 'Attack on Titan',
    poster_url: 'https://via.placeholder.com/300x400/333/fff?text=AOT',
    score: 9.0,
    aired_on: '2013-04-07',
    kind: 'TV',
  },
  {
    id: 2,
    name: 'Death Note',
    poster_url: 'https://via.placeholder.com/300x400/333/fff?text=DN',
    score: 8.6,
    aired_on: '2006-10-04',
    kind: 'TV',
  },
];

/**
 * Mock API endpoints
 */
export const mockApi = {
  // Auth endpoints
  async login(username: string, password: string) {
    // Простая проверка для демо
    if (username === 'admin' && password === 'admin') {
      return {
        access_token: 'mock_token_' + Date.now(),
        user: mockUsers[0],
      };
    }
    throw new Error('Invalid credentials');
  },

  async getCurrentUser() {
    return mockUsers[0];
  },

  async getUserByName(username: string) {
    const user = mockUsers.find((u) => u.username === username);
    if (user) {
      return {
        total_count: 1,
        user_list: [user],
      };
    }
    return {
      total_count: 0,
      user_list: [],
    };
  },

  async getPopularAnime() {
    return {
      total_count: mockAnime.length,
      anime_list: mockAnime,
    };
  },

  async getAnimeById(id: number) {
    const anime = mockAnime.find((a) => a.id === id);
    if (!anime) throw new Error('Anime not found');
    return anime;
  },
};

/**
 * Проверяет доступность основного API
 */
export const checkApiAvailability = async (baseUrl: string): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
};
