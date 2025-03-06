"use client";

import React, { useCallback } from "react";
import { atom, useAtom } from "jotai";
import { motion } from "framer-motion";
import { SortAsc, Play, Star, Film, Tags, Calendar } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { mergeClass } from "@/lib/utils/mergeClass";
import { GenreSelect } from "@/components/ui/genre-select";
import { Slider } from "@/components/ui/slider";
import { YearFilterInput } from "@/components/ui/year-filter-input";
import { filterSectionVariants } from "./animations";

// Опции сортировки
const sortOptions = [
  { id: "score", label: "По рейтингу" },
  { id: "date", label: "По дате" },
  { id: "name", label: "По названию" },
] as const;

// Опции статуса
const statusOptions = [
  { id: "anons", label: "Анонс" },
  { id: "ongoing", label: "Онгоинг" },
  { id: "released", label: "Вышло" },
] as const;

// Опции возрастного рейтинга
const ratingOptions = [
  { id: "g", label: "G" },
  { id: "pg", label: "PG" },
  { id: "pg_13", label: "PG-13" },
  { id: "r", label: "R-17" },
  { id: "r_plus", label: "R+" },
  { id: "none", label: "Нет" },
] as const;

// Опции типов аниме
const kindOptions = [
  { id: "tv", label: "TV Сериал" },
  { id: "movie", label: "Фильм" },
  { id: "ova", label: "OVA" },
  { id: "ona", label: "ONA" },
  { id: "special", label: "Спешл" },
  { id: "tv_special", label: "TV Спешл" },
] as const;

// Константы для диапазона лет
const YEARS: [number, number] = [1965, new Date().getFullYear()];
const DEFAULT_YEAR_START = YEARS[0].toString();
const DEFAULT_YEAR_END = YEARS[1].toString();

enum RANGE {
  MIN = "min",
  MAX = "max",
}

interface FilterState {
  selectingYears: string[];
}

/**
 * Атом для хранения состояния фильтров
 * @description Управляет глобальным состоянием фильтров боковой панели
 */
export const filterStateAtom = atom<FilterState>({
  selectingYears: [DEFAULT_YEAR_START, DEFAULT_YEAR_END],
});

interface FilterSidebarProps {
  className?: string;
}

/**
 * Компонент боковой панели фильтров для списка аниме
 * @description Отображает фильтры для сортировки и поиска аниме с анимацией
 * @param {FilterSidebarProps} props - Пропсы компонента
 */
export const FilterSidebar: React.FC<FilterSidebarProps> = React.memo(({ className = "" }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filterState, setFilterState] = useAtom(filterStateAtom);

  // Синхронизация состояния с URL при монтировании
  React.useEffect(() => {
    const years = searchParams.getAll("years");
    setFilterState((prev) => ({
      ...prev,
      selectingYears: years.length > 0 ? years : [DEFAULT_YEAR_START, DEFAULT_YEAR_END],
    }));
  }, [searchParams, setFilterState]);

   const updateSort = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams);
      const currentSort = params.get("sort");
      const currentOrder = params.get("order");

      if (currentSort === value && currentOrder === "desc") {
        params.set("order", "asc");
      } else if (currentSort === value) {
        params.delete("sort");
        params.delete("order");
      } else {
        params.set("sort", value);
        params.set("order", "desc");
      }

      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

   const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      if (params.get(key) === value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );
  const updateGenres = useCallback(
    (genreIds: string[]) => {
      const params = new URLSearchParams(searchParams);
      params.delete("genre_id");
      genreIds.forEach((id) => params.append("genre_id", id));
      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const updateYears = useCallback(
    (value: string[]) => {
      setFilterState((prev) => ({ ...prev, selectingYears: value }));
      const params = new URLSearchParams(searchParams);
      params.delete("years");
      value.forEach((year) => params.append("years", year));
      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams, setFilterState]
  );

  const isActive = useCallback(
    (key: string, value: string) => searchParams.get(key) === value,
    [searchParams]
  );

  const clearAllFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete("sort");
    params.delete("order");
    params.delete("status");
    params.delete("rating");
    params.delete("kind");
    params.delete("genre_id");
    params.delete("years");
    params.set("page", "1");
    setFilterState({ selectingYears: [DEFAULT_YEAR_START, DEFAULT_YEAR_END] });
    router.replace(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams, setFilterState]);

  return (
    <motion.aside
      className={mergeClass("w-full space-y-4", className)}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <FilterSection icon={<SortAsc className="w-4 h-4 text-white/60" />} title="Сортировка">
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => updateSort(option.id)}
              className={mergeClass(
                "px-4 h-[35px] flex items-center gap-[10px] rounded-full text-[13px] font-medium transition-all duration-300",
                isActive("sort", option.id)
                  ? "bg-white/20 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              )}
            >
              {isActive("sort", option.id) && (
                <div className="w-2 h-2 rounded-full bg-[#CCBAE4]" />
              )}
              {option.label}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection icon={<Calendar className="w-4 h-4 text-white/60" />} title="Год выхода">
        <div className="flex items-center gap-2">
          <YearFilterInput
            years={filterState.selectingYears}
            setSelectingYears={(years) =>
              setFilterState((prev) => ({ ...prev, selectingYears: years }))
            }
            range={RANGE.MIN}
            handleChangeParam={(name, value) => updateYears(value as string[])}
          />
          <Slider
            className="flex-1 [&_[role=slider]]:bg-[#CCBAE4] [&_[role=slider]]:border-[#CCBAE4]"
            onValueCommit={(value) => updateYears((value as number[]).map(String))}
            onValueChange={(value) =>
              setFilterState((prev) => ({
                ...prev,
                selectingYears: (value as number[]).map(String),
              }))
            }
            min={Number(DEFAULT_YEAR_START)}
            max={Number(DEFAULT_YEAR_END)}
            minStepsBetweenThumbs={0}
            value={filterState.selectingYears.map((y) => Number(y))}
            defaultValue={[Number(DEFAULT_YEAR_START), Number(DEFAULT_YEAR_END)]}
            step={1}
          />
          <YearFilterInput
            years={filterState.selectingYears}
            setSelectingYears={(years) =>
              setFilterState((prev) => ({ ...prev, selectingYears: years }))
            }
            range={RANGE.MAX}
            handleChangeParam={(name, value) => updateYears(value as string[])}
          />
        </div>
      </FilterSection>

      <FilterSection icon={<Tags className="w-4 h-4 text-white/60" />} title="Жанры">
        <GenreSelect
          value={searchParams.getAll("genre_id")}
          onChange={updateGenres}
        />
      </FilterSection>

      <FilterSection icon={<Film className="w-4 h-4 text-white/60" />} title="Тип">
        <div className="flex flex-wrap gap-2">
          {kindOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => updateFilter("kind", option.id)}
              className={mergeClass(
                "px-4 h-[35px] rounded-full text-[13px] font-medium transition-all duration-300",
                isActive("kind", option.id)
                  ? "bg-white/20 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection icon={<Play className="w-4 h-4 text-white/60" />} title="Статус">
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => updateFilter("status", option.id)}
              className={mergeClass(
                "px-4 h-[35px] rounded-full text-[13px] font-medium transition-all duration-300",
                isActive("status", option.id)
                  ? "bg-white/20 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection icon={<Star className="w-4 h-4 text-white/60" />} title="Возрастной рейтинг">
        <div className="flex flex-wrap gap-2">
          {ratingOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => updateFilter("rating", option.id)}
              className={mergeClass(
                "px-4 h-[35px] rounded-full text-[13px] font-medium transition-all duration-300",
                isActive("rating", option.id)
                  ? "bg-white/20 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </FilterSection>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/[0.02] border border-white/5 rounded-xl p-5"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" className="text-white/60">
              <path
                fill="currentColor"
                d="M6 13h12c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1s.45 1 1 1zm-2 4h12c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm3-9c0 .55.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1H8c-.55 0-1 .45-1 1z"
              />
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="text-[14px] font-medium text-white/80">Очистить фильтры</h3>
            <p className="text-[12px] text-white/40">Сбросить все выбранные параметры</p>
          </div>
          <button
            onClick={clearAllFilters}
            className="w-full px-4 py-2.5 rounded-lg text-[13px] font-medium bg-white/[0.02] border border-white/5 text-white/60 hover:bg-white/[0.04] hover:text-white/90 transition-all duration-200"
          >
            Сбросить всё
          </button>
        </div>
      </motion.div>
    </motion.aside>
  );
});

/**
 * Интерфейс пропсов для секции фильтров
 */
interface FilterSectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

/**
 * Компонент секции фильтров
 * @description Обёртка для отдельных фильтров с анимацией
 * @param {FilterSectionProps} props - Пропсы компонента
 */
const FilterSection: React.FC<FilterSectionProps> = React.memo(({ icon, title, children }) => (
  <motion.div
    variants={filterSectionVariants}
    initial="hidden"
    animate="visible"
    className="bg-[rgba(255,255,255,0.02)] border border-white/5 p-5 rounded-[14px]"
  >
    <motion.div
      className="flex items-center gap-2 mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      {icon}
      <h3 className="text-[14px] font-medium text-white/80">{title}</h3>
    </motion.div>
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {children}
    </motion.div>
  </motion.div>
));

FilterSidebar.displayName = "FilterSidebar";
FilterSection.displayName = "FilterSection";

export default FilterSidebar;