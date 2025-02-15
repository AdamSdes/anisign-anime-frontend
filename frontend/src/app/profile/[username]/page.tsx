'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header/Header';
import Report from "@/components/Report/Report";
import Footer from '@/components/Footer/Footer';
import ProfileHeader from '@/components/Profile/ProfileHeader';
import Statistics from '@/components/Profile/Statistics';
import AnimeList from '@/components/Profile/AnimeList';
import History from '@/components/Profile/History';
import ProfileFriends from '@/components/Profile/ProfileFriends';
import { useAuthStore } from '@/hooks/useAuth';
import { axiosInstance } from '@/lib/api/axiosConfig';
import { toast } from 'sonner';

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

interface ProfileError {
    status: number;
    message: string;
}

const ProfilePage = () => {
    const params = useParams();
    const username = params.username as string;
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [error, setError] = useState<ProfileError | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuthStore();
    const isOwnProfile = user?.username === username;

    const fetchProfileData = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const cleanUsername = username.replace('@', '');
            const response = await axiosInstance.get(`/user/get-user-by-username/${cleanUsername}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('[ProfilePage] Received profile data:', response.data);
            setProfileData(response.data);
            setError(null);
        } catch (error) {
            if (error instanceof Error) {
                setError({ status: 404, message: error.message });
            } else {
                setError({ status: 500, message: 'Неизвестная ошибка' });
            }
            setProfileData(null);
        } finally {
            setIsLoading(false);
        }
    }, [username]);

    useEffect(() => {
        fetchProfileData();
    }, [fetchProfileData]);

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

    if (!profileData) {
        return (
            <div className="flex min-h-screen flex-col">
                <Header />
                <div className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl text-white/90 mb-4">Пользователь не найден</h1>
                        <p className="text-white/60">
                            Пользователь с именем @{username} не существует
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
            {profileData && (
                <ProfileHeader
                    username={profileData.username}
                    nickname={profileData.nickname}
                    avatar={profileData.user_avatar}
                    banner={profileData.user_banner}
                    isOwnProfile={isOwnProfile}
                    isLoading={isLoading}
                    refetchUser={fetchProfileData}
                />
            )}
            <div className="container mx-auto px-4 pb-10 flex-1">
                <div className="mt-20">
                    <div className="grid grid-cols-1 min-[1000px]:grid grid-cols-[1fr_1px_373px] gap-[43px]">
                        <div className="space-y-16 min-w-0">
                            <Statistics />
                            <AnimeList />
                        </div>
                        <div className="hidden min-[1000px]:block w-[1px] bg-white/5" />
                        <div className="w-full  min-[1020px]:w-[373px] space-y-16">
                            <ProfileFriends />
                            <History />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
};

export default ProfilePage;