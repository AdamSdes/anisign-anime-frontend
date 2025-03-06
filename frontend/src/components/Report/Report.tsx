"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { mergeClass } from "@/lib/utils/mergeClass";
import { HiOutlineLightBulb } from "react-icons/hi";
import { AlertCircle } from "lucide-react";
import { ReportModal } from "./report-modal";

// Пропсы компонента Report
export interface ReportProps {
  className?: string;
}

/**
 * Компонент баннера для сообщения о проблемах
 * @param props Пропсы компонента
 */
export const Report: React.FC<ReportProps> = React.memo(({ className }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Открытие модального окна
  const openModal = React.useCallback(() => setIsModalOpen(true), []);

  // Закрытие модального окна
  const closeModal = React.useCallback(() => setIsModalOpen(false), []);

  return (
    <>
      <div className={mergeClass("bg-[rgba(255,255,255,0.02)] border-b border-white/5", className)}>
        <div className="container mx-auto px-4 py-4 sm:py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-lg bg-white/5">
              <HiOutlineLightBulb className="w-5 h-5 text-white/60" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] text-white/80 leading-relaxed">
                Сайт находится в бета-версии. Если вы нашли баг, пожалуйста, сообщите нам об этом.
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full sm:w-auto h-[50px] px-6 rounded-xl border border-white/5 hover:bg-white/[0.04] text-white/60 hover:text-white transition-all gap-2"
            onClick={openModal}
          >
            <AlertCircle className="w-4 h-4" />
            <span>Сообщить о проблеме</span>
          </Button>
        </div>
      </div>
      <ReportModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
});
Report.displayName = "Report";