'use client';

import Image from 'next/image';
import { NewsItem } from './NewsGrid';
import { formatDate } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  news: NewsItem;
}

const NewsModal = ({ isOpen, onClose, news }: NewsModalProps) => {
  // Форматирование даты
  const formattedDate = formatDate(news.date);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[700px] p-0 overflow-hidden bg-[#060606] border-white/5'>
        {/* Изображение новости */}
        <div className='w-full h-[240px] relative'>
          <Image
            src={news.imageUrl}
            alt={news.title}
            fill
            unoptimized={true}
            className='object-cover'
          />
          {/* Затемнение для лучшей читаемости заголовка */}
          <div className='absolute inset-0 bg-gradient-to-t from-[#060606] to-transparent'></div>

          {/* Категория и источник */}
          <div className='absolute top-4 right-4 flex gap-2 text-xs'>
            <span className='bg-[#060606]/80 backdrop-blur-md rounded-md px-3 py-1'>
              {news.category}
            </span>
            <span className='bg-[#060606]/80 backdrop-blur-md rounded-md px-3 py-1'>
              {news.source}
            </span>
          </div>

          {/* Заголовок поверх изображения */}
          <div className='absolute bottom-4 left-6 right-6'>
            <h2 className='text-xl font-medium text-white'>{news.title}</h2>
            <p className='text-xs text-white/60 mt-2'>{formattedDate}</p>
          </div>
        </div>

        {/* Полный текст новости */}
        <div className='p-6'>
          <p className='text-sm text-white/80 leading-relaxed whitespace-pre-line'>
            {news.content}

            {/* Дополнительный контент для более реалистичного отображения полной статьи */}
            {'\n\n'}
            {`Это важное событие для всех поклонников аниме. ${news.source} объявили об этом на своем официальном сайте. Фанаты уже активно обсуждают новость в социальных сетях и форумах.`}
            {'\n\n'}
            {
              'Статья будет дополняться по мере поступления новой информации. Следите за обновлениями!'
            }
          </p>

          <div className='mt-6 pt-4 border-t border-white/5 flex justify-between items-center'>
            <span className='text-xs text-white/40'>Источник: {news.source}</span>
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
