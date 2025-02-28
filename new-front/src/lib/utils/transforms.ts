import React from 'react';
import { useTranslations } from 'next-intl';
import { CharacterTooltip } from '@/components/ui/tooltip/CharacterTooltip';
import { AnimeTooltip } from '@/components/ui/tooltip/AnimeTooltip';

/**
 * Трансформирует значение поля (например, тип, статус, рейтинг) в читаемый текст с учётом мультиязычности *
 * @param key Ключ трансформации (например, 'kind', 'status', 'rating')
 * @param value Значение для трансформации (строка)
 * @returns Преобразованное значение или null, если значение отсутствует
 */
export const transformValue = (key: string, value: string | undefined): string | null => {
  if (!value) return null;

  const t = useTranslations('common');

  const transformations: Record<string, Record<string, string>> = {
    kind: {
      tv: t('tvSeries'),
      tv_special: t('tvSpecial'),
      movie: t('movie'),
      ova: t('ova'),
      ona: t('ona'),
      special: t('special'),
      music: t('musicVideo'),
    },
    status: {
      released: t('released'),
      ongoing: t('ongoing'),
      announced: t('announced'),
    },
    rating: {
      g: t('ratingG'),
      pg: t('ratingPG'),
      pg_13: t('ratingPG13'),
      r: t('ratingR17'),
      r_plus: t('ratingRPlus'),
      rx: t('ratingRx'),
    },
  };

  if (key === 'season' && value) {
    const [season, year] = value.split('_');
    const seasons: Record<string, string> = {
      winter: t('winter'),
      spring: t('spring'),
      summer: t('summer'),
      fall: t('fall'),
    };
    return `${seasons[season] || t('unknownSeason')} ${year}`;
  }

  return transformations[key]?.[value] || value;
};

/**
 * Трансформирует описание аниме, обрабатывая теги [character=...] и [anime=...] для создания интерактивных подсказок
 * @param description Описание аниме в виде строки с тегами
 * @returns React-узлы для рендера описания с подсказками
 */
export const transformDescription = (description: string): React.ReactNode => {
  if (!description) return '';

  const t = useTranslations('common');
  const parts = description.split(/(\[character=\d+\][^\[]+\[\/character\]|\[anime=\d+\][^\[]+\[\/anime\])/g);

  return parts.map((part, index) => {
    const characterMatch = part.match(/\[character=(\d+)\]([^\[]+)\[\/character\]/);
    const animeMatch = part.match(/\[anime=(\d+)\]([^\[]+)\[\/anime\]/);

    if (characterMatch) {
      const [_, id, name] = characterMatch;
      return React.createElement(CharacterTooltip, { key: `char-${index}`, id, name});
    }

    if (animeMatch) {
      const [_, id, name] = animeMatch;
      return React.createElement(AnimeTooltip, { key: `anime-${index}`, id, name });
    }

    return part;
  });
};


export type CharacterTooltipType = React.ComponentType<{ id: string; name: string; imageUrl?: string }>;
export type AnimeTooltipType = React.ComponentType<{ id: string; name: string }>;

export { CharacterTooltip as CharacterTooltipValue, AnimeTooltip as AnimeTooltipValue };