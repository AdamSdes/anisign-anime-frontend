"use client";

import React, { useCallback } from "react";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios/axiosConfig";
import { getBunnerUrl } from "@/lib/utils/banner";
import { Camera } from "lucide-react";
import { motion } from "framer-motion";
import { FileUploadDialog } from "@/components/ui/file-upload-dialog";
import { mutate } from "swr";

/**
 * Пропсы компонента ProfileBanner
 * @interface ProfileBannerProps
 */
interface ProfileBannerProps {
  banner?: string;
  isOwnProfile: boolean;
  isLoading?: boolean;
  onUploadClick: () => void;
}

/**
 * Компонент баннера профиля
 * @description Отображает баннер пользователя с возможностью загрузки нового изображения для владельца профиля
 * @param {ProfileBannerProps} props - Пропсы компонента
 * @returns {JSX.Element}
 */
export const ProfileBanner: React.FC<ProfileBannerProps> = React.memo(
  ({ banner, isOwnProfile, isLoading = false, onUploadClick }) => {
    const bannerUrl = getBunnerUrl(banner);

    // Обработчик загрузки баннера
    const handleBannerUpload = useCallback(
      async (files: File[]) => {
        if (files.length === 0) return;

        try {
          const formData = new FormData();
          formData.append("banner", files[0]);
          const response = await axiosInstance.post("/api/profile/update-banner", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          // Инвалидация кэша SWR после успешной загрузки
          await mutate(`/api/profile/${response.data.username}`);
          toast.success("Баннер успешно обновлен");
        } catch (error: any) {
          toast.error(error.response?.data?.detail || "Ошибка при загрузке баннера");
        } finally {
          onUploadClick(); 
        }
      },
      [onUploadClick]
    );

    return (
      <div className="relative w-full h-full">
        <div className="relative w-full h-full banner-background">
          {!bannerUrl && (
            <div className="w-full h-full bg-gradient-to-b from-white/[0.02] to-transparent" />
          )}

          {/* Кнопка загрузки баннера */}
          {isOwnProfile && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute z-10 top-5 right-6"
            >
              <motion.button
                onClick={onUploadClick}
                className="group flex items-center gap-3 px-5 py-3 bg-[#060606]/90 hover:bg-[#060606] border border-white/10 hover:border-white/20 rounded-xl backdrop-blur-xl transition-all duration-300"
              >
                <div className="p-2 rounded-lg transition-colors">
                  <Camera className="w-4 h-4 text-white/60 group-hover:text-white/90 transition-colors" />
                </div>
              </motion.button>
            </motion.div>
          )}

          <FileUploadDialog
                isOpen={false}
                onClose={() => { } }
                onUpload={handleBannerUpload}
                acceptedFileTypes={["image/jpeg", "image/png", "image/webp"]}
                maxFiles={1}
                maxSize={5 * 1024 * 1024} // 5MB
                title={""}          
            />
        </div>
      </div>
    );
  }
);

ProfileBanner.displayName = "ProfileBanner";
export default ProfileBanner;