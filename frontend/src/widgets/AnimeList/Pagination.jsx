'use client';
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Pagination = ({ currentPage, totalCount, pageSize }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [inputPage, setInputPage] = useState('');
    
    // Обновляем вычисление totalPages
    const totalPages = Math.ceil(totalCount / pageSize);

    const createPageURL = (pageNumber) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        
        // Сохраняем структуру URL с фильтрами
        const currentPath = pathname.split('?')[0]; // Берем путь без query params
        return `${currentPath}?${params.toString()}`;
    };

    const handlePageInput = (e) => {
        const value = e.target.value;
        if (value === '' || /^\d+$/.test(value)) {
            setInputPage(value);
        }
    };

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            const pageNum = parseInt(inputPage);
            if (pageNum >= 1 && pageNum <= totalPages) {
                router.push(createPageURL(pageNum));
                setInputPage('');
            }
        }
    };

    const handlePageChange = (pageNumber) => {
        router.push(createPageURL(pageNumber));
    };

    const getPageNumbers = () => {
        const pages = [];
        
        // Всегда показываем первую страницу
        pages.push(1);

        // Добавляем многоточие после первой страницы, если текущая страница далеко
        if (currentPage > 4) {
            pages.push('dots');
        }

        // Показываем страницы вокруг текущей
        const beforeCurrent = Math.max(currentPage - 1, 2);
        const afterCurrent = Math.min(currentPage + 1, totalPages - 1);

        for (let i = beforeCurrent; i <= afterCurrent; i++) {
            if (i > 1 && i < totalPages) {
                pages.push(i);
            }
        }

        // Добавляем многоточие перед последней страницей, если нужно
        if (currentPage < totalPages - 3) {
            pages.push('dots');
        }

        // Добавляем последнюю страницу, если она существует
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    // Не показываем пагинацию, если всего одна страница
    if (totalPages <= 1) return null;

    return (
        <div className="sticky bottom-2 z-50 flex items-center justify-center mb-5">
            <div className="w-fit rounded-[14px] border border-secondary/60 bg-background p-2 shadow">
                <div className="flex w-full justify-center gap-2 lg:gap-4">
                    {/* Кнопка "Назад" */}
                    <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        className="inline-flex gap-2 items-center justify-center rounded-[14px] whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 border border-secondary/60 bg-secondary/30 hover:bg-secondary/60 hover:text-secondary-foreground size-9 text-xs sm:size-10"
                        disabled={currentPage === 1}
                    >
                        <svg viewBox="0 0 1024 1024" width="1.2em" height="1.2em">
                            <path fill="currentColor" d="M872 474H286.9l350.2-304c5.6-4.9 2.2-14-5.2-14h-88.5c-3.9 0-7.6 1.4-10.5 3.9L155 487.8a31.96 31.96 0 0 0 0 48.3L535.1 866c1.5 1.3 3.3 2 5.2 2h91.5c7.4 0 10.8-9.2 5.2-14L286.9 550H872c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8" />
                        </svg>
                    </button>

                    {/* Страницы */}
                    {getPageNumbers().map((pageNumber, index) => {
                        if (pageNumber === 'dots') {
                            return (
                                <button
                                    key="dots"
                                    disabled
                                    className="inline-flex gap-2 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 border border-secondary/60 bg-secondary/30 hover:bg-secondary/60 hover:text-secondary-foreground size-9 sm:size-10"
                                >
                                    ...
                                </button>
                            );
                        }

                        if (pageNumber === 'input') {
                            return (
                                <input
                                    key="input"
                                    type="text"
                                    value={inputPage}
                                    onChange={handlePageInput}
                                    onKeyDown={handleInputKeyDown}
                                    className="flex rounded-[14px] border border-secondary/60 bg-secondary/30 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 size-9 sm:size-10"
                                    placeholder="..."
                                />
                            );
                        }

                        return (
                            <button
                                key={pageNumber}
                                onClick={() => handlePageChange(pageNumber)}
                                className={`inline-flex gap-2 items-center justify-center whitespace-nowrap rounded-[14px] text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 size-9 sm:size-10 ${
                                    currentPage === pageNumber
                                        ? 'border border-primary bg-primary text-primary-foreground hover:bg-primary/90'
                                        : 'border border-secondary/60 bg-secondary/30 hover:bg-secondary/60 hover:text-secondary-foreground'
                                }`}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}

                    {/* Кнопка "Вперед" */}
                    <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        className="inline-flex gap-2 items-center justify-center whitespace-nowrap rounded-[14px] font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 border border-secondary/60 bg-secondary/30 hover:bg-secondary/60 hover:text-secondary-foreground size-9 text-xs sm:size-10"
                        disabled={currentPage === totalPages}
                    >
                        <svg viewBox="0 0 1024 1024" width="1.2em" height="1.2em">
                            <path fill="currentColor" d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 0 0 0-48.4" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Pagination;
