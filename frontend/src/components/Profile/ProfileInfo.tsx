"use client";

import React from "react";
import { atom, useAtom } from "jotai";
import useSWR from "swr";
import { Play, Activity } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { axiosInstance } from "@/lib/axios/axiosConfig";

// Атом для состояния аутентификации
export const authAtom = atom<{
  isAuthenticated: boolean;
  user: { username: string; nickname?: string; user_avatar?: string; banner?: string; isPro?: boolean } | null;
}>({
  isAuthenticated: false,
  user: null,
});

/**
 * Интерфейс данных профиля
 * @interface ProfileInfoData
 */
interface ProfileInfoData {
  username: string;
  nickname?: string;
  joinedDate?: string;
  location?: string;
  isVerified?: boolean;
  currentAnime?: string; 
  userLevel?: string;
  userStatus?: string; 
  activityCount?: number; 
}

/**
 * Пропсы компонента ProfileInfo
 * @interface ProfileInfoProps
 */
interface ProfileInfoProps {
  username: string;
  nickname?: string;
  joinedDate?: string;
  location?: string;
  isVerified?: boolean;
  isLoading?: boolean;
}

/**
 * Компонент информации о профиле
 * @description Отображает информацию о пользователе, включая ник, статус и текущую активность
 * @param {ProfileInfoProps} props - Пропсы компонента
 * @returns {JSX.Element}
 */
export const ProfileInfo: React.FC<ProfileInfoProps> = React.memo(
  ({ username, nickname, joinedDate, location, isVerified = false, isLoading = false }) => {
    const [auth] = useAtom(authAtom);

    // Загрузка дополнительных данных профиля через SWR
    const { data: profileData, error } = useSWR<ProfileInfoData>(
      `/api/profile/${username}/info`,
      (url) => axiosInstance.get(url).then((res) => res.data),
      { revalidateOnFocus: false }
    );

    if (isLoading || !auth.isAuthenticated) {
      return (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-48 bg-white/5 rounded animate-pulse" />
          <Skeleton className="h-5 w-32 bg-white/5 rounded animate-pulse" />
        </div>
      );
    }

    if (error) {
      return <div className="text-red-500">Ошибка загрузки информации</div>;
    }

    const displayUsername = nickname || username;
    const currentAnime = profileData?.currentAnime || "Магическая битва 2";
    const userLevel = profileData?.userLevel || "Новичок";
    const userStatus = profileData?.userStatus || (auth.user?.isPro ? "PRO" : undefined);
    const activityCount = profileData?.activityCount || 42;

    return (
      <div className="flex flex-col gap-4">
        {/* Текущая активность */}
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-2 py-1.5 rounded-lg">
            <Play className="w-4 h-4 text-[#CCBAE4]" />
            <span className="text-white/70">Смотрит</span>
            <span className="text-white font-medium">{currentAnime}</span>
          </div>
        </div>

        {/* Статусы пользователя */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 bg-white/[0.03] rounded-full text-[13px] text-white/70 flex items-center gap-1.5">
            <span>{userLevel}</span>
          </div>
          {userStatus && (
            <div className="px-3 py-1.5 bg-[#FDE5B9] rounded-full text-[13px] text-black font-medium">
              {userStatus}
            </div>
          )}
          <div className="px-3 py-1.5 bg-white/[0.03] rounded-full text-[13px] text-white/70 flex items-center gap-1.5">
            <Activity className="w-4 h-4" />
            <span>{activityCount} действия</span>
          </div>
        </div>
      </div>
    );
  }
);

ProfileInfo.displayName = "ProfileInfo";
export default ProfileInfo;