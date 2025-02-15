import { Metadata } from 'next';

type Props = {
    params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    // Дождитесь получения всего объекта params
    const { id } = await params;

    // Обработка ID аниме
    const animeId = id.includes('-') ? id.split('-')[0] : id;

    try {
        // Выполняем запрос к API для получения данных об аниме
        const response = await fetch(`http://localhost:8000/anime/id/${animeId}`, {
            next: {
                revalidate: 3600 // Кэш обновляется каждый час
            }
        });

        if (!response.ok) {
            return {
                title: 'Аниме не найдено',
                description: 'Информация об аниме недоступна'
            };
        }

        const animeData = await response.json();

        return {
            title: `${animeData.russian || animeData.name} | Anime List`,
            description: `Информация об аниме ${animeData.russian || animeData.name}`,
            openGraph: {
                title: `${animeData.russian || animeData.name} | Anime List`,
                description: `Информация об аниме ${animeData.russian || animeData.name}`,
                images: [animeData.poster_url]
            }
        };
    } catch (error) {
        return {
            title: 'Ошибка загрузки',
            description: 'Не удалось загрузить информацию об аниме'
        };
    }
}

export default function AnimeLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}