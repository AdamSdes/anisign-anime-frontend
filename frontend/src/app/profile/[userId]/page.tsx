"use client";

import React, { useCallback } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/header/Header";
import { Report } from "@/components/report/report";
import Footer from "@/components/footer/Footer";
import ProfileHeader from "@/components/profile/ProfileHeader";
import Statistics from "@/components/profile/Statistics";
import AnimeList from "@/components/anime-list/AnimeList";
import History from "@/components/profile/History";
import ProfileFriends from "@/components/profile/ProfileFriends";
import { atom, useAtom } from "jotai";
import useSWR from "swr";
import { axiosInstance } from "@/lib/axios/axiosConfig";

// Атом для состояния аутентификации (из предыдущих файлов)
export const authAtom = atom<{
  isAuthenticated: boolean;
  user: { id: string; username: string; nickname?: string; user_avatar?: string; isPro?: boolean } | null;
}>({
  isAuthenticated: false,
  user: null,
});

/**
 * Интерфейс данных профиля
 * @interface ProfileData
 */
interface ProfileData {
  id: string;
  username: string;
  email: string;
  user_avatar?: string;
  user_banner?: string;
  nickname?: string;
  isVerified: boolean;
  joinedDate: string;
}

/**
 * Компонент страницы профиля
 * @description Отображает профиль пользователя с данными, статистикой, списками и историей
 * @returns {JSX.Element}
 */
const ProfilePage: React.FC = React.memo(() => {
  const { username } = useParams();
  const cleanUsername = (Array.isArray(username) ? username[0] : username)?.replace("@", "");
  const [auth] = useAtom(authAtom);
  const isOwnProfile = auth?.user?.username === cleanUsername;

  // SWR для загрузки данных профиля
  const {
    data: profileData,
    error,
    isLoading,
    mutate: refetchUser,
  } = useSWR<ProfileData>(
    cleanUsername ? `/user/get-user-by-username/${cleanUsername}` : null,
    (url) =>
      axiosInstance
        .get(url, {
          headers: auth?.isAuthenticated
            ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
            : undefined,
        })
        .then((res: { data: any; }) => res.data),
    { revalidateOnFocus: false }
  );

  const fetchProfileData = useCallback(() => refetchUser(), [refetchUser]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-white/60">Загрузка...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl text-white/90 mb-4">Пользователь не найден</h1>
            <p className="text-white/60">
              Пользователь с именем @{cleanUsername} не существует
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <Report />
      <ProfileHeader
        username={profileData.username}
        nickname={profileData.nickname}
        avatar={profileData.user_avatar}
        banner={profileData.user_banner}
        isOwnProfile={isOwnProfile}
        isLoading={isLoading}
        refetchUser={fetchProfileData}
      />
      <div className="container mx-auto px-4 pb-10 flex-1">
        <div className="mt-20">
          <div className="grid grid-cols-1 min-[1000px]:grid-cols-[1fr_1px_373px] gap-[43px]">
            <div className="space-y-16 min-w-0">
              <Statistics />
              <AnimeList />
            </div>
            <div className="hidden min-[1000px]:block w-[1px] bg-white/5" />
            <div className="w-full min-[1020px]:w-[373px] space-y-16">
              <ProfileFriends />
              <History userId={profileData.id} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
});

ProfilePage.displayName = "ProfilePage";
export default ProfilePage;