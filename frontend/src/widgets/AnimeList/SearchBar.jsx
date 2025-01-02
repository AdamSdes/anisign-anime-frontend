import { useState } from 'react';
import { Button } from "@/shared/shadcn-ui/button";
import { Search, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';

const SearchBar = ({ setSearch, viewMode, setViewMode }) => {
    const [searchValue, setSearchValue] = useState('');

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
        setSearch(e.target.value);
    };

    return (
        <div className="flex items-center gap-4">
            {/* Поиск */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
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

            {/* Переключатель вида */}
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

            {/* Кнопка фильтров (мобильная) */}
            <Button variant="outline" size="icon" className="md:hidden h-12 w-12">
                <SlidersHorizontal className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default SearchBar;
