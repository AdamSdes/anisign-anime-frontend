import React from 'react'
import Link from 'next/link'
import { Github, Twitter, Mail } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="border-t border-white/5">
            <div className="container mx-auto px-2">
                <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Логотип и описание */}
                    <div className="flex flex-col gap-6">
                        <Link href="/" className="flex items-center gap-4 w-fit">
                            <img src="/logo_header.png" alt="Logo" className="w-8 h-8" />
                            <span className="text-white/90 font-medium">Anisign</span>
                        </Link>
                        <p className="text-sm text-white/50 leading-relaxed max-w-[280px]">
                            Современная платформа для просмотра аниме с удобным интерфейсом и регулярными обновлениями
                        </p>
                    </div>

                    {/* Навигация */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-semibold text-white/80">Навигация</h3>
                        <div className="flex flex-col gap-3">
                            <Link href="/anime" className="text-sm text-white/50 hover:text-white/80 transition-colors w-fit">
                                Каталог аниме
                            </Link>
                            <Link href="/calendar" className="text-sm text-white/50 hover:text-white/80 transition-colors w-fit">
                                Календарь
                            </Link>
                            <Link href="/characters" className="text-sm text-white/50 hover:text-white/80 transition-colors w-fit">
                                Персонажи
                            </Link>
                        </div>
                    </div>

                    {/* Правовая информация */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-semibold text-white/80">Информация</h3>
                        <div className="flex flex-col gap-3">
                            <Link href="/about" className="text-sm text-white/50 hover:text-white/80 transition-colors w-fit">
                                О проекте
                            </Link>
                            <Link href="/privacy" className="text-sm text-white/50 hover:text-white/80 transition-colors w-fit">
                                Конфиденциальность
                            </Link>
                            <Link href="/terms" className="text-sm text-white/50 hover:text-white/80 transition-colors w-fit">
                                Условия использования
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
                                href="mailto:contact@anisign.com"
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                <Mail className="w-5 h-5 text-white/80" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Нижняя часть футера */}
                <div className="py-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-white/40">
                        © 2024 Anisign. Все права защищены.
                    </p>
                    <div className="flex items-center gap-6">
                        <span className="text-xs text-white/30">Версия 1.0.0</span>
                        <span className="text-xs text-white/30">Made with ❤️ by Anisign Team</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
