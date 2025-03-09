"use client";

import * as React from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import Image from "next/image";
import { mergeClass } from "@/lib/utils/mergeClass";
import { transformValue } from "@/lib/utils/transforms";
import { getAnimeList } from "@/services/anime";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Star } from "lucide-react";
import { genresMap } from "@/shared/data/genres";
import { DotButton, useDotButton } from "./embla-carousel-dot-button";
import { PrevButton, NextButton, usePrevNextButtons } from "./embla-carousel-arrow-buttons";

interface Anime {
  anime_id: number
  russian: string
  name: string
  poster_url: string
  score?: number
  aired_on: string
  kind: string
  episodes?: number
  description?: string
  genre_ids?: string[]
  rating?: string
}

//Пропсы компонента карусели Embla
interface EmblaCarouselProps {
  options?: EmblaOptionsType;
}

/**
 * Компонент карусели Embla для отображения списка аниме
 * @param props Пропсы компонента
 */
export const EmblaCarousel: React.FC<EmblaCarouselProps> = ({ options }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    ...options,
    loop: false,
    dragFree: true,
  });
  const [animeList, setAnimeList] = React.useState<Anime[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
    usePrevNextButtons(emblaApi);

  // Загрузка списка аниме
  const fetchAnimeList = React.useCallback(async () => {
    try {
      const data = await getAnimeList({
        limit: 10,
        status: "ongoing",
        sort_by: "score",
        sort_order: "desc",
      });
      setAnimeList(data.anime_list);
      setError(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Произошла ошибка при загрузке аниме";
      console.error("Error fetching anime:", error);
      setError(errorMessage);
      setAnimeList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAnimeList();
  }, [fetchAnimeList]);

  // Транслитерация текста для генерации URL
  const transliterate = React.useCallback((text: string): string => {
    const ru: { [key: string]: string } = {
      а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i",
      й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t",
      у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y",
      ь: "", э: "e", ю: "yu", я: "ya",
    };
    return text
      .toLowerCase()
      .split("")
      .map((char) => ru[char] || char)
      .join("");
  }, []);

  // Генерация URL для аниме
  const generateAnimeUrl = React.useCallback(
    (anime: Anime): string => {
      const title = anime.russian || anime.name || "";
      const slug = transliterate(title)
        .replace(/[^a-z0-9\s]/g, "")
        .trim()
        .replace(/\s+/g, " ")
        .replace(/ /g, "-");
      return `/anime/${anime.anime_id}${slug ? "-" + slug : ""}`;
    },
    [transliterate]
  );

  //  Получение данных жанра по ID
  const getGenre = React.useCallback(
    (genreId: string) => genresMap[genreId],
    []
  );

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="w-[261px] h-[368px] rounded-[16px] bg-white/5" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <section className="embla relative">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container flex">
          {animeList.map((anime) => (
            <div className="embla__slide flex-[0_0_auto]" key={anime.anime_id}>
              <TooltipProvider>
                <Tooltip delayDuration={700}>
                  <TooltipTrigger asChild>
                    <Link
                      href={generateAnimeUrl(anime)}
                      className="relative w-[261px] h-[368px] rounded-[16px] overflow-hidden border-none bg-none group block"
                    >
                      <Image
                        src={anime.poster_url}
                        alt={anime.russian || anime.name}
                        width={261}
                        height={368}
                        className="object-cover transition-transform duration-300 scale-105 group-hover:scale-110"
                        priority={animeList.indexOf(anime) === 0}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-10" />
                      <div className="absolute bottom-0 w-full p-4 text-white z-20">
                        <p className="text-[14px] text-start font-semibold">
                          {anime.russian || anime.name}
                        </p>
                        <div className="flex gap-[10px] text-sm mt-2 opacity-70">
                          <p className="text-[12px]">{new Date(anime.aired_on).getFullYear()}</p>
                          <span>/</span>
                          <p className="text-[12px]">{transformValue("kind", anime.kind)}</p>
                        </div>
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="p-0 bg-black/95 backdrop-blur border-white/[0.06]"
                  >
                    <div className="w-[340px] space-y-5 p-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-[15px] font-medium leading-tight text-white/90">
                            {anime.russian || anime.name}
                          </h3>
                          {anime.score && (
                            <div className="flex items-center gap-1.5 bg-white/[0.08] px-2.5 py-1 rounded-lg">
                              <Star className="w-3.5 h-3.5 text-[#E4DBBA]" />
                              <span className="text-sm font-medium text-[#E4DBBA]">
                                {Number(anime.score).toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-[13px] text-white/40 leading-tight">{anime.name}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <span className="text-[11px] uppercase tracking-wider text-white/40 font-medium">
                            Тип
                          </span>
                          <p className="text-[13px] text-white/90 font-medium">
                            {transformValue("kind", anime.kind)}
                          </p>
                        </div>
                        {anime.episodes && anime.episodes > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[11px] uppercase tracking-wider text-white/40 font-medium">
                              Эпизоды
                            </span>
                            <p className="text-[13px] text-white/90 font-medium">
                              {anime.episodes} эп.
                            </p>
                          </div>
                        )}
                        {anime.aired_on && (
                          <div className="space-y-1.5">
                            <span className="text-[11px] uppercase tracking-wider text-white/40 font-medium">
                              Год
                            </span>
                            <p className="text-[13px] text-white/90 font-medium">
                              {new Date(anime.aired_on).getFullYear()}
                            </p>
                          </div>
                        )}
                      </div>
                      {anime.genre_ids && anime.genre_ids.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[11px] uppercase tracking-wider text-white/40 font-medium">
                            Жанры
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {anime.genre_ids
                              .map((genreId) => {
                                const genre = getGenre(genreId);
                                return genre
                                  ? { id: genreId, name: genre.russian || genre.name }
                                  : null;
                              })
                              .filter((genre): genre is { id: string; name: string } => genre !== null)
                              .map((genre) => (
                                <span
                                  key={genre.id}
                                  className="px-2.5 py-1 text-[12px] rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white/90"
                                >
                                  {genre.name}
                                </span>
                              ))}
                          </div>
                        </div>
                      )}
                      {anime.description && (
                        <div className="space-y-2">
                          <span className="text-[11px] uppercase tracking-wider text-white/40 font-medium">
                            Описание
                          </span>
                          <p className="text-[13px] leading-relaxed text-white/70 line-clamp-4">
                            {anime.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <div className="flex items-center gap-2">
          <PrevButton
            onClick={onPrevButtonClick}
            disabled={prevBtnDisabled}
            className={mergeClass(
              "w-11 h-11 flex items-center justify-center rounded-full",
              "border border-white/10 bg-surface/80 transition-all duration-300 backdrop-blur-sm",
              prevBtnDisabled
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-white/5 hover:border-white/20"
            )}
          />
          <NextButton
            onClick={onNextButtonClick}
            disabled={nextBtnDisabled}
            className={mergeClass(
              "w-11 h-11 flex items-center justify-center rounded-full",
              "border border-white/10 bg-surface/80 transition-all duration-300 backdrop-blur-sm",
              nextBtnDisabled
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-white/5 hover:border-white/20"
            )}
          />
        </div>
        <div className="h-11 flex items-center gap-2 px-4 border border-white/10 bg-surface/80 backdrop-blur-sm rounded-full">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={mergeClass(
                "h-1.5 rounded-full transition-all duration-300",
                index === selectedIndex ? "w-3 bg-white" : "w-1.5 bg-white/20 hover:bg-white/40"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};