'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Link, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { AButton } from "@/shared/anisign-ui/Button";
import { ADropdown } from "@/shared/anisign-ui/Dropdown";
import { Kbd } from "@nextui-org/kbd";
import { HiMenu, HiX } from 'react-icons/hi';
import SearchModal from "@/shared/ui/SearchModal/SearchModal";

import { useDispatch, useSelector } from 'react-redux';
import { actionFullLogout } from '@/features/auth/authActions';

const UserLoggedNavBar = () => {
    return (
        <>
        <div className="h-[50px] w-[50px] rounded-full overflow-hidden flex items-center justify-center">
            <AButton
                className="h-full w-full p-0 flex items-center justify-center"
                size="md"
                color="gray"
            >
                <img src="bell.svg" alt="notifications" className="h-[20px] w-[20px]" />
            </AButton>
        </div>
        
        <div className="h-[50px] w-[50px] rounded-full overflow-hidden flex items-center justify-center">
            <Link 
            className="h-full w-full flex items-center justify-center"
            href="/profile">
                <AButton
                    className="h-full w-full p-0 flex items-center justify-center bg-[#D8D8D8]"
                    size="md"
                    color="gray"
                >
                    <img src="profile.svg" alt="notifications" className="h-[20px] w-[20px]" />
                </AButton>
            </Link>
        </div>
        </>
    )
}

const UserNotLoggedNavBar = () => {
    return (
        <Link 
        href="/auth">
            <AButton
                className="h-[50px] px-[25px]"
                size="md"
                >
                Авторизация
            </AButton>
        </Link>
    )
}


export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Состояние для мобильного меню
    const navbarRef = useRef(null);

    const isAuthenticated = useSelector(state => state.auth.accessToken !== null);

    useEffect(() => {
        const navbar = navbarRef.current;

        const observer = new IntersectionObserver(([entry]) => {
            setIsScrolled(!entry.isIntersecting);
        }, { threshold: [0.1] });

        if (navbar) {
            observer.observe(navbar);
        }

        return () => {
            if (navbar) {
                observer.unobserve(navbar);
            }
        };
    }, []);

    // Закрыть мобильное меню при изменении размера окна
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768 && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobileMenuOpen]);


    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(actionFullLogout());
    }

    return (
        <>
            <div ref={navbarRef}></div>
            <header
                className={`border-b-[1px] flex items-center border-white/8 sticky top-0 left-0 w-full h-[100px] bg-[#060606]/60 backdrop-blur-lg z-50 transition-all duration-300 ${isScrolled ? 'bg-[#060606]/80 shadow-lg py-3 backdrop-blur-lg' : 'bg-transparent h-[89px] flex items-center'}`}>
                <nav className="container mx-auto px-2 flex justify-between items-center">
                    {/* Левый блок навбара */}
                    <div className="navbar-left flex gap-5 items-center">
                        <Link href='/'
                              className="flex gap-5 items-center opacity-100 hover:opacity-50 transition-opacity duration-300">
                            <img src="logo.png" alt="Logo" className="w-8 h-8" />
                            <p className='text-[rgba(255,255,255,0.8)] text-[14px]'>Anisign</p>
                        </Link>
                        <img src="line.svg" alt="Line" className="hidden md:block" />
                        {/* Меню для десктопа */}
                        <div className="hidden md:flex gap-5">
                            <Link href='/animeList'
                                  className="text-[#CCBAE4] gap-1 font-semibold rounded-[12px] text-[14px] bg-[none] h-[48px] opacity-100 hover:opacity-60 transition-all duration-300">
                                Список аниме
                            </Link>
                            <button onClick={handleLogout} className='TEST'>TEST LOGOUT</button>
                        </div>
                    </div>

                    {/* Правый блок навбара для десктопа */}
                    <div className="hidden md:flex items-center gap-5">
                        <SearchModal/>
                        <ADropdown backdrop="blur">
                            <DropdownTrigger>
                                <AButton
                                    className="h-[50px] px-5"
                                    size="md"
                                    color="gray">
                                    Страницы
                                </AButton>
                            </DropdownTrigger>
                            <DropdownMenu variant="faded" aria-label="Static Actions">
                                <DropdownItem className="p-3" key="characters">
                                    <Link href="/characters">Персонажи</Link>
                                </DropdownItem>
                                <DropdownItem className="p-3" key="calendar">
                                    <Link href="/calendar">Календарь</Link>
                                </DropdownItem>
                                <DropdownItem className="p-3" key="collections">
                                    <Link href="/collections">Колекции</Link>
                                </DropdownItem>
                                <DropdownItem className="p-3" key="comments">
                                    <Link href="/comments">Комментарии</Link>
                                </DropdownItem>
                            </DropdownMenu>
                        </ADropdown>
                        <img src="line.svg" alt="Line" className="hidden md:block" />
                        {isAuthenticated ?
                         <UserLoggedNavBar />
                        :
                        <UserNotLoggedNavBar />
                        }
                       
                    </div>

                    {/* Бургер-меню для мобильных устройств */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Меню"
                            aria-expanded={isMobileMenuOpen}
                            aria-controls="mobile-menu"
                            className="focus:outline-none">
                            {isMobileMenuOpen ? <HiX className="w-6 h-6 text-white" /> : <HiMenu className="w-6 h-6 text-white" />}
                        </button>
                    </div>
                </nav>

                {/* Мобильное меню */}
                {isMobileMenuOpen && (
                    <div
                        id="mobile-menu"
                        className="md:hidden bg-[#060606]/90 backdrop-blur-lg absolute top-full left-0 w-full z-40 p-6">
                        <nav className="flex flex-col items-center space-y-6">
                            <Link href='/animeList'
                                  className="text-[#CCBAE4] font-semibold rounded text-lg px-4 py-2 w-full text-center hover:bg-[#1a1a1a] transition-colors">
                                Список аниме
                            </Link>
                            <Link href='/'
                                  className="text-white/70 font-medium rounded text-lg px-4 py-2 w-full text-center hover:bg-[#1a1a1a] transition-colors">
                                Случайное аниме
                            </Link>
                            <AButton
                                size="md"
                                className="h-[50px] min-w-0 w-full rounded-[12px] px-4"
                                color="border">
                                <div className="flex gap-3 items-center opacity-60 justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 21 21"
                                         fill="none">
                                        <circle cx="9" cy="9" r="8" stroke="white" strokeWidth="1.5" strokeLinecap="round"
                                                strokeLinejoin="round" />
                                        <path d="M14.5 14.958L19.5 19.958" stroke="white" strokeWidth="1.5"
                                              strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <Kbd className="bg-white/10" keys={["command"]}>K</Kbd>
                                </div>
                            </AButton>
                            <ADropdown backdrop="blur" className="w-full">
                                <DropdownTrigger>
                                    <AButton
                                        className="h-[50px] px-5 w-full"
                                        size="md"
                                        color="gray">
                                        Страницы
                                    </AButton>
                                </DropdownTrigger>
                                <DropdownMenu variant="faded" aria-label="Static Actions">
                                    <DropdownItem className="p-3" key="characters">
                                        <Link href="/characters">Персонажи</Link>
                                    </DropdownItem>
                                    <DropdownItem className="p-3" key="calendar">
                                        <Link href="/calendar">Календарь</Link>
                                    </DropdownItem>
                                    <DropdownItem className="p-3" key="collections">
                                        <Link href="/collections">Колекции</Link>
                                    </DropdownItem>
                                    <DropdownItem className="p-3" key="comments">
                                        <Link href="/comments">Комментарии</Link>
                                    </DropdownItem>
                                </DropdownMenu>
                            </ADropdown>
                            <Link href="/auth" className="w-full">
                                <AButton
                                    className="h-[50px] px-[25px] w-full"
                                    size="md">
                                    Авторизация
                                </AButton>
                            </Link>
                        </nav>
                    </div>
                )}
            </header>
        </>
    );
}
