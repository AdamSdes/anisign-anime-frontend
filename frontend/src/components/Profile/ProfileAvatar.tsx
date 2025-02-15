'use client';

import React, { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { FileUploadDialog } from '@/components/ui/file-upload-dialog';
import { useUploadAvatarMutation } from '@/features/auth/authApiSlice';
import { toast } from 'sonner';

interface ProfileAvatarProps {
    username: string;
    avatar?: string;
    nickname?: string;
    isOwnProfile: boolean;
    isLoading?: boolean;
    onAvatarUpdate?: () => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ 
    username, 
    avatar,
    nickname,
    isOwnProfile,
    isLoading = false,
    onAvatarUpdate
}) => {
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [uploadAvatar] = useUploadAvatarMutation();

    const handleUpload = async (files: File[]) => {
        if (files.length > 0) {
            try {
                setIsUploadDialogOpen(false); // Закрываем диалог сразу, чтобы избежать двойных кликов
                const result = await uploadAvatar(files[0]).unwrap();
                console.log('[ProfileAvatar] Upload success:', result);
                
                // Вызываем обновление родительского компонента
                onAvatarUpdate?.();
                
                toast.success('Аватар успешно обновлен');
            } catch (error: any) {
                console.error('[ProfileAvatar] Upload error:', error);
                toast.error(error.message || 'Ошибка при загрузке аватара');
                setIsUploadDialogOpen(true); // Открываем диалог обратно в случае ошибки
            }
        }
    };

    if (isLoading) {
        return (
            <div className="relative flex flex-col items-center justify-center w-[185px] h-[247px] gap-3 rounded-[14px] border border-white/5 overflow-hidden">
                <div className="relative">
                    <Skeleton className="h-[120px] w-[120px] rounded-full" />
                    <div className="h-[120px] w-[120px] rounded-full bg-white/[0.02] flex items-center justify-center absolute inset-0">
                        <svg
                            className="animate-spin h-8 w-8 text-white/40"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <Skeleton className="h-6 w-32" />
                    {nickname && <Skeleton className="h-4 w-24" />}
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="relative flex flex-col items-center justify-center w-[185px] h-[247px] gap-3 rounded-[14px]  overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {avatar && (
                        <>
                            <img 
                                src={avatar}
                                alt="" 
                                className="w-full h-full object-cover scale-105 blur-[2px]"
                            />
                            <div className="absolute inset-0 bg-black/70 rounded-[12px] border border-white/5 backdrop-blur-[2px]" />
                        </>
                    )}
                    <div className="absolute inset-0 bg-[#060606]/80" />
                </div>

                <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="relative">
                        <div 
                            className={`group relative ${isOwnProfile ? 'cursor-pointer' : ''}`}
                            onClick={() => isOwnProfile && setIsUploadDialogOpen(true)}
                        >
                            <Avatar className="h-[90px] w-[90px] ring-2 ring-white/[0.03] ring-offset-2 ring-offset-[#060606] transition-all duration-300 group-hover:ring-white/[0.08]">
                                <AvatarImage 
                                    src={avatar}
                                    className="object-cover"
                                />
                                <AvatarFallback className="bg-white/[0.02] text-white/60 text-2xl font-medium">
                                    {nickname ? nickname.slice(0, 2).toUpperCase() : username.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            {isOwnProfile && (
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    <div className="absolute inset-0 bg-black/60 rounded-full" />
                                    <svg
                                        className="w-6 h-6 text-white/90 relative z-10"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-center mt-3 gap-1">
                        {nickname && (
                            <span className="text-sm text-white/40">@{username}</span>
                        )}
                    </div>
                </div>
            </div>

            <FileUploadDialog
                isOpen={isUploadDialogOpen}
                onClose={() => setIsUploadDialogOpen(false)}
                onUpload={handleUpload}
                title="Загрузка аватара"
                acceptedFileTypes={['image/*']}
                maxFiles={1}
                maxSize={5 * 1024 * 1024} // 5MB
                aspectRatio={1}
            />
        </>
    );
};

export default React.memo(ProfileAvatar);