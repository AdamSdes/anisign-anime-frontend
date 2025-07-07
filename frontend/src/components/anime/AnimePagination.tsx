'use client';

import React, { useState, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';

interface AnimePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function AnimePagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: AnimePaginationProps) {
  const [inputPage, setInputPage] = useState<string>('');
  const [editingDots, setEditingDots] = useState<number | null>(null);

  // Если всего 1 страница, не показываем пагинацию
  if (totalPages <= 1) {
    return null;
  }

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const page = parseInt(inputPage);
      if (!isNaN(page) && page > 0 && page <= totalPages) {
        onPageChange(page);
      }
      setEditingDots(null);
      setInputPage('');
    } else if (e.key === 'Escape') {
      setEditingDots(null);
      setInputPage('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (
      value === '' ||
      (parseInt(value) <= totalPages && value.length <= totalPages.toString().length)
    ) {
      setInputPage(value);
    }
  };

  const handleInputBlur = () => {
    setEditingDots(null);
    setInputPage('');
  };

  const getPageNumbers = () => {
    const delta = 2; // Количество страниц до и после текущей
    const range = [];
    const rangeWithDots = [];

    // Всегда показываем первую страницу
    range.push(1);

    // Вычисляем диапазон страниц вокруг текущей
    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) {
        range.push(i);
      }
    }

    // Всегда показываем последнюю страницу
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Добавляем многоточие между страницами
    let prev = 0;
    for (const i of range) {
      if (prev) {
        if (i - prev === 2) {
          rangeWithDots.push(prev + 1);
        } else if (i - prev !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      prev = i;
    }

    return rangeWithDots;
  };

  // Обработчик клика по кнопке страницы
  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className='sticky bottom-2 z-10 flex items-center justify-center w-full'>
      <div
        className={cn(
          'flex items-center border border-white/5 gap-2 p-2 rounded-xl',
          'bg-background/80 backdrop-blur-xl',
          className
        )}
      >
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'inline-flex items-center justify-center',
            'h-10 w-10',
            'rounded-xl text-sm font-medium',
            'transition-colors duration-200',
            'border border-white/10',
            'bg-white/[0.02]',
            'text-white/60 hover:text-white',
            'hover:bg-white/[0.04] active:bg-white/[0.08]',
            'disabled:opacity-40 disabled:cursor-not-allowed'
          )}
          aria-label='Previous page'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='1em'
            height='1em'
            viewBox='0 0 1024 1024'
            className='h-4 w-4'
          >
            <path
              fill='currentColor'
              d='M872 474H286.9l350.2-304c5.6-4.9 2.2-14-5.2-14h-88.5c-3.9 0-7.6 1.4-10.5 3.9L155 487.8a31.96 31.96 0 0 0 0 48.3L535.1 866c1.5 1.3 3.3 2 5.2 2h91.5c7.4 0 10.8-9.2 5.2-14L286.9 550H872c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8'
            />
          </svg>
        </button>

        {getPageNumbers().map((pageNumber, index) =>
          pageNumber === '...' ? (
            editingDots === index ? (
              <input
                key={`dots-input-${index}`}
                type='text'
                value={inputPage}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                onBlur={handleInputBlur}
                className={cn(
                  'h-10 w-14',
                  'rounded-xl text-sm font-medium text-center',
                  'border border-white/10',
                  'bg-white/[0.04]',
                  'text-white placeholder-white/40',
                  'focus:outline-none focus:border-white/20',
                  'transition-colors duration-200'
                )}
                placeholder='...'
                autoFocus
              />
            ) : (
              <button
                key={`dots-${index}`}
                onClick={() => setEditingDots(index)}
                className={cn(
                  'inline-flex items-center justify-center',
                  'h-10 w-10',
                  'rounded-xl text-sm font-medium',
                  'transition-colors duration-200',
                  'border border-white/10',
                  'bg-white/[0.02]',
                  'text-white/60 hover:text-white',
                  'hover:bg-white/[0.04]'
                )}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='h-4 w-4'
                >
                  <circle cx='12' cy='12' r='1' />
                  <circle cx='19' cy='12' r='1' />
                  <circle cx='5' cy='12' r='1' />
                </svg>
              </button>
            )
          ) : (
            <button
              key={`page-${pageNumber}`}
              onClick={() => handlePageClick(Number(pageNumber))}
              className={cn(
                'inline-flex items-center justify-center',
                'h-10 w-10',
                'rounded-xl text-sm font-medium',
                'transition-colors duration-200',
                'border border-white/10',
                'bg-white/[0.02]',
                'text-white/60 hover:text-white',
                'hover:bg-white/[0.04] active:bg-white/[0.08]',
                currentPage === pageNumber && 'bg-white/10 text-white'
              )}
              aria-label={`Go to page ${pageNumber}`}
            >
              {pageNumber}
            </button>
          )
        )}

        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'inline-flex items-center justify-center',
            'h-10 w-10',
            'rounded-xl text-sm font-medium',
            'transition-colors duration-200',
            'border border-white/10',
            'bg-white/[0.02]',
            'text-white/60 hover:text-white',
            'hover:bg-white/[0.04] active:bg-white/[0.08]',
            'disabled:opacity-40 disabled:cursor-not-allowed'
          )}
          aria-label='Next page'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='1em'
            height='1em'
            viewBox='0 0 1024 1024'
            className='h-4 w-4'
          >
            <path
              fill='currentColor'
              d='M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 0 0 0-48.4'
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
