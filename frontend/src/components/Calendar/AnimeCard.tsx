"use client";

import React, { useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import useSWR from "swr";
import { Star } from "lucide-react";
import { axiosInstance } from "@/lib/axios/axiosConfig";

// Интерфейс пропсов компонента AnimeCard
interface AnimeCardProps {
  id?: number; 
  image: string; 
  rating: string; 
  title: string; 
  episodeInfo: string; 
  timeInfo: string; 
  episodeTitle?: string; 
}

// Интерфейс ответа API для данных изображения
interface ImageData {
  url: string;
}

/**
 * Функция загрузки данных изображения через SWR
 * @param url - URL эндпоинта API
 * @returns URL изображения
 */
const fetcher = (url: string) =>
  axiosInstance.get<ImageData>(url).then((res) => res.data.url);

//  Варианты анимации для карточки
const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Компонент карточки аниме для календаря
 * @description Отображает карточку аниме с анимацией и динамической загрузкой изображения
 * @param {AnimeCardProps} props - Пропсы компонента
 */
export const AnimeCard: React.FC<AnimeCardProps> = React.memo(
  ({ id, image, rating, title, episodeInfo, timeInfo }) => {
    // Загрузка изображения через SWR (если ID предоставлен)
    const { data: imageUrl, error: imageError } = useSWR(
      id ? `/anime/${id}/image` : null,
      fetcher,
      {
        fallbackData: image, 
        revalidateOnFocus: false,
      }
    );

    // Обработчик клика по карточке
    const handleClick = useCallback(() => {
      console.log(`Clicked on ${title} (ID: ${id})`);
    }, [id, title]);

    return (
      <motion.button
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="flex bg-[rgba(255,255,255,0.02)] w-full rounded-[12px] gap-5 items-center group hover:bg-white/[0.03] transition-all duration-300"
        onClick={handleClick}
      >
        <div className="relative w-[112px] h-[165px] overflow-hidden rounded-[12px]">
          {imageError ? (
            <div className="w-full h-full bg-white/5 flex items-center justify-center">
              <span className="text-white/40 text-[12px]">Нет изображения</span>
            </div>
          ) : (
            <Image
              src={imageUrl || image}
              alt={title}
              fill
              sizes="(max-width: 112px) 100vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              priority={!!id && id <= 3} 
            />
          )}
        </div>

        <div className="flex flex-col gap-4 flex-1 pr-4">
          <div className="flex gap-[10px] items-center">
            <Star className="w-3.5 h-3.5 text-[#E4DBBA]" />
            <p className="text-[#E4DBBA] text-[12px] lg:text-[14px]">{rating}</p>
          </div>

          <p className="text-[12px] lg:text-[14px] max-w-[180px] lg:max-w-[206px] font-semibold text-start line-clamp-2">
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
      </motion.button>
    );
  }
);

AnimeCard.displayName = "AnimeCard";

export default AnimeCard;