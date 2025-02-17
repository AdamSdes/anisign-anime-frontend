'use client';

import { getCharacterById } from '@/lib/api/character';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Report from '@/components/Report/Report';

export default function CharacterPage() {
  const { id } = useParams();
  const characterId = Array.isArray(id) ? id[0] : id;

  const { data: character, isLoading, error } = useQuery({
    queryKey: ['character', characterId],
    queryFn: () => getCharacterById(characterId),
  });

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
                  {character.description.replace(/\[spoiler=.*?\](.*?)\[\/spoiler\]/g, '$1')}
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-white/5">
              <p className="text-sm text-white/40">
                ID персонажа: {character.character_id}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <Report />
    </div>
  );
}
