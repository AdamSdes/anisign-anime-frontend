import { useState } from 'react';

const SearchBar = ({ setSearch }) => {
    const [searchValue, setSearchValue] = useState('');

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
        setSearch(e.target.value); // Обновляем состояние в родительском компоненте
    };

    return (
        <div className="flex items-end gap-2 border-b border-b-transparent bg-transparent transition md:gap-4">
            <div className="flex flex-1 flex-col gap-4">
                <input
                    className="flex h-12 w-full rounded-md border border-secondary/60 bg-secondary/30 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Введіть назву аніме..."
                    type="text"
                    value={searchValue}
                    onChange={handleSearchChange}
                />
            </div>
            {/* Мобильная кнопка фильтра */}
            <div className="lg:hidden">
                <button className="inline-flex items-center justify-center h-12 w-12 rounded-md border border-secondary/60 bg-secondary/30 hover:bg-secondary/60 hover:text-secondary-foreground">
                    <svg viewBox="0 0 1024 1024" width="1.2em" height="1.2em">
                        <path
                            fill="currentColor"
                            d="M349 838c0 17.7 14.2 32 31.8 32h262.4c17.6 0 31.8-14.3 31.8-32V642H349zm531.1-684H143.9c-24.5 0-39.8 26.7-27.5 48l221.3 376h348.8l221.3-376c12.1-21.3-3.2-48-27.7-48"
                        ></path>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default SearchBar;
