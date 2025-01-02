'use client';

import React, { useState } from 'react';
import { Input } from "@/shared/shadcn-ui/input";
import { Button } from "@/shared/shadcn-ui/button";
import { Search, SlidersHorizontal, Plus } from 'lucide-react';
import AnimeCard from '@/entities/AnimeCard/AnimeCard';

const mockCollections = [
  {
    id: 1,
    backgroundImage: "https://i.pinimg.com/originals/58/49/c2/5849c226fba0c1eeffab90cdbaf487d2.gif",
    title: "Топ романтических аниме",
    username: "Anisign",
    avatar: "https://avatars.githubusercontent.com/u/24516654?v=4",
    animeCount: 12
  },
  // ...остальные моковые данные...
];

const sortOptions = [
  { id: 'newest', label: 'Сначала новые' },
  { id: 'oldest', label: 'Сначала старые' },
  { id: 'popular', label: 'Популярные' },
  { id: 'updated', label: 'Обновлённые' },
];

const CollectionsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSort, setActiveSort] = useState('newest');

  return (
    <main className="min-h-screen py-[30px]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-2xl font-bold">Коллекции</h1>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <Input
                placeholder="Поиск коллекций..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[rgba(255,255,255,0.02)] border-white/5"
              />
            </div>
            <Button variant="outline" size="icon" className="shrink-0">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
            <Button className="shrink-0 gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Создать</span>
            </Button>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex flex-wrap gap-2 mb-6">
          {sortOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setActiveSort(option.id)}
              className={`px-4 h-[35px] rounded-full text-[13px] font-medium transition-all duration-300 ${
                activeSort === option.id 
                  ? 'bg-[#CCBAE4] text-black' 
                  : 'bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] text-white/60 hover:text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          <button className="group flex flex-col items-center justify-center border bg-[rgba(255,255,255,0.02)] aspect-[220/308] rounded-lg hover:bg-[rgba(255,255,255,0.04)] transition-all duration-300">
            <img
              className="group-hover:scale-90 transition-transform duration-300"
              src="/add-col.svg"
              alt="Создать коллекцию"
            />
            <span className="mt-3 text-white/60 group-hover:text-white text-sm">
              Создать коллекцию
            </span>
          </button>
          
          {mockCollections
            .filter(collection => 
              collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              collection.username.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((collection) => (
              <AnimeCard
                key={collection.id}
                backgroundImage={collection.backgroundImage}
                title={collection.title}
                username={collection.username}
                avatar={collection.avatar}
                animeCount={collection.animeCount}
              />
            ))}
        </div>
      </div>
    </main>
  );
};

export default CollectionsPage;
