'use client'
import { useState } from 'react';  // Это важно для работы useState
import AnimeList from "@/widgets/AnimeList/AnimeList";
import FilterSidebar from "@/widgets/AnimeList/FilterSidebar";
import Paginations from "@/widgets/AnimeList/Pagination";
import Navbar from "@/widgets/Header/Header";
import Report from "@/features/Report/Report";
import SearchBar from "@/widgets/AnimeList/SearchBar";
import Footer from "@/widgets/Footer/Footer";

const Page = () => {
    const [search, setSearch] = useState('');


    return (
        <div className=''>
            <Navbar></Navbar>
            <Report></Report>
            <main className="container mx-auto  mt-8  px-4 lg:mt-16">
                <div className="grid grid-cols-1 justify-center lg:grid-cols-[3fr_1fr] lg:gap-10">
                    <div className="flex flex-col gap-8">
                        <SearchBar setSearch={setSearch}/>
                        <AnimeList/>
                        <Paginations/>
                    </div>
                    <FilterSidebar/>
                </div>
            </main>
            <Footer/>
        </div>
    );
};

export default Page;