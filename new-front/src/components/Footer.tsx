'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { UserIcon, VK, Telegram, Discord, YouTube } from '@/shared/icons'; 

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const t = useTranslations('common');
  const pathname = usePathname();

  const isHomePage = pathname === '/';
  const isCharacterPage = pathname.startsWith('/anime/[id]/character/[id]');

  // Большой футер для главной и страниц персонажей
  if (isHomePage || isCharacterPage) {
    return (
      <footer className={className || 'bg-black text-white/60 p-8 border-t border-white/5'}>
        <div className="container mx-auto flex flex-col items-center gap-8">
          {/* Верхняя часть: Логотип и поддержка */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="../shared/images/Image.png" 
                alt="Anisign Logo"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full"
              />
              <span className="text-xl font-bold">Anisign.com</span>
            </div>
            <p className="text-center text-sm">
              {t('supportEmail')}
            </p>
          </div>

          {/* Средняя часть: Навигация, отслеживание и социальные сети */}
          <div className="flex justify-center gap-16 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold">{t('navigation')}</h4>
              <ul className="space-y-1">
                <li>{t('streamAnime')}</li>
                <li>{t('comments')}</li>
                <li>{t('characters')}</li>
                <li>{t('calendar')}</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">{t('tracking')}</h4>
              <ul className="space-y-1">
                <li>{t('content')}</li>
                <li>{t('report')}</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">{t('socialMedia')}</h4>
              <div className="flex gap-2">
                <VK className="w-5 h-5" />
                <Telegram className="w-5 h-5" />
                <Discord className="w-5 h-5" />
                <YouTube className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Нижняя часть: Иконка и копирайт */}
          <div className="flex items-center justify-between w-full max-w-md text-sm">
            <Image
              src="/images/icons/Image.png"
              alt="Anisign Icon"
              width={30}
              height={30}
              className="w-8 h-8 rounded-full"
            />
            <span>{t('copyright')}</span>
          </div>
        </div>
      </footer>
    );
  }

  // Компактный футер для остальных страниц
  return (
    <footer className={className || 'bg-black text-white/60 p-4 border-t border-white/5 flex items-center justify-between'}>
      <div className="flex items-center gap-2">
        <Image
          src="../shared/images/Image.png" 
          alt="Anisign Logo"
          width={30}
          height={30}
          className="w-8 h-8 rounded-full"
        />
        <span className="text-sm">Anisign.com</span>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span>{t('supportEmail')}</span>
        <span>{t('copyright')}</span>
      </div>
    </footer>
  );
}