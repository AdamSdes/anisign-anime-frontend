'use client';
import React from 'react';
import AnimeDetails from '@/widgets/AnimeDetails/AnimeDetails';
import ImageGallery from '@/widgets/AnimeDetails/ImageGallery';
import VideoPlayer from '@/widgets/AnimeDetails/VideoPlayer';
import Header from "@/widgets/Header/Header";
import Report from "@/features/Report/Report";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
    const { id } = useParams();
    const [animeData, setAnimeData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnimeDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8000/anime/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch anime details');
                }
                const data = await response.json();
                console.log('Полученные данные:', data);
                if (data.screenshots) {
                    data.screenshots = data.screenshots.slice(0, 4);
                }
                setAnimeData(data);
            } catch (error) {
                console.error('Error fetching anime details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnimeDetails();
    }, [id]);

    if (loading) {
        return (
            <>
                <Header />
                <Report />
                <main className="container mx-auto max-w-[1400px] px-4 py-10">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="h-[500px] bg-gray-200 rounded mb-4"></div>
                    </div>
                </main>
            </>
        );
    }

    if (!animeData) {
        return (
            <>
                <Header />
                <Report />
                <main className="container mx-auto max-w-[1400px] px-4 py-10">
                    <div className="text-center py-10">
                        <h2 className="text-2xl font-bold mb-2">Аниме не найдено</h2>
                        <p className="text-gray-600">Возможно, оно было удалено или перемещено</p>
                    </div>
                </main>
            </>
        );
    }

    console.log('Текущие данные:', animeData);
    console.log('shikimori_id:', animeData?.shikimori_id);

    // Проверяем anime_id для плеера
    console.log('anime_id для плеера:', animeData?.anime_id);

    return (
        <main className="flex min-h-screen flex-col">
            <Header />
            <section className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-8">

                    <AnimeDetails anime={animeData} />

                    {animeData?.screenshots?.length > 0 && (
                        <ImageGallery screenshots={animeData.screenshots} />
                    )}

                    <div className="mt-10">
                        <h2 className="text-2xl font-bold mb-5">Смотреть онлайн</h2>
                        {animeData?.anime_id && (
                            <VideoPlayer shikimoriId={animeData.anime_id} />
                        )}
                    </div>
                </div>
            </section>
            <Report />
        </main>
    );
}
