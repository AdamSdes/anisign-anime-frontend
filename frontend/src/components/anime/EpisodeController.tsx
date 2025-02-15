'use client';

import React, { useEffect } from 'react';
import { Minus, Plus, Trophy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

interface EpisodeControllerProps {
  currentEpisode: number;
  totalEpisodes: number;
  lastWatched?: number;
  animeName?: string; // Добавляем название аниме
  onEpisodeChange: (episode: number) => void;
}

export function EpisodeController({ 
  currentEpisode, 
  totalEpisodes, 
  lastWatched = 0,
  animeName = '', // Добавляем параметр
  onEpisodeChange 
}: EpisodeControllerProps) {
  const progress = (currentEpisode / totalEpisodes) * 100;

  useEffect(() => {
    if (currentEpisode === totalEpisodes) {
      // Первый залп конфетти
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#CCBAE4', '#D1B0ED', '#FFE4A0']
      });

      // Второй залп конфетти
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.7 },
          colors: ['#CCBAE4', '#D1B0ED', '#FFE4A0']
        });
      }, 200);

      // Обновленное поздравление с улучшенными стилями
      toast.custom((t) => (
        <div className="bg-[#060606] border border-white/5 rounded-lg p-6 max-w-md mx-auto text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-3 rounded-full bg-[#FFE4A0]/20">
              <Trophy className="w-8 h-8 text-[#FFE4A0]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Поздравляем с завершением! 🎉
              </h3>
              <p className="text-base text-white/70">
                {animeName 
                  ? `Вы завершили просмотр аниме "${animeName}"`
                  : "Вы просмотрели все эпизоды этого аниме"}
              </p>
            </div>
          </div>
        </div>
      ), {
        duration: 6000,
        position: 'top-center'
      });
    }
  }, [currentEpisode, totalEpisodes, animeName]);

  return (
    <div className="mt-6 space-y-4 relative z-50">
      {/* Верхняя строка с информацией */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-white/40">Текущий эпизод</p>
          <p className="text-2xl font-semibold text-white/90">{currentEpisode}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEpisodeChange(Math.max(1, currentEpisode - 1))}
            className="w-10 h-10 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5"
            disabled={currentEpisode <= 1}
          >
            <Minus className="h-4 w-4 text-white/60" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEpisodeChange(Math.min(totalEpisodes, currentEpisode + 1))}
            className="w-10 h-10 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5"
            disabled={currentEpisode >= totalEpisodes}
          >
            <Plus className="h-4 w-4 text-white/60" />
          </Button>
        </div>
      </div>

      {/* Обновленный прогресс бар */}
      <div className="relative h-3 bg-white/[0.02] rounded-full overflow-hidden group">
        {/* Индикатор прогресса */}
        <motion.div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#CCBAE4]/50 to-[#D1B0ED]/50"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Индикатор просмотренных эпизодов */}
        <div className="absolute inset-0 flex">
          {Array.from({ length: totalEpisodes }).map((_, index) => (
            <div
              key={index}
              className={`
                flex-1 border-r border-white/5 last:border-0
                ${index < currentEpisode ? 'bg-white/10' : ''}
              `}
            />
          ))}
        </div>

        {/* Текущий эпизод */}
        <motion.div
          className="absolute top-0 h-full w-1 bg-white/90"
          style={{ left: `${(currentEpisode / totalEpisodes) * 100}%` }}
        />

        {/* Интерактивные зоны */}
        <div className="absolute inset-0 flex opacity-0 group-hover:opacity-100 transition-opacity">
          {Array.from({ length: totalEpisodes }).map((_, index) => (
            <div
              key={index}
              className="flex-1 cursor-pointer hover:bg-white/10 transition-colors"
              onClick={() => onEpisodeChange(index + 1)}
            />
          ))}
        </div>
      </div>

      {/* Информация о просмотре */}
      <div className="flex items-center justify-between text-xs text-white/40">
        <span>Текущий эпизод</span>
        <div className="flex items-center gap-3">
          <span>{currentEpisode}/{totalEpisodes} эп.</span>
          {lastWatched > 0 && lastWatched !== currentEpisode && (
            <span className="px-2 py-0.5 rounded-full bg-white/5">
              Последний просмотренный: {lastWatched} эп.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
