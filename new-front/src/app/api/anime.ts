import { NextApiRequest, NextApiResponse } from 'next';
import { Anime } from '@/shared/types/anime';

const mockAnime: Anime = {
  anime_id: 1,
  name: "Shingeki no Kyojin: The Final Season - Kanketsu-hen",
  russian: "Атака титанов: Финальный сезон - Заключительная часть",
  poster_url: "https://moe.shikimori.one/system/animes/original/146984.jpg",
  score: 9.11,
  status: "ongoing",
  episodes: 2,
  duration: 60,
  description: "Заключительная часть финального сезона «Атаки титанов».",
  aired_on: "2023-03-03",
  released_on: "2023-11-04",
  next_episode_at: "2024-03-01T17:00:00.000Z",
  rating: "r",
  kind: "tv",
  season: "spring",
  genre_ids: ["1", "2", "3"],
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            if (req.url === '/save-anime-list-in-db') {
                // Сохранение
                res.status(200).json([mockAnime]);
            } else if (req.url === '/name/{name}') {
                // Поиск по названию
                res.status(200).json(mockAnime);
            } else if (req.url === '/genre/{genre}') {
                // Поиск по жанру
                res.status(200).json([mockAnime]);
            } else if (req.url === '/id/{anime_id}') {
                // Поиск по id
                const {anime_id} = req.query;
                res.status(200).json(mockAnime);
            } else if (req.url === '/get-anime-list') {
                // Получение списка
                res.status(200).json([mockAnime]);
            } else if (req.url === '/get-anime-list-by-kind/{kind}') {
                // Получение списка по типу
                res.status(200).json([mockAnime]);
            } else if (req.url === '/get-anime-list-by-rating/{rating}') {
                // Получение списка по рейтингу
                res.status(200).json([mockAnime]);
            } else if (req.url === '/get-anime-list-by-status/{status}') {
                // Получение списка по статусу
                res.status(200).json([mockAnime]);
            } else if (req.url === '/anime/by-year-range') {
                // Получение списка по диапазону лет
                res.status(200).json([mockAnime]);
            } else if (req.url === '/get-anime-list-filtered') {
                // Получение списка с фильтром
                res.status(200).json([mockAnime]);
            } else if (req.url === '/kinds') {
                // Получение всех типов
                res.status(200).json(['tv', 'movie', 'ova']);
            } else if (req.url === '/statuses') {
                // Получение всех статусов
                res.status(200).json(['ongoing', 'completed', 'planned']);
            } else if (req.url === '/ratings') {
                // Получение всех рейтингов
                res.status(200).json(['g', 'pg', 'r']);
            } else if (req.url === '/current-episode/{anime_id}/for-user/{user_id}') {
                // Получение текущего эпизода для пользователя
                res.status(200).json({ episode: 1, anime_id: 1, user_id: 1 });
            }
        break;
        case 'POST':
            if (req.url === '/update-current-episode/{anime_id}/for-user/{user_id}') {
                // Обновление текущего эпизода для пользователя
                const { anime_id, user_id, episode} = req.body;
                res.status(200).json({ message: 'Епизод обновлен', anime_id, user_id, episode });
            }
        break;
        case 'DELETE':
            if (req.url === '/delete-all-anime') {
                // Удаление всех аниме
                res.status(200).json({ message: 'Аниме удалены' });
            }
        break;
        default:
            res.status(404).json({ message: 'Метод не найден' });
    }
}