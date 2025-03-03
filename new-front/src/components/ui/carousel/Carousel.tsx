'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import  Image  from 'next/image'

interface Anime {
  id: number;
  name: string;
  image: string;
  rating: number;
  year: number;
  kind: string; 
}

interface CarouselProps {
  animeList: Anime[];
  title: string;
}

export default function Carousel({ animeList, title }: CarouselProps) {
  const t = useTranslations('carousel');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleItems = 5; 
  const totalItems = animeList.length;

  const handlePrev = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const handleNext = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev + 1) % totalItems);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const getVisibleAnime = () => {
    const items = [];
    for (let i = 0; i < visibleItems; i++) {
      items.push(animeList[(currentIndex + i) % totalItems]);
    }
    return items;
  };

  const StarIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 16 16"
      fill="none"
      className="text-yellow-400"
    >
      <polygon
        points="8,1 10,6 15,6 11,9 12,14 8,11 4,14 5,9 1,6 6,6"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );

  const ArrowLeftIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 16 16"
      fill="none"
      className="text-white"
    >
      <path
        d="M10 14L4 8L10 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );

  const ArrowRightIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 16 16"
      fill="none"
      className="text-white"
    >
      <path
        d="M6 14L12 8L6 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="bg-gradient-to-b from-purple-900 to-black rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <StarIcon />
            <span>{title}</span>
          </h2>
          <button
            onClick={handleNext}
            className="p-2 bg-black/30 hover:bg-black/50 text-white rounded-full"
            aria-label={t('next')}
          >
            <ArrowRightIcon />
          </button>
        </div>

        <div className="relative">
          <motion.div
            ref={containerRef}
            className="flex items-center space-x-4 overflow-hidden"
            initial={{ x: 0 }}
            animate={{ x: -currentIndex * (100 / visibleItems) + '%' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            {getVisibleAnime().map((anime) => (
              <motion.div
                key={anime.id}
                className="w-full flex-shrink-0"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Link
                  href={`/anime/${anime.id}`}
                  className="group relative w-full max-w-[200px] rounded-lg overflow-hidden bg-black/20 backdrop-blur-md shadow-lg hover:shadow-xl transition-all"
                >
                  <Image
                    src={anime.image}
                    alt={anime.name}
                    width={200}
                    height={300}
                    className="w-full h-[300px] object-cover rounded-t-lg"
                  />
                  <div className="p-3 bg-black/40">
                    <h3 className="text-white font-medium line-clamp-1">{anime.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-white/80">
                      <StarIcon />
                      <span>{anime.rating.toFixed(1)}</span>
                    </div>
                    <p className="text-white/60 text-xs">
                      {anime.year} | {anime.kind}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Стрелка назад (слева) */}
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-10"
            aria-label={t('prev')}
          >
            <ArrowLeftIcon />
          </button>

          {/* Точки навигации */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {Array.from({ length: totalItems }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  currentIndex === index ? 'bg-yellow-400' : 'bg-white/20'
                } hover:bg-yellow-500`}
                aria-label={`${t('goTo')} ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}