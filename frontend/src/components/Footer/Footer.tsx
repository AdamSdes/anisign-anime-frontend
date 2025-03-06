"use client";

import React from "react";
import Link from "next/link";
import { Github, Twitter, Youtube, MessageCircle, Calendar } from "lucide-react";

/**
 * Компонент футера
 * @description Отображает футер сайта с навигацией, контактами и копирайтом
 */
export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/5 bg-black">
      <div className="container mx-auto px-4">
        {/* Основная часть футера */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Логотип и описание */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3 w-fit">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-blue-500" />
              <span className="text-white/90 font-medium text-lg">Anisign</span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-[280px]">
              Аниме портал для фанатов, новичков и обученных лиц
            </p>
          </div>

          {/* Навигация */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-white/80">Навигация</h3>
            <div className="flex flex-col gap-3">
              <Link href="/anime" className="text-sm text-white/50 hover:text-white/80 transition-colors w-fit">
                Список аниме
              </Link>
              <Link href="/collections" className="text-sm text-white/50 hover:text-white/80 transition-colors w-fit">
                Коллекции
              </Link>
              <Link href="/characters" className="text-sm text-white/50 hover:text-white/80 transition-colors w-fit">
                Персонажи
              </Link>
              <Link href="/calendar" className="text-sm text-white/50 hover:text-white/80 transition-colors w-fit">
                Календарь
              </Link>
            </div>
          </div>

          {/* Остальное */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-white/80">Остальное</h3>
            <div className="flex flex-col gap-3">
              <Link href="/comments" className="text-sm text-white/50 hover:text-white/80 transition-colors w-fit">
                Комментарии
              </Link>
              <Link href="/retro" className="text-sm text-white/50 hover:text-white/80 transition-colors w-fit">
                Ретроги
              </Link>
            </div>
          </div>

          {/* Социальные сети и контакты */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-white/80">Связаться с нами</h3>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Github className="w-5 h-5 text-white/80" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Twitter className="w-5 h-5 text-white/80" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-white/80" />
              </a>
              <a
                href="https://telegram.org"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-white/80" /> 
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Youtube className="w-5 h-5 text-white/80" />
              </a>
            </div>
          </div>
        </div>

        {/* Нижняя часть футера */}
        <div className="py-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href="/" className="flex items-center gap-3 w-fit">
            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-pink-500 to-blue-500" />
            <span className="text-white/40 text-sm">Anisign.com</span>
          </Link>
          <div className="flex items-center gap-6">
            <a href="mailto:support@anisign.com" className="text-sm text-white/40">
              support@anisign.com
            </a>
            <span className="text-sm text-white/40">© 2024 Anisign</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.displayName = "Footer";
export default Footer;