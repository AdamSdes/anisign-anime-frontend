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

// Компонент для отображения аниме
const AnimeCard = ({ anime }) => (
    <div className="flex items-start gap-3 group">
        <div className="relative">
            <img
                src={anime.image}
                alt={anime.name}
                className="w-[120px] h-[160px] rounded-xl object-cover transition-all group-hover:shadow-lg"
            />
            <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-1 rounded-full">
                <Star className="w-3 h-3 text-[#E4DBBA]" />
                <span className="text-xs font-medium text-[#E4DBBA]">{anime.rating}</span>
            </div>
        </div>
        <div className="flex-1 space-y-2 py-1">
            <h3 className="font-medium text-base leading-tight group-hover:text-primary transition-colors">
                {truncateText(anime.name, 50)}
            </h3>
            <div className="flex flex-wrap gap-1.5">
                {anime.genres.map((genre, index) => (
                    <Badge 
                        key={index} 
                        variant="secondary" 
                        className="bg-white/5 hover:bg-white/10 text-xs px-2 py-0.5 transition-colors"
                    >
                        {genre}
                    </Badge>
                ))}
            </div>
        </div>
    </div>
);

// Компонент для отображения персонажей
const CharacterCard = ({ character }) => (
    <div className="flex items-start gap-3 group">
        <img
            src={character.image}
            alt={character.name}
            className="w-[120px] h-[160px] rounded-xl object-cover transition-all group-hover:shadow-lg"
        />
        <div className="flex-1 space-y-1.5 py-1">
            <h3 className="font-medium text-base leading-tight group-hover:text-primary transition-colors">
                {truncateText(character.name, 40)}
            </h3>
            <p className="text-sm text-muted-foreground">
                {character.animeTitle}
            </p>
        </div>
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
                className="h-[50px] border border-white/5 w-fit rounded-full gap-3 text-muted-foreground"
                onClick={() => setOpen(true)}
            >
                <Search className="h-5 w-5" />
                <kbd className="pointer-events-none rounded-full hover:bg-[rgba(255,255,255,0.01)] px-3 text-[12px] h-5 select-none bg-muted px-1.5 font-medium text-muted-foreground rounded">
                    K
                </kbd>
            </Button>
            <Dialog modal open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[800px] p-0">
                    <div className="relative">
                        <div className="flex items-center border-b px-3">
                            <Search className="h-5 w-5 text-muted-foreground/50" />
                            <Input 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Поиск аниме и персонажей..." 
                                className="h-14 px-4 border-0 focus-visible:ring-0 rounded-none bg-transparent"
                            />
                            <kbd className="pointer-events-none h-6 select-none bg-muted px-2 font-mono text-[10px] font-medium text-muted-foreground rounded flex items-center">
                                ESC
                            </kbd>
                        </div>
                    </div>
                    <div className="border-t">
                        <div className="flex p-2 gap-2 border-b">
                            {categories.map((category) => (
                                <Button
                                    key={category.name}
                                    variant={activeCategory === category.name ? "default" : "ghost"}
                                    onClick={() => setActiveCategory(category.name)}
                                    className="px-4"
                                >
                                    {category.name}
                                </Button>
                            ))}
                        </div>
                        <div className="max-h-[500px] overflow-y-auto p-3 space-y-3">
                            {filteredComponents?.length === 0 ? (
                                <div className="text-center py-10 text-muted-foreground">
                                    Ничего не найдено
                                </div>
                            ) : (
                                filteredComponents?.map((item, index) => (
                                    <div 
                                        key={index}
                                        className="p-2 hover:bg-accent/50 rounded-xl transition-colors cursor-pointer"
                                    >
                                        {activeCategory === 'Аниме' ? (
                                            <AnimeCard anime={item} />
                                        ) : (
                                            <CharacterCard character={item} />
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default SearchModal;
