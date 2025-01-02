'use client';
import React from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Footer = () => {
    return (
        <footer className="border-t border-white/5 bg-[#060606]/30 backdrop-blur-xl">
            <div className="container mx-auto px-4 py-12">
                {/* Основная секция */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Бренд */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-3">
                            <img src="/logo.png" alt="AniSign" className="w-8 h-8" />
                            <span className="text-lg font-semibold">AniSign</span>
                        </Link>
                        <p className="text-sm text-white/60 max-w-[280px]">
                            Ваш проводник в мир аниме. Смотрите любимые сериалы в HD качестве
                        </p>
                    </div>

                    {/* Навигация */}
                    <div>
                        <h3 className="font-medium mb-4">Навигация</h3>
                        <nav className="opacity-70 flex flex-col  space-y-3">
                            <Link href="/anime-list">Каталог аниме</Link>
                            <Link href="/calendar">Календарь</Link>
                            <Link href="/news">Новости</Link>
                            <Link href="/pro">Premium</Link>
                        </nav>
                    </div>

                    {/* Поддержка */}
                    <div>
                        <h3 className="font-medium mb-4">Поддержка</h3>
                        <nav className="opacity-70 flex flex-col space-y-3">
                            <Link href="/faq">FAQ</Link>
                            <Link href="/contact">Обратная связь</Link>
                            <Link href="/rules">Правила</Link>
                            <Link href="/dmca">DMCA</Link>
                        </nav>
                    </div>

                    {/* Присоединяйтесь */}
                    <div>
                        <h3 className="font-medium mb-4">Присоединяйтесь</h3>
                        <div className="space-y-4">
                            <p className="text-sm text-white/60">
                                Станьте частью сообщества любителей аниме
                            </p>
                            <Link href="/auth">
                                <Button 
                                    className="w-full mt-3 bg-[#CCBAE4] text-black hover:opacity-90"
                                >
                                    Регистрация
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Разделитель */}
                <div className="h-px bg-white/5 mb-8" />

                {/* Нижняя секция */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
                    <div className="flex items-center gap-1">
                        <span>Сделано</span>
                        <span>для любителей аниме</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy">Конфиденциальность</Link>
                        <Link href="/terms">Условия использования</Link>
                        <span>© 2024 AniSign</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
