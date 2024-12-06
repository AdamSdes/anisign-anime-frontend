'use client'
import React, { useEffect } from 'react';
import {Button} from '@/shared/shadcn-ui/button';
import {ChevronRight} from 'lucide-react';
import {Avatar} from "@nextui-org/avatar";
import {Badge} from "@/shared/shadcn-ui/badge";
import {AButton} from "@/shared/anisign-ui/Button";

import { useLazyGetUserByUsernameQuery, useUploadAvatarMutation } from '@/features/auth/authApiSlice';
import { useSelector } from 'react-redux';
import { redirect } from 'next/navigation';
import { toast } from "sonner";
import MyDropzone from '@/features/dropzone/Dropzone';


const Profile = () => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const username = useSelector(state => state.auth.user.username);
    // const avatarUrl = useSelector(state => state.auth.user.avatar);
    const isAuthenticated = useSelector(state => state.auth.accessToken !== null);
    
    const [getUserByUsername, { data: user}] = useLazyGetUserByUsernameQuery(); //брати урл аватару звідси чи зі стейту???
    const [uploadAvatar] = useUploadAvatarMutation();

    const handleAvatarUploadSuccess = () => {
        toast.success('Файл успешно загружен', {
            duration: 4000,
        });
    }

    const handleAvatarUploadError = () => {
        toast.error('Пройзошла ошибка', {
            duration: 4000,
        });
    }

    useEffect(() => {
        if (!isAuthenticated) {
            redirect('/auth');
        } else {
            getUserByUsername(username);
        }
    }, [isAuthenticated, getUserByUsername]);
    
    return (
        <div className="anim-list-background h-[368px] p-6 relative">
            <div className="container mx-auto h-full">
                <div className="absolute bottom-0 left-0 mb-5 w-full max-w-[90%] lg:max-w-none lg:static lg:flex lg:justify-between lg:items-center gap-5" style={{ marginTop: '190px' }}>
                    {/* Аватар и информация о пользователе */}
                    <div className="flex flex-col lg:flex-row items-center mb-5 gap-5">
                    <MyDropzone 
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full"
                        onUpload={uploadAvatar} 
                        onUploadSuccess={handleAvatarUploadSuccess}
                        onUploadError={handleAvatarUploadError}
                        >
                        <Avatar
                            src={user?.user_avatar ? `${BASE_URL}${user?.user_avatar}?t=${new Date().getTime()}` : ''}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-lg"
                            alt="User Avatar"
                        />
                    </MyDropzone>
                        <div className="flex flex-col gap-2 text-center lg:text-left">
                            <p className="text-md sm:text-lg font-semibold text-white">{user?.username || '@AdamS'}</p>
                            {/* Бейджи */}
                            <div className="flex gap-2 justify-center lg:justify-start">
                                <Badge variant="outline" className="text-white">Новичок</Badge>
                                <Badge
                                    className="text-xs sm:text-sm text-black bg-gradient-to-r from-blue-400 to-pink-400"
                                >
                                    PRO
                                </Badge>
                            </div>
                        </div>

                    </div>
                    {/* Основная кнопка "Добавить в друзья" */}
                    <div className="flex justify-center lg:justify-end w-full lg:w-auto">
                        <AButton size='md' color='gray' className="py-[25px]">
                            Добавить в друзья
                        </AButton>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
