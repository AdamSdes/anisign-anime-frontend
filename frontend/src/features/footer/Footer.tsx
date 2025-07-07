'use client';

import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='border-t border-white/5 py-8 mt-auto'>
      <div className='container px-4 mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='flex flex-col gap-4'>
            <Link href='/' className='flex items-center gap-3'>
              <Image src='/logo.jpg' alt='Logo' width={40} height={40} className='rounded-full' />
              <h2 className='text-[16px]'>Anisign</h2>
            </Link>
            <p className='text-sm text-white/60'>
              Ваш проводник в мире аниме. Находите, сохраняйте и делитесь любимыми аниме.
            </p>
          </div>
          
          <div className='flex flex-col gap-3'>
            <h3 className='text-sm font-medium mb-2'>Навигация</h3>
            <Link href='/' className='text-sm text-white/60 hover:text-white transition-colors'>
              Главная
            </Link>
            <Link href='/anime' className='text-sm text-white/60 hover:text-white transition-colors'>
              Список аниме
            </Link>
            <Link href='/characters' className='text-sm text-white/60 hover:text-white transition-colors'>
              Персонажи
            </Link>
            <Link href='/favorites' className='text-sm text-white/60 hover:text-white transition-colors'>
              Избранное
            </Link>
          </div>
          
          <div className='flex flex-col gap-3'>
            <h3 className='text-sm font-medium mb-2'>Социальные сети</h3>
            <div className='flex gap-4'>
              <a 
                href='https://t.me/anisign' 
                target='_blank' 
                rel='noopener noreferrer'
                className='w-8 h-8 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center hover:bg-white/[0.04] transition-colors'
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 4.5L2.5 12.5L21.5 20.5L21.5 4.5Z"></path>
                  <path d="M21.5 4.5L10.5 15.5L2.5 12.5"></path>
                  <path d="M21.5 4.5L10.5 15.5L10.5 20.5L13.5 17.5"></path>
                </svg>
              </a>
              <a 
                href='https://vk.com/anisign' 
                target='_blank' 
                rel='noopener noreferrer'
                className='w-8 h-8 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center hover:bg-white/[0.04] transition-colors'
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93V15.07C2 20.67 3.33 22 8.93 22H15.07C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2ZM18.15 16.27H16.69C16.14 16.27 15.97 15.82 14.86 14.72C13.86 13.77 13.49 13.67 13.27 13.67C12.95 13.67 12.87 13.76 12.87 14.18V15.77C12.87 16.1 12.75 16.27 11.81 16.27C10.35 16.27 8.74 15.35 7.57 13.73C5.66 11.08 5.2 9.04 5.2 8.66C5.2 8.45 5.28 8.26 5.69 8.26H7.15C7.49 8.26 7.64 8.43 7.78 8.82C8.47 10.88 9.6 12.7 10.06 12.7C10.25 12.7 10.33 12.61 10.33 12.13V9.57C10.29 8.53 9.75 8.46 9.75 8.13C9.75 7.97 9.89 7.82 10.12 7.82H12.3C12.59 7.82 12.71 7.97 12.71 8.34V11.48C12.71 11.78 12.85 11.9 12.95 11.9C13.14 11.9 13.31 11.78 13.66 11.43C14.67 10.33 15.41 8.67 15.41 8.67C15.5 8.46 15.68 8.26 16.03 8.26H17.49C17.93 8.26 18.05 8.48 17.93 8.82C17.71 9.56 16.39 11.49 16.39 11.49C16.21 11.77 16.14 11.89 16.39 12.2C16.58 12.44 17.09 12.89 17.43 13.29C18.05 13.99 18.53 14.6 18.68 15.01C18.84 15.42 18.63 15.64 18.15 15.64V16.27Z"/>
                </svg>
              </a>
              <a 
                href='https://discord.gg/anisign' 
                target='_blank' 
                rel='noopener noreferrer'
                className='w-8 h-8 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center hover:bg-white/[0.04] transition-colors'
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.02-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .02.01.04.03.05 1.8 1.32 3.53 2.12 5.24 2.65.03.01.06 0 .07-.02.4-.55.76-1.13 1.07-1.74.02-.04 0-.08-.04-.09-.57-.22-1.11-.48-1.64-.78-.04-.02-.04-.08-.01-.11.11-.08.22-.17.33-.25.02-.02.05-.02.07-.01 3.44 1.57 7.15 1.57 10.55 0 .02-.01.05-.01.07.01.11.09.22.17.33.26.04.03.04.09-.01.11-.52.31-1.07.56-1.64.78-.04.01-.05.06-.04.09.32.61.68 1.19 1.07 1.74.03.02.06.03.09.02 1.72-.53 3.45-1.33 5.25-2.65.02-.01.03-.03.03-.05.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12 0-1.17.84-2.12 1.89-2.12 1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12 0-1.17.84-2.12 1.89-2.12 1.06 0 1.9.96 1.89 2.12 0 1.17-.83 2.12-1.89 2.12z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className='mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-xs text-white/40'>
            © {currentYear} Anisign. Все права защищены.
          </p>
          <div className='flex gap-6'>
            <Link href='/terms' className='text-xs text-white/40 hover:text-white/60 transition-colors'>
              Условия использования
            </Link>
            <Link href='/privacy' className='text-xs text-white/40 hover:text-white/60 transition-colors'>
              Политика конфиденциальности
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
