import React, { useState } from "react";
import { mergeClass } from "@/lib/utils/mergeClass";
import { ImageProps } from "@/shared/types/image";

/**
 * Компонент изображения с индикацией загрузки и обработки ошибок
 * @param props Пропсы изображения
 */
export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ className, src, alt, removeWrapper, ...props }, ref) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const imageClasses = mergeClass(
      "w-full h-full object-cover transition-opacity duration-300",
      isLoading && "opacity-0",
      !isLoading && "opacity-100",
      className
    );

    const content = (
      <>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/5">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          </div>
        )}
        <img
          ref={ref}
          src={src}
          alt={alt}
          className={imageClasses}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          {...props}
        />
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/5">
            <span className="text-white/40">Изображение недоступно</span>
          </div>
        )}
      </>
    );

    return removeWrapper ? content : <div className="relative w-full h-full">{content}</div>;
  }
);
Image.displayName = "Image";