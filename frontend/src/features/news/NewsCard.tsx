'use client';

import { useState } from 'react';
import Image from 'next/image';
import { NewsItem } from '@/services/newsService';
import NewsModal from '@/features/news/NewsModal';
import { ExternalLink } from 'lucide-react';

interface NewsCardProps {
  news: NewsItem;
}

const NewsCard = ({ news }: NewsCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(news.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <div
        className='bg-white/[0.02] rounded-xl overflow-hidden border border-white/5 hover:border-white/10 transition-all cursor-pointer group'
        onClick={handleCardClick}
      >
        {/* Изображение новости */}
        <div className='w-full h-48 relative overflow-hidden'>
          <Image
            src={news.img}
            alt={news.title}
            fill
            unoptimized={true}
            className='object-cover group-hover:scale-105 transition-transform duration-300'
          />
          {/* Дата */}
          <div className='absolute bottom-3 left-3 right-3 flex justify-between text-xs'>
            <span className='bg-[#060606]/80 backdrop-blur-md rounded-md px-3 py-1'>
              {news.date}
            </span>
            <button
              onClick={handleLinkClick}
              className='bg-[#060606]/80 backdrop-blur-md rounded-md px-3 py-1 hover:bg-[#060606]/90 transition-colors flex items-center gap-1'
            >
              <ExternalLink className='w-3 h-3' />
              Источник
            </button>
          </div>
        </div>

        {/* Содержимое карточки */}
        <div className='p-4'>
          <h3 className='text-base font-medium mb-2 line-clamp-2 group-hover:text-white transition-colors'>
            {news.title}
          </h3>
          <p className='text-sm text-white/60 line-clamp-3 mb-3'>{news.text}</p>
          <div className='flex justify-between items-center'>
            <span className='text-xs text-white/40'>{news.date}</span>
            <span className='text-xs text-white/80 group-hover:text-white transition-colors'>
              Подробнее
            </span>
          </div>
        </div>
      </div>

      {/* Модальное окно с полной статьей */}
      <NewsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} news={news} />
    </>
  );
};

export default NewsCard;
