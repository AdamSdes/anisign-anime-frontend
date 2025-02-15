'use client'
import React, { useState } from 'react'
import AnimeCard from '@/components/Calendar/AnimeCard'
import { Button } from '@/components/ui/button'
import { CalendarDays, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const MOCK_ANIMES = [
    {
        id: 1,
        image: "/mock/anime1.jpg",
        rating: "8.7",
        title: "Демон против проклятий",
        episodeInfo: "Серия 13",
        timeInfo: "12:00",
        episodeTitle: "Битва в темноте"
    },
    {
        id: 2,
        image: "/mock/anime2.jpg",
        rating: "9.2",
        title: "Клинок, рассекающий демонов",
        episodeInfo: "Серия 8",
        timeInfo: "15:30",
        episodeTitle: "Путь самурая"
    },
    {
        id: 3,
        image: "/mock/anime3.jpg",
        rating: "7.9",
        title: "Синий оркестр",
        episodeInfo: "Серия 21",
        timeInfo: "18:00",
        episodeTitle: "Мелодия судьбы"
    },
    {
        id: 4,
        image: "/mock/anime3.jpg",
        rating: "8.4",
        title: "Магическая битва",
        episodeInfo: "Серия 5",
        timeInfo: "20:30",
        episodeTitle: "Заклинание разрушения"
    },
    {
        id: 5,
        image: "/mock/anime1.jpg",
        rating: "8.8",
        title: "Атака титанов",
        episodeInfo: "Серия 17",
        timeInfo: "22:00",
        episodeTitle: "Последний рубеж"
    },
    {
        id: 6,
        image: "/mock/anime2.jpg",
        rating: "7.6",
        title: "Благословение небожителей",
        episodeInfo: "Серия 9",
        timeInfo: "23:30",
        episodeTitle: "Божественное вмешательство"
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const itemVariants = {
    hidden: { 
        opacity: 0,
        y: 20 
    },
    visible: { 
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
}

const Calendar = () => {
    const router = useRouter();
    const [selectedCard, setSelectedCard] = useState<number | null>(null);
    const [isLoading] = useState(false);

    if (isLoading) {
        return (
            <main className="flex flex-col mb-[30px] gap-3 items-center">
                <div className="container mx-auto px-2 py-5 flex flex-col">
                    <div className="flex flex-col gap-5 items-center justify-center w-full h-[353px] bg-[rgba(255,255,255,0.02)] rounded-[14px]">
                        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-white/5 fill-[#CCBAE4]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <motion.main 
            className="flex flex-col mt-[60px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto px-2 flex flex-col">
                <motion.div 
                    className="flex justify-between items-center mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <CalendarDays className="w-6 h-6 text-white/40" />
                            <h2 className="text-2xl font-bold tracking-tight">Календарь</h2>
                        </div>
                    </div>
                    <Button 
                        variant="ghost" 
                        className="h-[50px] px-6 rounded-[12px] bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.04] transition-all duration-200 flex items-center gap-3"
                        onClick={() => router.push('/calendar')}
                    >
                        <span className="text-[14px] font-normal text-white/80">Перейти в календарь</span>
                        <ChevronRight className="h-4 w-4 text-white/40" />
                    </Button>
                </motion.div>

                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[20px]"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {MOCK_ANIMES.map((anime) => (
                        <motion.div
                            key={anime.id}
                            variants={itemVariants}
                            onMouseEnter={() => setSelectedCard(anime.id)}
                            onMouseLeave={() => setSelectedCard(null)}
                            className={`transition-opacity duration-300 ${
                                selectedCard !== null && selectedCard !== anime.id 
                                    ? 'opacity-40' 
                                    : 'opacity-100'
                            }`}
                        >
                            <AnimeCard {...anime} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.main>
    );
};

export default Calendar;
