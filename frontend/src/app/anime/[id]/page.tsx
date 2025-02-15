'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import AnimeDetails from '@/components/AnimeDetails/AnimeDetails';
import RelatedAnime from '@/components/AnimeDetails/RelatedAnime';
import Header from "@/components/Header/Header";
import Report from "@/components/Report/Report";
import Footer from "@/components/Footer/Footer";
import VideoPlayer from '@/components/anime/VideoPlayer';

import AnimeComments from '@/components/Comments/AnimeComments';

// Import Screenshots component with dynamic import
const Screenshots = dynamic(
    () => import('@/components/anime/Screenshots'),
    { 
        loading: () => <div>Loading screenshots...</div>,
        ssr: false 
    }
);

interface AnimeData {
    id: string;  // UUID для комментариев
    anime_id: string;
    russian: string;
    name: string;
    poster_url: string;
    aired_on: string;
    kind: string;
    screenshots?: string[];
    related_anime_ids?: string[];
    related_anime_texts?: string[];
    // Add other anime properties as needed
}

interface Genre {
    id: number;
    name: string;
    genre_id: number;
    russian: string;
    // Add other genre properties as needed
}

export default function Page() {
    const { id } = useParams();
    const animeId = typeof id === 'string' ? id.split('-')[0] : id?.[0]?.split('-')[0];
    const [animeData, setAnimeData] = useState<AnimeData | null>(null);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [relatedAnime, setRelatedAnime] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnimeDetails = async () => {
            try {
                setLoading(true);
                // Fetch both anime details and genres
                const [animeResponse, genresResponse] = await Promise.all([
                    fetch(`http://localhost:8000/anime/id/${animeId}`),
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

                // Fetch related anime if there are any
                if (animeData.related_anime_ids && animeData.related_anime_ids.length > 0) {
                    const relatedPromises = animeData.related_anime_ids.map(async (id: string, index: number) => {
                        try {
                            // Сначала проверяем существование аниме в базе
                            const checkResponse = await fetch(`http://localhost:8000/anime/id/${id}`);
                            
                            if (!checkResponse.ok) {
                                console.log(`Anime with id ${id} not found in database`);
                                return null;
                            }

                            const relatedAnimeData = await checkResponse.json();

                            // Проверяем наличие всех необходимых полей до обращения к ним
                            if (!relatedAnimeData || typeof relatedAnimeData !== 'object') {
                                console.log(`Invalid data received for anime with id ${id}`);
                                return null;
                            }

                            // Проверяем каждое поле отдельно для более точной диагностики
                            const missingFields = [];
                            if (!relatedAnimeData.anime_id) missingFields.push('anime_id');
                            if (!relatedAnimeData.name && !relatedAnimeData.russian) missingFields.push('name/russian');
                            if (!relatedAnimeData.poster_url) missingFields.push('poster_url');

                            if (missingFields.length > 0) {
                                console.log(`Anime with id ${id} is missing required fields: ${missingFields.join(', ')}`);
                                return null;
                            }

                            // Если все проверки пройдены, возвращаем объект с данными
                            return {
                                anime_id: relatedAnimeData.anime_id,
                                name: relatedAnimeData.russian || relatedAnimeData.name,
                                russian: relatedAnimeData.russian,
                                poster_url: relatedAnimeData.poster_url,
                                relation_type: animeData.related_anime_texts?.[index] || 'Связанное аниме',
                                kind: relatedAnimeData.kind || 'Unknown',
                                aired_on: relatedAnimeData.aired_on || '',
                                episodes: relatedAnimeData.episodes,
                                score: relatedAnimeData.score
                            };
                        } catch (error) {
                            console.log(`Error processing anime with id ${id}:`, error);
                            return null;
                        }
                    });

                    try {
                        const relatedResults = await Promise.all(relatedPromises);
                        // Фильтруем null значения и устанавливаем только валидные результаты
                        const validResults = relatedResults.filter((anime): anime is NonNullable<typeof anime> => 
                            anime !== null &&
                            typeof anime === 'object' &&
                            typeof anime.anime_id === 'string' &&
                            typeof anime.name === 'string' &&
                            typeof anime.poster_url === 'string'
                        );
                        
                        if (validResults.length === 0) {
                            console.log('No valid related anime found after filtering');
                        }
                        
                        setRelatedAnime(validResults);
                    } catch (error) {
                        console.log('Error processing related anime results:', error);
                        setRelatedAnime([]);
                    }
                }

                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
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

    return (
        <>
            <Header />
            <Report />
            <section className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-16">
                    <AnimeDetails 
                        anime={animeData} 
                        genres={genres} 
                        isLoading={loading}
                    />
                    {animeData && (
                        <div className="space-y-8">
                            <Suspense fallback={<div>Loading screenshots...</div>}>
                                {animeData.screenshots && animeData.screenshots.length > 0 && (
                                    <Screenshots screenshots={animeData.screenshots} />
                                )}
                            </Suspense>
                            
                            <VideoPlayer 
                                shikimoriId={animeData.anime_id}
                                />
                                
                                
                                {relatedAnime.length > 0 && (
                                    <RelatedAnime relatedAnime={relatedAnime} />
                                )}

                        </div>
                    )}
                </div>
            </section>
            <div className="container mx-auto px-4 py-8">
                <div className="mt-8">
                    <AnimeComments animeId={animeData.id} />
                </div>
            </div>
            <Footer/>
        </>
    );
}
