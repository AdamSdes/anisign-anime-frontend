'use client'
import { useState } from 'react';
import AnimeList from "@/widgets/AnimeList/AnimeList";
import FilterSidebar from "@/widgets/AnimeList/FilterSidebar";
import Pagination from "@/widgets/AnimeList/Pagination";
import Navbar from "@/widgets/Header/Header";
import Report from "@/features/Report/Report";
import Footer from "@/widgets/Footer/Footer";

const Page = () => {
    const [totalCount, setTotalCount] = useState(0);
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
                        />
                    </div>
                    <FilterSidebar />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Page;