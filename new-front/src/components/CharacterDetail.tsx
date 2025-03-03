'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Character } from '@/shared/types/character';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import useSWR from 'swr'; 
import { characterService } from '@/services/character';

interface CharacterDetailProps {
  className?: string;
}

export function CharacterDetail({ className }: CharacterDetailProps) {
  const t = useTranslations('common');
  const params = useParams();
  const characterId = params.id as string;

  // Использование SWR для кэширования запроса к API
  const { data: character, error, isLoading } = useSWR<Character, Error>(
    `/api/characters/${characterId}`,
    () => characterService.getCharacterDetails(characterId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false, 
    }
  );

  // Безопасная обработка опциональных полей с useMemo
  const characterName = useMemo(() => {
    if (!character?.name) return t('unnamedCharacter');
    return character.name + (character.russian ? ` (${character.russian})` : '');
  }, [character, t]);

  const characterDescription = useMemo(() => {
    return character?.description || t('noDescription');
  }, [character, t]);

  const characterImageSrc = useMemo(() => {
    return character?.image_url || '/placeholder-character.png';
  }, [character]);

  const characterRoles = useMemo(() => {
    return character?.roles || [];
  }, [character]);

  if (isLoading) {
    return (
      <div className={className || 'flex justify-center py-8 text-white/40'}>
        {t('loading')}
      </div>
    );
  }

  if (error) {
    return (
      <div className={className || 'flex flex-col items-center justify-center py-16 px-4'}>
        <h3 className="text-lg font-medium text-white/80 mb-2">
          {error.message || t('errorLoadingCharacter')}
        </h3>
        <p className="text-sm text-white/40 text-center max-w-md">
          {t('tryAgain')}
        </p>
      </div>
    );
  }

  if (!character) {
    return (
      <div className={className || 'flex flex-col items-center justify-center py-16 px-4'}>
        <h3 className="text-lg font-medium text-white/80 mb-2">
          {t('characterNotFound')}
        </h3>
        <p className="text-sm text-white/40 text-center max-w-md">
          {t('checkCharacterId')}
        </p>
      </div>
    );
  }

  return (
    <div className={className || 'space-y-8 p-4 bg-black/90 backdrop-blur-md rounded-xl border border-white/5 shadow-lg'}>
      <div className="flex flex-col md:flex-row gap-6">
        <Image
          src={characterImageSrc}
          alt={characterName || t('characterImage')}
          width={300}
          height={400}
          className="rounded-xl object-cover"
        />
        <div className="space-y-4 flex-1">
          <h1 className="text-2xl font-bold text-white/90">
            {characterName}
          </h1>
          <p className="text-sm text-white/60">
            {characterDescription}
          </p>
          <div className="space-y-2">
            <h3 className="text-md font-medium text-white/80">
              {t('roles')}
            </h3>
            <ul className="list-disc pl-5 text-sm text-white/60">
              {characterRoles.length > 0
                ? characterRoles.map((role, index) => (
                    <li key={index}>{role}</li>
                  ))
                : <li>{t('noRoles')}</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}