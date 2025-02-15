'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import AnimeList from '@/components/AnimeList/AnimeList'
import FilterSidebar from '@/components/AnimeList/FilterSidebar'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import Report from '@/components/Report/Report'

export default function AnimeListPage() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        // Если нет никаких параметров, устанавливаем дефолтные
        if (searchParams.toString() === '') {
            const params = new URLSearchParams()
            router.replace(`${pathname}?${params.toString()}`)
        }
    }, [])

    return (
        <>
            <Header />
            <Report />
            <main className="min-h-screen bg-[#030303]">
                <div className="container px-[20px] py-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-8"
                    >
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Main Content */}
                            <div className="flex-1">
                                <AnimeList />
                            </div>

                            {/* Sidebar */}
                            <div className="w-full lg:w-[300px] shrink-0">
                                <div className="lg:top-[100px]">
                                    <FilterSidebar />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </>
    )
}
