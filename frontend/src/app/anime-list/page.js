'use client'
import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import AnimeList from "@/widgets/AnimeList/AnimeList";
import FilterSidebar from "@/widgets/AnimeList/FilterSidebar";
import Pagination from "@/widgets/AnimeList/Pagination";
import Navbar from "@/widgets/Header/Header";
import Report from "@/features/Report/Report";
import Footer from "@/widgets/Footer/Footer";

const Page = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    useEffect(() => {
        // Извлекаем параметры из URL при первой загрузке и при изменении URL
        const handleURLParams = () => {
            // Извлекаем kinds из пути
            const kindMatch = pathname.match(/\/anime-list\/kind-([^/]+)/);
            const genreMatch = pathname.match(/\/genre-(\d+)/);
            
            const kinds = kindMatch ? kindMatch[1].split('+') : [];
            const genres = genreMatch ? [genreMatch[1]] : [];
            
            // Извлекаем page из query params
            const page = Number(searchParams.get('page')) || 1;
            
            // Обновляем состояние
            setCurrentPage(page);
            setFilters(prev => ({
                ...prev,
                kinds: kinds,
                genres: genres
            }));
        };

        handleURLParams();
    }, [pathname, searchParams]);

    const [totalCount, setTotalCount] = useState(0);
    const [filters, setFilters] = useState({
        kinds: [],
        genres: [] // Add genres filter
    });
    const limit = 20; // Дублируем константу из AnimeList
    const [currentPage, setCurrentPage] = useState(1);

    // Функция для обновления totalCount, которую будем передавать в AnimeList
    const handleUpdateTotalCount = (count) => {
        setTotalCount(count);
    };

    return (
        <div>
            <Navbar />
            <Report />
            <main className="container mx-auto mt-8 px-4 lg:mt-16">
                <div className="grid grid-cols-1 justify-center lg:grid-cols-[3fr_1fr] lg:gap-10">
                    <div className="flex flex-col gap-8">
                        <AnimeList 
                            onUpdateTotalCount={handleUpdateTotalCount}
                            pageSize={limit}
                            filters={filters} // Pass filters to AnimeList
                        />
                    </div>
                    <FilterSidebar 
                        filters={filters} // Pass filters to FilterSidebar
                        setFilters={setFilters} // Pass setFilters to FilterSidebar
                    />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Page;