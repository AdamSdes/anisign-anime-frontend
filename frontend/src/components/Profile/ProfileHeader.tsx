import React, { useState, useEffect } from 'react';
import ProfileBanner from './ProfileBanner';
import ProfileAvatar from './ProfileAvatar';
import ProfileInfo from './ProfileInfo';
import ProfileActions from './ProfileActions';
import { useAuthStore } from '@/hooks/useAuth';
import { FileUploadDialog } from '@/components/ui/file-upload-dialog';
import { toast } from 'sonner';
import * as auth from '@/lib/auth';
import { getAvatarUrl } from '@/utils/avatar';
import { getBannerUrl } from '@/utils/banner';

interface ProfileHeaderProps {
    username: string;
    nickname?: string;
    avatar?: string;
    banner?: string;
    isOwnProfile: boolean;
    isLoading?: boolean;
    refetchUser: () => Promise<void>;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
    username,
    nickname,
    avatar,
    banner,
    isOwnProfile,
    isLoading = false,
    refetchUser
}) => {
    const [currentAvatar, setCurrentAvatar] = useState(avatar);
    const [currentBanner, setCurrentBanner] = useState(banner);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

    const updateUserData = useAuthStore(state => state.updateUserData);

    useEffect(() => {
        setCurrentAvatar(avatar);
    }, [avatar]);

    useEffect(() => {
        console.log('[ProfileHeader] Banner prop changed:', banner);
        setCurrentBanner(banner);
    }, [banner]);

    const handleAvatarUpdate = async () => {
        await refetchUser();
    };

    const handleBannerUpload = async (files: File[]) => {
        if (files.length === 0) return;

        try {
            setIsUpdating(true);
            setIsUploadDialogOpen(false); // Закрываем диалог сразу
            
            console.log('[ProfileHeader] Starting banner upload');
            const newBannerUrl = await auth.updateBanner(files[0]);
            console.log('[ProfileHeader] Banner upload success, new URL:', newBannerUrl);
            
            // Обновляем локальное состояние
            setCurrentBanner(newBannerUrl);
            console.log('[ProfileHeader] Current banner updated:', newBannerUrl);
            
            // Обновляем данные пользователя
            await refetchUser();
            console.log('[ProfileHeader] User data refetched');
            
            toast.success('Баннер успешно обновлен');
        } catch (error: any) {
            console.error('[ProfileHeader] Banner upload error:', error);
            const errorMessage = error.response?.data?.detail || error.message || 'Ошибка при загрузке баннера';
            toast.error(errorMessage);
            setIsUploadDialogOpen(true); // Открываем диалог обратно в случае ошибки
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="relative">
            <div className="absolute inset-x-0  top-0 w-full h-[350px]">
                <ProfileBanner 
                    banner={getBannerUrl(currentBanner)}
                    isOwnProfile={isOwnProfile}
                    isLoading={isLoading || isUpdating}
                    onUploadClick={() => setIsUploadDialogOpen(true)}
                />
            </div>
            
            <div className="container mx-auto px-4 sm:px-8 pb-4 max-w-[1450px] relative pt-[200px]">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-center sm:items-end">
                    <div className="relative flex flex-col items-center justify-center w-[185px] h-[247px] gap-3 rounded-[14px] border border-white/5 overflow-hidden">
                        <ProfileAvatar 
                            username={username}
                            avatar={getAvatarUrl(currentAvatar)}
                            nickname={nickname}
                            isOwnProfile={isOwnProfile}
                            isLoading={isLoading}
                            onAvatarUpdate={handleAvatarUpdate}
                        />
                    </div>
                    <div className="flex-1 flex flex-col sm:flex-row gap-4 items-center sm:items-end sm:justify-between w-full">
                        <ProfileInfo 
                            username={username}
                            nickname={nickname}
                            isLoading={isLoading}
                        />
                        {isOwnProfile && (
                            <ProfileActions />
                        )}
                    </div>
                </div>
            </div>

            <FileUploadDialog
                isOpen={isUploadDialogOpen}
                onClose={() => setIsUploadDialogOpen(false)}
                onUpload={handleBannerUpload}
                acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp']}
                maxFiles={1}
                maxSize={5 * 1024 * 1024} // 5MB
            />
        </div>
    );
};

export default ProfileHeader;