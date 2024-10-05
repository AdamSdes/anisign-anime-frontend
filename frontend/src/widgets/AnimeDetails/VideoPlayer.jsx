'use client';
import React, { useState, useRef } from 'react';
import { AButton } from '@/shared/anisign-ui/Button';

export default function VideoPlayer() {
    // State variables
    const [activeTab, setActiveTab] = useState('Озвучка');
    const [selectedOption, setSelectedOption] = useState('JAM CLUB');
    const [currentPage, setCurrentPage] = useState(2);
    const [watchedEpisodes, setWatchedEpisodes] = useState(12);

    // Constants
    const totalPages = 25;
    const totalEpisodes = 30;

    // Refs for drag scrolling
    const scrollRef = useRef(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    // Options list
    const options = [
        'JAM CLUB',
        'AniDUB',
        'AniLibria',
        'SHIZA Project',
        'AniMedia',
        'AniFilm',
        'AnimeVost',
        'AniRise',
    ];

    // Handlers
    const handlePageChange = (page) => setCurrentPage(page);
    const handlePrevClick = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const handleNextClick = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

    const handleMouseDown = (e) => {
        isDragging.current = true;
        startX.current = e.pageX - scrollRef.current.offsetLeft;
        scrollLeft.current = scrollRef.current.scrollLeft;
    };

    const handleMouseUpOrLeave = () => {
        isDragging.current = false;
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        const x = e.pageX - scrollRef.current.offsetLeft;
        scrollRef.current.scrollLeft = scrollLeft.current - (x - startX.current) * 2; // Adjust scroll speed
    };

    const handleIncrement = () => watchedEpisodes < totalEpisodes && setWatchedEpisodes(watchedEpisodes + 1);
    const handleDecrement = () => watchedEpisodes > 0 && setWatchedEpisodes(watchedEpisodes - 1);

    // Progress calculation
    const progressPercentage = (watchedEpisodes / totalEpisodes) * 100;

    return (
        <>

        </>
    );
}
