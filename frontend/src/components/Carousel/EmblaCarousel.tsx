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
                        <div className="w-[261px] h-[368px] rounded-[16px] bg-white/5" />
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
                            <Link href={generateAnimeUrl(anime)} className="relative w-[261px] h-[368px] rounded-[16px] overflow-hidden border-none bg-none group block">
                                <Image
                                    src={anime.poster_url}
                                    alt={anime.russian || anime.name}
                                    width={261}
                                    height={368}
                                    className="w-full h-full object-cover"
                                    priority={animeList.indexOf(anime) === 0}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent pointer-events-none z-10" />
                                <div className="absolute bottom-0 w-full p-4 text-white z-20">
                                    <p className="text-[14px] text-start font-semibold">
                                        {anime.russian || anime.name}
                                    </p>
                                    <div className="flex gap-[10px] text-sm mt-2 opacity-70">
                                        <p className="text-[12px]">
                                            {new Date(anime.aired_on).getFullYear()}
                                        </p>
                                        <span>/</span>
                                        <p className="text-[12px]">
                                            {transformValue('kind', anime.kind)}
                                        </p>
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
                            border border-white/10 bg-surface/80
                            transition-all duration-300 backdrop-blur-sm
                            ${prevBtnDisabled 
                                ? 'opacity-40 cursor-not-allowed' 
                                : 'hover:bg-white/5 hover:border-white/20'}
                        `}
                    />
                    <NextButton 
                        onClick={onNextButtonClick} 
                        disabled={nextBtnDisabled}
                        className={`
                            w-11 h-11 flex items-center justify-center rounded-full
                            border border-white/10 bg-surface/80
                            transition-all duration-300 backdrop-blur-sm
                            ${nextBtnDisabled 
                                ? 'opacity-40 cursor-not-allowed' 
                                : 'hover:bg-white/5 hover:border-white/20'}
                        `}
                    />
                </div>

                <div className="h-11 flex items-center gap-2 px-4 border border-white/10 bg-surface/80 backdrop-blur-sm rounded-full">
                    {scrollSnaps.map((_, index) => (
                        <DotButton
                            key={index}
                            onClick={() => onDotButtonClick(index)}
                            className={`
                                h-1.5 rounded-full transition-all duration-300
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
