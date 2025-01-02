'use client';
import React from 'react';
import { Button } from "@/components/ui/button";
import { Eye, Clock, Check, X, Pause, LayoutGrid, Table2 } from "lucide-react";

const Anime = () => {
  const [activeTag, setActiveTag] = React.useState('watching');
  const [viewMode, setViewMode] = React.useState('grid'); // 'grid' или 'table'

  const tags = [
    { id: 'watching', label: 'Cмотрю', icon: Eye, count: 1, color: '#CCBAE4' },
    { id: 'completed', label: 'Просмотрел', icon: Check, count: 12, color: '#86EFAC' },
    { id: 'planned', label: 'Планирую', icon: Clock, count: 5, color: '#93C5FD' },
    { id: 'dropped', label: 'Бросил', icon: X, count: 2, color: '#FDA4AF' },
    { id: 'onhold', label: 'Отложил', icon: Pause, count: 3, color: '#FCD34D' },
  ];

  const animeList = [
    { title: 'Test', year: 2024, gener: 'TV Series' },
    { title: 'Test', year: 2024, gener: 'TV Series' },
    { title: 'Test', year: 2024, gener: 'TV Series' },
    { title: 'Test', year: 2024, gener: 'TV Series' },
    { title: 'Test', year: 2024, gener: 'TV Series' },
    { title: 'Test', year: 2024, gener: 'TV Series' },
    { title: 'Test', year: 2024, gener: 'TV Series' },
    { title: 'Test', year: 2024, gener: 'TV Series' },
    { title: 'Test', year: 2024, gener: 'TV Series' },
    { title: 'Test', year: 2024, gener: 'TV Series' },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-[18px] lg:text-[20px] font-bold">Аниме</h1>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode('grid')}
            className={`w-9 h-9 rounded-full ${
              viewMode === 'grid' 
                ? 'bg-[rgba(255,255,255,0.1)] text-white' 
                : 'text-white/60 hover:text-white hover:bg-[rgba(255,255,255,0.04)]'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode('table')}
            className={`w-9 h-9 rounded-full ${
              viewMode === 'table' 
                ? 'bg-[rgba(255,255,255,0.1)] text-white' 
                : 'text-white/60 hover:text-white hover:bg-[rgba(255,255,255,0.04)]'
            }`}
          >
            <Table2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Категории */}
      <div className="flex gap-2 flex-wrap">
        {tags.map((tag) => (
          <Button
            key={tag.id}
            onClick={() => setActiveTag(tag.id)}
            className={`h-[45px] px-4 rounded-full flex items-center gap-2 transition-all duration-300 ${
              activeTag === tag.id
                ? 'bg-[rgba(255,255,255,0.1)] text-white'
                : 'bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] text-white/60'
            }`}
          >
            <tag.icon className="h-4 w-4" style={{ color: tag.color }} />
            <span>{tag.label}</span>
            <span className="px-2 py-0.5 rounded-full bg-[rgba(255,255,255,0.05)] text-[12px] ml-1">
              {tag.count}
            </span>
          </Button>
        ))}
      </div>

      {/* Список аниме */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {animeList.map((item, index) => (
            <div 
              key={index} 
              className="group cursor-pointer"
            >
              <div className="relative rounded-[14px] overflow-hidden mb-3">
                <img 
                  src="/anime1.png" 
                  className="w-full aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-105" 
                  alt={item.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-[14px] font-medium text-white/90 group-hover:text-white transition-colors duration-300 line-clamp-2">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 text-[12px] text-white/40">
                  <span>{item.year}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span>{item.gener}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[rgba(255,255,255,0.02)] border border-white/5 rounded-[14px] overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-white/5">
              <tr>
                <th className="text-left p-4 text-[14px] font-medium text-white/60">Название</th>
                <th className="text-left p-4 text-[14px] font-medium text-white/60">Тип</th>
                <th className="text-left p-4 text-[14px] font-medium text-white/60">Год</th>
                <th className="text-left p-4 text-[14px] font-medium text-white/60">Серии</th>
                <th className="text-left p-4 text-[14px] font-medium text-white/60">Оценка</th>
              </tr>
            </thead>
            <tbody>
              {animeList.map((item, index) => (
                <tr 
                  key={index}
                  className="border-b border-white/5 hover:bg-[rgba(255,255,255,0.02)] transition-colors cursor-pointer"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src="/anime1.png" 
                        alt={item.title}
                        className="w-[45px] h-[60px] rounded-lg object-cover"
                      />
                      <span className="text-[14px] font-medium text-white/90">
                        {item.title}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-[14px] text-white/60">{item.gener}</td>
                  <td className="p-4 text-[14px] text-white/60">{item.year}</td>
                  <td className="p-4 text-[14px] text-white/60">12/12</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-md bg-[rgba(255,255,255,0.05)] text-[12px] text-white/90">
                      8.4
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Anime;
