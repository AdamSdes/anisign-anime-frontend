'use client';
import React from 'react';
import { ClockIcon, PlayCircle, History as HistoryIcon } from "lucide-react";
import { Button } from '../ui/button';

const History = () => {
    const history = [
        {
            title: 'Магическая битва 2',
            episodes: '12/24',
            time: '1 час назад',
            image: 'https://dere.shikimori.one/uploads/poster/animes/52215/cf8f3c9f66f121bb57297236704eefcd.jpeg',
            episode: 12,
        },
        {
            title: 'Магическая битва 2',
            episodes: '12/24',
            time: '1 час назад',
            image: 'https://nyaa.shikimori.one/uploads/poster/animes/58572/7ba51d13a48c5d205f509440008fc566.jpeg',
            episode: 12,
        },
    ];

    return (
        <div className="flex flex-col">
            {/* Новый заголовок секции с кнопкой показать всё */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <HistoryIcon className="w-5 h-5 text-white/40" />
                    <h2 className="text-white/80 text-sm font-medium">История просмотров</h2>
                    <span className="text-white/40 text-sm">({history.length})</span>
                </div>
                <Button 
                    variant="ghost" 
                    className="text-xs text-white/40 hover:text-white/60 transition-colors"
                >
                    Показать всё
                </Button>
            </div>

            {/* Оригинальный список истории */}
            <div className="grid gap-3 w-full">
                {history.map((item, index) => (
                    <div 
                        key={index} 
                        className="bg-[rgba(255,255,255,0.02)] border border-white/5 rounded-[14px] p-3 hover:bg-[rgba(255,255,255,0.04)] transition-all duration-300 cursor-pointer group w-full"
                    >
                        <div className="flex gap-4 w-full">
                            {/* Preview Image */}
                            <div className="relative">
                                <img 
                                    src={item.image}
                                    alt={item.title}
                                    className="w-[100px] h-[60px] object-cover rounded-lg"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <PlayCircle className="w-8 h-8 text-white drop-shadow-lg" />
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-[14px] font-medium text-white/90 group-hover:text-white transition-colors duration-300 truncate">
                                    {item.title}
                                </h3>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className="text-[12px] text-white/40">
                                        Серия {item.episode}
                                    </span>
                                    <div className="flex items-center gap-1.5 text-[12px] text-white/40">
                                        <ClockIcon className="w-3.5 h-3.5" />
                                        {item.time}
                                    </div>
                                </div>
                            </div>

                            {/* Episodes count */}
                            <div className="px-3 py-1 h-fit rounded-full bg-[rgba(255,255,255,0.05)] text-[12px] text-white/60">
                                {item.episodes}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default History;
