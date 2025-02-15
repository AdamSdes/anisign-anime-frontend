"use client"
import * as React from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Genre {
    genre_id: string
    name: string
    russian: string
    id: string
}

interface GenreSelectProps {
    className?: string
    value?: string[]
    onChange?: (value: string[]) => void
}

export function GenreSelect({ className, value = [], onChange }: GenreSelectProps) {
    const [open, setOpen] = React.useState(false)
    const [selectedGenres, setSelectedGenres] = React.useState<string[]>(value)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [genres, setGenres] = React.useState<Genre[]>([])
    const [loading, setLoading] = React.useState(true)

    // Нормализация текста для поиска
    const normalizeText = (text: string) => {
        return text
            .toLowerCase()
            .replace(/ё/g, 'е')
            .replace(/\s+/g, ' ')
            .trim();
    };

    // Загрузка и сортировка жанров
    React.useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch('http://localhost:8000/genre/get-list-genres')
                const data = await response.json()
                // Сортировка по русскому названию (если есть) или английскому
                const sortedData = data.sort((a: Genre, b: Genre) => {
                    const nameA = normalizeText(a.russian || a.name);
                    const nameB = normalizeText(b.russian || b.name);
                    return nameA.localeCompare(nameB);
                });
                setGenres(sortedData)
            } catch (error) {
                console.error('Error fetching genres:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchGenres()
    }, [])

    const handleSelect = (genreId: string) => {
        let newSelected;
        if (selectedGenres.includes(genreId)) {
            // Удаляем жанр
            newSelected = selectedGenres.filter(id => id !== genreId);
        } else {
            // Добавляем жанр
            newSelected = [...selectedGenres, genreId];
        }
        
        setSelectedGenres(newSelected);
        onChange?.(newSelected);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedGenres([]);
        onChange?.([]);
    };

    const getSelectedLabel = (genreId: string) => {
        const genre = genres.find(g => g.genre_id === genreId)
        return genre ? (genre.russian || genre.name) : genreId
    }

    const filteredGenres = React.useMemo(() => {
        if (!searchQuery) return genres;
        const normalizedQuery = normalizeText(searchQuery);
        
        return genres.filter(genre => {
            const normalizedRussian = normalizeText(genre.russian || '');
            const normalizedName = normalizeText(genre.name);
            
            // Поиск по частичному совпадению в обоих названиях
            return normalizedRussian.includes(normalizedQuery) || 
                   normalizedName.includes(normalizedQuery);
        });
    }, [searchQuery, genres]);

    if (loading) {
        return (
            <Button variant="outline" className={cn("w-full h-full items-center py-4 rounded-[14px] bg-white/[0.02] border-white/5 text-white/60", className)}>
                Загрузка жанров...
            </Button>
        )
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full h-full items-center py-4 rounded-[14px] justify-between",
                        "bg-white/[0.02] border-white/5 hover:bg-white/[0.03]",
                        "text-white/60 hover:text-white",
                        className
                    )}
                >
                    <div className="flex flex-wrap gap-1">
                        {selectedGenres.length === 0 && 
                            <span className="text-white/40">Выберите жанры</span>
                        }
                        {selectedGenres.map((genreId) => (
                            <Badge
                                variant="secondary"
                                key={genreId}
                                className="bg-[#CCBAE4] text-black hover:bg-[#CCBAE4]/90"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleSelect(genreId)
                                }}
                            >
                                {getSelectedLabel(genreId)}
                                <div
                                    role="button"
                                    tabIndex={0}
                                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleSelect(genreId)
                                        }
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleSelect(genreId)
                                    }}
                                >
                                    <X className="h-3 w-3 text-black hover:text-black/80" />
                                </div>
                            </Badge>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        {selectedGenres.length > 0 && (
                            <div
                                role="button"
                                tabIndex={0}
                                className="h-4 w-4 p-0 hover:bg-transparent text-white/40 hover:text-white/60 cursor-pointer"
                                onClick={handleClear}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleClear(e as any)
                                    }
                                }}
                            >
                                <X className="h-4 w-4" />
                            </div>
                        )}
                        <ChevronsUpDown className="h-4 w-4 shrink-0 text-white/40" />
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent 
                className="w-full p-0 bg-[#0A0A0A] border border-white/5 shadow-xl" 
                align="start"
                sideOffset={5}
            >
                <Command className="bg-transparent">
                    <CommandInput 
                        placeholder="Поиск жанров..." 
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                        className="h-11 rounded-none text-[#DEDEDF] placeholder:text-white/40"
                    />
                    <CommandList className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        <CommandEmpty className="py-6 text-center text-sm text-white/40">
                            Жанры не найдены
                        </CommandEmpty>
                        <CommandGroup className="text-white/40 px-2">
                            {filteredGenres.map((genre) => (
                                <CommandItem
                                    key={genre.genre_id}
                                    onSelect={() => handleSelect(genre.genre_id)}
                                    className="flex items-center gap-2 px-2 py-1.5 
                                             text-white/60 hover:text-[#DEDEDF]
                                             hover:bg-white/[0.03] rounded-lg cursor-pointer
                                             aria-selected:bg-white/5"
                                >
                                    <div className={cn(
                                        "flex h-4 w-4 items-center justify-center rounded",
                                        "border transition-colors duration-200",
                                        selectedGenres.includes(genre.genre_id) 
                                            ? "bg-[#DEDEDF] border-[#DEDEDF]" 
                                            : "border-white/10 hover:border-[#DEDEDF]/50"
                                    )}>
                                        {selectedGenres.includes(genre.genre_id) && (
                                            <Check className="h-3 w-3 text-black" />
                                        )}
                                    </div>
                                    <span className="flex-1 text-white/60 hover:text-white/100 transition-all duration-300">
                                        {genre.russian || genre.name}
                                    </span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
