'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { UserMenu } from '@/features/user-menu/UserMenu';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import SearchModal from '@/features/search/SearchModal';

const Header = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();
  // Добавляем состояние для отслеживания гидратации
  const [isMounted, setIsMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Эффект для отметки, что компонент смонтирован на клиенте
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Определяем, находимся ли мы на странице аниме
  const isAnimePage = pathname === '/anime';

  // Если мы на странице аниме, сохраняем текущие параметры URL
  const animeLink =
    isAnimePage && searchParams.toString() ? `/anime?${searchParams.toString()}` : '/anime';

  return (
    <header className='border-b border-white/5 py-4 h-[100px] flex items-center'>
      <div className='container px-4 mx-auto flex justify-between'>
        <div className='flex gap-7 items-center'>
          <Link href='/' className='flex items-center gap-3'>
            <Image src='/logo.jpg' alt='Logo' width={40} height={40} className='rounded-full' />
            <h1 className='text-[16px]'>Anisign</h1>
          </Link>
          <div className='w-[2px] h-[20px] bg-white/5'></div>
          <div className='flex items-center gap-5'>
            <Link href={animeLink} className='text-[14px] opacity-80 hover:opacity-100'>
              Список аниме
            </Link>
            <Link href='/characters' className='text-[14px] opacity-80 hover:opacity-100'>
              Персонажи
            </Link>
            <Link href='/news' className='text-[14px] opacity-80 hover:opacity-100'>
              Новости
            </Link>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          {/* Кнопка поиска */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className='flex items-center justify-center w-[40px] h-[40px] rounded-full bg-white/[0.02] hover:bg-white/[0.08] transition-colors border border-white/5'
            aria-label='Поиск'
          >
            <svg
              width='15'
              height='15'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>

          {/* Скрываем элементы авторизации до завершения проверки */}
          {!isMounted || loading ? (
            <div className='w-[128px] h-[50px] rounded-full bg-[rgba(255,255,255,0.02)] animate-pulse'></div>
          ) : (
            <>
              {!isAuthenticated ? (
                <Button
                  onClick={() => router.push('/auth')}
                  className='bg-[#DEDEDF] text-black h-[50px] px-5 rounded-xl'
                >
                  Авторизация
                </Button>
              ) : (
                <UserMenu />
              )}
            </>
          )}
        </div>
      </div>

      {/* Модальное окно поиска */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
};

export default Header;
