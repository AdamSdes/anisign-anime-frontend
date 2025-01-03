import React from 'react';
import { Avatar } from "@/components/ui/avatar";
import Link from 'next/link';
import { Clock, ExternalLink, MessageCircle, Heart } from "lucide-react";

const RecentComment = ({ comment }) => {
    return (
        <div className="relative flex flex-col h-full p-6 rounded-[14px] border border-white/5 hover:border-white/10 transition-all">

            <div className="flex items-start gap-4 justify-between">
                <div className='flex items-center gap-3'>
                    <img
                        src={comment.author.avatar}
                        className="w-11 h-11 rounded-full"
                    />
                    <span className="font-semibold text-[15px] text-white/90 truncate pr-2">
                        {comment.author.name}
                    </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    {/* Hearts counter */}
                    <div className="flex items-center gap-1.5 text-[11px] text-white/40">
                        <Heart className="w-3 h-3" />
                        <span>{comment.hearts || 0}</span>
                    </div>
                    {/* Time */}
                    <div className="flex items-center gap-1.5 text-[11px] text-white/40 bg-white/[0.03] px-2 py-1 rounded-full">
                        <Clock className="w-3 h-3" />
                        {comment.date}
                    </div>
                </div>
            </div>

            {/* Comment content with left accent */}
            <div className="relative mt-[30px] pl-4">
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/5" />
                <p className="text-[14px] text-white/70 line-clamp-3 leading-relaxed">
                    {comment.content}
                </p>
            </div>

            {/* Anime link with icon accent */}
            <div className="mt-auto pt-[30px] flex items-center justify-between">
                <Link
                    href={`/anime/${comment.animeId}`}
                    className="flex items-center gap-2 group"
                >
                    <MessageCircle className="w-4 h-4 text-[#CCBAE4]/70 group-hover:text-[#CCBAE4] transition-colors" />
                    <span className="text-xs text-white/50 group-hover:text-white/80 transition-colors truncate">
                        {comment.animeName}
                    </span>
                </Link>
                <span className="text-[10px] text-white/30 tabular-nums">#{comment.id}</span>
            </div>
        </div>
    );
};

export const RecentComments = () => {
    // Это моковые данные для примера
    const recentComments = [
        {
            id: 1,
            author: {
                name: "roma_chmo",
                avatar: "https://i.pinimg.com/originals/9e/18/8c/9e188c30a388a0073581d2cea5bb1378.gif"
            },
            content: "Очень интересное аниме! Особенно понравилась анимация в последней серии.",
            date: "5 м.",
            hearts: 12, // Add hearts count
            animeId: "1",
            animeName: "Демон против проклятий"
        },
        {
            id: 2,
            author: {
                name: "adams",
                avatar: "https://i.pinimg.com/736x/b4/7f/8b/b47f8b3896d83210eac9f349f46167bd.jpg"
            },
            content: "Сюжет немного предсказуемый, но смотреть интересно.",
            date: "15 м.",
            hearts: 8, // Add hearts count
            animeId: "2",
            animeName: "Синий оркестр"
        },
        {
            id: 3,
            author: {
                name: "vulkan-lowtab",
                avatar: "https://i.pinimg.com/736x/4e/d3/a2/4ed3a293e68a75742f0cc09fe2e3224b.jpg"
            },
            content: "Отличная рисовка и музыкальное сопровождение!",
            date: "30 м.",
            hearts: 5, // Add hearts count
            animeId: "3",
            animeName: "Магическая битва"
        },

    ];

    return (
        <div className="w-full">
            <div className="container px-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recentComments.map(comment => (
                        <RecentComment key={comment.id} comment={comment} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecentComments;
