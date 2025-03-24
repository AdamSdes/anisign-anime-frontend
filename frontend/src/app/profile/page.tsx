'use client';

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/header/Header";
import { Report } from "@/components/report/report";
import Footer from "@/components/footer/Footer";
import ProfileHeader from "@/components/profile/ProfileHeader";
import Statistics from "@/components/profile/Statistics";
import AnimeList from "@/components/profile/AnimeList";
import History from "@/components/profile/History";
import ProfileFriends from "@/components/profile/ProfileFriends";
import { useAtom } from "jotai";
import { isAuthenticatedAtom, userAtom } from "@/lib/atom/authAtom";
import { useSetAtom } from "jotai";
import { setAvatarAtom } from "@/lib/atom/userAtom";

interface ProfileData {
  id: string;
  username: string;
  nickname?: string;
  user_avatar: string | null;
  user_banner: string | null;
}

const ProfilePage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [currentUser] = useAtom(userAtom);
  const setAvatar = useSetAtom(setAvatarAtom);

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const username = useMemo(() => {
    if (!params?.username) return null;
    let rawUsername = Array.isArray(params.username) ? params.username[0] : params.username;
    rawUsername = rawUsername.trim();
    return rawUsername.startsWith("@") ? rawUsername.slice(1) : rawUsername;
  }, [params?.username]);

  const fetchUserProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    if (!username) {
      if (isAuthenticated && currentUser?.username) {
        router.push(`/profile/${currentUser.username}`);
        return;
      } else {
        setError("Пожалуйста, укажите корректное имя пользователя");
        setIsLoading(false);
        return;
      }
    }
    try {
      const response = await fetch(`http://localhost:8000/user/get-user-by-username/${encodeURIComponent(username)}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        cache: 'no-cache'
      });
      if (!response.ok) {
        throw new Error(`Ошибка сервера (${response.status}): ${response.statusText}`);
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Сервер вернул некорректный ответ");
      }
      const userData: ProfileData = await response.json();
      if (!userData.username) throw new Error("Данные пользователя некорректны");
      setProfileData(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка при загрузке профиля");
    } finally {
      setIsLoading(false);
    }
  }, [username, isAuthenticated, currentUser, router]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    if (profileData?.user_avatar && isAuthenticated && currentUser?.username === profileData.username) {
      setAvatar(profileData.user_avatar);
    }
  }, [profileData, isAuthenticated, currentUser, setAvatar]);

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!profileData) return <div>Профиль не найден</div>;

  return (
    <>
      <Header />
      <Report />
      <ProfileHeader
        username={profileData.username}
        nickname={profileData.nickname || profileData.username}
        avatar={profileData.user_avatar || ''}
        banner={profileData.user_banner || ''}
        isOwnProfile={isAuthenticated && currentUser?.username === profileData.username}
        isLoading={false}
        refetchUser={fetchUserProfile}
      />
      <div className="container mx-auto px-4 pb-10 flex-1">
        <div className="mt-20 grid grid-cols-1 min-[1000px]:grid-cols-[1fr_1px_373px] gap-[43px]">
          <div className="space-y-16 min-w-0">
            <Statistics />
            <AnimeList />
          </div>
          <div className="hidden min-[1000px]:block w-[1px] bg-white/5" />
          <div className="w-full min-[1020px]:w-[373px] space-y-16">
            <History userId={profileData.id.toString()} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
