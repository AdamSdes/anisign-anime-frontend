'use client'
import React, { useEffect } from 'react';
import {Avatar} from "@nextui-org/avatar";
import {Badge} from "@nextui-org/badge";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from "@nextui-org/modal";
import {Input} from "@nextui-org/input";
import {AButton} from "@/shared/anisign-ui/Button";
import { toast } from "sonner";

import { useLazyGetUserByUsernameQuery, useGetUserAvatarQuery, useUploadAvatarMutation, useChangePasswordMutation } from '@/features/auth/authApiSlice';
import { useSelector } from 'react-redux';
import { redirect } from 'next/navigation';
import MyDropzone from '@/features/dropzone/Dropzone';

const Profile = () => {
    const [getUserByUsername, { data: user, isLoading, isError }] = useLazyGetUserByUsernameQuery();
    const { data: avatarUrl, isLoading: isAvatarLoading, error: avatarError, refetch: refetchAvatar } = useGetUserAvatarQuery();
    const [uploadAvatar] = useUploadAvatarMutation();
    const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
    const username = useSelector(state => state.auth.user);
    const isAuthenticated = useSelector(state => state.auth.accessToken !== null);
    
    // Состояния для модального окна
    const [isOpen, setIsOpen] = React.useState(false);
    const [oldPassword, setOldPassword] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

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

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("Новые пароли не совпадают");
            return;
        }
        
        if (newPassword.length < 6) {
            toast.error("Новый пароль должен быть не менее 6 символов");
            return;
        }

        try {
            await changePassword({
                password: oldPassword,
                newPassword: newPassword,
                confirmPassword: confirmPassword
            }).unwrap();
            
            toast.success("Пароль успешно изменен");
            setIsOpen(false);
            // Очищаем поля
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            toast.error(error.data?.detail || "Ошибка при смене пароля");
        }
    };

    const handleAvatarDrop = async (files) => {
        try {
            if (files && files[0]) {
                await uploadAvatar(files[0]).unwrap();
                await refetchAvatar(); // Принудительно обновляем аватар
                toast.success("Аватар успешно обновлен");
            }
        } catch (error) {
            toast.error("Ошибка при загрузке аватара");
            console.error("Error uploading avatar:", error);
        }
    };
    
    return (
        <>
            <div className="anim-list-background h-[368px] p-6 relative">
                <div className="container mx-auto h-full">
                    <div className="absolute bottom-0 left-0 mb-5 w-full max-w-[90%] lg:max-w-none lg:static lg:flex lg:justify-between lg:items-center gap-5" style={{ marginTop: '190px' }}>
                        <div className="flex flex-col lg:flex-row items-center mb-5 gap-5">
                            <MyDropzone className="w-16 h-16 sm:w-20 sm:h-20 rounded-full" onDrop={handleAvatarDrop}>
                                {isAvatarLoading ? (
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex justify-center items-center bg-default-100">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </div>
                                ) : avatarError ? (
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex justify-center items-center bg-danger text-white text-xs text-center p-2">
                                        Ошибка загрузки
                                    </div>
                                ) : (
                                    <Avatar
                                        src={avatarUrl || "https://gamek.mediacdn.vn/133514250583805952/2024/5/13/photo-1715575082069-1715575082737592043637.png"}
                                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-lg"
                                        alt="User Avatar"
                                    />
                                )}
                            </MyDropzone>
                            <div>
                                <h1 className="text-white text-2xl font-bold">{user?.username || username}</h1>
                                <Badge content="" size="sm">
                                    <p className="text-[#CCBAE4] text-sm">Новичок PRO</p>
                                </Badge>
                            </div>
                        </div>
                        <div>
                            <AButton
                                className="h-[50px] px-[25px]"
                                size="md"
                                onClick={() => setIsOpen(true)}
                            >
                                Сменить пароль
                            </AButton>
                        </div>
                    </div>
                </div>
            </div>

            <Modal 
                isOpen={isOpen} 
                onOpenChange={setIsOpen}
                placement="top-center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Смена пароля</ModalHeader>
                            <ModalBody>
                                <Input
                                    autoFocus
                                    label="Текущий пароль"
                                    placeholder="Введите текущий пароль"
                                    type="password"
                                    variant="bordered"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                                <Input
                                    label="Новый пароль"
                                    placeholder="Введите новый пароль"
                                    type="password"
                                    variant="bordered"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <Input
                                    label="Подтверждение пароля"
                                    placeholder="Подтвердите новый пароль"
                                    type="password"
                                    variant="bordered"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <AButton color="danger" variant="flat" onPress={onClose}>
                                    Отмена
                                </AButton>
                                <AButton color="primary" onPress={handleChangePassword} isLoading={isChangingPassword}>
                                    Изменить
                                </AButton>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default Profile;
