import React, { useState } from 'react'
import { cn } from '@/lib/utils'

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    removeWrapper?: boolean
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
    ({ className, src, alt, removeWrapper, ...props }, ref) => {
        const [isLoading, setIsLoading] = useState(true)
        const [hasError, setHasError] = useState(false)

        const imageClasses = cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoading && 'opacity-0',
            !isLoading && 'opacity-100',
            className
        )

        if (removeWrapper) {
            return (
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
                            setIsLoading(false)
                            setHasError(true)
                        }}
                        {...props}
                    />

                    {hasError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                            <span className="text-white/40">Изображение недоступно</span>
                        </div>
                    )}
                </>
            )
        }

        return (
            <div className="relative w-full h-full">
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
                        setIsLoading(false)
                        setHasError(true)
                    }}
                    {...props}
                />

                {hasError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                        <span className="text-white/40">Изображение недоступно</span>
                    </div>
                )}
            </div>
        )
    }
)

Image.displayName = 'Image'

export { Image }
