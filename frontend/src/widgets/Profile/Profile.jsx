'use client'
import React, { useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FaEye } from "react-icons/fa";
import { Settings, Camera, UserCircle, Crown, Trophy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner"; // Import the new loading indicator
import Link from 'next/link';

import { useLazyGetUserByUsernameQuery, useGetUserAvatarQuery, useUploadAvatarMutation, useChangePasswordMutation } from '@/features/auth/authApiSlice';
import { useSelector } from 'react-redux';
import { redirect } from 'next/navigation';
import { FileUploadDialog } from '@/components/ui/file-upload-dialog';
import { ChangePasswordDialog } from '@/components/ui/change-password-dialog';

const Profile = () => {
    const [getUserByUsername, { data: user, isLoading, isError }] = useLazyGetUserByUsernameQuery();
    const { data: avatarUrl, isLoading: isAvatarLoading, error: avatarError, refetch: refetchAvatar } = useGetUserAvatarQuery(undefined, {
        // Добавляем повторные попытки при ошибке
        pollingInterval: 0,
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true
    });
    const [uploadAvatar] = useUploadAvatarMutation();
    const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
    const username = useSelector(state => state.auth.user);
    const isAuthenticated = useSelector(state => state.auth.accessToken !== null);
    
    // Состояния для модальных окон
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = React.useState(false);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = React.useState(false);
    const [isAvatarUploading, setIsAvatarUploading] = React.useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            redirect('/auth');
        } else {
            getUserByUsername(username);
        }
    }, [isAuthenticated, getUserByUsername]);

    // Очищаем URL при размонтировании
    useEffect(() => {
        return () => {
            if (avatarUrl && avatarUrl.startsWith('blob:')) {
                URL.revokeObjectURL(avatarUrl);
            }
        };
    }, [avatarUrl]);

    const handleChangePassword = async (passwords) => {
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("Новые пароли не совпадают");
            return;
        }
        
        if (passwords.newPassword.length < 6) {
            toast.error("Новый пароль должен быть не менее 6 символов");
            return;
        }

        try {
            await changePassword(passwords).unwrap();
            toast.success("Пароль успешно изменен");
            setIsPasswordDialogOpen(false);
        } catch (error) {
            toast.error(error.data?.detail || "Ошибка при смене пароля");
        }
    };

    const handleAvatarDrop = async (file) => {
        if (!file) return;
        
        setIsAvatarUploading(true);
        try {
            // Загружаем аватар
            await uploadAvatar(file).unwrap();
            
            // Убираем множественные рефетчи, оставляем только один
            await refetchAvatar();
            
            toast.success("Аватар успешно обновлен");
            setIsUploadDialogOpen(false);
        } catch (error) {
            toast.error(error.data?.detail || "Ошибка при загрузке аватара");
            console.error("Error uploading avatar:", error);
        } finally {
            setIsAvatarUploading(false);
        }
    };
    
    return (
        <>
            <div className="anim-list-background h-[350px] relative">
                <div className="container mx-auto h-full flex items-end justify-center pb-10">
                    <div className="flex justify-between items-end w-full max-w-[1450px] gap-6 translate-y-[80px]">
                        {/* Left Section */}
                        <div className="flex items-end gap-6">
                            {/* Avatar Section */}
                            <div className="flex flex-col anim-list-background-card outline outline-[1px] outline-white/5 rounded-[14px] items-center justify-center h-[247px] w-[185px] gap-3">
                                <div 
                                    className="relative group cursor-pointer"
                                    onClick={() => !isAvatarUploading && setIsUploadDialogOpen(true)}
                                >
                                    <div className="w-20 h-20 rounded-full overflow-hidden">
                                        {(isAvatarLoading || isAvatarUploading) ? (
                                            <div className="w-full h-full bg-[rgba(255,255,255,0.02)] flex items-center justify-center">
                                                <Spinner size="sm" color="primary" />
                                            </div>
                                        ) : avatarError ? (
                                            <UserCircle className="w-full h-full text-white/40" />
                                        ) : (
                                            <Avatar className="w-full h-full">
                                                <AvatarImage 
                                                    src={avatarUrl} 
                                                    alt={username}
                                                    className="object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.src = ''; // Очищаем битый URL
                                                        refetchAvatar(); // Пробуем перезагрузить
                                                    }}
                                                />
                                                <AvatarFallback>
                                                    <UserCircle className="w-8 h-8 text-white/40" />
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/50 flex items-center justify-center">
                                        <Camera className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                                
                                <div className="text-center">
                                    <h1 className="text-white text-[14px] font-semibold">{user?.username || username}</h1>
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="flex flex-col gap-5">
                                <p className="text-white/50 pl-1 text-[14px] flex items-center gap-3">
                                    <FaEye className="w-4 h-4" />
                                    Смотрит — Магическая битва 2
                                </p>
                                <div className="flex gap-2">
                                    <span className="py-2 px-3 rounded-full border border-white/5 text-white/60">
                                        Новичок
                                    </span>
                                    <span className="py-2 px-3 rounded-full bg-[#CCBAE4] text-black font-medium flex items-center gap-1.5">
                                        <Crown className="w-3.5 h-3.5" /> PRO
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className='flex gap-3'>
                            <Link 
                                href="/achievements"
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#CCBAE4]/10 hover:bg-[#CCBAE4]/20 transition-all duration-300"
                            >
                                <Trophy className="h-4 w-4 text-[#CCBAE4]" />
                                <span className="text-[#CCBAE4]">Достижения</span>
                            </Link>
                            <Link href='/settings'>
                                <Button             
                                    className="h-[50px] px-[25px] rounded-full bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)] text-white/90 hover:text-white flex items-center gap-2 transition-all duration-300"
                                >
                                    <Settings className="w-4 h-4" />
                                    Настройки
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dialogs */}
            <FileUploadDialog 
                isOpen={isUploadDialogOpen}
                onClose={() => setIsUploadDialogOpen(false)}
                onUpload={handleAvatarDrop}
            />
        </>
    );
}

export default Profile;
