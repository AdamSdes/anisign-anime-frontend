export interface NewsItem {
  title: string;
  text: string;
  img: string;
  date: string;
  link: string;
}

export interface NewsResponse {
  news: NewsItem[];
  total_count: number;
  current_page: number;
  has_next_page: boolean;
}

class NewsService {
  private baseUrl = 'http://localhost:8000';

  async getNews(page: number = 1): Promise<NewsResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/news/?page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Предполагаем, что если новостей меньше 6, то это последняя страница
      const hasNextPage = data.length >= 6;

      // Преобразуем данные в нужный формат
      return {
        news: data,
        total_count: data.length,
        current_page: page,
        has_next_page: hasNextPage,
      };
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  }
}

export const newsService = new NewsService();
