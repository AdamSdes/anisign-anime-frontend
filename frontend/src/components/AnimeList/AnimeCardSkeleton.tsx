const AnimeCardSkeleton = () => {
    return (
        <div className="group relative">
            {/* Score Badge */}
            <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-black backdrop-blur-sm rounded-full px-2.5 py-1">
                <div className="w-3.5 h-3.5 bg-white/[0.06] rounded-full" />
                <div className="w-8 h-3.5 bg-white/[0.06] rounded-full" />
            </div>

            {/* Image Container */}
            <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-white/[0.02] border border-white/5">
                <div className="absolute inset-0 animate-pulse bg-white/[0.02]" />
            </div>

            {/* Info */}
            <div className="mt-3 space-y-1">
                {/* Title */}
                <div className="space-y-1">
                    <div className="h-4 w-[80%] bg-white/[0.02] border border-white/5 rounded-md animate-pulse" />
                    <div className="h-4 w-[60%] bg-white/[0.02] border border-white/5 rounded-md animate-pulse" />
                </div>
                
                {/* Additional Info */}
                <div className="flex items-center text-xs gap-2">
                    {/* Kind */}
                    <div className="h-3 w-14 bg-white/[0.02] border border-white/5 rounded-full animate-pulse" />
                    {/* Dot */}
                    <div className="w-1 h-1 rounded-full bg-white/20" />
                    {/* Year */}
                    <div className="h-3 w-8 bg-white/[0.02] border border-white/5 rounded-full animate-pulse" />
                    {/* Dot */}
                    <div className="w-1 h-1 rounded-full bg-white/20" />
                    {/* Episodes */}
                    <div className="h-3 w-12 bg-white/[0.02] border border-white/5 rounded-full animate-pulse" />
                </div>
            </div>
        </div>
    )
}

export default AnimeCardSkeleton
