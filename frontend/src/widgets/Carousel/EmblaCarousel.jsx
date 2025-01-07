'use client'
import React, { useState, useEffect } from 'react'
import { DotButton, useDotButton } from '@/widgets/Carousel/EmblaCarouselDotButton'
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
} from '@/widgets/Carousel/EmblaCarouselArrowButtons'
import useEmblaCarousel from 'embla-carousel-react'
import { Tooltip } from "@nextui-org/tooltip"
import { Card, Skeleton } from "@nextui-org/react"

const EmblaCarousel = ({ options }) => {
    const [slides, setSlides] = useState([]);
    const [emblaRef, emblaApi] = useEmblaCarousel({ 
        ...options, 
        loop: false,
        dragFree: true
    })
    const [loading, setLoading] = useState(true)

    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)

    useEffect(() => {
        const fetchAnime = async () => {
            try {
                setLoading(true)
                const response = await fetch('http://localhost:8000/anime/get-anime-list?limit=10')
                const data = await response.json()
                // Обновляем для работы с новой структурой API
                setSlides(data.anime_list || [])
            } catch (error) {
                console.error('Error fetching anime:', error)
                setSlides([])
            } finally {
                setLoading(false)
            }
        }

        fetchAnime()
    }, [])

    if (loading) {
        return (
            <section className="embla ">
                <div className="mb-[51px]">
                    <div
                        className="flex flex-col gap-5 items-center justify-center w-full backdrop-blur-xl  h-[368px] bg-[rgba(255,255,255,0.02)] rounded-[14px]">
                        <svg aria-hidden="true"
                             className="w-8 h-8 text-gray-200 animate-spin dark:text-white/5 fill-[#CCBAE4]"
                             viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"/>
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"/>
                        </svg>
                    </div>
                </div>

                <div className="flex justify-between opacity-20 gap-4 mt-[30px] mb-[20px]">
                    <div className="flex gap-4">
                        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled}/>
                        <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled}/>
                    </div>

                    <div className="border rounded-[50px] items-center w-fit p-4 flex gap-5">
                        <div className="flex gap-5 rounded-[50px] transition-colors duration-300">
                            <div className="w-[10px] h-[10px] bg-white/10 rounded-[14px]"></div>
                            <div className="w-[10px] h-[10px] bg-white/10 rounded-[14px]"></div>
                            <div className="w-[10px] h-[10px] bg-white/10 rounded-[14px]"></div>
                            <div className="w-[10px] h-[10px] bg-white/10 rounded-[14px]"></div>
                        </div>
                    </div>
                </div>

            </section>
        )
    }

    return (
        <section className="embla">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {Array.isArray(slides) && slides.map((anime) => (
                        <div className="embla__slide" key={anime.anime_id}>
                            <Tooltip
                                delay={700}
                                closeDelay={300}
                                className="bg-[#060606] border"
                                content={
                                    <div className="w-[250px] flex flex-col gap-5 px-2 py-4">
                                        <Skeleton className="rounded-lg bg-white/10">
                                            <div className="h-24 rounded-lg bg-white/10"></div>
                                        </Skeleton>
                                        <div className="space-y-3">
                                            <Skeleton className="w-3/5 rounded-lg">
                                                <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                                            </Skeleton>
                                            <Skeleton className="w-4/5 rounded-lg">
                                                <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                                            </Skeleton>
                                            <Skeleton className="w-2/5 rounded-lg">
                                                <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                                            </Skeleton>
                                        </div>
                                    </div>
                                }
                            >
                                <button
                                    className="relative w-[261px] h-[368px] rounded-[16px] overflow-hidden border-none bg-none group">
                                    <img
                                        src={anime.poster_url}
                                        alt={anime.russian || anime.name}
                                        className="object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-110"/>
                                    <div
                                        className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent pointer-events-none z-10"></div>
                                    <div className="absolute bottom-0 w-full p-4 text-white z-20">
                                        <p className="text-[14px] text-start font-semibold">{anime.russian || anime.name}</p>
                                        <div className="flex gap-[10px] text-sm mt-2 opacity-70">
                                            <p className="text-[12px]">{new Date(anime.released_on).getFullYear()}</p>
                                            <span>/</span>
                                            <p className="text-[12px]">{anime.kind}</p>
                                        </div>
                                    </div>
                                </button>
                            </Tooltip>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-between gap-4 mt-[30px] mb-[20px]">
                <div className="flex gap-4">
                    <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled}/>
                    <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled}/>
                </div>

                <div className="border rounded-[50px] items-center w-fit p-4 flex gap-5">
                    {scrollSnaps.map((_, index) => (
                        <DotButton
                            key={index}
                            onClick={() => onDotButtonClick(index)}
                            className={`w-[10px] h-[10px] rounded-[50px] transition-colors duration-300 ${
                                index === selectedIndex ? 'bg-white' : 'bg-white/40'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default EmblaCarousel
