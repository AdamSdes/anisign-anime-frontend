'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { HiMenu, HiX, HiSearch, HiChevronDown } from 'react-icons/hi';
import { Calendar, Users2, Flame, PlayCircle, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SearchModal } from '@/components/SearchModal';
import { UserLoggedNavBar } from './UserLoggedNavBar';
import { useAuthStore } from '@/hooks/useAuth';
import { getAvatarUrl } from '@/utils/avatar';
import HeaderAvatar from './HeaderAvatar';
import { logout } from '@/lib/auth';

const UserNotLoggedNavBar = () => {
    return (
        <Link href="/auth">
            <Button
                className="h-[50px] px-[25px] rounded-[12px] bg-[#DEDEDF] hover:bg-[#DEDEDF]/90 text-black font-medium transition-all duration-200 hover:shadow-[0_0_20px_rgba(222,222,223,0.15)]"
            >
                Авторизация
            </Button>
        </Link>
    )
}

const Header = ({ className = '' }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const navbarRef = useRef(null);
    
    const { isAuthenticated, user, hydrated } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);

    // Получаем URL аватара
    const avatarUrl = user?.user_avatar ? getAvatarUrl(user.user_avatar) : undefined;

    useEffect(() => {
        if (hydrated) {
            setIsLoading(false);
        }
    }, [hydrated]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        console.log('[Header] Auth state changed:', { isAuthenticated, user, hydrated });
    }, [isAuthenticated, user, hydrated]);

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

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <>
            <div ref={navbarRef} />
            <header className={`
                border-b-[1px] flex items-center border-white/5 
                sticky top-0 left-0 w-full 
                bg-[#060606]/60 backdrop-blur-xl z-50 
                transition-all duration-300
                ${isScrolled ? 'bg-[#060606]/90 shadow-lg py-3' : 'bg-transparent h-[89px] flex items-center'}
                ${className}
            `}>
                <nav className="container mx-auto px-4 flex justify-between items-center">
                    <div className="navbar-left flex gap-4 sm:gap-6 items-center">
                        <Link href='/' className="flex gap-3 sm:gap-5 items-center opacity-100 hover:opacity-80 transition-all">
                            <img src="/logo_header.png" alt="Logo" className="w-7 h-7 sm:w-8 sm:h-8" />
                            <p className='text-white/90 font-medium text-[14px] sm:text-[15px]'>Anisign</p>
                        </Link>
                        <div className="hidden md:block w-[1px] h-[20px] bg-white/5" />
                        <div className="hidden md:flex gap-6 items-center">
                            <Link href='/anime-list'
                                  className="text-white/60 font-medium text-[14px] hover:text-white transition-colors">
                                Все аниме
                            </Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group">
                                    <span className="text-[14px] font-medium">Каталог</span>
                                    <HiChevronDown className="w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[280px] bg-[#060606]/95 backdrop-blur-xl border-white/5 p-2">
                                    <div className="grid gap-1">
                                        <Link href="/calendar">
                                            <DropdownMenuItem className="flex items-center gap-3 p-3 text-white/60 hover:text-white focus:text-white rounded-lg data-[highlighted]:bg-white/5 cursor-pointer group">
                                                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                                                    <Calendar className="h-5 w-5 text-white/30 group-hover:text-white/60 transition-colors" />
                                                </div>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-[14px] font-medium">Календарь</span>
                                                    <span className="text-[12px] text-white/30 group-hover:text-white/50">Расписание выхода</span>
                                                </div>
                                            </DropdownMenuItem>
                                        </Link>
                                        <Link href="/characters">
                                        <DropdownMenuItem className="flex items-center gap-3 p-3 text-white/60 hover:text-white focus:text-white rounded-lg data-[highlighted]:bg-white/5 cursor-pointer group">
                                            <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                                                <Users2 className="h-5 w-5 text-white/80" />
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[14px] font-medium">Персонажи</span>
                                                <span className="text-[12px] text-white/40 group-hover:text-white/60">База персонажей</span>
                                            </div>
                                        </DropdownMenuItem>
                                        </Link>
                                        <DropdownMenuSeparator className="my-1 bg-white/5" />
                                        
                                        <DropdownMenuItem className="flex items-center gap-3 p-3 text-white/60 hover:text-white focus:text-white rounded-lg data-[highlighted]:bg-white/5 cursor-pointer group">
                                            <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                                                <Flame className="h-5 w-5 text-white/80" />
                                            </div>
                                            <Link href='/anime-list?order=desc&sort=score&page=1'>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-[14px] font-medium">Популярное</span>
                                                    <span className="text-[12px] text-white/40 group-hover:text-white/60">Топ просмотров</span>
                                                </div>
                                            </Link>
                                        </DropdownMenuItem>
                                        <Link href='/anime-list?page=1&status=ongoing&order=desc&sort=score'>
                                            <DropdownMenuItem className="flex items-center gap-3 p-3 text-white/60 hover:text-white focus:text-white rounded-lg data-[highlighted]:bg-white/5 cursor-pointer group">
                                                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                                                    <PlayCircle className="h-5 w-5 text-white/80" />
                                                </div>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-[14px] font-medium">Онгоинги</span>
                                                    <span className="text-[12px] text-white/40 group-hover:text-white/60">Текущие релизы</span>
                                                </div>
                                            </DropdownMenuItem>
                                        </Link>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-5">
                        {/* PRO Button - новый вариант */}
                        <Button 
                            variant="ghost"
                            className="relative group h-[50px] px-5 rounded-xl 
                                     border border-[#CCBAE4]/20
                                     hover:border-[#CCBAE4]/40 transition-all duration-300"
                        >

                            
                            <div className="relative flex items-center gap-2">
                                <div className="relative">
                                    <Sparkles className="w-4 h-4 text-[#CCBAE4] animate-pulse" />
                                </div>
                                <span className="text-[14px] font-medium text-[#CCBAE4]/70">
                                    PRO
                                </span>
                            </div>
                        </Button>
                        <Button 
                            variant="ghost" 
                            className="h-[50px] pl-4 pr-3 rounded-[12px] border border-white/5 hover:border-white/10 transition-all duration-200 flex items-center gap-4"
                            onClick={() => setIsSearchOpen(true)}
                        >
                            <div className="flex items-center gap-3">
                                <HiSearch className="h-[18px] w-[18px] text-white/30" />
                                <span className="text-[14px] font-normal text-white/40">Поиск аниме</span>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1">
                                <kbd className="text-[10px] font-medium text-white/30">⌘</kbd>
                                <kbd className="text-[10px] font-medium text-white/30">K</kbd>
                            </div>
                        </Button>
                        <div className="hidden md:block w-[1px] h-[20px] bg-white/5" />
                        {isClient && hydrated ? (
                            isAuthenticated && user ? (
                                <UserLoggedNavBar 
                                    username={user.username}
                                    nickname={user.nickname}
                                    avatar={avatarUrl}
                                    isPro={user.isPro}
                                />
                            ) : (
                                <UserNotLoggedNavBar />
                            )
                        ) : (
                            <div className="w-[120px] h-[50px] bg-white/[0.02] rounded-[12px] animate-pulse" />
                        )}
                    </div>

                    <div className="flex md:hidden items-center gap-3">
                        <Button 
                            variant="ghost"
                            className="h-11 px-4 rounded-xl bg-[#0A0A0A] border border-[#CCBAE4]/20
                                     hover:border-[#CCBAE4]/40 transition-all duration-300"
                        >
                            <div className="relative">
                                <Sparkles className="w-4 h-4 text-[#CCBAE4] animate-pulse" />
                                <div className="absolute -inset-1 bg-[#CCBAE4]/20 blur-xl animate-pulse" />
                            </div>
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-11 w-11 rounded-xl border border-white/5"
                            onClick={() => setIsSearchOpen(true)}
                        >
                            <HiSearch className="h-5 w-5 text-white/40" />
                        </Button>

                        <button
                            className="flex items-center justify-center h-11 w-11 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all text-white/80 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <HiX size={20} /> : <HiMenu size={20} />}
                        </button>
                    </div>
                </nav>
            </header>

            {/* Мобильное меню */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 bg-[#060606]/95 backdrop-blur-xl z-60 pt-[89px]">
                    <div className="container h-[calc(100vh-89px)] mx-auto px-4 py-6 flex flex-col">
                        <div className="flex-1 flex flex-col gap-6">
                            {/* Навигация */}
                            <div className="space-y-1">
                                <Link href="/anime-list">
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start gap-3 p-3 h-auto text-white/60 hover:text-white rounded-lg"
                                    >
                                        <PlayCircle className="h-5 w-5" />
                                        <div className="flex flex-col items-start">
                                            <span className="text-[14px] font-medium">Все аниме</span>
                                            <span className="text-[12px] text-white/40">Каталог аниме</span>
                                        </div>
                                    </Button>
                                </Link>

                                <Link href="/calendar">
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start gap-3 p-3 h-auto text-white/60 hover:text-white rounded-lg"
                                    >
                                        <Calendar className="h-5 w-5" />
                                        <div className="flex flex-col items-start">
                                            <span className="text-[14px] font-medium">Календарь</span>
                                            <span className="text-[12px] text-white/40">Расписание выхода</span>
                                        </div>
                                    </Button>
                                </Link>

                                <Link href="/characters">
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start gap-3 p-3 h-auto text-white/60 hover:text-white rounded-lg"
                                    >
                                        <Users2 className="h-5 w-5" />
                                        <div className="flex flex-col items-start">
                                            <span className="text-[14px] font-medium">Персонажи</span>
                                            <span className="text-[12px] text-white/40">База персонажей</span>
                                        </div>
                                    </Button>
                                </Link>

                                <Link href="/anime-list?order=desc&sort=score&page=1">
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start gap-3 p-3 h-auto text-white/60 hover:text-white rounded-lg"
                                    >
                                        <Flame className="h-5 w-5" />
                                        <div className="flex flex-col items-start">
                                            <span className="text-[14px] font-medium">Популярное</span>
                                            <span className="text-[12px] text-white/40">Топ просмотров</span>
                                        </div>
                                    </Button>
                                </Link>

                                <Link href="/anime-list?page=1&status=ongoing&order=desc&sort=score">
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start gap-3 p-3 h-auto text-white/60 hover:text-white rounded-lg"
                                    >
                                        <PlayCircle className="h-5 w-5" />
                                        <div className="flex flex-col items-start">
                                            <span className="text-[14px] font-medium">Онгоинги</span>
                                            <span className="text-[12px] text-white/40">Текущие релизы</span>
                                        </div>
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Нижняя секция */}
                        <div className="pt-6 border-t border-white/5">
                            {isClient && hydrated ? (
                                isAuthenticated && user ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02]">
                                            <HeaderAvatar />
                                            <div className="flex-1">
                                                <p className="text-[14px] font-medium text-white/90">
                                                    {user.nickname || user.username}
                                                </p>
                                                <p className="text-[12px] text-white/40">@{user.username}</p>
                                            </div>
                                        </div>
                                        <Link href={`/profile/${user.username}`}>
                                            <Button variant="ghost" 
                                                   className="w-full justify-start h-11 text-white/60">
                                                Мой профиль
                                            </Button>
                                        </Link>
                                        <Button variant="ghost" 
                                                onClick={logout}
                                                className="w-full justify-start h-11 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                                            Выйти
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        <Link href="/auth" className="w-full">
                                            <Button className="w-full h-[50px] rounded-xl bg-[#DEDEDF] hover:bg-[#DEDEDF]/90 text-black">
                                                Авторизация
                                            </Button>
                                        </Link>
                                        <Link href="/auth/register" className="w-full">
                                            <Button variant="outline" 
                                                    className="w-full h-[50px] rounded-xl border-white/10 hover:bg-white/5">
                                                Регистрация
                                            </Button>
                                        </Link>
                                    </div>
                                )
                            ) : (
                                <div className="w-full h-[50px] bg-white/[0.02] rounded-xl animate-pulse" />
                            )}
                        </div>
                    </div>
                </div>
            )}

            <SearchModal 
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
        </>
    );
}

export default Header;