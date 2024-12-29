'use client';
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { Label } from "@/shared/shadcn-ui/label";
import { AButton } from "@/shared/anisign-ui/Button";
import { AInput } from "@/shared/anisign-ui/Input";
import { ASwitch } from "@/shared/anisign-ui/Switch";
import { toast } from "sonner";
import { redirect } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { actionFullRegister } from '@/features/auth/authActions';

const LoginForm = () => {
    const dispatch = useDispatch();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [hasAgreedToToS, setHasAgreedToToS] = useState(false);

    const isAuthenticated = useSelector(state => state.auth.accessToken !== null);

    const toggleVisibility = () => setIsPasswordVisible(!isPasswordVisible);
    const toggleAgreedToToS = () => setHasAgreedToToS(!hasAgreedToToS);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password || !confirmPassword) {
            toast.error('Все поля должны быть заполнены', { duration: 4000 });
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Пароли не совпадают', { duration: 4000 });
            return;
        }

        if (!hasAgreedToToS) {
            toast.error('Вы должны согласиться с правилами сайта', { duration: 4000 });
            return;
        }

        try {
            await dispatch(actionFullRegister({ username, password, confirmPassword }));
            toast.success("Регистрация прошла успешно!", { duration: 4000 });
        } catch (error) {
            console.error('Error at handleSubmit', error);
            toast.error('Произошла ошибка при регистрации', {
                description: "Попробуйте еще раз позже или свяжитесь с поддержкой",
                duration: 4000,
            });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSubmit(e);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            redirect('/');
        }
    }, [isAuthenticated]);

    return (
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[600px]" >
            <div 
                className="relative h-screen max-h-screen bg-black"
                onKeyDown={handleKeyDown}
            >
                <img src="/1.gif" className="absolute h-screen w-full object-cover" alt=""/>
                <div className="absolute inset-0 backdrop-blur-xl bg-[rgba(6,6,6,0.9)] from-background to-transparent"></div>
                <div className="absolute p-[40px] inset-0 flex flex-col gap-5 justify-end items-start">
                    <h1 className="font-bold text-[40px] text-start">
                        Нельзя знать, что такое победа,<br/>не испытав поражения.
                    </h1>
                    <div className="flex gap-4 items-center">
                        <img src="/logo.png" alt=""/>
                        <p>Anisign</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center py-12 anim-test">
                <div className="mx-auto grid w-[360px] gap-[40px]">
                    <div className="flex gap-4 items-center">
                        <div className="flex justify-between items-center w-full">
                            <h1 className="text-1xl font-bold">Добро пожаловать</h1>
                            <Link href="/">
                                <AButton size="md" color="border">На сайт</AButton>
                                <AButton size="md" color="border">СОСАТИ ХУЙ</AButton>
                            </Link>
                        </div>
                    </div>
                    <form className="flex flex-col gap-[20px]" >
                        <div className="grid gap-2">
                            <AInput
                                type="email"
                                placeholder="Логин"
                                size='xl'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <AInput
                                type={isPasswordVisible ? "text" : "password"}
                                placeholder="Пароль"
                                size='xl'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                endContent={
                                    <button
                                        className="focus:outline-none"
                                        type="button"
                                        onClick={toggleVisibility}
                                        aria-label="toggle password visibility"
                                    >
                                    </button>
                                }
                            />
                            <AInput
                                type="password"
                                placeholder="Повторите Пароль"
                                size='xl'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <ASwitch
                                selected={hasAgreedToToS}
                                onChange={toggleAgreedToToS}
                                aria-label="Automatic updates"
                            />
                            <Label htmlFor="airplane-mode" className="opacity-70 font-normal">
                                Согласен с <a className="text-[#B6D0F7т]" href="youtube.com">правилами</a> сайта
                            </Label>
                        </div>
                        <div className="flex gap-2">
                            <AButton className='w-full' onClick={handleSubmit}>Создать</AButton>
                            <Link href="/auth">
                                <AButton className="h-[58px]" color="gray">
                                    <img src="/left-icon.svg" className="w-[80px]" alt=""/>
                                </AButton>
                            </Link>
                        </div>
                        <div className="w-full h-[1px] bg-white opacity-10"></div>
                        <div className="flex flex-col gap-2">
                            <AButton
                                color="gray"
                                startContent={<img src="/google.svg" className="w-[20px] h-[20px]"/>}
                            >
                                Google
                            </AButton>
                            <AButton
                                color="gray"
                                startContent={<img src="/discord.svg" className="w-[24px] h-[24px]"/>}
                            >
                                Discord
                            </AButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;