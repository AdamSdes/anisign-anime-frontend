'use client';

import Image from 'next/image';
import { NewsItem } from '@/services/newsService';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ExternalLink } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  news: NewsItem;
}

const NewsModal = ({ isOpen, onClose, news }: NewsModalProps) => {
  const handleLinkClick = () => {
    window.open(news.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[700px] p-0 overflow-hidden bg-[#060606] border-white/5'>
        <VisuallyHidden>
          <DialogTitle>{news.title}</DialogTitle>
        </VisuallyHidden>
        {/* Изображение новости */}
        <div className='w-full h-[240px] relative'>
          <Image src={news.img} alt={news.title} fill unoptimized={true} className='object-cover' />
          {/* Затемнение для лучшей читаемости заголовка */}
          <div className='absolute inset-0 bg-gradient-to-t from-[#060606] to-transparent'></div>

          {/* Дата и ссылка на источник */}
          <div className='absolute top-4 right-4 flex gap-2 text-xs'>
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

          {/* Заголовок поверх изображения */}
          <div className='absolute bottom-4 left-6 right-6'>
            <h2 className='text-xl font-medium text-white'>{news.title}</h2>
            <p className='text-xs text-white/60 mt-2'>{news.date}</p>
          </div>
        </div>

        {/* Полный текст новости */}
        <div className='p-6'>
          <p className='text-sm text-white/80 leading-relaxed whitespace-pre-line'>{news.text}</p>

          <div className='mt-6 pt-4 border-t border-white/5 flex justify-between items-center'>
            <button
              onClick={handleLinkClick}
              className='text-xs text-white/60 hover:text-white transition-colors flex items-center gap-1'
            >
              <ExternalLink className='w-3 h-3' />
              Читать полную статью
            </button>
            <button
              onClick={onClose}
              className='text-xs bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition'
            >
              Закрыть
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewsModal;
