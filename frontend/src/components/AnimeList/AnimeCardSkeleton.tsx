import Image from 'next/image'

const AnimeCardSkeleton = () => {
    return (
        <div className="group relative">
            {/* Score Badge Skeleton */}
            <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-white/[0.02] rounded-full px-2.5 py-1 w-[60px]">
            </div>

            {/* Image Container Skeleton */}
            <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-white/[0.02]">
            </div>

            {/* Info Skeleton */}
            <div className="mt-3 space-y-1">
                {/* Title Skeleton */}
                <div className="w-full h-[20px] rounded-lg bg-white/[0.02]"></div>
                
                {/* Metadata Skeleton */}
                <div className="flex items-center gap-2">
                    <div className="w-[40px] h-[14px] rounded-lg bg-white/[0.02]"></div>
                    <div className="w-1 h-1 rounded-full bg-white/[0.02]"></div>
                    <div className="w-[30px] h-[14px] rounded-lg bg-white/[0.02]"></div>
                    <div className="w-1 h-1 rounded-full bg-white/[0.02]"></div>
                    <div className="w-[35px] h-[14px] rounded-lg bg-white/[0.02]"></div>
                </div>
            </div>
        </div>
    )
}

export default AnimeCardSkeleton
