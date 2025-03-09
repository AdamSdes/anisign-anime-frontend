"use client";

import * as React from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { mergeClass } from "@/lib/utils/mergeClass";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Genre, GenreSelectProps } from "@/shared/types/genre";
import { axiosInstance } from "@/lib/axios/axiosConfig"; 

/**
 * Компонент выбора жанров с поиском и множественным выбором
 * @param props Пропсы компонента
 */
export function GenreSelect({ className, value = [], onChange }: GenreSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedGenres, setSelectedGenres] = React.useState<string[]>(value);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [genres, setGenres] = React.useState<Genre[]>([]);
  const [loading, setLoading] = React.useState(true);

  const normalizeText = (text: string): string =>
    text.toLowerCase().replace(/ё/g, "е").replace(/\s+/g, " ").trim();

  React.useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axiosInstance.get<Genre[]>("/genre/get-list-genres");
        const sortedData = response.data.sort((a, b) =>
          normalizeText(a.russian || a.name).localeCompare(normalizeText(b.russian || b.name))
        );
        setGenres(sortedData);
      } catch (error) {
        console.error("Error fetching genres:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGenres();
  }, []);

  const handleSelect = React.useCallback(
    (genreId: string) => {
      const newSelected = selectedGenres.includes(genreId)
        ? selectedGenres.filter((id) => id !== genreId)
        : [...selectedGenres, genreId];
      setSelectedGenres(newSelected);
      onChange?.(newSelected);
    },
    [selectedGenres, onChange]
  );

  const handleClear = React.useCallback((e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setSelectedGenres([]);
    onChange?.([]);
  }, [onChange]);

  const getSelectedLabel = (genreId: string): string => {
    const genre = genres.find((g) => g.genre_id === genreId); // Исправлено на genre_id
    return genre ? genre.russian || genre.name : genreId;
  };

  const filteredGenres = React.useMemo(() => {
    if (!searchQuery) return genres;
    const normalizedQuery = normalizeText(searchQuery);
    return genres.filter((genre) =>
      [genre.russian || "", genre.name].some((text) => normalizeText(text).includes(normalizedQuery))
    );
  }, [searchQuery, genres]);

  if (loading) {
    return (
      <Button
        variant="outline"
        className={mergeClass("w-full h-full items-center py-4 rounded-[14px] bg-white/[0.02] border-white/5 text-white/60", className)}
      >
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
          className={mergeClass(
            "w-full h-full items-center py-4 rounded-[14px] justify-between",
            "bg-white/[0.02] border-white/5 hover:bg-white/[0.03] text-white/60 hover:text-white",
            className
          )}
        >
          <div className="flex flex-wrap gap-1">
            {selectedGenres.length === 0 && <span className="text-white/40">Выберите жанры</span>}
            {selectedGenres.map((genreId) => (
              <Badge
                variant="secondary"
                key={genreId} // Уникальный ключ на основе genreId
                className="bg-[#CCBAE4] text-black hover:bg-[#CCBAE4]/90"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(genreId);
                }}
              >
                {getSelectedLabel(genreId)}
                <div
                  role="button"
                  tabIndex={0}
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSelect(genreId);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(genreId);
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
                  if (e.key === "Enter") handleClear(e);
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
                  key={genre.genre_id} // Исправлено на genre_id
                  onSelect={() => handleSelect(genre.genre_id)} // Исправлено на genre_id
                  className="flex items-center gap-2 px-2 py-1.5 text-white/60 hover:text-[#DEDEDF] hover:bg-white/[0.03] rounded-lg cursor-pointer aria-selected:bg-white/5"
                >
                  <div
                    className={mergeClass(
                      "flex h-4 w-4 items-center justify-center rounded border transition-colors duration-200",
                      selectedGenres.includes(genre.genre_id)
                        ? "bg-[#DEDEDF] border-[#DEDEDF]"
                        : "border-white/10 hover:border-[#DEDEDF]/50"
                    )}
                  >
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
  );
}