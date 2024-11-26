'use client';
import { useEffect, useState } from 'react';
import { Label } from "@/shared/shadcn-ui/label";
import { AButton } from "@/shared/anisign-ui/Button";
import { AInput } from "@/shared/anisign-ui/Input";
import { ACheckbox } from "@/shared/anisign-ui/Checkbox";
import Link from 'next/link';

import { useDispatch, useSelector } from 'react-redux';
import { actionFullLogin } from '@/features/auth/authActions';
import { getUserByUsernameThunk } from '@/features/auth/authApiSlice';
import { redirect } from 'next/navigation';

export function Auth() {
    const dispatch = useDispatch();
    // const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberPassword, setRememberPassword] = useState(false); // поміняти на 'запамятати мене'
    const isAuthenticated = useSelector(state => state.auth.accessToken !== null);

    const toggleRememberPassword = () => setRememberPassword(!rememberPassword);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            // потрібне повідомлення на сторінці
            console.log('Логін та пароль повинні бути заповнені');
            return;
        }

        try {
            // виклик запиту авторизації
            dispatch(actionFullLogin({ username, password }));
        } catch (error) {
            console.log('Помилка при handleSubmit', error);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            // тут мав би бути редірект на головну сторінку
            redirect('/');
            console.log('USER LOGGED IN')
        }
      }, [isAuthenticated]);

    const handleTest = (e) => {
        e.preventDefault();
        dispatch(getUserByUsernameThunk('test1234', { forceRefetch: true }));
    }
    

    return (
        <div className="bg-[url('/bg/auth_bg.png')] bg-cover bg-center">
            <div className="flex items-center justify-end w-full h-screen">
                <div className="bg-[#060606] mr-[175px] p-[50px] rounded-[24px] w-[490px]">
                    <div className="flex flex-col justify-between items-center gap-[35px]">
                        <div className="flex justify-between items-center w-full">
                            <p className='font-semibold'>Добро пожаловать ✌️</p>
                            <Link href="/" className="bg-red px-[15px] h-[33px] border rounded-full flex items-center">
                                <img src="/left-icon.svg" className="w-[17px]" alt=""/>
                            </Link>
                        </div>

                        <div className="flex w-full gap-2">
                            <AButton
                                color="gray"
                                className="w-full"
                                startContent={<img src="/google.svg" className="w-[24px] h-[20px]"/>}>
                                Google
                            </AButton>
                            <AButton
                                color="gray"
                                className="w-full"
                                startContent={<img src="/discord.svg" className="w-[24px] h-[24px]"/>}>
                                Discord
                            </AButton>
                        </div>
                        <div className="w-full h-[1px] bg-white opacity-10"></div>

                        <div className="flex flex-col gap-[35px] w-full">

                            <div className="grid gap-3 w-full">
                                <AInput
                                    type="email"
                                    placeholder="Логин"
                                    size="xl"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    startContent={
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18" fill="none">
                                            <rect x="1" y="1" width="20" height="16" rx="5" stroke="#8B8B8B" strokeWidth="1.5"/>
                                            <path d="M5 6L9.8 9.6C10.5111 10.1333 11.4889 10.1333 12.2 9.6L17 6"
                                                stroke="#8B8B8B" strokeWidth="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    }
                                />
                                <AInput
                                    type="password"
                                    placeholder="Пароль"
                                    size="xl"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    startContent={
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 18 20" fill="none">
                                            <rect x="1" y="7" width="16" height="12" rx="4" stroke="#8B8B8B" strokeWidth="1.5"/>
                                            <path d="M9 14L9 12" stroke="#8B8B8B" strokeWidth="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M13 7V5C13 2.79086 11.2091 1 9 1V1C6.79086 1 5 2.79086 5 5L5 7"
                                                stroke="#8B8B8B" strokeWidth="1.5"/>
                                        </svg>
                                    }
                                    endContent={
                                        <Link href="/auth/restore">
                                            <AButton href="/auth" className="w-[75px] h-[35px]" color="gray">
                                                <p className="text-xs opacity-70 font-normal">Забыл</p>
                                            </AButton>
                                        </Link>
                                    }
                                />
                            </div>

                            <div className='flex items-center space-x-2 w-full'>
                                <ACheckbox onClick={toggleRememberPassword} />
                                <Label htmlFor="airplane-mode" className="opacity-70 font-normal">
                                    Запомнить пароль
                                </Label>
                            </div>

                            <div className="flex gap-2 w-full">
                                <AButton className='w-full' onClick={handleSubmit}>Войти</AButton>
                                <Link href="/auth/registration">
                                    <AButton href="/auth/registration" className=" w-[58px] h-[58px]" color="gray">
                                        <img src="/sign-up.svg" className="w-[80px]" alt=""/>
                                    </AButton>
                                </Link>
                                <button onClick={handleTest}>test</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Auth;
