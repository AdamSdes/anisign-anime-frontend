'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button/Button';

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export function Pagination({ totalPages, currentPage, onPageChange, className }: PaginationProps) {
    const t = useTranslations('common');
    const [pages, setPages] = useState<number[]>([]);

    useEffect(() => {
        const newPages = Array.from({ length: totalPages }, (_, i) => i + 1);
        setPages(newPages);
    }, [totalPages]);
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };
    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };
    if (totalPages <= 1) return null;

    return (
        <div className={className || 'flex items-center gap-2 justify-center mt-6'}>
          <Button
            variant="outline"
            className="bg-black border-white/5 text-white/60 hover:bg-white/[0.04] rounded-xl px-4 py-2"
            onClick={handlePrevious}
            disabled={currentPage === 1}
          >
            {t('previous')}
          </Button>
          <div className="flex gap-2">
            {pages.map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                className={
                  currentPage === page
                    ? 'bg-gray-200 text-black hover:bg-gray-300 rounded-xl px-3 py-2'
                    : 'bg-black border-white/5 text-white/60 hover:bg-white/[0.04] rounded-xl px-3 py-2'
                }
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            className="bg-black border-white/5 text-white/60 hover:bg-white/[0.04] rounded-xl px-4 py-2"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            {t('next')}
          </Button>
        </div>
    );
}