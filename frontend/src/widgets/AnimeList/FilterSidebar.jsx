"use client";
import React, { useEffect } from "react";
import { Slider } from "@nextui-org/slider";
import { GenreSelect } from "@/components/ui/genre-select";
import { Button } from "@nextui-org/react";
import { 
    Filter, 
    Star, 
    Calendar, 
    Target, 
    X, 
    Play, 
    Check, 
    Clock, 
    Sparkles, 
    Film, 
    Tv as Television, // Renamed from Television to Tv
    Clapperboard,
    Disc,
    Globe
} from "lucide-react";
// Add these imports
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from 'next/navigation';

const FilterSidebar = ({ filters, setFilters }) => {
    const router = useRouter();
    const [activeSort, setActiveSort] = React.useState('date'); // Add this state
    const [years, setYears] = React.useState([1965, 2024]);
    const [inputValues, setInputValues] = React.useState([1965, 2024]);
    const [selectedGenres, setSelectedGenres] = React.useState([]);
    const [selectedAgeRating, setSelectedAgeRating] = React.useState(''); // Add this state
    const [selectedSeason, setSelectedSeason] = React.useState('');
    const [selectedTypes, setSelectedTypes] = React.useState([]); // Add this state
    const [selectedStatus, setSelectedStatus] = React.useState(''); // Add this state

    React.useEffect(() => {
        // Sync selectedTypes with filters.kinds
        setSelectedTypes(filters.kinds || []);
    }, [filters.kinds]);

    // Синхронизируем состояние жанров
    React.useEffect(() => {
        setSelectedGenres(filters.genres || []);
    }, [filters.genres]);

    const handleSliderChange = (newValue) => {
        setYears(newValue);
        setInputValues(newValue);
    };

    const handleInputChange = (index, value) => {
        if (value.length > 4) return;

        const newInputValues = [...inputValues];
        newInputValues[index] = value;
        setInputValues(newInputValues);

        const newYears = [...years];
        const parsedValue = Number(value);

        if (!isNaN(parsedValue) && parsedValue >= 1965 && parsedValue <= 2024) {
            newYears[index] = parsedValue;
            if (newYears[0] <= newYears[1]) {
                setYears(newYears);
            }
        }
    };

    const sortOptions = [
        { id: 'date', label: 'Дате' },
        { id: 'rating', label: 'Рейтингу' },
        { id: 'name', label: 'Названию' },
        { id: 'views', label: 'Просмотрам' }
    ];

    // Обновим массив возрастных рейтингов, добавив описания и иконки
    const ageRatings = [
        { 
            id: 'G', 
            label: 'G',
            description: 'Нет возрастных ограничений',
            color: '#4CAF50'
        },
        { 
            id: 'PG', 
            label: 'PG',
            description: 'Рекомендуется присутствие родителей',
            color: '#2196F3'
        },
        { 
            id: 'PG-13', 
            label: 'PG-13',
            description: 'Детям до 13 лет просмотр нежелателен',
            color: '#FFA726'
        },
        { 
            id: 'R-17', 
            label: 'R-17+',
            description: 'Лицам до 17 лет обязательно присутствие взрослого',
            color: '#FF5722'
        },
        { 
            id: 'R+', 
            label: 'R+',
            description: 'Только для взрослой аудитории',
            color: '#D32F2F'
        }
    ];

    const seasons = [
        { id: 'winter', label: 'Зима' },
        { id: 'spring', label: 'Весна' },
        { id: 'summer', label: 'Лето' },
        { id: 'fall', label: 'Осень' }
    ];

    // Обновляем массив типов, чтобы он соответствовал API
    const types = [
        { id: 'tv', label: 'ТВ-Сериал' },
        { id: 'movie', label: 'Фильм' },
        { id: 'ova', label: 'OVA' },
        { id: 'ona', label: 'ONA' },
        { id: 'special', label: 'Спешл' },
        { id: 'tv_special', label: 'ТВ-Спешл' }
    ];

    const statusOptions = [
        { 
            id: 'ongoing', 
            label: 'Онгоинг',
            icon: Play,
            color: '#4CAF50',
            description: 'Выходит сейчас'
        },
        { 
            id: 'finished', 
            label: 'Завершён',
            icon: Check,
            color: '#CCBAE4',
            description: 'Все серии доступны'
        },
        { 
            id: 'announced', 
            label: 'Анонс',
            icon: Clock,
            color: '#FFA726',
            description: 'Скоро выйдет'
        },
        { 
            id: 'upcoming', 
            label: 'Upcoming',
            icon: Sparkles,
            color: '#2196F3',
            description: 'В планах на выход'
        }
    ];

    const ratingOptions = [
        { id: 'g', label: 'G', description: 'Для всех возрастов' },
        { id: 'pg', label: 'PG', description: 'Рекомендуется присутствие родителей' },
        { id: 'pg_13', label: 'PG-13', description: '13+' },
        { id: 'r', label: 'R', description: '17+' },
        { id: 'r_plus', label: 'R+', description: '18+' }
    ];

    const handleRatingChange = (ratingId) => {
        const newRating = filters.rating === ratingId ? '' : ratingId;
        setFilters(prev => ({
            ...prev,
            rating: newRating
        }));
    };

    // Синхронизируем состояние с фильтрами
    React.useEffect(() => {
        setSelectedAgeRating(filters.rating || '');
    }, [filters.rating]);

    // Добавим функцию сброса фильтров
    const handleReset = () => {
        setActiveSort('date');
        setYears([1965, 2024]);
        setInputValues([1965, 2024]);
        setSelectedGenres([]);
        setSelectedAgeRating('');
        setSelectedSeason('');
        setSelectedTypes([]);
        setSelectedStatus('');
        setFilters(prev => ({ ...prev, kinds: [] })); // Reset kinds filter
        router.push('/anime-list');
    };

    // Обновляем функцию handleTypeClick для поддержки множественного выбора
    const handleTypeClick = (typeId) => {
        const newKinds = selectedTypes.includes(typeId)
            ? selectedTypes.filter(t => t !== typeId)
            : [...selectedTypes, typeId];
            
        setSelectedTypes(newKinds);
        setFilters(prev => ({
            ...prev,
            kinds: newKinds
        }));
    };

    const handleGenreChange = (newGenres) => {
        setSelectedGenres(newGenres);
        setFilters(prev => ({
            ...prev,
            genres: newGenres
        }));
    };

    // Синхронизируем состояние кнопок с фильтрами
    useEffect(() => {
        setSelectedTypes(filters.kinds || []);
    }, [filters.kinds]);

    return (
        <aside className="hidden lg:block space-y-5 sticky top-20">
            <div className="w-[344px] flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-white/60" />
                    <h2 className="text-[16px] font-semibold">Фильтры</h2>
                </div>
                <Button
                    onClick={handleReset}
                    className="h-[35px] px-3 bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] text-white/60 hover:text-white rounded-full flex items-center gap-2 transition-all duration-300"
                >
                    <X className="w-4 h-4" />
                    <span className="text-[13px]">Сбросить</span>
                </Button>
            </div>

            {/* Сортировка */}
            <div className="bg-[rgba(255,255,255,0.02)] border border-white/5 p-5 rounded-[14px]">
                <div className="flex items-center gap-2 mb-4">
                    <Star className="w-4 h-4 text-white/60" />
                    <h3 className="text-[14px] font-medium">Сортировка</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {sortOptions.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => setActiveSort(option.id)}
                            className={`px-4 h-[35px] rounded-full text-[13px] font-medium transition-all duration-300 ${
                                activeSort === option.id 
                                    ? 'bg-[#CCBAE4] text-black' 
                                    : 'bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] text-white/60 hover:text-white'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Обновленный блок статусов */}
            <div className="bg-[rgba(255,255,255,0.02)] border border-white/5 p-5 rounded-[14px]">
                <div className="flex items-center gap-2 mb-4">
                    <Target className="w-4 h-4 text-white/60" />
                    <h3 className="text-[14px] font-medium">Статус</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {statusOptions.map((status) => {
                        const Icon = status.icon;
                        return (
                            <button
                                key={status.id}
                                onClick={() => setSelectedStatus(status.id === selectedStatus ? '' : status.id)}
                                className={`group flex flex-col items-start p-3 rounded-xl transition-all duration-300 ${
                                    selectedStatus === status.id 
                                        ? 'bg-white/10' 
                                        : 'hover:bg-white/5'
                                }`}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <Icon 
                                        className="w-4 h-4" 
                                        style={{ 
                                            color: selectedStatus === status.id ? status.color : 'rgba(255,255,255,0.6)',
                                            transition: 'color 0.3s'
                                        }} 
                                    />
                                    <span className={`font-medium ${
                                        selectedStatus === status.id 
                                            ? 'text-white' 
                                            : 'text-white/60 group-hover:text-white/80'
                                    }`}>
                                        {status.label}
                                    </span>
                                </div>
                                <span className="text-[11px] text-white/40">
                                    {status.description}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Обновленный блок рейтинга */}
            <div className="bg-[rgba(255,255,255,0.02)] border border-white/5 p-5 rounded-[14px]">
                <div className="flex items-center gap-2 mb-4">
                    <Globe className="w-4 h-4 text-white/60" />
                    <h3 className="text-[14px] font-medium">Возрастной рейтинг</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {ratingOptions.map((rating) => (
                        <button
                            key={rating.id}
                            onClick={() => handleRatingChange(rating.id)}
                            className={`px-4 h-[35px] rounded-full text-[13px] font-medium transition-all duration-300 ${
                                filters.rating === rating.id
                                    ? 'bg-[#CCBAE4] text-black'
                                    : 'bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] text-white/60 hover:text-white'
                            }`}
                        >
                            {rating.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Жанры */}
            <div className="bg-[rgba(255,255,255,0.02)] border border-white/5 p-5 rounded-[14px]">
                <div className="flex items-center gap-2 mb-4">
                    <Target className="w-4 h-4 text-white/60" />
                    <h3 className="text-[14px] font-medium">Жанры</h3>
                </div>
                <GenreSelect 
                    value={selectedGenres}
                    onChange={handleGenreChange}
                    className="bg-transparent"
                />
            </div>

            {/* Год выхода */}
            <div className="bg-[rgba(255,255,255,0.02)] border border-white/5 p-5 rounded-[14px]">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-4 h-4 text-white/60" />
                    <h3 className="text-[14px] font-medium">Год выхода</h3>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center gap-4">
                        <input
                            type="text"
                            value={inputValues[0]}
                            maxLength="4"
                            onChange={(e) => handleInputChange(0, e.target.value)}
                            className="w-[70px] h-[35px] px-2 bg-[rgba(255,255,255,0.02)] border border-white/5 text-center text-white/80 rounded-full focus:outline-none focus:ring-1 focus:ring-white/10"
                        />
                        <div className="flex-1 px-3 py-3 border border-white/5 rounded-full">
                            <Slider
                                className=""
                                showTooltip={true}
                                thumbClassName="thumb"
                                trackClassName="track"
                                defaultValue={years}
                                maxValue={2024}
                                minValue={1965}
                                value={years}
                                onChange={handleSliderChange}
                                ariaLabel={['Lower thumb', 'Upper thumb']}
                                ariaValuetext={state => `Year ${state.valueNow}`}
                                step={1}
                                minDistance={1}
                                renderTrack={(props, state) => (<div
                                    {...props}
                                    className={`track ${state.index === 1 ? 'filled-track' : 'empty-track'}`}
                                />)}
                            />
                        </div>
                        <input
                            type="text"
                            value={inputValues[1]}
                            maxLength="4"
                            onChange={(e) => handleInputChange(1, e.target.value)}
                            className="w-[70px] h-[35px] px-2 bg-[rgba(255,255,255,0.02)] border border-white/5 text-center text-white/80 rounded-full focus:outline-none focus:ring-1 focus:ring-white/10"
                        />
                    </div>
                </div>
            </div>

            {/* Обновленный блок типов */}
            <div className="bg-[rgba(255,255,255,0.02)] border border-white/5 p-5 rounded-[14px]">
                <div className="flex items-center gap-2 mb-4">
                    <Film className="w-4 h-4 text-white/60" />
                    <h3 className="text-[14px] font-medium">Тип</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {types.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => handleTypeClick(type.id)}
                            className={`px-4 h-[35px] rounded-full text-[13px] font-medium transition-all duration-300 ${
                                selectedTypes.includes(type.id)
                                    ? 'bg-[#CCBAE4] text-black'
                                    : 'bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] text-white/60 hover:text-white'
                            }`}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default FilterSidebar;
