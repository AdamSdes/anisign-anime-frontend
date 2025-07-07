/**
 * Словарь жанров аниме
 *
 * Используется для преобразования ID жанров в понятные названия
 */
interface Genre {
  id: string; // UUID жанра
  russian: string; // Русское название
  name: string; // Английское название
  genre_id: string; // Числовой ID в API
}

export const genres: Genre[] = [
  {
    russian: 'Сёнен',
    name: 'Shounen',
    id: '80e86ece-8c1d-49cb-9a4c-575594abcdd1',
    genre_id: '27',
  },
  {
    russian: 'Приключения',
    name: 'Adventure',
    id: 'c861b11d-2f55-4c75-9cee-ca788e7e32c1',
    genre_id: '2',
  },
  {
    russian: 'Драма',
    name: 'Drama',
    id: '3846e25d-ae85-46d0-9498-7855fbaa9303',
    genre_id: '8',
  },
  {
    russian: 'Фэнтези',
    name: 'Fantasy',
    id: '786c8a29-b913-421f-802a-f55da91a3f04',
    genre_id: '10',
  },
  {
    russian: 'Экшен',
    name: 'Action',
    id: '93ed6bd7-f8b9-402b-86be-a982a68b8b46',
    genre_id: '1',
  },
  {
    russian: 'Военное',
    name: 'Military',
    id: 'fd453950-92ac-4c86-81de-e4a3752a609a',
    genre_id: '38',
  },
  {
    russian: 'Фантастика',
    name: 'Sci-Fi',
    id: '699a8f48-dc04-4fef-8de0-0c58b0372b2e',
    genre_id: '24',
  },
  {
    russian: 'Триллер',
    name: 'Suspense',
    id: '7a18893d-5309-4058-b610-82200bee3d56',
    genre_id: '117',
  },
  {
    russian: 'Психологическое',
    name: 'Psychological',
    id: '4c8266af-71e3-4ede-8c06-f2a66d268e34',
    genre_id: '40',
  },
  {
    russian: 'Путешествие во времени',
    name: 'Time Travel',
    id: '7a115115-4e0e-4dd6-8a58-bb5a124092e5',
    genre_id: '111',
  },
  {
    russian: 'Жестокость',
    name: 'Gore',
    id: 'f81b5aa2-79fd-4ef9-b6a5-dac70b861c85',
    genre_id: '105',
  },
  {
    russian: 'Выживание',
    name: 'Survival',
    id: 'd8bc65e6-350a-44cf-b011-e62d23a4ada5',
    genre_id: '141',
  },
  {
    russian: 'Комедия',
    name: 'Comedy',
    id: '2fdb3242-0ece-441a-b8cc-2e055ba1b096',
    genre_id: '4',
  },
  {
    russian: 'Гэг-юмор',
    name: 'Gag Humor',
    id: '75ea75bb-bbce-4c77-ae03-f0684a9211be',
    genre_id: '112',
  },
  {
    russian: 'Исторический',
    name: 'Historical',
    id: '360e7e9b-864e-40a4-8b87-a9b3566fd011',
    genre_id: '13',
  },
  {
    russian: 'Пародия',
    name: 'Parody',
    id: '790205a9-676f-4c0b-ac38-096b751f1455',
    genre_id: '20',
  },
  {
    russian: 'Самураи',
    name: 'Samurai',
    id: '1a3359be-7194-4aae-ac52-d7732e48d0e1',
    genre_id: '21',
  },
  {
    russian: 'Взрослые персонажи',
    name: 'Adult Cast',
    id: '2967a34b-b9da-4956-99e4-0254c6672574',
    genre_id: '104',
  },
  {
    russian: 'Космос',
    name: 'Space',
    id: 'e71aee2e-2bd9-409f-9fd7-b2916be69a46',
    genre_id: '29',
  },
  {
    russian: 'Сэйнэн',
    name: 'Seinen',
    id: '7bd92dc5-6815-4359-bba8-f26dd6f530d6',
    genre_id: '42',
  },
  {
    russian: 'Романтика',
    name: 'Romance',
    id: '41a7ab7c-6ac2-4fc8-8754-500f33fcbae6',
    genre_id: '22',
  },
  {
    russian: 'Школа',
    name: 'School',
    id: '80d426e1-700e-4192-823b-7c96de0ad4a2',
    genre_id: '23',
  },
  {
    russian: 'Сёдзё',
    name: 'Shoujo',
    id: 'e4e9bd05-9287-41f4-b3c7-003b3080735d',
    genre_id: '25',
  },
  {
    russian: 'Сверхъестественное',
    name: 'Supernatural',
    id: 'bb10ca57-e1c7-43be-adf7-5c1ae3ebb6b6',
    genre_id: '37',
  },
  {
    russian: 'Удостоено наград',
    name: 'Award Winning',
    id: 'a1c2c118-c4c9-46e0-8eba-307fee9eb23a',
    genre_id: '114',
  },
  {
    russian: 'Забота о детях',
    name: 'Childcare',
    id: 'c3843c01-567b-46b6-8b4a-5eba266a47b7',
    genre_id: '134',
  },
  {
    russian: 'Стратегические игры',
    name: 'Strategy Game',
    id: '5782a047-46de-4175-b09d-a2d24bd5ea53',
    genre_id: '11',
  },
  {
    russian: 'Меха',
    name: 'Mecha',
    id: 'dcf1b5eb-a3b4-4c6a-83dd-61bbc2abd347',
    genre_id: '18',
  },
  {
    russian: 'Супер сила',
    name: 'Super Power',
    id: '8b32da69-e739-4d15-a5b8-3903656a9df2',
    genre_id: '31',
  },
  {
    russian: 'Тайна',
    name: 'Mystery',
    id: '0e28f6b7-a953-4c8e-aab1-35fc0f077e3f',
    genre_id: '7',
  },
  {
    russian: 'Медицина',
    name: 'Medical',
    id: 'e8c1c361-4faa-4ac2-ae41-0f06bff8bda3',
    genre_id: '147',
  },
  {
    russian: 'Вампиры',
    name: 'Vampire',
    id: '5b773133-4b73-400c-a198-4e0d85a9c2c4',
    genre_id: '32',
  },
  {
    russian: 'Городское фэнтези',
    name: 'Urban Fantasy',
    id: 'd93dee4c-9599-46e9-ba05-8b903076caaa',
    genre_id: '197',
  },
  {
    russian: 'Спорт',
    name: 'Sports',
    id: 'c2cbe8ae-13ad-41c2-99f6-9c29bafba2dd',
    genre_id: '30',
  },
  {
    russian: 'Командный спорт',
    name: 'Team Sports',
    id: 'c1a0130a-dc97-4798-ab9d-1b7d18b75a3c',
    genre_id: '102',
  },
  {
    russian: 'Спортивные единоборства',
    name: 'Combat Sports',
    id: 'd3c8dd78-18e7-4780-9c0d-f195aedbf6d2',
    genre_id: '118',
  },
  {
    russian: 'Мифология',
    name: 'Mythology',
    id: '9562350f-d558-4607-88e7-ae10bd5b66ba',
    genre_id: '6',
  },
  {
    russian: 'CGDCT',
    name: 'CGDCT',
    id: '9b3a742a-e9b7-4562-92e4-f9ca1e1ba538',
    genre_id: '119',
  },
  {
    russian: 'Музыка',
    name: 'Music',
    id: 'e46611d9-2bf6-4d41-b890-3dcdc9e88ddf',
    genre_id: '19',
  },
  {
    russian: 'Исполнительское искусство',
    name: 'Performing Arts',
    id: 'b579c99d-2adb-4919-81d0-1ee1dd92ae3c',
    genre_id: '142',
  },
  {
    russian: 'Повседневность',
    name: 'Slice of Life',
    id: 'a8eb4476-3b7f-484e-9ec2-9929f0065e9c',
    genre_id: '36',
  },
  {
    russian: 'Иясикэй',
    name: 'Iyashikei',
    id: '58cfa92c-038f-4f74-9fb1-c88ea4a7687f',
    genre_id: '140',
  },
  {
    russian: 'Дзёсей',
    name: 'Josei',
    id: 'a7e039f8-7285-4e8b-a64f-f1eb19ff76b1',
    genre_id: '43',
  },
  {
    russian: 'Любовный многоугольник',
    name: 'Love Polygon',
    id: 'e458ebc5-66b2-45d4-bc81-490b3c02ea35',
    genre_id: '107',
  },
  {
    russian: 'Исэкай',
    name: 'Isekai',
    id: '51438ead-246d-43f3-aaf4-4fd8cb67d4d9',
    genre_id: '130',
  },
  {
    russian: 'Культура отаку',
    name: 'Otaku Culture',
    id: '9705692f-5d31-4b1d-aa7f-9b60c095814d',
    genre_id: '137',
  },
  {
    russian: 'Хулиганы',
    name: 'Delinquents',
    id: '62b38b62-166e-4fd0-97fc-83bd647f5a44',
    genre_id: '131',
  },
  {
    russian: 'Работа',
    name: 'Workplace',
    id: '5b55785d-3d74-477e-9420-16600861f373',
    genre_id: '139',
  },
  {
    russian: 'Реинкарнация',
    name: 'Reincarnation',
    id: '15c4d070-4bf5-4af1-961c-9bffb08f5aea',
    genre_id: '106',
  },
  {
    russian: 'Этти',
    name: 'Ecchi',
    id: '09b95429-a910-456d-8e31-4600b9979780',
    genre_id: '9',
  },
  {
    russian: 'Антропоморфизм',
    name: 'Anthropomorphic',
    id: 'd442fec0-506b-42c4-849a-f023beeb9116',
    genre_id: '143',
  },
  {
    russian: 'Организованная преступность',
    name: 'Organized Crime',
    id: '4a1e5a9a-6d71-48da-84f1-22241711b9bf',
    genre_id: '138',
  },
  {
    russian: 'Романтический подтекст',
    name: 'Love Status Quo',
    id: '33230264-0d2e-4823-a411-bea09b24a0af',
    genre_id: '151',
  },
  {
    russian: 'Детектив',
    name: 'Detective',
    id: 'cbbb0be5-9d5a-4c94-87b3-15b6dbd761fd',
    genre_id: '39',
  },
  {
    russian: 'Шоу-бизнес',
    name: 'Showbiz',
    id: '4dcccde5-7a12-4e6c-b2a7-3c5bacb76ebe',
    genre_id: '136',
  },
  {
    russian: 'Гурман',
    name: 'Gourmet',
    id: '48d258b3-9d26-4263-a752-f2f9d98f3c88',
    genre_id: '543',
  },
  {
    russian: 'Ужасы',
    name: 'Horror',
    id: 'cd58f802-d671-4b33-820a-620494a0a9f6',
    genre_id: '14',
  },
  {
    russian: 'Боевые искусства',
    name: 'Martial Arts',
    id: 'abd1e427-539c-4b32-ac40-dc06a9a76011',
    genre_id: '17',
  },
  {
    russian: 'Авангард',
    name: 'Avant Garde',
    id: 'c85e5f0c-7cf2-4e4c-bfdd-835c498edd55',
    genre_id: '5',
  },
  {
    russian: 'Махо-сёдзё',
    name: 'Mahou Shoujo',
    id: 'd205a5e3-65b6-48c3-a211-24eea0b56701',
    genre_id: '124',
  },
  {
    russian: 'Гонки',
    name: 'Racing',
    id: '238269a1-adcf-4adb-9bfc-c231deb2b825',
    genre_id: '3',
  },
  {
    russian: 'Гарем',
    name: 'Harem',
    id: 'aaa22d42-c3fd-4cf6-ba3b-6f59b22a58a5',
    genre_id: '35',
  },
  {
    russian: 'Изобразительное искусство',
    name: 'Visual Arts',
    id: '841b78f7-4a7f-4f39-bf59-4f67fb8f8bd4',
    genre_id: '108',
  },
  {
    russian: 'Идолы (Муж.)',
    name: 'Idols (Male)',
    id: '3309f75d-1516-40fc-a7f5-b3d576cdf7e3',
    genre_id: '150',
  },
  {
    russian: 'Кроссдрессинг',
    name: 'Crossdressing',
    id: '2801ec50-1132-4a91-aeed-b3f2b67b9d25',
    genre_id: '144',
  },
  {
    russian: 'Детское',
    name: 'Kids',
    id: 'a16d8e3e-d69e-4a4c-b02b-f371a77a2c9d',
    genre_id: '15',
  },
  {
    russian: 'Игра с высокими ставками',
    name: 'High Stakes Game',
    id: '47807182-5b8a-41b5-9fa6-5958cd695c06',
    genre_id: '146',
  },
  {
    russian: 'Видеоигры',
    name: 'Video Game',
    id: '61a24328-57ae-42ea-a23d-9f39669a50a7',
    genre_id: '103',
  },
  {
    russian: 'Идолы (Жен.)',
    name: 'Idols (Female)',
    id: 'de6a3a49-99a2-40f6-983b-8acbbd602077',
    genre_id: '145',
  },
  {
    russian: 'Реверс-гарем',
    name: 'Reverse Harem',
    id: '1dc5e712-9ed3-4412-9c09-01022795b950',
    genre_id: '125',
  },
  {
    russian: 'Магическая смена пола',
    name: 'Magical Sex Shift',
    id: 'b90d45e3-8035-4b64-b582-b171551af90d',
    genre_id: '135',
  },
  {
    russian: 'Питомцы',
    name: 'Pets',
    id: 'c1e2ac2b-f700-43d7-bf96-067926652df0',
    genre_id: '148',
  },
  {
    russian: 'Образовательное',
    name: 'Educational',
    id: '807f96c2-022d-41eb-bb4b-72aff26521ae',
    genre_id: '149',
  },
  {
    russian: 'Злодейка',
    name: 'Villainess',
    id: '63c45b26-21a7-4ebd-806e-96cde40dea95',
    genre_id: '198',
  },
];

/**
 * Получение объекта жанра по его ID
 * @param id ID жанра (genre_id)
 */
export function getGenreById(id: string): Genre | undefined {
  return genres.find((genre) => genre.genre_id === id);
}

/**
 * Получение локализованного названия жанра по его ID
 */
export function getGenreName(id: string, language: 'russian' | 'name' = 'russian'): string {
  const genre = getGenreById(id);
  if (!genre) return id; // Если жанр не найден, возвращаем его ID
  return genre[language];
}
