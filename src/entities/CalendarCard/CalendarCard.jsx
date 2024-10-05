import React from 'react';
import { Image } from "@nextui-org/image";

const CalendarCard = ({ image, rating, title, episodeInfo, timeInfo }) => {
    return (
        <button className='flex bg-[rgba(255,255,255,0.02)] pr-4 w-full rounded-[12px] gap-5 items-center '>
            <Image
                isZoomed
                className="w-[112px] h-[165px] rounded-[12px] object-cover"
                src={image}
                alt={title}
            />
            <div className='flex flex-col gap-4'>
                <div className='flex gap-[10px] items-center'>
                    <img src="star.svg" alt="Rating Star" />
                    <p className='text-[#E4DBBA] text-[12px] lg:text-[14px]'>{rating}</p>
                </div>
                <p className='text-[12px] lg:text-[14px] max-w-[180px] lg:max-w-[206px] font-semibold text-start'>
                    {title}
                </p>
                <div className="flex gap-2">
                    <div
                        className="flex text-[12px] lg:text-[14px] px-[15px] py-[10px] items-center bg-[rgba(204,186,228,0.10)] w-fit font-semibold text-[#CCBAE4] rounded-[9px] whitespace-nowrap">
                        <div>{episodeInfo}</div>
                    </div>
                    <div
                        className="flex px-[15px] text-[12px] py-[10px] items-center bg-none w-fit border font-medium text-[#D7D7D7] rounded-[9px] whitespace-nowrap">
                        {timeInfo}
                    </div>
                </div>
            </div>
        </button>
    );
};

export default CalendarCard;
