"use client";

import React, { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { mergeClass } from "@/lib/utils/mergeClass";

// Интерфейс пропсов компонента Pagination
interface PaginationProps {
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void; 
  className?: string; 
}

/**
 * Компонент пагинации
 * @description Отображает элементы управления пагинацией с поддержкой ввода номера страницы
 * @param {PaginationProps} props - Пропсы компонента
 */
export const Pagination: React.FC<PaginationProps> = React.memo(
  ({ currentPage, totalPages, onPageChange, className = "" }) => {
    const [inputPage, setInputPage] = useState<string>("");
    const [editingDots, setEditingDots] = useState<number | null>(null);

    /**
     * Обработчик нажатия клавиш в поле ввода
     * @param e - Событие клавиатуры
     * @param position - Позиция многоточия в массиве страниц
     */
    const handleInputKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>, position: number) => {
        if (e.key === "Enter") {
          const page = parseInt(inputPage);
          if (!isNaN(page) && page > 0 && page <= totalPages) {
            onPageChange(page);
          }
          setEditingDots(null);
          setInputPage("");
        } else if (e.key === "Escape") {
          setEditingDots(null);
          setInputPage("");
        }
      },
      [inputPage, totalPages, onPageChange]
    );

    /**
     * Обработчик изменения значения в поле ввода
     * @param e - Событие изменения ввода
     */
    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        if (
          value === "" ||
          (parseInt(value) <= totalPages &&
            value.length <= totalPages.toString().length)
        ) {
          setInputPage(value);
        }
      },
      [totalPages]
    );

    //  Обработчик потери фокуса поля ввода
    const handleInputBlur = useCallback(() => {
      setEditingDots(null);
      setInputPage("");
    }, []);

    /**
     * Генерация массива номеров страниц с многоточиями
     * @returns Массив страниц и многоточий
     */
    const getPageNumbers = useCallback(() => {
      const delta = 2;
      const range: (number | "...")[] = [];
      const rangeWithDots: (number | "...")[] = [];

      range.push(1);

      for (
        let i = Math.max(2, currentPage - delta);
        i <= Math.min(totalPages - 1, currentPage + delta);
        i++
      ) {
        range.push(i);
      }

      if (totalPages > 1) {
        range.push(totalPages);
      }

      let prev = 0;
        for (const item of range) {
            if (prev) {
                if (typeof item === 'number' && typeof prev === 'number') {
                    if (item - prev === 2) {
                        rangeWithDots.push(prev + 1);
                    } else if (item - prev !== 1) {
                        rangeWithDots.push("...");
                    }
                }
            }
            rangeWithDots.push(item);
            if (typeof item === 'number') {
                prev = item;
            }
        }
      return rangeWithDots;
    }, [currentPage, totalPages]);

    return (
      <div className={mergeClass("flex items-center gap-2", className)}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={mergeClass(
            "inline-flex items-center justify-center",
            "h-10 w-20",
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
          Назад
        </button>

        {getPageNumbers().map((pageNumber, index) =>
          pageNumber === "..." ? (
            editingDots === index ? (
              <input
                key={`dots-input-${index}`}
                type="text"
                value={inputPage}
                onChange={handleInputChange}
                onKeyDown={(e) => handleInputKeyDown(e, index)}
                onBlur={handleInputBlur}
                className={mergeClass(
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
                className={mergeClass(
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
              className={mergeClass(
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
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={mergeClass(
            "inline-flex items-center justify-center",
            "h-10 w-20",
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
          Вперёд
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  }
);

Pagination.displayName = "Pagination";

export default Pagination;