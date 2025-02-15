interface Genre {
    genre_id: string;
    name: string;
    russian: string;
}

export const genresMap: Record<string, Genre> = {
    '1': { genre_id: '1', name: 'Action', russian: 'Экшен' },
    '2': { genre_id: '2', name: 'Adventure', russian: 'Приключения' },
    '3': { genre_id: '3', name: 'Cars', russian: 'Машины' },
    '4': { genre_id: '4', name: 'Comedy', russian: 'Комедия' },
    '5': { genre_id: '5', name: 'Dementia', russian: 'Безумие' },
    '6': { genre_id: '6', name: 'Demons', russian: 'Демоны' },
    '7': { genre_id: '7', name: 'Mystery', russian: 'Детектив' },
    '8': { genre_id: '8', name: 'Drama', russian: 'Драма' },
    '9': { genre_id: '9', name: 'Ecchi', russian: 'Этти' },
    '10': { genre_id: '10', name: 'Fantasy', russian: 'Фэнтези' },
    '11': { genre_id: '11', name: 'Game', russian: 'Игры' },
    '12': { genre_id: '12', name: 'Hentai', russian: 'Хентай' },
    '13': { genre_id: '13', name: 'Historical', russian: 'Исторический' },
    '14': { genre_id: '14', name: 'Horror', russian: 'Ужасы' },
    '15': { genre_id: '15', name: 'Kids', russian: 'Детское' },
    '16': { genre_id: '16', name: 'Magic', russian: 'Магия' },
    '17': { genre_id: '17', name: 'Martial Arts', russian: 'Боевые искусства' },
    '18': { genre_id: '18', name: 'Mecha', russian: 'Меха' },
    '19': { genre_id: '19', name: 'Music', russian: 'Музыка' },
    '20': { genre_id: '20', name: 'Parody', russian: 'Пародия' },
    '21': { genre_id: '21', name: 'Samurai', russian: 'Самураи' },
    '22': { genre_id: '22', name: 'Romance', russian: 'Романтика' },
    '23': { genre_id: '23', name: 'School', russian: 'Школа' },
    '24': { genre_id: '24', name: 'Sci-Fi', russian: 'Фантастика' },
    '25': { genre_id: '25', name: 'Shoujo', russian: 'Сёдзё' },
    '26': { genre_id: '26', name: 'Shoujo Ai', russian: 'Сёдзё-ай' },
    '27': { genre_id: '27', name: 'Shounen', russian: 'Сёнен' },
    '28': { genre_id: '28', name: 'Shounen Ai', russian: 'Сёнен-ай' },
    '29': { genre_id: '29', name: 'Space', russian: 'Космос' },
    '30': { genre_id: '30', name: 'Sports', russian: 'Спорт' },
    '31': { genre_id: '31', name: 'Super Power', russian: 'Супер сила' },
    '32': { genre_id: '32', name: 'Vampire', russian: 'Вампиры' },
    '33': { genre_id: '33', name: 'Yaoi', russian: 'Яой' },
    '34': { genre_id: '34', name: 'Yuri', russian: 'Юри' },
    '35': { genre_id: '35', name: 'Harem', russian: 'Гарем' },
    '36': { genre_id: '36', name: 'Slice of Life', russian: 'Повседневность' },
    '37': { genre_id: '37', name: 'Supernatural', russian: 'Сверхъестественное' },
    '38': { genre_id: '38', name: 'Military', russian: 'Военное' },
    '39': { genre_id: '39', name: 'Police', russian: 'Полиция' },
    '40': { genre_id: '40', name: 'Psychological', russian: 'Психологическое' }
};
