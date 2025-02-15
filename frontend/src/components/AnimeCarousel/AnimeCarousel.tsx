'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import EmblaCarousel from "@/components/Carousel/EmblaCarousel"
import { motion } from 'framer-motion'
import { useAuthStore } from '@/hooks/useAuth'
import { getBannerUrl } from '@/utils/banner'

const AnimeCarousel = () => {
    const OPTIONS = { align: 'start', dragFree: true }
    const user = useAuthStore(state => state.user)
    const bannerUrl = getBannerUrl(user?.user_banner)
    
    console.log('[AnimeCarousel] User:', user);
    console.log('[AnimeCarousel] Banner URL:', bannerUrl);

    return (
        <motion.section 
            className="anim-list-background py-10"
            style={bannerUrl ? { '--profile-banner': `url(${bannerUrl})` } as React.CSSProperties : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto">
                <motion.div 
                    className="flex justify-between items-center mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-gradient-to-t from-accent to-purple-500 rounded-full"></div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold tracking-tight">Лучшие онгоинги</h2>
                            <span className="text-xl" role="img" aria-label="fire">🔥</span>
                        </div>
                    </div>
                    <Button 
                        variant="ghost" 
                        className="group flex items-center gap-2 px-4 py-2 text-secondary hover:text-white transition-all duration-300 hover:bg-white/5"
                    >
                        <span>Смотреть все</span>
                        <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"/>
                    </Button>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <EmblaCarousel options={OPTIONS} />
                </motion.div>
            </div>
        </motion.section>
    )
}

export default AnimeCarousel
