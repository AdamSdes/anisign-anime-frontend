'use client'
import { useState } from 'react';  // Это важно для работы useState
import AnimeList from "@/widgets/AnimeList/AnimeList";
import FilterSidebar from "@/widgets/AnimeList/FilterSidebar";
import Paginations from "@/widgets/AnimeList/Pagination";
import Navbar from "@/widgets/Header/Header";
import Report from "@/features/Report/Report";
import SearchBar from "@/widgets/AnimeList/SearchBar";


const Page = () => {
    const [search, setSearch] = useState('');
    const animeList = [
        {
            title: 'Monogatari Series',
            year: '2024',
            type: 'ONA',
            slug: 'monogatari-series',
            poster: 'https://animego.org/upload/anime/images/66df9de57702c856425275.jpg',
        },
        {
            title: 'Tokyo Ghoul',
            year: '2014',
            type: 'TV Series',
            slug: 'tokyo-ghoul',
            poster: 'https://animego.org/upload/anime/images/66fecaf845d0c296511294.jpg',
        },
        {
            title: 'Steins;Gate',
            year: '2011',
            type: 'TV Series',
            slug: 'steins-gate',
            poster: 'https://animego.org/upload/anime/images/66fecc0a031aa696666350.jpg',
        },
        {
            title: 'Neon Genesis Evangelion',
            year: '1995',
            type: 'TV Series',
            slug: 'neon-genesis-evangelion',
            poster: 'https://animego.org/upload/anime/images/66ed0f65e1934509113779.jpg',
        },
        {
            title: 'Dragon Ball Z',
            year: '1989',
            type: 'TV Series',
            slug: 'dragon-ball-z',
            poster: 'https://animego.org/upload/anime/images/66f9859b60aa6000785164.jpg',
        },
        {
            title: 'Neon Genesis Evangelion',
            year: '1995',
            type: 'TV Series',
            slug: 'neon-genesis-evangelion',
            poster: 'https://animego.org/upload/anime/images/66c071970c0b1181684749.jpg',
        },
        {
            title: 'Neon Genesis Evangelion',
            year: '1995',
            type: 'TV Series',
            slug: 'neon-genesis-evangelion',
            poster: 'https://animego.org/upload/anime/images/66ff1406079d8553596971.jpg',
        },
        {
            title: 'Neon Genesis Evangelion',
            year: '1995',
            type: 'TV Series',
            slug: 'neon-genesis-evangelion',
            poster: 'https://animego.org/upload/anime/images/66f98a96e176b918085718.jpg',
        },
        {
            title: 'Neon Genesis Evangelion',
            year: '1995',
            type: 'TV Series',
            slug: 'neon-genesis-evangelion',
            poster: 'https://animego.org/upload/anime/images/66fb9adab04ff360773531.jpg',
        },
        {
            title: 'Neon Genesis Evangelion',
            year: '1995',
            type: 'TV Series',
            slug: 'neon-genesis-evangelion',
            poster: 'https://animego.org/upload/anime/images/66f3da9c9caa6456691876.jpg',
        },
        {
            title: 'Neon Genesis Evangelion',
            year: '1995',
            type: 'TV Series',
            slug: 'neon-genesis-evangelion',
            poster: 'https://animego.org/upload/anime/images/662d1d89c4a1d034870587.jpg',
        },
        {
            title: 'Neon Genesis Evangelion',
            year: '1995',
            type: 'TV Series',
            slug: 'neon-genesis-evangelion',
            poster: 'https://animego.org/upload/anime/images/662d1d89c4a1d034870587.jpg',
        },
        {
            title: 'Neon Genesis Evangelion',
            year: '1995',
            type: 'TV Series',
            slug: 'neon-genesis-evangelion',
            poster: 'https://animego.org/upload/anime/images/662d1d89c4a1d034870587.jpg',
        },
    ];

    return (
        <div className=''>
            <Navbar></Navbar>
            <Report></Report>
            <main className="container mx-auto  mt-8  px-4 lg:mt-16">
                <div className="grid grid-cols-1 justify-center lg:grid-cols-[3fr_1fr] lg:gap-10">
                    <div className="flex flex-col gap-8">
                        <SearchBar setSearch={setSearch}/>
                        <AnimeList
                            animeList={animeList.filter(anime => anime.title.toLowerCase().includes(search.toLowerCase()))}/>
                        <Paginations/>
                    </div>
                    <FilterSidebar/>
                </div>
            </main>
        </div>
    );
};

export default Page;