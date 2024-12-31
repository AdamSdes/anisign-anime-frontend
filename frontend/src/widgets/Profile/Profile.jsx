'use client'
import React, { useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FaEye } from "react-icons/fa";
import { toast } from "sonner";
import { CircularProgress } from '@mui/material';
import { Button } from "@/components/ui/button";

import { useLazyGetUserByUsernameQuery, useGetUserAvatarQuery, useUploadAvatarMutation, useChangePasswordMutation } from '@/features/auth/authApiSlice';
import { useSelector } from 'react-redux';
import { redirect } from 'next/navigation';
import { FileUploadDialog } from '@/components/ui/file-upload-dialog';
import { ChangePasswordDialog } from '@/components/ui/change-password-dialog';

const Profile = () => {
    const [getUserByUsername, { data: user, isLoading, isError }] = useLazyGetUserByUsernameQuery();
    const { data: avatarUrl, isLoading: isAvatarLoading, error: avatarError, refetch: refetchAvatar } = useGetUserAvatarQuery();
    const [uploadAvatar] = useUploadAvatarMutation();
    const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
    const username = useSelector(state => state.auth.user);
    const isAuthenticated = useSelector(state => state.auth.accessToken !== null);
    
    // Состояния для модальных окон
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = React.useState(false);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = React.useState(false);

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
        
        try {
            await uploadAvatar(file).unwrap();
            await refetchAvatar(); // Принудительно обновляем аватар
            toast.success("Аватар успешно обновлен");
            setIsUploadDialogOpen(false);
        } catch (error) {
            toast.error(error.data?.detail || "Ошибка при загрузке аватара");
            console.error("Error uploading avatar:", error);
        }
    };
    
    return (
        <>
            <div className="anim-list-background h-[350px] relative">
                <div className="container mx-auto h-full flex items-end justify-center pb-10">
                    <div className="flex justify-between items-end w-full max-w-[1450px] gap-5 translate-y-[80px]">
                        {/* Левая часть с PRO */}
                        <div className="flex items-end gap-5">
                            <div className="flex flex-col anim-list-background-card outline outline-[1px] outline-white/5 rounded-[14px] items-center justify-center h-[247px] w-[185px] gap-3">
                                <div 
                                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full hover:opacity-80 transition-opacity relative group cursor-pointer"
                                    onClick={() => setIsUploadDialogOpen(true)}
                                >
                                    {isAvatarLoading ? (
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex justify-center items-center bg-default-100">
                                            <CircularProgress size="sm" color="primary" />
                                        </div>
                                    ) : (
                                        <>
                                            <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
                                                <AvatarImage src={avatarUrl} alt={username} />
                                                <AvatarFallback>{username?.[0]?.toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <span className="text-white text-xs">Изменить</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <FileUploadDialog 
                                    isOpen={isUploadDialogOpen}
                                    onClose={() => setIsUploadDialogOpen(false)}
                                    onUpload={handleAvatarDrop}
                                />
                                <div className="text-center">
                                    <h1 className="text-white text-[14px] font-semibold">{user?.username || username}</h1>
                                </div>
                            </div>
                            <div className="flex flex-col gap-5">
                                <p className="text-white/50 pl-1 text-sm flex items-center gap-3"><FaEye size={20} />Смотрит - Магическую битву 2</p>
                                <div className="flex gap-2">
                                    <p className='py-2 px-3 rounded-full border border-white/5 text-white/60'>Новичок</p>
                                    <p className='py-2 flex items-center px-3 font-semibold rounded-full bg-[#CCBAE4] text-black'>PRO</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button
                                className="h-[50px] px-[25px]"
                                size="lg"
                                onClick={() => setIsPasswordDialogOpen(true)}
                            >
                                Сменить пароль
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <ChangePasswordDialog 
                isOpen={isPasswordDialogOpen}
                onClose={() => setIsPasswordDialogOpen(false)}
                onChangePassword={handleChangePassword}
                isLoading={isChangingPassword}
            />
        </>
    );
}

export default Profile;
