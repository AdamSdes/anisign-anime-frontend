/**
 * Трансформация значений в читаемый формат
 * @param key Ключ значения 
 * @param value Значение 
 * @returns Преобразованное значение
 */
export const transformValue = (key: string, value: string | undefined): string | null => {
    if (!value) return null;
  
    const transformations: Record<string, Record<string, string>> = {
      kind: {
        tv: 'ТВ Сериал',
        tv_special: 'ТВ Спешл',
        movie: 'Фильм',
        ova: 'OVA',
        ona: 'ONA',
        special: 'Спешл',
        music: 'Клип',
      },
      status: {
        released: 'Вышел',
        ongoing: 'Онгоинг',
        announced: 'Анонсировано',
      },
      rating: {
        g: 'G',
        pg: 'PG',
        pg_13: 'PG-13',
        r: 'R-17',
        r_plus: 'R+',
        rx: 'Rx',
      },
    };
  
    if (key === 'season') {
      const [season, year] = value.split('_');
      const seasons: Record<string, string> = {
        winter: 'Зима',
        spring: 'Весна',
        summer: 'Лето',
        fall: 'Осень',
      };
      return season in seasons ? `${seasons[season]} ${year}` : value;
    }
  
    return transformations[key]?.[value] || value;
  };