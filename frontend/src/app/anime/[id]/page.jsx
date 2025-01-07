'use client';
import React from 'react';
import AnimeDetails from '@/widgets/AnimeDetails/AnimeDetails';
import ImageGallery from '@/widgets/AnimeDetails/ImageGallery';
import VideoPlayer from '@/widgets/AnimeDetails/VideoPlayer';
import Header from "@/widgets/Header/Header";
import Report from "@/features/Report/Report";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Comments from '@/widgets/Comments/Comments';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Reviews from '@/widgets/AnimeDetails/Reviews';
import Footer from "@/widgets/Footer/Footer";
import RelatedAnime from '@/widgets/AnimeDetails/RelatedAnime';

export default function Page() {
    const { id } = useParams();
    // Извлекаем только числовой ID из параметра
    const animeId = id.split('-')[0];
    const [animeData, setAnimeData] = useState(null);
    const [genres, setGenres] = useState(null); // Добавляем состояние для жанров
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnimeDetails = async () => {
            try {
                setLoading(true);
                const [animeResponse, genresResponse] = await Promise.all([
                    fetch(`http://localhost:8000/anime/id/${animeId}`), // Используем только ID
                    fetch('http://localhost:8000/genre/get-list-genres')
                ]);

                if (!animeResponse.ok || !genresResponse.ok) {
                    throw new Error('Failed to fetch data');
                }

                const [animeData, genresData] = await Promise.all([
                    animeResponse.json(),
                    genresResponse.json()
                ]);

                setAnimeData(animeData);
                setGenres(genresData);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (animeId) {
            fetchAnimeDetails();
        }
    }, [animeId]);

    if (loading) {
        return (
            <>
                <Header />
                <Report />
                <main className="container mx-auto max-w-[1400px] px-4 py-10">
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/20"></div>
                    </div>
                </main>
            </>
        );
    }

    if (error || !animeData) {
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
            <Report />
            <section className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-8">
                    <AnimeDetails 
                        anime={animeData} 
                        genres={genres} 
                        isLoading={loading}
                    />

                    {animeData?.screenshots?.length > 0 && (
                        <ImageGallery screenshots={animeData.screenshots} />
                    )}

                    <RelatedAnime></RelatedAnime>

                    <div 
                        id="player" 
                        className="mt-10 scroll-mt-24 scroll-smooth" 
                    > 
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold mb-5">Смотреть онлайн</h2>
                            <button>Сообщить об ошибке</button>
                        </div>
                        {animeData?.anime_id && (
                            <VideoPlayer shikimoriId={animeData.anime_id} />
                        )}
                    </div>
                    <div className="w-full mt-10 h-[1px] bg-white/5"></div>       
                    
                    <Tabs defaultValue="comments" className="mt-10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold">Комментарии</h2>
                            <TabsList className="bg-white/5 rounded-full">
                                <TabsTrigger 
                                    value="comments" 
                                    className="data-[state=active]:bg-[#CCBAE4] rounded-full data-[state=active]:text-black"
                                >
                                    Комментарии
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="reviews" 
                                    className="data-[state=active]:bg-[#CCBAE4] rounded-full data-[state=active]:text-black"
                                >
                                    Отзывы
                                </TabsTrigger>
                            </TabsList>
                        </div>
                        
                        <TabsContent value="comments">
                            <Comments animeId={animeData?.anime_id} />
                        </TabsContent>
                        
                        <TabsContent value="reviews">
                            <Reviews animeId={animeData?.anime_id} />
                        </TabsContent>
                    </Tabs>
                </div>
            </section>
            <Footer/>
        </main>
    );
}
