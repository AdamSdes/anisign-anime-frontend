import React from 'react'
import Image from 'next/image'
import { Star } from 'lucide-react'

interface AnimeCardProps {
    image: string
    rating: string
    title: string
    episodeInfo: string
    timeInfo: string
    episodeTitle?: string // сделаем опциональным, так как не используется в новом дизайне
}

const AnimeCard = ({ image, rating, title, episodeInfo, timeInfo }: AnimeCardProps) => {
    return (
        <button className='flex bg-[rgba(255,255,255,0.02)] w-full rounded-[12px] gap-5 items-center group hover:bg-white/[0.03] transition-all duration-300'>
            <div className="relative w-[112px] h-[165px] overflow-hidden rounded-[12px]">
                <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="(max-width: 112px) 100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    priority
                />
            </div>

            <div className='flex flex-col gap-4 flex-1 pr-4'>
                <div className='flex gap-[10px] items-center'>
                    <Star className="w-3.5 h-3.5 text-[#E4DBBA]" />
                    <p className='text-[#E4DBBA] text-[12px] lg:text-[14px]'>{rating}</p>
                </div>
                
                <p className='text-[12px] lg:text-[14px] max-w-[180px] lg:max-w-[206px] font-semibold text-start line-clamp-2'>
                    {title}
                </p>
                
                <div className="flex gap-2">
                    <div className="flex text-[12px] lg:text-[14px] px-[15px] py-[10px] items-center bg-[rgba(204,186,228,0.10)] w-fit font-semibold text-[#CCBAE4] rounded-[9px] whitespace-nowrap">
                        {episodeInfo}
                    </div>
                    <div className="flex px-[15px] text-[12px] py-[10px] items-center bg-none w-fit border border-white/10 font-medium text-[#D7D7D7] rounded-[9px] whitespace-nowrap">
                        {timeInfo}
                    </div>
                </div>
            </div>
        </button>
    )
}

export default AnimeCard
