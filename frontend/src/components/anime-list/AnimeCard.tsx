"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Anime, Genre } from "@/shared/types/anime";

interface AnimeCardProps {
  anime: Anime;
  genres?: Genre[];
  priority?: boolean;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime, genres, priority }) => {
  const [imageError, setImageError] = useState(false);
  
  console.log("AnimeCard data:", anime);
  console.log("Genres:", genres);

  const generateAnimeUrl = (anime: Anime) => {
    const title = anime.russian || anime.name || "";
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .trim()
      .replace(/\s+/g, " ")
      .replace(/ /g, "-");
    return `/anime/${anime.anime_id}${slug ? "-" + slug : ""}`;
  };

  // Извлечение года
  const year = anime.aired_on ? new Date(anime.aired_on).getFullYear().toString() : "";

  return (
    <TooltipProvider>
      <Tooltip delayDuration={700}>
        <TooltipTrigger asChild>
          <div className="flex flex-col">
            <Link
              href={generateAnimeUrl(anime)}
              className="relative block w-[200px] h-[280px] rounded-[16px] overflow-hidden border border-white/10 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <Image
                src={imageError ? "/placeholder-image.jpg" : (anime.poster_url || "/placeholder-image.jpg")}
                alt={anime.russian || anime.name || "Anime Poster"}
                width={200}
                height={280}
                style={{ width: "100%", height: "100%" }}
                className="object-cover transition-transform duration-300 scale-105 group-hover:scale-110"
                priority={priority}
                onError={(e) => {
                  console.warn("Image load error:", anime.poster_url);
                  setImageError(true);
                }}
              />
            </Link>
            {/* Подпись под карточкой */}
            <div className="mt-2">
              <p className="text-[14px] font-semibold line-clamp-1 text-white">
                {anime.russian || anime.name || "Unknown Title"}
              </p>
              <div className="flex items-center gap-2 text-[12px] mt-1 text-white/90">
                <span>{year}</span>
                {anime.score && (
                  <span className="bg-white/[0.1] px-1.5 py-0.5 rounded text-[#FFD700]">
                    {String(anime.kind)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className="p-0 bg-black/80 backdrop-blur border border-white/10 w-[340px]"
        >
          <div className="space-y-4 p-4">
            <div className="space-y-1">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[15px] font-medium leading-tight text-white">
                  {anime.russian || anime.name || "Unknown Title"}
                </h3>
                {anime.score && (
                  <div className="flex items-center gap-1.5 bg-white/[0.08] px-2.5 py-1 rounded-lg">
                    <span className="text-sm font-medium text-[#FFD700]">
                      {Number(anime.score).toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-[13px] text-white/80 leading-tight">{anime.name}</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <span className="text-[11px] uppercase tracking-wider text-white/60 font-medium">
                  Тип
                </span>
                <p className="text-[13px] text-white font-medium">{anime.kind}</p>
              </div>
              {anime.episodes && anime.episodes > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] uppercase tracking-wider text-white/60 font-medium">
                    Еизодов
                  </span>
                  <p className="text-[13px] text-white font-medium">{anime.episodes}</p>
                </div>
              )}
              <div className="space-y-1.5">
                <span className="text-[11px] uppercase tracking-wider text-white/60 font-medium">
                  Год
                </span>
                <p className="text-[13px] text-white font-medium">{year}</p>
              </div>
            </div>
            {anime.genre_ids && anime.genre_ids.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-white/60 font-medium">
                  Жанр
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {anime.genre_ids
                    .map((genreId) => genres?.find((g) => g.genre_id === String(genreId)))
                    .filter((genre): genre is Genre => genre !== undefined)
                    .map((genre) => (
                      <span
                        key={genre.genre_id}
                        className="px-2.5 py-1 text-[12px] rounded-lg bg-white/[0.03] border border-white/[0.06] text-white transition-colors hover:bg-white/[0.06] hover:text-white"
                      >
                        {genre.russian || genre.name}
                      </span>
                    ))}
                </div>
              </div>
            )}
            {anime.description && (
              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-white/60 font-medium">
                  Описание
                </span>
                <p className="text-[13px] leading-relaxed text-white line-clamp-4">
                  {anime.description}
                </p>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

AnimeCard.displayName = "AnimeCard";
export default AnimeCard;