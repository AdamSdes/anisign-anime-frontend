"use client";

import React, { useCallback } from "react";
import { atom, useAtom } from "jotai";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios/axiosConfig"
import ProfileBanner from "./ProfileBanner";
import ProfileAvatar from "./ProfileAvatar";
import ProfileInfo from "./ProfileInfo";
import ProfileActions from "./ProfileActions";
import { FileUploadDialog } from "@/components/ui/file-upload-dialog";

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
 * @interface ProfileData
 */
interface ProfileData {
  username: string;
  nickname?: string;
  avatar?: string;
  banner?: string;
  joinedDate?: string;
  location?: string;
  isVerified?: boolean;
}

/**
 * Пропсы компонента ProfileHeader
 * @interface ProfileHeaderProps
 */
interface ProfileHeaderProps {
  username: string;
  avatar?: string;
  banner?: string;
  nickname?: string;
  isOwnProfile: boolean;
  isLoading: boolean;
  refetchUser: () => Promise<any>;
}

/**
 * Компонент заголовка профиля
 * @description Отображает баннер, аватар, информацию и действия пользователя
 * @param {ProfileHeaderProps} props - Пропсы компонента
 * @returns {JSX.Element}
 */
export const ProfileHeader: React.FC<ProfileHeaderProps> = React.memo(
  ({ username, isOwnProfile }) => {
    const [auth] = useAtom(authAtom);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = React.useState(false);

    // Загрузка данных профиля через SWR
    const { data: profileData, error, isLoading } = useSWR<ProfileData>(
      `/api/profile/${username}`,
      (url) => axiosInstance.get(url).then((res) => res.data),
      { revalidateOnFocus: false }
    );

    // Функция обновления данных профиля
    const refetchUser = useCallback(async () => {
      await mutate(`/api/profile/${username}`);
    }, [username]);

    // Обработчик загрузки баннера
    const handleBannerUpload = async (files: File[]) => {
      if (files.length === 0) return;

      try {
        const formData = new FormData();
        formData.append("banner", files[0]);
        const response = await axiosInstance.post("/api/profile/update-banner", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        await refetchUser();
        toast.success("Баннер успешно обновлен");
      } catch (error: any) {
        toast.error(error.response?.data?.detail || "Ошибка при загрузке баннера");
      } finally {
        setIsUploadDialogOpen(false);
      }
    };

    if (isLoading) return <div className="text-white/40">Загрузка...</div>;
    if (error) return <div className="text-red-500">Ошибка загрузки профиля</div>;

    return (
      <div className="relative">
        {/* Баннер */}
        <div className="absolute inset-x-0 top-0 w-full h-[350px]">
          <ProfileBanner
            banner={profileData?.banner}
            isOwnProfile={isOwnProfile}
            isLoading={isLoading}
            onUploadClick={() => setIsUploadDialogOpen(true)}
          />
        </div>

        {/* Основной контент */}
        <div className="container mx-auto px-4 sm:px-8 pb-4 max-w-[1450px] relative pt-[200px]">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-center sm:items-end">
            <div className="relative flex flex-col items-center justify-center w-[185px] h-[247px] gap-3 rounded-[14px] border border-white/5 overflow-hidden">
              <ProfileAvatar
                username={username}
                avatar={profileData?.avatar}
                nickname={profileData?.nickname}
                isOwnProfile={isOwnProfile}
                isLoading={isLoading}
                onAvatarUpdate={refetchUser}
              />
            </div>
            <div className="flex-1 flex flex-col sm:flex-row gap-4 items-center sm:items-end sm:justify-between w-full">
              <ProfileInfo
                username={username}
                nickname={profileData?.nickname}
                joinedDate={profileData?.joinedDate}
                location={profileData?.location}
                isVerified={profileData?.isVerified}
                isLoading={isLoading}
              />
              {isOwnProfile && <ProfileActions />}
            </div>
          </div>
        </div>

        {/* Диалог загрузки баннера */}
        <FileUploadDialog
            isOpen={isUploadDialogOpen}
            onClose={() => setIsUploadDialogOpen(false)}
            onUpload={handleBannerUpload}
            acceptedFileTypes={["image/jpeg", "image/png", "image/webp"]}
            maxFiles={1}
            maxSize={5 * 1024 * 1024} // 5MB
            title={""}        
        />
      </div>
    );
  }
);

ProfileHeader.displayName = "ProfileHeader";
export default ProfileHeader;