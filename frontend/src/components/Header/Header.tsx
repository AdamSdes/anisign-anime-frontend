"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HiSearch, HiMenu } from "react-icons/hi";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import { atom, useAtom } from "jotai";
import { Badge } from "@/components/ui/badge";
import HeaderAvatar from "./HeaderAvatar";
import SearchModal from "@/components/SearchModal";

// Атом для состояния аутентификации
export const authAtom = atom<{ isAuthenticated: boolean; user: { username: string; nickname?: string; user_avatar?: string; isPro?: boolean } | null }>({
  isAuthenticated: false,
  user: null,
});

/**
 * Интерфейс пропсов компонента Header
 * @interface HeaderProps
 */
interface HeaderProps {
  className?: string;
}

/**
 * Компонент шапки сайта
 * @description Отображает навигационную панель с логотипом, поиском, уведомлениями и профилем
 * @param {HeaderProps} props - Пропсы компонента
 * @returns {JSX.Element}
 */
export const Header: React.FC<HeaderProps> = React.memo(({ className = "" }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [auth] = useAtom(authAtom);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      <motion.header
        className={`border-b border-white/5 sticky top-0 left-0 w-full h-[89px] bg-[#060606]/60 backdrop-blur-lg z-50 transition-all duration-300 ${
          isScrolled ? "bg-[#060606]/80 shadow-lg py-3" : "bg-transparent"
        } ${className}`}
        initial={{ y: 0 }}
        animate={{ y: isScrolled ? 0 : 0 }}
      >
        <nav className="container mx-auto px-4 h-full flex justify-between items-center">
          {/* Левая часть: Логотип и навигация */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-all">
              <img src="/logo_header.png" alt="logo" className="w-7 h-7"/>
              <span className="text-white/90 font-medium text-[15px]">Anisign</span>
            </Link>
            <Link href="/anime-list" className="text-white/60 font-medium text-[14px] hover:text-white transition-colors hidden md:block">
              Список аниме
            </Link>
          </div>

          {/* Правая часть: Поиск, уведомления, профиль, меню */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="h-[50px] pl-4 pr-[50px] hover:pr-20 rounded-[12px] border border-white/5 hover:border-white/10 transition-all duration-500 flex items-center gap-4"
              onClick={() => setIsSearchOpen(true)}
            >
              <HiSearch className="h-[18px] w-[18px] text-white/30" />
              <span className="text-[14px] font-normal text-white/40">Поиск...</span>
            </Button>
            {auth?.isAuthenticated && auth.user ? (
              <div className="flex items-center gap-2">
                <HeaderAvatar />
              </div>
            ) : (
              <Link href="/auth">
                <Button className="h-[50px] px-[25px] rounded-[12px] bg-[#DEDEDF] hover:bg-[#DEDEDF]/90 text-black font-medium transition-all">
                  Авторизация
                </Button>
              </Link>
            )}
            <button
              className="flex items-center justify-center h-11 w-11 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all text-white/80 hover:text-white md:hidden"
              onClick={toggleMobileMenu}
            >
              <HiMenu size={20} />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Мобильное меню (упрощённое) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-[#060606]/95 backdrop-blur-xl z-40 pt-[89px]">
          <div className="container mx-auto px-4 py-6 flex flex-col h-[calc(100vh-89px)]">
            <div className="flex-1 flex flex-col gap-6">
              <Link href="/anime-list" className="text-white/60 hover:text-white transition-colors">
                Список аниме
              </Link>
            </div>
            <div className="pt-6 border-t border-white/5">
              {auth?.isAuthenticated && auth.user ? (
                <div className="flex items-center gap-4">
                  <HeaderAvatar />
                  <div>
                    <p className="text-white/90">{auth.user.nickname || auth.user.username}</p>
                    <Link href={`/profile/${auth.user.username}`}>Мой профиль</Link>
                  </div>
                </div>
              ) : (
                <Link href="/auth">
                  <Button className="w-full h-[50px] rounded-xl bg-[#DEDEDF] hover:bg-[#DEDEDF]/90 text-black">
                    Авторизация
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
});

Header.displayName = "Header";
export default Header;