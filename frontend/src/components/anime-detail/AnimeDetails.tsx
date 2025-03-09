"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";
import { ListSelector } from "./ListSelector";
import { ScrollToPlayerButton } from "./ScrollToPlayerButton";
import { AnimeDetailsSkeleton } from "./AnimeDetailsSkeleton";
import { transformValue } from "@/lib/utils/transforms";
import { CharacterTooltip, AnimeTooltip, parseDescription } from "../ui/character-anime-tooltips";
import { containerVariants, itemVariants } from "./animations";
import { Anime, Genre } from "@/shared/types/anime";

// Интерфейс пропсов компонента AnimeDetails
interface AnimeDetailsProps {
  animeId: number;
  anime: Anime;
  genres: Genre[]; 
}

/**
 * Вспомогательная функция для описания рейтинга
 * @param rating - Код рейтинга аниме
 * @returns Описание рейтинга
 */
const getRatingDescription = (rating: string): string => {
  const descriptions: Record<string, string> = {
    g: "Нет возрастных ограничений. Демонстрация любому возрасту.",
    pg: "Рекомендуется присутствие родителей при просмотре.",
    pg_13: "Детям до 13 лет просмотр не желателен.",
    r: "Лицам до 17 лет обязательно присутствие взрослого.",
    r_plus: "Лицам до 18 лет просмотр запрещён.",
    rx: "Хентай. Откровенный материал только для взрослых.",
  };
  return descriptions[rating] || "Рейтинг не указан";
};

/**
 * Вспомогательная функция для общей длительности
 * @param duration - Длительность одной серии в минутах
 * @param episodes - Количество эпизодов
 * @returns Форматированная строка общей длительности
 */
const getTotalDuration = (duration: number, episodes: number): string => {
  if (!duration || !episodes || episodes === 1) return "";
  const totalMinutes = duration * episodes;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `Общая длительность: ${hours} ч. ${minutes} мин.`;
};

/**
 * Вспомогательная функция для форматирования даты
 * @param dateString - Строка даты в формате ISO
 * @returns Форматированная дата на русском
 */
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/**
 * Вспомогательная функция для цвета статуса
 * @param status - Статус аниме
 * @returns Цвет в формате HEX
 */
const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    ongoing: "#4CAF50",
    released: "#CCBAE4",
    announced: "#FFA726",
  };
  return colors[status] || "#CCBAE4";
};

/**
 * Компонент детальной информации об аниме
 * @description Отображает подробности аниме с анимацией и интерактивными элементами
 * @param {AnimeDetailsProps} props - Пропсы компонента
 */
const AnimeDetails: React.FC<AnimeDetailsProps> = React.memo(({ animeId, anime, genres }) => {
  if (!anime) {
    return <AnimeDetailsSkeleton />;
  }

  if (!anime.anime_id) {
    return <div>Ошибка загрузки данных: данные об аниме отсутствуют</div>;
  }

  const getGenreName = useMemo(
    () => (genreId: string) => {
      if (!genres) return "...";
      const genre = genres.find((g) => String(g.genre_id) === String(genreId));
      return genre ? genre.russian || genre.name : "...";
    },
    [genres]
  );

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative"
    >
      <div className="flex flex-col lg:flex-row gap-8 relative">
        {/* Left Column */}
        <motion.article variants={itemVariants} className="flex flex-col gap-6 lg:sticky lg:top-24 h-fit">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-[315px] overflow-hidden rounded-[14px] relative group">
              <Image
                alt={anime.russian || anime.name}
                className="w-full h-[454px] object-cover transition-transform duration-500 scale-105 group-hover:scale-110"
                src={anime.poster_url}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="flex flex-col gap-3 w-full max-w-[315px]">
            <ScrollToPlayerButton />
            <ListSelector animeId={anime.anime_id} />
          </motion.div>
        </motion.article>

        {/* Center Column */}
        <motion.article variants={itemVariants} className="flex w-full flex-col gap-8">
          {anime.date_of_broadcast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-5 bg-white/[0.02] rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FFE7B7]/10">
                  <svg width="20" height="20" viewBox="0 0 24 24" className="text-[#FFE7B7]">
                    <path
                      fill="currentColor"
                      d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m4.2 14.2L11 13V7h1.5v5.2l4.5 2.7l-.8 1.3Z"
                    />
                  </svg>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-medium text-white/90">Следующий эпизод</span>
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium text-white"
                      style={{ backgroundColor: getStatusColor(anime.status) }}
                    >
                      {transformValue("status", anime.status)}
                    </span>
                  </div>
                  <p className="text-[12px] text-white/40">До выхода нового эпизода</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5">
                  <p className="text-[14px] font-medium text-white/90">
                    {new Date(anime.date_of_broadcast).toLocaleString("ru-RU", {
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <motion.header variants={itemVariants} className="flex justify-between items-start gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-[32px] font-bold text-white/90">{anime.russian || anime.name}</h1>
              <p className="text-white/40 text-[14px]">{anime.name}</p>
            </div>
            {anime.score && (
              <div className="bg-white/[0.02] border border-white/5 px-4 py-2 rounded-xl">
                <span className="text-[#FFE4A0] font-medium">{anime.score}</span>
              </div>
            )}
          </motion.header>

          <div className="flex gap-2 flex-wrap">
            {anime.genre_ids?.map((genreId) => (
              <span
                key={genreId}
                className="px-4 py-2 bg-white/[0.02] border border-white/5 text-white/60 rounded-xl text-[14px] hover:bg-white/[0.04] transition-colors"
              >
                {getGenreName(genreId)}
              </span>
            ))}
          </div>

          <motion.div variants={itemVariants} className="w-full h-[1px] bg-white/5" />

          <motion.div variants={itemVariants} className="text-white/70 text-[15px] leading-relaxed">
            {anime.description && anime.description.trim() ? (
              parseDescription(anime.description)
            ) : (
              <div className="h-[220px] rounded-xl flex items-center justify-center">
                <div className="text-center space-y-2">
                  <p className="text-[24px]">😢</p>
                  <p className="text-white/40">Описание отсутствует</p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.article>

        {/* Vertical Divider Line */}
        <div className="hidden lg:block w-[1px] bg-white/5" />

        {/* Right Column */}
        <motion.aside variants={itemVariants} className="hidden lg:block min-w-[320px] space-y-4">
          {anime.kind && (
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
              <div className="flex justify-between items-center">
                <span className="text-white/40 text-[14px]">Тип</span>
                <span className="text-white/80 text-[14px]">{transformValue("kind", anime.kind)}</span>
              </div>
            </div>
          )}
          {anime.episodes && (
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
              <div className="flex justify-between items-center">
                <span className="text-white/40 text-[14px]">Эпизодов</span>
                <span className="text-white/80 text-[14px] font-medium">{anime.episodes}</span>
              </div>
            </div>
          )}
          {anime.status && (
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
              <div className="flex justify-between items-center">
                <span className="text-white/40 text-[14px]">Статус</span>
                <span className="text-white/80 text-[14px]">{transformValue("status", anime.status)}</span>
              </div>
            </div>
          )}
          {anime.rating && (
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/40 text-[14px]">Рейтинг</span>
                  <span className="text-white/80 text-[14px] font-medium">{transformValue("rating", anime.rating)}</span>
                </div>
                <span className="text-white/30 text-[12px]">{getRatingDescription(anime.rating)}</span>
              </div>
            </div>
          )}
          {anime.duration && (
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/40 text-[14px]">Длительность серии</span>
                  <span className="text-white/80 text-[14px]">{anime.duration} мин.</span>
                </div>
                <span className="text-white/30 text-[12px]">{getTotalDuration(anime.duration, anime.episodes)}</span>
              </div>
            </div>
          )}
          {anime.season && (
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
              <div className="flex justify-between items-center">
                <span className="text-white/40 text-[14px]">Сезон</span>
                <span className="text-white/80 text-[14px]">{transformValue("season", anime.season)}</span>
              </div>
            </div>
          )}
          {(anime.aired_on || anime.released_on) && (
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 space-y-3">
              {anime.aired_on && (
                <div className="flex justify-between items-center">
                  <span className="text-white/40 text-[14px]">Начало показа</span>
                  <span className="text-white/80 text-[14px]">{formatDate(anime.aired_on)}</span>
                </div>
              )}
              {anime.released_on && (
                <div className="flex justify-between items-center">
                  <span className="text-white/40 text-[14px]">Завершение</span>
                  <span className="text-white/80 text-[14px]">{formatDate(anime.released_on)}</span>
                </div>
              )}
            </div>
          )}
        </motion.aside>
      </div>
    </motion.section>
  );
});

AnimeDetails.displayName = "AnimeDetails";

export default AnimeDetails;