'use client';
import React, { useEffect, useState } from 'react';
import { PlayCircle, History as HistoryIcon } from "lucide-react";
import { Button } from '../ui/button';
import { axiosInstance } from '@/lib/api/axiosConfig';
import { useRouter } from 'next/navigation';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

interface Anime {
    id: string;
    anime_id: string;
    english: string;
    russian: string;
    episodes: number;
    episodesAired: number;
    poster_url: string;
    kind: string;
}

interface ViewHistory {
    id: string;
    anime_id_list: string[];
    last_watched_at: string;
    is_finished: boolean | null;
    user_id: string;
}

interface HistoryResponse {
    user_view_history: ViewHistory[];
    animes: Anime[];
}

const getKindText = (kind: string) => {
    const kinds = {
        tv: 'TV Сериал',
        movie: 'Фильм',
        ova: 'OVA',
        ona: 'ONA',
        special: 'Спешл',
        music: 'Клип',
    };
    return kinds[kind as keyof typeof kinds] || kind;
};

const truncateText = (text: string, maxLength: number = 21) => {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
};

const History = ({ userId }: { userId: string }) => {
    const router = useRouter();
    const [historyData, setHistoryData] = useState<HistoryResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!userId) {
                setError('User ID is required');
                setIsLoading(false);
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const response = await axiosInstance.post(`/viewhistory/get-view-history-of-user/${userId}`, null, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log('History response:', response.data);
                setHistoryData(response.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch history');
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, [userId]);

    if (isLoading) return <div className="text-white/40">Загрузка...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!historyData?.user_view_history.length) return <div className="text-white/40">История просмотров пуста</div>;

    const uniqueAnimeIds = [...new Set(historyData.user_view_history[0].anime_id_list)].reverse();
    console.log('Unique anime IDs:', uniqueAnimeIds);

    const historyItems = uniqueAnimeIds.map(animeId => {
        const anime = historyData.animes.find(a => a.id === animeId);
        if (!anime) return null;

        return {
            id: anime.id,
            anime_id: anime.anime_id,
            title: truncateText(anime.russian || anime.english),
            episodes: `${anime.episodesAired}/${anime.episodes}`,
            image: anime.poster_url,
            kind: getKindText(anime.kind)
        };
    }).filter(Boolean);

    const HistoryItem = ({ item }: { item: any }) => (
        <div 
            className="bg-[rgba(255,255,255,0.02)] border border-white/5 rounded-[14px] p-3 hover:bg-[rgba(255,255,255,0.04)] transition-all duration-300 cursor-pointer group w-full"
            onClick={() => router.push(`/anime/${item?.anime_id}`)}
        >
            <div className="flex flex-col sm:flex-row gap-4 w-full">
                <div className="relative shrink-0">
                    <img 
                        src={item?.image}
                        alt={item?.title}
                        className="w-full sm:w-[100px] h-[60px] object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayCircle className="w-8 h-8 text-white drop-shadow-lg" />
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-[14px] font-medium text-white/90 group-hover:text-white transition-colors duration-300 truncate">
                        {item?.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="px-3 py-1 h-fit rounded-full bg-[rgba(255,255,255,0.05)] text-[12px] text-white/60">
                            {item?.episodes}
                        </div>
                        <span className="text-[12px] text-white/40">
                            {item?.kind}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col w-full">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <HistoryIcon className="w-5 h-5 text-white/40" />
                    <h2 className="text-white/80 text-sm font-medium">История просмотров</h2>
                    <span className="text-white/40 text-sm">({historyItems.length})</span>
                </div>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button 
                            variant="ghost" 
                            className="text-xs text-white/40 hover:text-white/60 transition-colors"
                        >
                            Показать всё
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="bg-[#0A0A0A] border-l border-white/5 overflow-y-auto">
                        <SheetHeader className="mb-6">
                            <div className="flex items-center gap-2">
                                <HistoryIcon className="w-5 h-5 text-white/40" />
                                <SheetTitle className="text-white/90 text-left">История просмотров</SheetTitle>
                                <span className="text-white/40 text-sm">({historyItems.length})</span>
                            </div>
                        </SheetHeader>
                        <div className="grid gap-3 pr-6 pb-20">
                            {historyItems.map((item, index) => (
                                <HistoryItem key={`${item?.id}-${index}-sheet`} item={item} />
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="grid gap-3">
                {historyItems.slice(0, 5).map((item, index) => (
                    <HistoryItem key={`${item?.id}-${index}`} item={item} />
                ))}
            </div>
        </div>
    );
};

export default History;
