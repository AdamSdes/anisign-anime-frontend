import React from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { MapPin, CalendarDays, UserRoundCheck, Play, Star, Activity } from "lucide-react";

interface ProfileInfoProps {
    username: string;
    nickname?: string;
    joinedDate?: string;
    location?: string;
    isVerified?: boolean;
    isLoading?: boolean;
    currentAnime?: string; // Текущее аниме, которое смотрит пользователь
    userLevel?: string; // Уровень пользователя (Новичок, Отаку и т.д.)
    userStatus?: string; // PRO, VIP и т.д.
    activityCount?: number; // Количество действий
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
    username,
    nickname,
    joinedDate,
    location,
    isVerified = false,
    isLoading = false,
}) => {
    if (isLoading) {
        return (
            <div className="flex flex-col gap-2">
                <div className="h-7 w-48 bg-white/5 rounded animate-pulse" />
                <div className="h-5 w-32 bg-white/5 rounded animate-pulse" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Текущая активность */}
            <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-2 py-1.5 rounded-lg">
                    <Play className="w-4 h-4 text-[#CCBAE4]" />
                    <span className="text-white/70">Смотрит</span>
                    <span className="text-white font-medium">Магическая битва 2</span>
                </div>
            </div>

            {/* Статусы пользователя */}
            <div className="flex flex-wrap items-center gap-2">
                <div className="px-3 py-1.5 bg-white/[0.03] rounded-full text-[13px] text-white/70 flex items-center gap-1.5">
                    <span>Новичок</span>
                </div>
                <div className="px-3 py-1.5 bg-[#FDE5B9] rounded-full text-[13px] text-black font-medium">
                    PRO
                </div>
                <div className="px-3 py-1.5 bg-white/[0.03] rounded-full text-[13px] text-white/70 flex items-center gap-1.5">
                    <Activity className="w-4 h-4" />
                    <span>42 действия</span>
                </div>
            </div>
        </div>
    );
};

export default ProfileInfo;
