'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'

export const ScrollToPlayerButton = () => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const playerSection = document.getElementById('player')
        if (playerSection) {
            playerSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        }
    }

    return (
        <motion.button
            whileHover={{ opacity: 0.8 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleClick}
            className="w-full flex items-center justify-center gap-2 h-[54px] bg-[#CCBAE4] 
                hover:opacity-90 text-black font-medium rounded-xl px-5 transition-all duration-300"
        >
            <Play className="h-5 w-5" />
            <span>Смотреть</span>
        </motion.button>
    )
}
