"use client";

import React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Report } from "@/components/report/report";
import { atom, useAtom } from "jotai";
import useSWR from "swr";
import { axiosInstance } from "@/lib/axios/axiosConfig";
import { Button } from "@/components/ui/button";

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
  id: string;
  character_id: string;
  name: string;
  russian: string;
  japanese?: string;
  poster_url: string;
  description?: string;
}

/**
 * Пропсы компонента CharacterPage
 * @interface CharacterPageProps
 */
interface CharacterPageProps {}

/**
 * Компонент страницы детальной информации о персонаже
 * @description Отображает детальную информацию о персонаже с изображением и описанием
 * @returns {JSX.Element}
 */
const CharacterPage: React.FC<CharacterPageProps> = React.memo(() => {
  const { id } = useParams();
  const characterId = Array.isArray(id) ? id[0] : id;
  const [auth] = useAtom(authAtom);

  // SWR для загрузки данных персонажа
  const { data: character, error, isLoading } = useSWR<Character>(
    characterId ? `/api/character/${characterId}` : null,
    (url) => axiosInstance.get(url).then((res) => res.data),
    { revalidateOnFocus: false }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
        </div>
        <Footer />
        <Report />
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] gap-4">
          <p className="text-white/60">Персонаж не найден</p>
          <Link
            href="/characters"
            className="flex items-center gap-2 text-white/60 hover:text-white/90 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Вернуться к списку</span>
          </Link>
        </div>
        <Footer />
        <Report />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/characters"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white/90 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Вернуться к списку</span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-[300px,1fr] gap-8">
          {/* Изображение */}
          <div className="space-y-4">
            <div className="aspect-[2/3] relative rounded-xl overflow-hidden border border-white/5">
              <Image
                src={character.poster_url}
                alt={character.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 300px"
              />
            </div>
          </div>

          {/* Информация */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white/90">
                {character.russian || character.name}
              </h1>
              {character.name !== character.russian && (
                <p className="text-xl text-white/60">{character.name}</p>
              )}
              {character.japanese && (
                <p className="text-lg text-white/40 font-japanese">{character.japanese}</p>
              )}
            </div>

            {character.description && (
              <div className="space-y-2">
                <h2 className="text-xl font-medium text-white/90">Описание</h2>
                <p className="text-white/60 leading-relaxed whitespace-pre-wrap">
                  {character.description.replace(/\[spoiler=.*?\](.*?)\[\/spoiler\]/g, "$1")}
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-white/5">
              <p className="text-sm text-white/40">ID персонажа: {character.character_id}</p>
              {auth.isAuthenticated && (
                <Button
                  variant="ghost"
                  className="mt-2 text-white/60 hover:text-white/90"
                  onClick={() => console.log("Add to favorites:", character.id)}
                >
                  Добавить в избранное
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <Report />
    </div>
  );
});

CharacterPage.displayName = "CharacterPage";
export default CharacterPage;