'use client';
import { useState, useEffect } from 'react';
import Navbar from "@/widgets/Header/Header";
import Footer from "@/widgets/Footer/Footer";

const CharacterPage = ({ params }) => {
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCharacter = async () => {
            try {
                setLoading(true);
                setError(null);
                // Используем правильный эндпоинт для получения персонажа по ID
                const response = await fetch(`http://localhost:8000/character/${params.id}`, {
                    headers: {
                        'accept': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Character not found');
                }

                const data = await response.json();
                setCharacter(data);
            } catch (error) {
                console.error('Error fetching character:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchCharacter();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div>
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row gap-8 animate-pulse">
                        <div className="w-full md:w-[300px] flex-shrink-0">
                            <div className="rounded-[14px] bg-white/5 aspect-[3/4]" />
                        </div>
                        <div className="flex-1 space-y-6">
                            <div className="h-8 bg-white/5 rounded w-3/4" />
                            <div className="h-4 bg-white/5 rounded w-1/2" />
                            <div className="space-y-3">
                                <div className="h-4 bg-white/5 rounded w-full" />
                                <div className="h-4 bg-white/5 rounded w-full" />
                                <div className="h-4 bg-white/5 rounded w-2/3" />
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                    <div className="text-center text-white/70">
                        <h2 className="text-xl font-medium mb-2">Персонаж не найден</h2>
                        <p>Возможно, этот персонаж был удален или перемещен.</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!character) {
        return <div>Character not found</div>;
    }

    return (
        <div>
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-[300px] flex-shrink-0">
                        <div className="rounded-[14px] overflow-hidden">
                            <img 
                                src={character.poster_url} 
                                alt={character.russian || character.name}
                                className="w-full h-auto"
                            />
                        </div>
                    </div>
                    <div className="flex-1 space-y-6">
                        <div>
                            <h1 className="text-2xl font-semibold text-white/90">
                                {character.russian || character.name}
                            </h1>
                            <p className="text-white/50 mt-2">{character.japanese}</p>
                        </div>
                        {character.description && (
                            <div className="prose prose-invert max-w-none">
                                <p className="text-white/70">{character.description}</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CharacterPage;
