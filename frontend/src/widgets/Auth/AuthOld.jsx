'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/context/AuthContext'; // Импортируйте useAuth
import {CheckboxGroup, Checkbox} from "@nextui-org/react";
import {AButton} from "@/shared/anisign-ui/Button";
import {ASwitch} from "@/shared/anisign-ui/Switch";
import {AInput} from "@/shared/anisign-ui/Input";
import {ACheckbox} from "@/shared/anisign-ui/Checkbox";



export function Auth() {
    const [authData, setAuthData] = useState({email: '', password: ''});
    const router = useRouter();
    const {login} = useAuth(); // Получаем функцию login из контекста

    const [isVisible, setIsVisible] = useState(false); // Исправлено использование useState
    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleInput = (e) => {
        setAuthData({...authData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (authData.email && authData.password) {
            // Фиктивные данные пользователя для примера
            const userData = {
                email: authData.email,
                avatar: '/123.gif',
            };

            login(userData);

            router.push('/');
        } else {
            alert('Please fill in both email and password.');
        }
    };

    return (
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[600px]">
            <div className="relative h-screen max-h-screen bg-black">
                <img src="/1.gif" className="absolute h-screen w-full object-cover" alt=""/>
                <div
                    className="absolute inset-0 backdrop-blur-xl bg-[rgba(6,6,6,0.9)] from-background to-transparent"></div>
                <div className="absolute p-[40px] inset-0 flex flex-col gap-5 justify-end items-start">
                    <h1 className="font-bold text-[40px] text-start">Нельзя знать, что такое победа,<br/>не испытав
                        поражения.</h1>
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
                            <h1 className="text-1xl font-bold">✌️ Добро пожаловать</h1>
                            <AButton onClick={() => router.push('/')}
                                     size="md"
                                     color="border">
                                На сайт
                            </AButton>
                        </div>
                    </div>

                    <div className="flex flex-col gap-[20px]">
                        <div className="grid gap-2">
                            <AInput
                                type="email"
                                placeholder="you@example.com"
                                size='xl'
                                startContent={
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18"
                                         fill="none">
                                        <rect x="1" y="1" width="20" height="16" rx="5" stroke="#8B8B8B"
                                              stroke-width="1.5"/>
                                        <path d="M5 6L9.8 9.6C10.5111 10.1333 11.4889 10.1333 12.2 9.6L17 6"
                                              stroke="#8B8B8B" stroke-width="1.5" stroke-linecap="round"
                                              stroke-linejoin="round"/>
                                    </svg>
                                }
                            />

                            <AInput
                                type={isVisible ? "text" : "password"}
                                placeholder="Пароль"
                                size='xl'
                                startContent={
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 18 20"
                                         fill="none">
                                        <rect x="1" y="7" width="16" height="12" rx="4" stroke="#8B8B8B"
                                              stroke-width="1.5"/>
                                        <path d="M9 14L9 12" stroke="#8B8B8B" stroke-width="1.5" stroke-linecap="round"
                                              stroke-linejoin="round"/>
                                        <path d="M13 7V5C13 2.79086 11.2091 1 9 1V1C6.79086 1 5 2.79086 5 5L5 7"
                                              stroke="#8B8B8B" stroke-width="1.5"/>
                                    </svg>
                                }
                                endContent={
                                    <button className="focus:outline-none" type="button" onClick={toggleVisibility}
                                            aria-label="toggle password visibility">
                                        {isVisible ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14"
                                                 viewBox="0 0 20 14" fill="none">
                                                <path
                                                    d="M1.20057 7.78442C0.933139 7.2954 0.933144 6.70445 1.20058 6.21544C2.9 3.10803 6.20336 1 9.99997 1C13.7966 1 17.1 3.10809 18.7994 6.21558C19.0669 6.7046 19.0669 7.29555 18.7994 7.78456C17.1 10.892 13.7966 13 10 13C6.20336 13 2.89997 10.8919 1.20057 7.78442Z"
                                                    stroke="white" stroke-width="1.5"/>
                                                <circle cx="10" cy="7" r="3" stroke="white" stroke-width="1.5"/>
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="18"
                                                 viewBox="0 0 20 18" fill="none">
                                                <path
                                                    d="M18.7994 8.21558L19.4575 7.85572L18.7994 8.21558ZM18.7994 9.78456L19.4574 10.1444L18.7994 9.78456ZM1.20058 8.21544L1.8586 8.57531L1.20058 8.21544ZM1.20057 9.78442L0.54254 10.1443L0.54254 10.1443L1.20057 9.78442ZM17.5236 5.30907C17.227 5.0199 16.7522 5.0259 16.463 5.32247C16.1738 5.61904 16.1798 6.09387 16.4764 6.38304L17.5236 5.30907ZM7.68628 13.9596C7.28505 13.8567 6.87638 14.0986 6.7735 14.4998C6.67062 14.9011 6.91249 15.3097 7.31372 15.4126L7.68628 13.9596ZM12.604 3.34114L12.4099 4.06559L12.604 3.34114ZM5.07264 13.7089L4.70374 14.3619L5.50475 13.0959L5.07264 13.7089ZM1.8586 8.57531C3.43153 5.69919 6.4879 3.75 9.99997 3.75V2.25C5.91882 2.25 2.36847 4.51686 0.542558 7.85557L1.8586 8.57531ZM18.1414 9.42469C16.5685 12.3008 13.5121 14.25 10 14.25V15.75C14.0812 15.75 17.6315 13.4831 19.4574 10.1444L18.1414 9.42469ZM18.1414 8.57544C18.2862 8.84022 18.2862 9.15992 18.1414 9.42469L19.4574 10.1444C19.8475 9.43118 19.8475 8.56898 19.4575 7.85572L18.1414 8.57544ZM0.542558 7.85557C0.152487 8.56882 0.15248 9.43102 0.54254 10.1443L1.8586 9.42456C1.7138 9.15979 1.7138 8.84008 1.8586 8.57531L0.542558 7.85557ZM16.4764 6.38304C17.1347 7.02488 17.6974 7.76347 18.1414 8.57544L19.4575 7.85572C18.9413 6.91179 18.2876 6.05403 17.5236 5.30907L16.4764 6.38304ZM10 14.25C9.20019 14.25 8.42506 14.1491 7.68628 13.9596L7.31372 15.4126C8.17323 15.633 9.07349 15.75 10 15.75V14.25ZM9.99997 3.75C10.8346 3.75 11.6423 3.85991 12.4099 4.06559L12.7981 2.6167C11.905 2.37739 10.9668 2.25 9.99997 2.25V3.75ZM3.92995 11.9904C3.09529 11.2678 2.39151 10.399 1.8586 9.42456L0.54254 10.1443C1.16202 11.2771 1.97944 12.2858 2.94816 13.1244L3.92995 11.9904ZM5.44154 13.0559C4.90181 12.751 4.3956 12.3935 3.92995 11.9904L2.94816 13.1244C3.48873 13.5924 4.07659 14.0076 4.70374 14.3619L5.44154 13.0559ZM3.00695 13.1704L4.64054 14.3219L5.50475 13.0959L3.87116 11.9444L3.00695 13.1704ZM12.4099 4.06559C13.1269 4.2577 13.8096 4.53359 14.4471 4.88219L15.1668 3.56615C14.426 3.161 13.6321 2.84016 12.7981 2.6167L12.4099 4.06559Z"
                                                    fill="white"/>
                                                <path d="M17.4648 1.46436L2.46484 16.4644" stroke="white"
                                                      stroke-width="1.5" stroke-linecap="round"
                                                      stroke-linejoin="round"/>
                                                <path d="M7 9C7 7.34315 8.34315 6 10 6" stroke="white"
                                                      stroke-width="1.5" stroke-linecap="round"/>
                                            </svg>
                                        )}
                                    </button>
                                }
                            />

                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                classNames={{
                                    inputWrapper: "border-white/10 mb-5",
                                    base: "w-full text-white ",
                                    input: "resize-y text-white min-h-[40px] h-[150px] max-h-[200px]",
                            }}
                                value="example">
                                Запомнить пароль
                            </Checkbox>
                        </div>
                        <div className="flex gap-2">
                            <AButton className='w-full'>Войти</AButton>
                            <AButton color="gray" onClick={() => router.push('/auth/registration')}
                                     className="border">
                                <img src="/add-user.svg" className="w-[32px] w-[32px]"/>
                            </AButton>
                        </div>
                        <div className="w-full h-[1px] bg-white opacity-10"></div>
                        <div className="flex flex-col gap-2">
                            <AButton
                                color="gray"
                                startContent={<img src="/google.svg" className="w-[20px] h-[20px]"/>}>
                                Google
                            </AButton>
                            <AButton
                                color="gray"
                                startContent={<img src="/discord.svg" className="w-[24px] h-[24px]"/>}>
                                Discord
                            </AButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Auth;