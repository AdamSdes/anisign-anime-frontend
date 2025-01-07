import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from "@/shared/shadcn-ui/button";
import { Search, LayoutGrid, List, SlidersHorizontal, Loader2 } from 'lucide-react';

const SearchBar = ({ setSearch, viewMode, setViewMode }) => {
    const [searchValue, setSearchValue] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const abortControllerRef = useRef(null);
    const debounceTimerRef = useRef(null);

    const performSearch = useCallback(async (searchTerm) => {
        // Отменяем предыдущий запрос если он существует
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Если поисковый запрос пустой, сбрасываем результаты
        if (!searchTerm.trim()) {
            setSearch(null);
            return;
        }

        // Создаем новый контроллер для текущего запроса
        abortControllerRef.current = new AbortController();

        try {
            setIsSearching(true);
            const response = await fetch(
                `http://localhost:8000/anime/name/${encodeURIComponent(searchTerm)}`,
                { signal: abortControllerRef.current.signal }
            );
            const data = await response.json();
            setSearch(data);
        } catch (error) {
            if (error.name === 'AbortError') {
                // Игнорируем ошибки отмененных запросов
                return;
            }
            console.error('Error fetching search results:', error);
            setSearch({ total_count: 0, anime_list: [] });
        } finally {
            setIsSearching(false);
        }
    }, [setSearch]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);

        // Очищаем предыдущий таймер
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Устанавливаем новый таймер
        debounceTimerRef.current = setTimeout(() => {
            performSearch(value);
        }, 400); // Увеличиваем задержку до 400мс
    };

    // Очистка при размонтировании
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return (
        <div className="flex items-center gap-4">
            <div className="relative flex-1">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-opacity duration-200 ${isSearching ? 'opacity-0' : 'text-white/60'}`} />
                {isSearching && (
                    <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-white/60" />
                )}
                <input
                    className="w-full h-12 pl-10 pr-4 bg-white/[0.02] hover:bg-white/[0.03] border border-white/5 
                        rounded-xl text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-1 
                        focus:ring-white/10 transition-all"
                    placeholder="Поиск аниме..."
                    type="text"
                    value={searchValue}
                    onChange={handleSearchChange}
                />
            </div>

            <div className="hidden md:flex bg-white/5 rounded-lg p-1 gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className={`h-10 w-10 ${viewMode === 'grid' ? 'bg-white/10' : ''}`}
                    onClick={() => setViewMode('grid')}
                >
                    <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className={`h-10 w-10 ${viewMode === 'list' ? 'bg-white/10' : ''}`}
                    onClick={() => setViewMode('list')}
                >
                    <List className="h-4 w-4" />
                </Button>
            </div>

            <Button variant="outline" size="icon" className="md:hidden h-12 w-12">
                <SlidersHorizontal className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default SearchBar;
