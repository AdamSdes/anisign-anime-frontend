"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { mergeClass } from "@/lib/utils/mergeClass";
import {
  Image as ImageIcon,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Grid,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

// Пропсы компонента скриншотов
interface ScreenshotsProps {
  screenshots: string[];
}

/**
 * Компонент для отображения и управления скриншотами аниме
 * @param props Пропсы компонента
 */
export const Screenshots: React.FC<ScreenshotsProps> = React.memo(({ screenshots }) => {
  const validScreenshots = React.useMemo(() => screenshots?.filter(Boolean) || [], [screenshots]);
  const totalImages = validScreenshots.length;

  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState<number | null>(null);
  const [isImageLoading, setIsImageLoading] = React.useState(true);
  const [isGalleryView, setIsGalleryView] = React.useState(false);

  if (totalImages === 0) return null;

  // Переход к следующему изображению
  const handleNext = React.useCallback(() => {
    if (selectedImageIndex !== null) {
      setIsImageLoading(true);
      setSelectedImageIndex((selectedImageIndex + 1) % totalImages);
    }
  }, [selectedImageIndex, totalImages]);

  // Переход к предыдущему изображению
  const handlePrev = React.useCallback(() => {
    if (selectedImageIndex !== null) {
      setIsImageLoading(true);
      setSelectedImageIndex(
        selectedImageIndex === 0 ? totalImages - 1 : selectedImageIndex - 1
      );
    }
  }, [selectedImageIndex, totalImages]);

  //  Обработка нажатий клавиш для навигации
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") setSelectedImageIndex(null);
    },
    [handleNext, handlePrev]
  );

  //  Открытие галереи
  const openGallery = React.useCallback(() => {
    setIsGalleryView(true);
    setSelectedImageIndex(0);
  }, []);

  // Закрытие диалога
  const closeDialog = React.useCallback(() => {
    setSelectedImageIndex(null);
    setIsGalleryView(false);
  }, []);

  return (
    <section className="w-full space-y-6 mb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-white/60" />
          <h3 className="text-[16px] font-semibold">Скриншоты</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/40">Всего {totalImages} изображений</span>
          <div className="h-4 w-[1px] bg-white/10" />
          <Button
            variant="ghost"
            size="sm"
            onClick={openGallery}
            className="text-sm text-white/60 hover:text-white/90"
          >
            <ZoomIn className="w-4 h-4 mr-2" />
            Открыть галерею
          </Button>
        </div>
      </div>

      {/* Screenshots Grid */}
      <div className="relative isolate">
        <div className="grid grid-cols-5 gap-3">
          {validScreenshots.slice(0, 5).map((screenshot, index) => (
            <motion.div
              key={index}
              className="relative aspect-video group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setSelectedImageIndex(index)}
            >
              <div className="relative w-full h-full overflow-hidden rounded-xl bg-white/[0.02] border border-white/5">
                <Image
                  src={screenshot}
                  alt={`Скриншот ${index + 1}`}
                  fill
                  priority={index === 0}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-xs text-white/80 font-medium">
                      Скриншот {index + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={selectedImageIndex !== null} onOpenChange={closeDialog}>
        <DialogContent
          className={mergeClass(
            "max-w-[95vw] max-h-[95vh] p-0 border-none",
            isGalleryView ? "bg-[#060606]/95 backdrop-blur-xl" : "bg-transparent"
          )}
          onKeyDown={handleKeyDown}
        >
          <DialogTitle className="sr-only">Просмотр скриншотов</DialogTitle>
          <DialogDescription className="sr-only">
            Галерея скриншотов из аниме
          </DialogDescription>

          {/* Modal Header */}
          <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsGalleryView(!isGalleryView)}
                className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white"
              >
                <Grid className="w-5 h-5" />
              </Button>
              <span className="text-white/90 text-sm font-medium">
                {isGalleryView
                  ? "Галерея"
                  : `Скриншот ${selectedImageIndex! + 1} из ${validScreenshots.length}`}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white"
              onClick={closeDialog}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {isGalleryView ? (
            // Gallery Grid View
            <div className="pt-20 px-6 pb-6 h-[90vh]">
              <div className="grid grid-cols-3 gap-4 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20 pr-2">
                {validScreenshots.map((screenshot, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative aspect-video cursor-pointer group"
                    onClick={() => {
                      setSelectedImageIndex(index);
                      setIsGalleryView(false);
                    }}
                  >
                    <div className="relative w-full h-full overflow-hidden rounded-xl bg-white/[0.02] border border-white/5">
                      <Image
                        src={screenshot}
                        alt={`Скриншот ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                          <span className="text-xs text-white/80 font-medium">
                            Скриншот {index + 1}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            // Single Image View
            <>
              <div className="absolute inset-0 flex items-center justify-between z-40 px-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrev}
                  className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNext}
                  className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </div>
              {selectedImageIndex !== null && validScreenshots[selectedImageIndex] && (
                <div className="relative w-full h-[90vh] flex items-center justify-center bg-black/80 backdrop-blur-sm">
                  {isImageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="w-10 h-10 border-4 border-white/10 border-t-white/60 rounded-full animate-spin" />
                    </div>
                  )}
                  <Image
                    src={validScreenshots[selectedImageIndex]}
                    alt={`Скриншот ${selectedImageIndex + 1}`}
                    fill
                    className="object-contain"
                    onLoadingComplete={() => setIsImageLoading(false)}
                    priority
                  />
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
});
Screenshots.displayName = "Screenshots";