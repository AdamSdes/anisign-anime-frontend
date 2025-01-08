"use client"

import * as React from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function GenreSelect({ className, value = [], onChange }) {
  const [open, setOpen] = React.useState(false)
  const [selectedGenres, setSelectedGenres] = React.useState(value)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [genres, setGenres] = React.useState({
    "Все жанры": []
  })
  const [loading, setLoading] = React.useState(true)

  // Загрузка жанров с API
  React.useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('http://localhost:8000/genre/get-list-genres');
        const data = await response.json();
        
        // Группируем жанры
        setGenres({
          "Все жанры": data.map(genre => ({
            value: genre.genre_id,
            label: genre.russian || genre.name
          }))
        });
      } catch (error) {
        console.error('Error fetching genres:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const handleSelect = (genreId) => {
    // Изменяем на множественный выбор
    const newSelected = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId];
    
    setSelectedGenres(newSelected);
    onChange?.(newSelected);
  };

  const handleClear = (e) => {
    e.stopPropagation()
    setSelectedGenres([])
    onChange?.([])
  }

  const getSelectedLabel = (value) => {
    for (const category of Object.values(genres)) {
      const genre = category.find(g => g.value === value)
      if (genre) return genre.label
    }
    return value
  }

  const filteredGenres = React.useMemo(() => {
    if (!searchQuery) return genres;

    const filtered = {};
    Object.entries(genres).forEach(([category, items]) => {
      const matchedItems = items.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (matchedItems.length > 0) {
        filtered[category] = matchedItems;
      }
    });
    return filtered;
  }, [searchQuery, genres]);

  if (loading) {
    return (
      <Button variant="outline" className={cn("w-full h-full items-center py-4 rounded-[14px]", className)}>
        Загрузка жанров...
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full h-full items-center py-4 rounded-[14px] justify-between", className)}
        >
          <div className="flex flex-wrap gap-1">
            {selectedGenres.length === 0 && "Виберіть жанри"}
            {selectedGenres.map((value) => (
              <Badge
                variant="secondary"
                key={value}
                className=""
                onClick={(e) => {
                  e.stopPropagation()
                  handleSelect(value)
                }}
              >
                {getSelectedLabel(value)}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {selectedGenres.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput 
            placeholder="Пошук жанрів..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {Object.entries(filteredGenres).map(([category, items]) => (
              <CommandGroup key={category} heading={category}>
                {items.map((genre) => (
                  <CommandItem
                    key={genre.value}
                    onSelect={() => handleSelect(genre.value)}
                    className="flex items-center gap-2 px-2"
                  >
                    <div className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-full border border-primary",
                      selectedGenres.includes(genre.value) && "bg-primary text-primary-foreground"
                    )}>
                      {selectedGenres.includes(genre.value) && (
                        <Check className="h-3 w-3" />
                      )}
                    </div>
                    <span>{genre.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
            {Object.keys(filteredGenres).length === 0 && (
              <CommandEmpty>Жанрів не знайдено.</CommandEmpty>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
