
import React from 'react'
import {Button} from '@/shared/shadcn-ui/button';
import {ChevronRight} from 'lucide-react';
import EmblaCarousel from "@/widgets/Carousel/EmblaCarousel";
import {endpoints} from "@/shared/api/config";


async function fetchAnimeData() {
    try {
        const response = await fetch(endpoints.mainCalendar);
        if (!response.ok) {
            throw new Error('Ошибка при загрузке данных');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

const AnimeCarousel = async () => {
    const OPTIONS = { align: 'center', dragFree: true }
    const SLIDE_COUNT = 8
    const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

    return (
        <main className="anim-list-background p-6">

            <div className="container mx-auto px-2 py-5 mb-[30px] flex justify-between items-center">
                <p className='flex gap-3 items-center text-[20px] font-bold'>
                    <img src="/star-carousel.svg" alt=""/>
                    Лучшие онгоинги</p>
                <Button variant="outline" size="icon">
                    <ChevronRight className="h-4 w-4"/>
                </Button>
            </div>

            <div className="m-auto">
                <EmblaCarousel slides={SLIDES} options={OPTIONS} />
            </div>
        </main>
    );
}

export default AnimeCarousel;