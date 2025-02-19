'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, ChevronRight } from 'lucide-react'
import RecentComment from './RecentComment'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation';

const MOCK_COMMENTS = [
    {
        id: 1,
        author: {
            name: "Кирилл Петров",
            avatar: "/mock/anime2.jpg"
        },
        content: "Невероятный эпизод! Анимация просто на высшем уровне, особенно сцена битвы. Такого я еще не видел.",
        date: "2 часа назад",
        hearts: 12,
        animeId: "1",
        animeName: "Клинок, рассекающий демонов"
    },
    {
        id: 2,
        author: {
            name: "Анна Светлова",
            avatar: "/mock/anime1.jpg"
        },
        content: "Сюжет становится все интереснее с каждой серией. Персонажи раскрываются очень глубоко.",
        date: "4 часа назад",
        hearts: 8,
        animeId: "2",
        animeName: "Магическая битва"
    },
    {
        id: 3,
        author: {
            name: "Дмитрий Волков",
            avatar: "/mock/anime3.jpg"
        },
        content: "Отличная серия! Саундтрек просто космический, а концовка заставила задуматься.",
        date: "5 часов назад",
        hearts: 15,
        animeId: "3",
        animeName: "Атака титанов"
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

const RecentComments = () => {
    const router = useRouter();

    return (
        <motion.section 
            className="flex flex-col py-12 sm:py-16 md:py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto px-4">
                <motion.div 
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-white/5">
                            <MessageCircle className="w-5 h-5 text-white/60" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Последние комментарии</h2>
                    </div>
                    <Button 
                        variant="ghost" 
                        className="w-full sm:w-auto h-[50px] px-6 rounded-xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.04] transition-all duration-200 flex items-center justify-center gap-3"
                        onClick={() => router.push('/comments')}
                    >
                        <span className="text-[14px] font-normal text-white/80">Все комментарии</span>
                        <ChevronRight className="h-4 w-4 text-white/40" />
                    </Button>
                </motion.div>

                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {MOCK_COMMENTS.map((comment) => (
                        <motion.div
                            key={comment.id}
                            variants={itemVariants}
                            className="flex-1 min-w-0"
                        >
                            <RecentComment comment={comment} />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Мобильная кнопка "Все комментарии" внизу */}
                <motion.div 
                    className="mt-6 block sm:hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <Button 
                        variant="outline"
                        className="w-full h-[50px] rounded-xl border-white/10 hover:bg-white/5 text-white/60"
                        onClick={() => router.push('/comments')}
                    >
                        Смотреть все комментарии
                    </Button>
                </motion.div>
            </div>
        </motion.section>
    )
}

export default RecentComments
