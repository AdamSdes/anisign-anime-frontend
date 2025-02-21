'use client'
import React, { useState, KeyboardEvent } from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    className?: string
}

const Pagination: React.FC<PaginationProps> = ({ 
    currentPage, 
    totalPages,
    onPageChange,
    className = ""
}) => {
    const [inputPage, setInputPage] = useState<string>('')
    const [editingDots, setEditingDots] = useState<number | null>(null)

    const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>, position: number) => {
        if (e.key === 'Enter') {
            const page = parseInt(inputPage)
            if (!isNaN(page) && page > 0 && page <= totalPages) {
                onPageChange(page)
            }
            setEditingDots(null)
            setInputPage('')
        } else if (e.key === 'Escape') {
            setEditingDots(null)
            setInputPage('')
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '')
        if (value === '' || (parseInt(value) <= totalPages && value.length <= totalPages.toString().length)) {
            setInputPage(value)
        }
    }

    const handleInputBlur = () => {
        setEditingDots(null)
        setInputPage('')
    }

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

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={cn(
                    "inline-flex items-center justify-center",
                    "h-10 w-10",
                    "rounded-xl text-sm font-medium",
                    "transition-colors duration-200",
                    "border border-white/10",
                    "bg-white/[0.02]",
                    "text-white/60 hover:text-white",
                    "hover:bg-white/[0.04] active:bg-white/[0.08]",
                    "disabled:opacity-40 disabled:cursor-not-allowed"
                )}
                aria-label="Previous page"
            >
                <ChevronLeft className="h-4 w-4" />
            </button>

            {getPageNumbers().map((pageNumber, index) => (
                pageNumber === '...' ? (
                    editingDots === index ? (
                        <input
                            key={`dots-input-${index}`}
                            type="text"
                            value={inputPage}
                            onChange={handleInputChange}
                            onKeyDown={(e) => handleInputKeyDown(e, index)}
                            onBlur={handleInputBlur}
                            className={cn(
                                "h-10 w-14",
                                "rounded-xl text-sm font-medium text-center",
                                "border border-white/10",
                                "bg-white/[0.04]",
                                "text-white placeholder-white/40",
                                "focus:outline-none focus:border-white/20",
                                "transition-colors duration-200"
                            )}
                            placeholder="..."
                            autoFocus
                        />
                    ) : (
                        <button
                            key={`dots-${index}`}
                            onClick={() => setEditingDots(index)}
                            className={cn(
                                "inline-flex items-center justify-center",
                                "h-10 w-10",
                                "rounded-xl text-sm font-medium",
                                "transition-colors duration-200",
                                "border border-white/10",
                                "bg-white/[0.02]",
                                "text-white/60 hover:text-white",
                                "hover:bg-white/[0.04]"
                            )}
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </button>
                    )
                ) : (
                    <button
                        key={`page-${pageNumber}`}
                        onClick={() => onPageChange(Number(pageNumber))}
                        className={cn(
                            "inline-flex items-center justify-center",
                            "h-10 w-10",
                            "rounded-xl text-sm font-medium",
                            "transition-colors duration-200",
                            "border border-white/10",
                            "bg-white/[0.02]",
                            "text-white/60 hover:text-white",
                            "hover:bg-white/[0.04] active:bg-white/[0.08]",
                            currentPage === pageNumber && "bg-white/10 text-white"
                        )}
                        aria-label={`Go to page ${pageNumber}`}
                    >
                        {pageNumber}
                    </button>
                )
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={cn(
                    "inline-flex items-center justify-center",
                    "h-10 w-10",
                    "rounded-xl text-sm font-medium",
                    "transition-colors duration-200",
                    "border border-white/10",
                    "bg-white/[0.02]",
                    "text-white/60 hover:text-white",
                    "hover:bg-white/[0.04] active:bg-white/[0.08]",
                    "disabled:opacity-40 disabled:cursor-not-allowed"
                )}
                aria-label="Next page"
            >
                <ChevronRight className="h-4 w-4" />
            </button>
        </div>
    )
}

export default Pagination
