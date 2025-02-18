'use client'
import React, { useEffect, useState } from 'react'
import useEmblaCarousel, { EmblaOptionsType } from 'embla-carousel-react'
import { DotButton, useDotButton } from './EmblaCarouselDotButton'
import { PrevButton, NextButton, usePrevNextButtons } from './EmblaCarouselArrowButtons'
import Link from 'next/link'
import Image from 'next/image'
import { transformValue } from '@/lib/utils/transforms'
import { axiosInstance } from '@/lib/api/axiosConfig'
import { getAnimeList } from '@/services/api/anime'

interface Anime {
    anime_id: number
    russian: string
    name: string
    poster_url: string
    score?: number
    aired_on: string
    kind: string
    episodes?: number
    description?: string
    genre_ids?: string[]
    rating?: string
}

interface EmblaCarouselProps {
    options?: EmblaOptionsType
}

const EmblaCarousel = ({ options }: EmblaCarouselProps) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ 
        ...options, 
        loop: false,
        dragFree: true
    })

    const [animeList, setAnimeList] = useState<Anime[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchAnimeList = async () => {
            try {
                const data = await getAnimeList({ 
                    limit: 10,
                    status: 'ongoing',
                    sort_by: 'score',
                    sort_order: 'desc'
                })
                setAnimeList(data.anime_list)
                setError(null)
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка при загрузке аниме'
                console.error('Error fetching anime:', error)
                setError(errorMessage)
                setAnimeList([])
            } finally {
                setLoading(false)
            }
        }

        fetchAnimeList()
    }, [])

    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)
    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)

    const transliterate = (text: string) => {
        const ru: { [key: string]: string } = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e',
            'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k',
            'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
            'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts',
            'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
            'э': 'e', 'ю': 'yu', 'я': 'ya'
        }
        return text.toLowerCase().split('').map(char => ru[char] || char).join('')
    }

    const generateAnimeUrl = (anime: Anime) => {
        const title = anime.russian || anime.name || ''
        const slug = transliterate(title)
            .replace(/[^a-z0-9\s]/g, '')
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/ /g, '-')

        return `/anime/${anime.anime_id}${slug ? '-' + slug : ''}`
    }

    if (loading) {
        return (
            <div className="grid grid-cols-4 gap-6">
                {[...Array(4)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                        <div className="w-[200px] h-[300px] rounded-[16px] bg-white/5" />
                    </div>
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center text-red-500">
                {error}
            </div>
        )
    }

    return (
        <section className="embla relative">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {animeList.map((anime) => (
                        <div className="embla__slide" key={anime.anime_id}>
                            <Link href={generateAnimeUrl(anime)} className="group relative w-[200px] block">
                                {/* Image Container */}
                                <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-white/5">
                                    {/* Score Badge */}
                                    {anime.score && (
                                        <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5">
                                            <svg width="12" height="12" viewBox="0 0 24 24" className="text-[#FFE4A0]">
                                                <path fill="currentColor" d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z"/>
                                            </svg>
                                            <span className="text-xs font-medium text-[#FFE4A0]">{anime.score.toFixed(1)}</span>
                                        </div>
                                    )}
                                    
                                    <Image
                                        src={anime.poster_url}
                                        alt={anime.russian || anime.name}
                                        width={200}
                                        height={300}
                                        priority={animeList.indexOf(anime) === 0}
                                        className="w-full h-full object-cover transition-transform duration-300 scale-105 group-hover:scale-110"
                                    />
                                </div>

                                {/* Info */}
                                <div className="mt-2 space-y-1">
                                    <h3 className="text-xs font-medium line-clamp-2 text-white/90 group-hover:text-white transition-colors">
                                        {anime.russian || anime.name}
                                    </h3>
                                    <div className="flex items-center text-[10px] text-white/50 gap-1.5">
                                        <span>{transformValue('kind', anime.kind)}</span>
                                        {anime.aired_on && (
                                            <>
                                                <div className="w-1 h-1 rounded-full bg-white/20" />
                                                <span>{new Date(anime.aired_on).getFullYear()}</span>
                                            </>
                                        )}
                                        {anime.episodes > 0 && (
                                            <>
                                                <div className="w-1 h-1 rounded-full bg-white/20" />
                                                <span>{anime.episodes} эп.</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
                <div className="flex items-center gap-2">
                    <PrevButton 
                        onClick={onPrevButtonClick} 
                        disabled={prevBtnDisabled}
                        className={`
                            w-11 h-11 flex items-center justify-center rounded-full
                            border border-white/10 bg-white/[0.02]
                            transition-all duration-200
                            ${prevBtnDisabled 
                                ? 'opacity-40 cursor-not-allowed' 
                                : 'hover:bg-white/[0.04] hover:border-white/20'}
                        `}
                    />
                    <NextButton 
                        onClick={onNextButtonClick} 
                        disabled={nextBtnDisabled}
                        className={`
                            w-11 h-11 flex items-center justify-center rounded-full
                            border border-white/10 bg-white/[0.02]
                            transition-all duration-200
                            ${nextBtnDisabled 
                                ? 'opacity-40 cursor-not-allowed' 
                                : 'hover:bg-white/[0.04] hover:border-white/20'}
                        `}
                    />
                </div>

                <div className="h-11 flex items-center gap-2 px-4 border border-white/10 bg-white/[0.02] rounded-full">
                    {scrollSnaps.map((_, index) => (
                        <DotButton
                            key={index}
                            onClick={() => onDotButtonClick(index)}
                            className={`
                                h-1.5 rounded-full transition-all duration-200
                                ${index === selectedIndex 
                                    ? 'w-3 bg-white' 
                                    : 'w-1.5 bg-white/20 hover:bg-white/40'}
                            `}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default EmblaCarousel
