'use client'
import React, { useState, useMemo, useEffect } from 'react';
import {
    Modal,
    ModalContent,
    ModalBody,
    useDisclosure,
    Button,
    Kbd,
    Input,
    Chip
} from '@nextui-org/react';
import { AButton } from "@/shared/anisign-ui/Button";

// Обновленная структура данных
const categories = [
    {
        name: 'Аниме',
        components: [
            {
                name: 'Аля иногда кокетничает со мной по-русски',
                image: 'https://cdn.hikka.io/content/anime/tokidoki-bosotto-russia-go-de-dereru-tonari-no-aalya-san-5e6d32/0YGF-kqSMHm_LmJB-QXyPw.jpg',
                rating: 9.1,
                genres: ['Демоны', 'Приключение', 'Комедия','Драмма','Фєнтези','Гарем','Фєнтези','Фєнтези']
            },
            {
                name: 'Я прибрал к рукам девушку, которая потеряла своего жениха, и теперь я учу её всяким плохим вещам',
                image: 'https://animego.org/upload/anime/images/6576b9d8508e1333282527.jpg',
                rating: 9.1,
                genres: ['Комедия', 'Романтика']
            },
        ],
    },
    {
        name: 'Персонажи',
        components: [
            {
                name: 'Саммон',
                image: 'https://animego.org/media/cache/thumbs_180x252/upload/character/66fd33f64d38d231936231.jpg',
                animeTitle: 'Любовь Мураи'
            },
            {
                name: 'Персонаж 2',
                image: 'https://animego.org/media/cache/thumbs_180x252/upload/character/66fbc2804ec22977561595.jpg',
                animeTitle: 'Идолмастер: Блестящие цвета 2'
            },
        ],
    },
];

// Функция для обрезки текста
const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
};

// Компонент для отображения списка категорий
const CategoryButton = ({ category, isActive, onSelect }) => (
    <Button
        key={category.name}
        variant={isActive ? 'solid' : 'ghost'}
        onPress={() => onSelect(category.name)}
        className={isActive ? 'bg-purple-500 text-white px-[45px] py-[25px]' : 'bg-white/5 border-none px-[45px] py-[25px]'}
    >
        {category.name}
    </Button>
);

// Компонент для отображения аниме
const AnimeCard = ({ anime }) => (
    <div className="bg-[#0B0B0B] p-4 rounded-lg shadow-md flex items-center gap-4">
        <img
            src={anime.image}
            alt="Anime thumbnail"
            className="rounded-md"
            width={60}
            height={90}
        />
        <div className='flex justify-between w-full gap-2 items-center pr-5'>
            <div className="flex flex-col gap-2">
                <h3 className="text-white font-semibold">
                    {truncateText(anime.name, 40)}
                </h3>
                <div className="flex gap-1 max-w-full flex-wrap">
                    {anime.genres.map((genre, index) => (
                        <Chip className="bg-white/5 text-white/60" key={index} size="sm" clickable>
                            {genre}
                        </Chip>
                    ))}
                </div>
            </div>
            <span className="text-[#E4DBBA] bg-[#E4DBBA]/20 px-4 py-2 rounded-[100px]">{anime.rating}</span>
        </div>
    </div>
);

// Компонент для отображения персонажей
const CharacterCard = ({ character }) => (
    <div className="bg-[#0B0B0B] p-4 rounded-lg shadow-md flex items-center gap-4">
        <img
            src={character.image}
            alt="Character thumbnail"
            className="rounded-md"
            width={60}
            height={90}
        />
        <div className='flex justify-between w-full gap-2 items-center pr-5'>
            <div className="flex flex-col gap-2">
                <h3 className="text-white font-semibold">
                    {truncateText(character.name, 40)}
                </h3>
                <span className="text-white/70">{character.animeTitle}</span>
            </div>
        </div>
    </div>
);

// Основной компонент с модальным окном
const SearchModal = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('Аниме');

    // Мемоизация для оптимизации поиска
    const filteredComponents = useMemo(() => {
        const category = categories.find((cat) => cat.name === activeCategory);
        return category?.components.filter((component) =>
            component.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [activeCategory, searchTerm]);

    // Обработчик события нажатия на клавишу "K"
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key.toLowerCase() === 'k') {
                onOpen(); // Открываем модальное окно
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Убираем обработчик при размонтировании
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onOpen]);

    return (
        <>
            <AButton
                size="md"
                className="h-[50px] min-w-0 w-fit rounded-[12px]"
                onPress={onOpen}
                color="border">
                <div className="flex gap-3 items-center opacity-60">
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 21 21"
                         fill="none">
                        <circle cx="9" cy="9" r="8" stroke="white" strokeWidth="1.5" strokeLinecap="round"
                                strokeLinejoin="round" />
                        <path d="M14.5 14.958L19.5 19.958" stroke="white" strokeWidth="1.5"
                              strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <Kbd className="bg-white/10" keys={["command"]}>K</Kbd>
                </div>
            </AButton>

            <Modal isOpen={isOpen} size={'5xl'} onOpenChange={onOpenChange} classNames={{
                body: 'py-10',
                backdrop: 'bg-black/50',
                base: 'dark:bg-[#060606] bg-none text-[#a8b0d3]',
            }}>
                <ModalContent>
                    <ModalBody>
                        {/* Поле поиска */}
                        <Input
                            isClearable
                            radius="lg"
                            classNames={{
                                label: 'text-black/50 dark:text-white/90',
                                input: ['bg-transparent', 'text-black/90 dark:text-white/90', 'placeholder:text-default-700/50 dark:placeholder:text-white/60'],
                                innerWrapper: 'bg-transparent',
                                inputWrapper: [
                                    'shadow-none',
                                    'backdrop-saturate-200',
                                    'dark:bg-[#0B0B0B]',
                                    'px-[15px] py-[25px]',
                                    'group-data-[focus=true]:bg-[#060606]',
                                    'dark:group-data-[focus=true]:bg-[#060606]',
                                    '!cursor-text',
                                ],
                            }}
                            placeholder="Поиск..."
                            startContent={<img src="search.svg" alt="search icon" />}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <div className="flex mt-5 gap-[20px]">
                            {/* Боковая панель категорий */}
                            <div className="">
                                <div className="flex flex-col gap-3">
                                    {categories.map((category) => (
                                        <CategoryButton
                                            key={category.name}
                                            category={category}
                                            isActive={activeCategory === category.name}
                                            onSelect={setActiveCategory}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Вертикальный разделитель */}
                            <div className="w-[1px] bg-white/5 h-[350px]"></div>

                            {/* Отображение компонентов */}
                            <div className="w-full flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                {filteredComponents?.length > 0 ? (
                                    filteredComponents.map((component, index) => (
                                        activeCategory === 'Аниме' ? (
                                            <AnimeCard key={index} anime={component} />
                                        ) : (
                                            <CharacterCard key={index} character={component} />
                                        )
                                    ))
                                ) : (
                                    <div className="flex flex-col bg-[#FF5C5C]/10 rounded-xl justify-center items-center h-full">
                                        <p className="text-[#FF5C5C] font-semibold text-[16px]">Ничего не найдено</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default SearchModal;
