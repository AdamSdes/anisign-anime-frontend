'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Command, Star } from "lucide-react"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

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

// Обновленный компонент карточки аниме
const AnimeCard = ({ anime }) => (
    <div className="group relative flex items-start gap-4 p-2 rounded-xl transition-all duration-300 hover:bg-white/[0.03]">
        <div className="relative aspect-[3/4] w-[100px] flex-shrink-0">
            <img
                src={anime.image}
                alt={anime.name}
                className="w-full h-full object-cover rounded-lg transition-all duration-300 group-hover:ring-2 ring-[#CCBAE4]/20"
            />
            <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full 
                bg-black/60 backdrop-blur-md border border-white/10">
                <Star className="w-3 h-3 text-[#CCBAE4]" />
                <span className="text-xs font-medium">{anime.rating}</span>
            </div>
        </div>
        <div className="flex-1 min-w-0 py-1">
            <h3 className="text-[15px] font-medium leading-snug mb-2 text-white/90 group-hover:text-white 
                transition-colors duration-200">
                {truncateText(anime.name, 60)}
            </h3>
            <div className="flex flex-wrap gap-1.5">
                {anime.genres.slice(0, 4).map((genre, index) => (
                    <span key={index} 
                        className="px-2.5 py-1 text-[11px] font-medium bg-white/[0.03] text-white/50 
                        rounded-full border border-white/[0.05] transition-all duration-200 
                        hover:border-white/10 hover:text-white/70">
                        {genre}
                    </span>
                ))}
                {anime.genres.length > 4 && (
                    <span className="px-2 py-1 text-[11px] text-white/40">
                        +{anime.genres.length - 4}
                    </span>
                )}
            </div>
        </div>
    </div>
);

// Обновленный компонент карточки персонажа
const CharacterCard = ({ character }) => (
    <div className="group relative flex items-start gap-4 p-2 rounded-xl transition-all duration-300 
        hover:bg-white/[0.03]">
        <div className="relative aspect-[3/4] w-[90px] flex-shrink-0">
            <img
                src={character.image}
                alt={character.name}
                className="w-full h-full object-cover rounded-lg transition-all duration-300 
                    group-hover:ring-2 ring-[#CCBAE4]/20"
            />
        </div>
        <div className="flex-1 min-w-0 py-1">
            <h3 className="text-[15px] font-medium text-white/90 group-hover:text-white 
                transition-colors duration-200 mb-1.5">
                {truncateText(character.name, 40)}
            </h3>
            <p className="text-[13px] text-white/40 group-hover:text-white/50 transition-colors duration-200">
                {character.animeTitle}
            </p>
        </div>
    </div>
);

const EmptyState = ({ searchTerm }) => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 bg-gradient-to-br from-[#CCBAE4]/20 to-transparent 
                rounded-full blur-xl"/>
            <Search className="w-16 h-16 text-white/10" />
        </div>
        <p className="text-[15px] text-white/40 mb-2">
            {searchTerm ? 'Ничего не найдено' : 'Начните поиск'}
        </p>
        {searchTerm && (
            <p className="text-[13px] text-white/30">
                Попробуйте изменить поисковый запрос
            </p>
        )}
    </div>
);

const SearchModal = () => {
    const [open, setOpen] = useState(false)
    const [activeCategory, setActiveCategory] = useState('Аниме')
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const down = (e) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const filteredComponents = useMemo(() => {
        const category = categories.find((cat) => cat.name === activeCategory);
        return category?.components.filter((component) =>
            component.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [activeCategory, searchTerm]);

    return (
        <>
            <Button
                variant="ghost"
                className="h-[46px] bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 
                    rounded-full gap-3 text-white/60 transition-all duration-300 hover:border-white/10"
                onClick={() => setOpen(true)}
            >
                <Search className="w-4 h-4" />
                <span className="text-sm">Поиск</span>
                <kbd className="hidden md:flex h-6 items-center px-2 text-[11px] font-medium 
                    bg-white/[0.02] rounded-md text-white/30">⌘K</kbd>
            </Button>

            <Dialog modal open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[850px] p-0 gap-0 rounded-2xl border border-white/[0.05] 
                    bg-black/90 shadow-2xl">
                    <div className="flex items-center px-4 h-16 border-b border-white/[0.05]">
                        <Search className="w-5 h-5 text-white/30" />
                        <Input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Поиск аниме и персонажей..." 
                            className="h-16 px-4 border-0 focus-visible:ring-0 bg-transparent 
                                text-white/90 placeholder:text-white/30 text-[15px]"
                        />
                    </div>
                    
                    <div className="sticky top-0 z-10 border-b border-white/[0.05] 
                        bg-black/50">
                        <div className="flex p-3 gap-2">
                            {categories.map((category) => (
                                <Button
                                    key={category.name}
                                    onClick={() => setActiveCategory(category.name)}
                                    className={cn(
                                        "px-4 h-9 rounded-full text-[13px] font-medium transition-all",
                                        activeCategory === category.name 
                                            ? "bg-[#CCBAE4] text-black" 
                                            : "text-white/50 hover:text-white/80 bg-white/[0.02] hover:bg-white/[0.05]"
                                    )}
                                >
                                    {category.name}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="relative max-h-[600px] overflow-y-auto">
                        {filteredComponents?.length === 0 ? (
                            <EmptyState searchTerm={searchTerm} />
                        ) : (
                            <div className="grid grid-cols-1 divide-y divide-white/[0.03]">
                                {filteredComponents?.map((item, index) => (
                                    <div key={index} className="p-2">
                                        {activeCategory === 'Аниме' 
                                            ? <AnimeCard anime={item} />
                                            : <CharacterCard character={item} />
                                        }
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default SearchModal;
