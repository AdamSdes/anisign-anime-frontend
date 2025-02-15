'use client';

import React, { useEffect, useState } from 'react';
import { FileUploadDialog } from '@/components/ui/file-upload-dialog';
import { toast } from 'sonner';
import { useUploadBannerMutation } from '@/features/auth/authApiSlice';
import { getBannerUrl } from '@/utils/banner';
import { Camera, Upload } from 'lucide-react'; // Добавляем новые иконки
import { motion } from 'framer-motion';

interface ProfileBannerProps {
    banner?: string;
    isOwnProfile: boolean;
    isLoading?: boolean;
    onUploadClick: () => void;
}

const ProfileBanner: React.FC<ProfileBannerProps> = ({
    banner,
    isOwnProfile,
    isLoading = false,
    onUploadClick,
}) => {
    const [uploadBanner] = useUploadBannerMutation();
    const [currentBanner, setCurrentBanner] = useState(banner);
    const bannerUrl = getBannerUrl(currentBanner);

    // Обновляем CSS-переменную при изменении URL баннера
    useEffect(() => {
        if (bannerUrl) {
            document.documentElement.style.setProperty('--profile-banner', `url(${bannerUrl})`);
        }
    }, [bannerUrl]);

    // Синхронизируем локальное состояние с пропсами
    useEffect(() => {
        console.log('[ProfileBanner] Banner prop changed:', banner);
        setCurrentBanner(banner);
    }, [banner]);

    const handleBannerUpload = async (files: File[]) => {
        if (files.length === 0) return;

        try {
            console.log('[ProfileBanner] Uploading file:', files[0].name);
            const result = await uploadBanner(files[0]).unwrap();
            console.log('[ProfileBanner] Upload success:', result);
            
            if (result.banner) {
                // Обновляем локальное состояние
                setCurrentBanner(result.banner);
                // Немедленно обновляем CSS-переменную
                const newBannerUrl = getBannerUrl(result.banner);
                document.documentElement.style.setProperty('--profile-banner', `url(${newBannerUrl})`);
            }
            
            toast.success('Баннер успешно обновлен');
            onUploadClick(); // Закрываем диалог
        } catch (error: any) {
            console.error('[ProfileBanner] Banner upload error:', error);
            toast.error(error.message || 'Ошибка при загрузке баннера');
        }
    };

    return (
        <div className="relative w-full h-full">
            <div className="relative w-full h-full banner-background">
                {!bannerUrl && (
                    <div className="w-full h-full bg-gradient-to-b from-white/[0.02] to-transparent" />
                )}

                {/* Обновленная кнопка загрузки */}
                {isOwnProfile && !isLoading && (
                    <div className="absolute bottom-6 right-6 flex items-center gap-3">
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={onUploadClick}
                            className="group flex items-center gap-3 px-5 py-3 bg-[#060606]/90 hover:bg-[#060606] border border-white/10 hover:border-white/20 rounded-xl backdrop-blur-xl transition-all duration-300"
                        >
                            <div className="p-2 rounded-lg bg-white/[0.04] group-hover:bg-white/[0.08] transition-colors">
                                <Camera className="w-4 h-4 text-white/60 group-hover:text-white/90 transition-colors" />
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-sm font-medium text-white/80 group-hover:text-white/90">
                                    Обновить баннер
                                </span>
                                <span className="text-xs text-white/40 group-hover:text-white/60">
                                    JPG, PNG или WebP
                                </span>
                            </div>
                        </motion.button>

                    </div>
                )}

                <FileUploadDialog
                    isOpen={false}
                    onClose={() => {}}
                    onUpload={handleBannerUpload}
                    acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp']}
                    maxFiles={1}
                    maxSize={5 * 1024 * 1024} // 5MB
                />
            </div>
        </div>
    );
};

export default ProfileBanner;
