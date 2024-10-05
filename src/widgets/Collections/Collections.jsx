'use client'
import React, { useEffect, useState } from 'react';
import { Button } from '@/shared/shadcn-ui/button';
import { ChevronRight } from 'lucide-react';
import AnimeCard from '@/entities/AnimeCard/AnimeCard';
import { endpoints } from "@/shared/api/config";

async function fetchAnimeCollection() {
  try {
    const response = await fetch(endpoints.mainAnimeCollection);
    if (!response.ok) {
      throw new Error('Ошибка при загрузке данных');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

const Collection = () => {
  const [animeCollection, setAnimeCollection] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnimeCollection() {
      setLoading(true);
      const data = await fetchAnimeCollection();
      setAnimeCollection(data);
      setLoading(false);
    }

    loadAnimeCollection();
  }, []);

  return (
      <main className="mb-[50px]">
        <div className="container mx-auto px-2 py-5 flex justify-between items-center">
          <p className="text-[20px] font-bold">Коллекции</p>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Flex-контейнер для карточек с адаптивными размерами */}
        <div className="container mx-auto px-2 py-5 flex flex-wrap gap-4">
          {/* Кнопка добавления коллекции */}
          <button
              className="group flex-shrink-0 items-center justify-center border bg-[rgba(255,255,255,0.02)] h-[308px] w-[220px] rounded-lg hover:bg-[rgba(255,255,255,0.04)] transition-all duration-300"
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
              animeCollection.map((anime, index) => (
                  <AnimeCard
                      key={index}
                      backgroundImage={anime.backgroundImage}
                      title={anime.title}
                      username={anime.username}
                      avatar={anime.avatar}
                  />
              ))
          )}
        </div>
      </main>
  );
};

export default Collection;
