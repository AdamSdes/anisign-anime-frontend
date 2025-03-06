"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { atom, useAtom } from "jotai";
import useSWR from "swr";
import { axiosInstance } from "@/lib/axios/axiosConfig";

// Атом для состояния аутентификации
export const authAtom = atom<{
  isAuthenticated: boolean;
  user: { username: string; nickname?: string; user_avatar?: string; banner?: string; isPro?: boolean } | null;
}>({
  isAuthenticated: false,
  user: null,
});

/**
 * Интерфейс данных персонажа
 * @interface Character
 */
interface Character {
  character_id: string;
  name: string;
  russian: string;
  japanese: string;
  poster_url: string;
}

/**
 * Пропсы компонента CharacterCard
 * @interface CharacterCardProps
 * @extends Character
 */
interface CharacterCardProps extends Character {}

/**
 * Компонент карточки персонажа
 * @description Отображает информацию о персонаже с изображением и ссылкой на страницу
 * @param {CharacterCardProps} props - Пропсы компонента
 * @returns {JSX.Element}
 */
export const CharacterCard: React.FC<CharacterCardProps> = React.memo(
  ({ character_id, name, russian, japanese, poster_url }) => {
    const [imgError, setImgError] = useState(false);
    const [imgLoading, setImgLoading] = useState(true);
    const [auth] = useAtom(authAtom); // Добавлено использование атома аутентификации

    // Опциональная загрузка данных через SWR (если требуется динамическая проверка)
    const { data: characterData } = useSWR<Character>(
      auth.isAuthenticated ? `/api/characters/${character_id}` : null,
      (url) => axiosInstance.get(url).then((res) => res.data),
      { revalidateOnFocus: false }
    );

    const truncateTitle = (title: string, maxLength: number = 21) => {
      if (!title) return "";
      return title.length <= maxLength ? title : title.slice(0, maxLength) + "...";
    };

    const fallbackImage = "/placeholder-character.jpg"; // Предполагаемый путь к fallback-изображению
    
    // Гарантируем, что altText всегда будет строкой
    const altText = russian || name || "Character";
    
    // Гарантируем, что imageUrl всегда будет строкой
    const imageUrl = poster_url || fallbackImage;

    return (
      <Link href={`/characters/${character_id}`}>
        <div className="group relative">
          {/* Контейнер изображения */}
          <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-white/5">
            {imgLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              </div>
            )}
            {!imgError ? (
              <Image
                src={imageUrl}
                alt={altText}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                className={`object-cover transition-transform duration-300 scale-105 group-hover:scale-110 ${
                  imgLoading ? "opacity-0" : "opacity-100"
                }`}
                onError={() => {
                  setImgError(true);
                  setImgLoading(false);
                }}
                onLoad={() => setImgLoading(false)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                <span className="text-white/40">Нет изображения</span>
              </div>
            )}
          </div>

          {/* Информация */}
          <div className="mt-3 space-y-1.5">
            <h3 className="text-sm font-medium line-clamp-1 text-white/90 group-hover:text-white transition-colors">
              {truncateTitle(russian || name || characterData?.russian || characterData?.name || "")}
            </h3>
            <div className="space-y-1">
              {name && name !== (russian || "") && (
                <p className="text-xs text-white/50 line-clamp-1">
                  {truncateTitle(name)}
                </p>
              )}
              {japanese && (
                <p className="text-xs text-white/30 line-clamp-1 font-japanese">
                  {truncateTitle(japanese)}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }
);

CharacterCard.displayName = "CharacterCard";
export default CharacterCard;