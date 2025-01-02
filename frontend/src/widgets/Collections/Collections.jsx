'use client'
import React, { useEffect, useState } from 'react';
import { Button } from '@/shared/shadcn-ui/button';
import { ChevronRight } from 'lucide-react';
import AnimeCard from '@/entities/AnimeCard/AnimeCard';
import Link from 'next/link';

// Добавим моковые данные
const mockCollections = [
  {
    id: 1,
    backgroundImage: "https://i.pinimg.com/originals/58/49/c2/5849c226fba0c1eeffab90cdbaf487d2.gif",
    title: "Топ романтических аниме",
    username: "Anisign",
    avatar: "https://avatars.githubusercontent.com/u/24516654?v=4",
    animeCount: 12
  },
  {
    id: 2,
    backgroundImage: "https://i.pinimg.com/736x/98/5d/87/985d87628ec385e2cca1af186d47ee15.jpg",
    title: "Лучшие сёнэны",
    username: "AnimeExpert",
    avatar: "https://i.pinimg.com/736x/25/9d/97/259d97bba4ba85ac1639501267317ce9.jpg",
    animeCount: 8
  },
  {
    id: 3,
    backgroundImage: "https://i.pinimg.com/736x/dc/d8/b6/dcd8b643e60125ec0dca6ca0a1c67c40.jpg",
    title: "Психологические триллеры",
    username: "MindHunter",
    avatar: "https://avatars.mds.yandex.net/i?id=1b2e97080c07d7a84895a4ac26207f00_l-5287716-images-thumbs&n=13",
    animeCount: 15
  },
  {
    id: 4,
    backgroundImage: "https://i.pinimg.com/originals/ad/67/09/ad67090ff30d09ce9a4496b2a85a3e84.gif",
    title: "Спортивные аниме",
    username: "SportsFan",
    avatar: "https://i.pinimg.com/originals/e3/7b/17/e37b17ce854a5f7ac578ce89a67a4c89.jpg",
    animeCount: 6
  },
  {
    id: 5,
    backgroundImage: "https://i.pinimg.com/originals/3a/1e/32/3a1e322da3784a3c6b01f4f021445e0d.gif",
    title: "Спортивные аниме",
    username: "SportsFan",
    avatar: "https://i.pinimg.com/originals/e3/7b/17/e37b17ce854a5f7ac578ce89a67a4c89.jpg",
    animeCount: 6
  },
];

const Collection = () => {
  const [animeCollection, setAnimeCollection] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Имитация загрузки данных
    const loadAnimeCollection = async () => {
      setLoading(true);
      // Имитация задержки сети
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnimeCollection(mockCollections);
      setLoading(false);
    };

    loadAnimeCollection();
  }, []);

  return (
      <main className="mb-[50px]">
        <div className="container mx-auto px-2 py-5 flex justify-between items-center">
          <p className="text-[20px] font-bold">Коллекции</p>
          <Button variant="outline" size="icon">
            <Link href="/collections">
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Flex-контейнер для карточек с адаптивными размерами */}
        <div className="container mx-auto px-2 py-5 flex flex-wrap gap-[20px]">
          {/* Кнопка добавления коллекции */}
          <button
              className="group flex-shrink-0 items-center justify-center border bg-[rgba(255,255,255,0.02)] h-[308px] w-[220px] rounded-[14px] hover:bg-[rgba(255,255,255,0.04)] transition-all duration-300"
              aria-label="Добавить коллекцию"
          >
            <img
                className="group-hover:scale-90 transition-transform duration-300"
                src="add-col.svg"
                alt="Добавить коллекцию"
            />
          </button>

          {loading ? (
              <div className="text-white">Загрузка коллекций...</div>
          ) : (
              animeCollection.map((collection) => (
                  <AnimeCard
                      key={collection.id}
                      backgroundImage={collection.backgroundImage}
                      title={collection.title}
                      username={collection.username}
                      avatar={collection.avatar}
                      animeCount={collection.animeCount}
                  />
              ))
          )}
        </div>
      </main>
  );
};

export default Collection;
