import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AnimeDetailsSkeleton() {
    return (
        <div className="flex flex-col lg:flex-row gap-8 relative">
            {/* Left Column */}
            <div className="flex flex-col gap-6 lg:sticky lg:top-24 h-fit">
                <Skeleton className="w-[225px] h-[318px] rounded-lg" />
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>

            {/* Right Column */}
            <div className="flex-1 space-y-6">
                <Skeleton className="h-8 w-3/4" />
                <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                </div>
                <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-6 w-20" />
                    ))}
                </div>
            </div>
        </div>
    );
}
