'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CharacterCard from './CharacterCard';

const CharacterCardSkeleton = () => (
    <div className="animate-pulse">
        <div className="relative aspect-[3/4] rounded-[14px] bg-white/5" />
        <div className="mt-3 space-y-2">
            <div className="h-4 bg-white/5 rounded w-3/4" />
            <div className="h-3 bg-white/5 rounded w-1/2" />
        </div>
    </div>
);

const CharacterList = () => {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 20;

    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`http://localhost:8000/character/get-character-list?page=${currentPage}&limit=${limit}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch characters');
                }
                const data = await response.json();
                setCharacters(data);
            } catch (error) {
                console.error('Error fetching characters:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCharacters();
    }, [currentPage]);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {[...Array(limit)].map((_, index) => (
                        <CharacterCardSkeleton key={index} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {characters.map((character) => (
                    <CharacterCard key={character.id} character={character} />
                ))}
            </div>
        </div>
    );
};

export default CharacterList;
