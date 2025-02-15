'use client'
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { SortAsc, Play, Star, Film, Tags, Calendar } from "lucide-react"
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { cn } from "@/lib/utils"
import { GenreSelect } from "@/components/ui/genre-select"
import { Slider } from "@/components/ui/slider"
import YearFilterInput from "@/components/ui/year-filter-input"

const sortOptions = [
    { id: 'score', label: 'По рейтингу' },
    { id: 'date', label: 'По дате' },
    { id: 'name', label: 'По названию' },
]

const statusOptions = [
    { id: 'anons', label: 'Анонс' },
    { id: 'ongoing', label: 'Онгоинг' },
    { id: 'released', label: 'Вышло' }
]

const ratingOptions = [
    { id: 'g', label: 'G' },
    { id: 'pg', label: 'PG' },
    { id: 'pg_13', label: 'PG-13' },
    { id: 'r', label: 'R-17' },
    { id: 'r_plus', label: 'R+' },
    { id: 'none', label: 'Нет' }
]

const kindOptions = [
    { id: 'tv', label: 'TV Сериал' },
    { id: 'movie', label: 'Фильм' },
    { id: 'ova', label: 'OVA' },
    { id: 'ona', label: 'ONA' },
    { id: 'special', label: 'Спешл' },
    { id: 'tv_special', label: 'TV Спешл' }
]

const YEARS: [number, number] = [1965, new Date().getFullYear()]
const DEFAULT_YEAR_START = YEARS[0].toString()
const DEFAULT_YEAR_END = YEARS[1].toString()

enum RANGE {
    MIN = 'min',
    MAX = 'max',
}

interface FilterSidebarProps {
    className?: string
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ className = "" }) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const updateSort = (value: string) => {
        const params = new URLSearchParams(searchParams)
        
        // Если текущая сортировка совпадает с выбранной и порядок desc, меняем на asc
        if (params.get('sort') === value && params.get('order') === 'desc') {
            params.set('order', 'asc')
        } else {
            // В противном случае устанавливаем desc
            params.set('order', 'desc')
        }

        // Если текущая сортировка совпадает с выбранной, удаляем её
        if (params.get('sort') === value) {
            params.delete('sort')
            params.delete('order')
        } else {
            params.set('sort', value)
        }

        // Сбрасываем страницу при изменении сортировки
        params.set('page', '1')
        
        router.replace(`${pathname}?${params.toString()}`)
    }

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams)
        
        // Если текущее значение совпадает с выбранным, удаляем его
        if (params.get(key) === value) {
            params.delete(key)
        } else {
            params.set(key, value)
        }

        // Сбрасываем страницу при изменении фильтра
        params.set('page', '1')
        
        router.replace(`${pathname}?${params.toString()}`)
    }

    const updateGenres = (genreIds: string[]) => {
        const params = new URLSearchParams(searchParams)
        
        // Удаляем все текущие genre_id
        params.delete('genre_id')
        
        // Добавляем новые genre_id
        genreIds.forEach(id => {
            params.append('genre_id', id)
        })

        // Сбрасываем страницу при изменении жанров
        params.set('page', '1')
        
        router.replace(`${pathname}?${params.toString()}`)
    }

    const updateYears = (value: string | string[] | boolean) => {
        const params = new URLSearchParams(searchParams)
        
        // Удаляем текущие года
        params.delete('years')
        
        // Добавляем новые года
        if (Array.isArray(value)) {
            value.forEach(year => {
                params.append('years', year)
            })
        }

        // Сбрасываем страницу при изменении годов
        params.set('page', '1')
        
        router.replace(`${pathname}?${params.toString()}`)
    }

    const isActive = (key: string, value: string) => {
        return searchParams.get(key) === value
    }

    const [selectingYears, setSelectingYears] = useState<string[]>(
        searchParams.getAll('years').length > 0 
            ? searchParams.getAll('years') 
            : YEARS.map((y) => String(y))
    )

    useEffect(() => {
        const years = searchParams.getAll('years')
        if (JSON.stringify(selectingYears) !== JSON.stringify(years)) {
            setSelectingYears(
                years.length > 0 ? years : YEARS.map((y) => String(y)),
            )
        }
    }, [searchParams])

    const clearAllFilters = () => {
        const params = new URLSearchParams(searchParams)
        
        // Удаляем все параметры фильтрации
        params.delete('sort')
        params.delete('order')
        params.delete('status')
        params.delete('rating')
        params.delete('kind')
        params.delete('genre_id')
        params.delete('years')
        params.set('page', '1')
        
        router.replace(`${pathname}?${params.toString()}`)
    }

    return (
        <motion.aside 
            className={cn("w-full space-y-4", className)}
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
                            className={cn(
                                "px-4 h-[35px] rounded-full text-[13px] font-medium transition-all duration-300",
                                isActive('sort', option.id)
                                    ? "bg-white/20 text-white"
                                    : "bg-white/5 text-white/60 hover:bg-white/10"
                            )}
                        >
                            {option.label}
                            {isActive('sort', option.id) && (
                                <span className="ml-1">
                                    {searchParams.get('order') === 'desc' ? '↓' : '↑'}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </FilterSection>

            <FilterSection icon={<Calendar className="w-4 h-4 text-white/60" />} title="Рік виходу">
                <div className="flex items-center gap-2">
                    <YearFilterInput
                        years={selectingYears}
                        setSelectingYears={setSelectingYears}
                        range={RANGE.MIN}
                        handleChangeParam={updateYears}
                    />
                    <Slider
                        className="flex-1 [&_[role=slider]]:bg-[#CCBAE4] [&_[role=slider]]:border-[#CCBAE4]"
                        onValueCommit={(value) =>
                            updateYears((value as number[]).map(String))
                        }
                        onValueChange={(value) =>
                            setSelectingYears((value as number[]).map(String))
                        }
                        min={Number(DEFAULT_YEAR_START)}
                        max={Number(DEFAULT_YEAR_END)}
                        minStepsBetweenThumbs={0}
                        value={selectingYears.map((y) => Number(y))}
                        defaultValue={[Number(DEFAULT_YEAR_START), Number(DEFAULT_YEAR_END)]}
                        step={1}
                    />
                    <YearFilterInput
                        years={selectingYears}
                        setSelectingYears={setSelectingYears}
                        range={RANGE.MAX}
                        handleChangeParam={updateYears}
                    />
                </div>
            </FilterSection>

            <FilterSection icon={<Tags className="w-4 h-4 text-white/60" />} title="Жанры">
                <GenreSelect 
                    value={searchParams.getAll('genre_id')}
                    onChange={updateGenres}
                />
            </FilterSection>

            <FilterSection icon={<Film className="w-4 h-4 text-white/60" />} title="Тип">
                <div className="flex flex-wrap gap-2">
                    {kindOptions.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => updateFilter('kind', option.id)}
                            className={cn(
                                "px-4 h-[35px] rounded-full text-[13px] font-medium transition-all duration-300",
                                isActive('kind', option.id)
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
                            onClick={() => updateFilter('status', option.id)}
                            className={cn(
                                "px-4 h-[35px] rounded-full text-[13px] font-medium transition-all duration-300",
                                isActive('status', option.id)
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
                            onClick={() => updateFilter('rating', option.id)}
                            className={cn(
                                "px-4 h-[35px] rounded-full text-[13px] font-medium transition-all duration-300",
                                isActive('rating', option.id)
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
                            <path fill="currentColor" d="M6 13h12c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1s.45 1 1 1zm-2 4h12c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm3-9c0 .55.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1H8c-.55 0-1 .45-1 1z"/>
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
    )
}

interface FilterSectionProps {
    icon: React.ReactNode
    title: string
    children: React.ReactNode
}

const FilterSection: React.FC<FilterSectionProps> = ({ icon, title, children }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
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
)

export default FilterSidebar
