'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Link } from "@nextui-org/react";
import { AButton } from "@/shared/anisign-ui/Button";
import { ADropdown } from "@/shared/anisign-ui/Dropdown";
import { Kbd } from "@nextui-org/kbd";
import { HiMenu, HiX } from 'react-icons/hi';
import SearchModal from "@/shared/ui/SearchModal/SearchModal";
import { useRouter } from 'next/navigation';

import { useSelector, useDispatch } from 'react-redux';
import { actionFullLogout } from '@/features/auth/authActions';
import { UserNav } from "@/components/ui/user-nav";
import { Button } from "@/components/ui/button";
import { NotificationsNav } from "@/components/ui/notifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserNotLoggedNavBar = () => {
    return (
        <Link href="/auth">
            <Button
                className="h-[50px] px-[25px] rounded-[14px]"
                size="lg"
            >
                Авторизация
            </Button>
        </Link>
    )
}

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navbarRef = useRef(null);
    const isAuthenticated = useSelector(state => state.auth.accessToken !== null);
    const dispatch = useDispatch();

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

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768 && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobileMenuOpen]);

    const handleLogout = () => {
        dispatch(actionFullLogout());
    };

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
                            <img src="/logo.png" alt="Logo" className="w-8 h-8" />
                            <p className='text-[rgba(255,255,255,0.8)] text-[14px]'>Anisign</p>
                        </Link>
                        <img src="/line.svg" alt="Line" className="hidden md:block" />
                        {/* Меню для десктопа */}
                        <div className="hidden md:flex gap-5">
                            <Link href='/anime-list'
                                  className="text-[#CCBAE4] gap-1 font-semibold rounded-[12px] text-[14px] bg-[none] h-[48px] opacity-100 hover:opacity-60 transition-all duration-300">
                                Список аниме
                            </Link>
                        </div>
                    </div>

                    {/* Правый блок навбара для десктопа */}
                    <div className="hidden md:flex items-center gap-5">
                        <SearchModal/>
                        {/* <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="h-[50px] px-5 rounded-[14px] border border-white/5"
                                    size="lg"
                                >
                                    Страницы
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuItem>
                                    <Link href="/characters">Персонажи</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href="/calendar">Календарь</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href="/news">Новости</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu> */}
                        <img src="/line.svg" alt="Line" className="hidden md:block" />
                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <NotificationsNav />
                                <UserNav onLogout={handleLogout} />
                            </div>
                        ) : (
                            <UserNotLoggedNavBar />
                        )}
                    </div>

                    {/* Мобильное меню */}
                    <button
                        className="md:hidden text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
                    </button>
                </nav>
            </header>

            {/* Мобильное меню */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 bg-black/95 z-40 pt-[89px]">
                    <div className="container mx-auto px-4 py-8">
                        <div className="flex flex-col gap-6">
                            <Link href="/anime-list" className="text-white text-lg">
                                Список аниме
                            </Link>
                            <Link href="/characters" className="text-white text-lg">
                                Персонажи
                            </Link>
                            <Link href="/calendar" className="text-white text-lg">
                                Календарь
                            </Link>
                            <Link href="/news" className="text-white text-lg">
                                Новости
                            </Link>
                            {isAuthenticated && (
                                <button 
                                    onClick={handleLogout}
                                    className="text-red-500 text-lg text-left"
                                >
                                    Выйти
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
