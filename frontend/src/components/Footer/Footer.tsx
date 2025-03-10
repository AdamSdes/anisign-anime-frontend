"use client";

import React from "react";
import Link from "next/link";

/**
 * Компонент футера
 * @description Отображает футер сайта с навигацией, контактами и копирайтом
 */
export const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Верхняя часть футера */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 text-center md:text-left">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-semibold text-[#A8A8A8]">
              <span className="text-[#A57AFF]">Anisign</span> — Аниме портал для фанатов, новичков и обученных лиц!
            </h2>
          </div>
          <Link
            href="/anime-list"
            className="bg-[#2A2A2A] text-white px-6 py-2 rounded-full hover:bg-[#3A3A3A] transition-colors text-sm"
          >
            Список аниме →
          </Link>
        </div>

        {/* Линия между верхней частью и колонками */}
        <div className="border-t border-white/5 mb-10"></div>

        {/* Основная часть футера */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10 text-center md:text-left">
          {/* Навигация */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-[#636363]">Навигация</h3>
            <div className="flex flex-col gap-2">
              <Link href="/anime" className="text-sm text-[#DADADA] hover:text-[#FFFFFF] transition-colors">
                Список аниме
              </Link>
              <Link href="/collections" className="text-sm text-[#DADADA] hover:text-[#FFFFFF] transition-colors">
                Коллекции
              </Link>
              <Link href="/characters" className="text-sm text-[#DADADA] hover:text-[#FFFFFF] transition-colors">
                Персонажи
              </Link>
              <Link href="/calendar" className="text-sm text-[#DADADA] hover:text-[#FFFFFF] transition-colors">
                Календарь
              </Link>              
            </div>
          </div>

          {/* Остальное */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-[#636363]">Остальное</h3>
            <div className="flex flex-col gap-2">
              <Link href="/comments" className="text-sm text-[#DADADA] hover:text-[#FFFFFF] transition-colors">
                Комментарии
              </Link>
              <Link href="/report" className="text-sm text-[#DADADA] hover:text-[#FFFFFF] transition-colors">
                Репорт
              </Link>
            </div>
          </div>

          {/* Связаться с нами */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-[#636363]">Связаться с нами</h3>
            <div className="flex justify-center md:justify-start gap-4">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <img src="/icon/VK.png" alt="VK" className="w-5 h-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <img src="/icon/Telegram.png" alt="Telegram" className="w-5 h-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <img src="/icon/Discord.png" alt="Discord" className="w-5 h-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <img src="/icon/YouTube.png" alt="YouTube" className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Нижняя часть футера */}
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo_header.png" alt="Anisign Logo" className="w-5 h-5" />
            <span className="text-sm text-white/40">Anisign.com</span>
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