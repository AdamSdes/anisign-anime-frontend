const kindTransformations = {
  tv: 'ТВ Сериал',
  tv_special: 'ТВ Спешл',
  movie: 'Фильм',
  ova: 'OVA',
  ona: 'ONA',
  special: 'Спешл',
  music: 'Клип',
} as const;

const statusTransformations = {
  released: 'Вышел',
  ongoing: 'Онгоинг',
  announced: 'Анонсировано',
} as const;

const ratingTransformations = {
  g: 'G',
  pg: 'PG',
  pg_13: 'PG-13',
  r: 'R-17',
  r_plus: 'R+',
  rx: 'Rx',
} as const;

const seasonTransformations = {
  winter: 'Зима',
  spring: 'Весна',
  summer: 'Лето',
  fall: 'Осень',
} as const;

type KindKey = keyof typeof kindTransformations;
type StatusKey = keyof typeof statusTransformations;
type RatingKey = keyof typeof ratingTransformations;
type SeasonKey = keyof typeof seasonTransformations;

/**
 * Преобразует значение поля в человекочитаемый формат
 * @param key Название поля (kind, status, rating, season)
 * @param value Значение поля
 * @returns Преобразованное значение или исходное, если преобразование не найдено
 */
export function transformValue(key: string, value: string): string {
  if (key === 'season' && value) {
    const [season, year] = value.split('_') as [SeasonKey, string];
    return season in seasonTransformations ? `${seasonTransformations[season]} ${year}` : value;
  }

  const transformations: Record<string, Record<string, string>> = {
    kind: kindTransformations,
    status: statusTransformations,
    rating: ratingTransformations,
  };

  if (key in transformations && value in transformations[key]) {
    return transformations[key][value];
  }

  return value;
}

/**
 * Преобразует описание, удаляя разметку персонажей
 * @param description Исходное описание
 * @returns Очищенное описание или пустая строка, если описание отсутствует
 */
export function transformDescription(description: string): string {
  if (!description) return '';
  return description.replace(/\[character=\d+\]([^\[]+)\[\/character\]/g, '$1');
}