import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { useAuth } from '@/context/AuthContext';
import { UserAvatar } from '@/components/user/UserAvatar';
import { MdLogout, MdAccountCircle, MdInfo } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { useTokenExpiration } from '@/hooks/useTokenExpiration';
import { useEffect, useState } from 'react';

// Форматирование времени в минутах и секундах
const formatTimeLeft = (expInfo: { minutes: number; seconds: number }) => {
  return `${expInfo.minutes.toString().padStart(2, '0')}:${expInfo.seconds
    .toString()
    .padStart(2, '0')}`;
};

export function UserMenu() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  // Получаем обратный отсчет до истечения срока токена
  const { minutes, seconds, expired } = useTokenExpiration();

  // Форматированное отображение оставшегося времени
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    // Обновляем отображение времени каждую секунду
    if (minutes !== undefined && seconds !== undefined) {
      setTimeLeft(formatTimeLeft({ minutes, seconds }));

      const interval = setInterval(() => {
        if (minutes !== undefined && seconds !== undefined) {
          setTimeLeft(formatTimeLeft({ minutes, seconds }));
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [minutes, seconds]);

  // Обработчик нажатия на кнопку профиля
  const handleProfileClick = () => {
    if (user) {
      // Используем window.location для полной перезагрузки страницы
      // Это избавит от ошибки 404 с параметром _rsc 
      window.location.href = `/profile/${user.username}`;
      // Альтернативный вариант с router, но могут быть проблемы с RSC
      // router.push(`/profile/${user.username}`);
    }
  };

  // Обработчик выхода
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  // Обработчик для открытия модального окна "О приложении"
  const handleAboutClick = () => {
    // TODO: Реализовать модальное окно с информацией о приложении
    alert('О приложении Anisign');
  };

  return (
    <Menubar className='bg-[#0A0A0A] rounded-full hover:bg-[#111111] transition-all duration-300 h-[50px] px-2.5 border-0 !border-none'>
      <MenubarMenu>
        <MenubarTrigger className='p-0 data-[state=open]:bg-transparent focus:bg-transparent cursor-pointer focus:ring-0'>
          <div className='flex items-center gap-3'>
            <UserAvatar user={user} showStatus={true} size='sm' />
            <div className='font-medium truncate opacity-90 mr-2 text-[14px]'>
              {user?.username || 'Гость'}
            </div>
          </div>
        </MenubarTrigger>
        <MenubarContent
          align='end'
          className='mr-1 mt-1 min-w-[220px] bg-[#0A0A0A]/95 backdrop-blur-md text-white rounded-xl shadow-xl overflow-hidden'
        >
          <div className='flex items-center gap-3 p-3 '>
            <UserAvatar user={user} size='md' className='shrink-0' />
            <div className='flex flex-col overflow-hidden'>
              <div className='font-medium truncate text-[15px]'>{user?.username || 'Гость'}</div>
              {minutes !== undefined && seconds !== undefined && isAuthenticated && !expired ? (
                <div className='text-[11px] text-white/50 truncate flex items-center gap-1.5'>
                  <span className='w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse'></span>
                  <span>Сеанс: {timeLeft}</span>
                </div>
              ) : (
                <div className='text-[11px] text-white/50'>Войдите в аккаунт</div>
              )}
            </div>
          </div>

          <MenubarSeparator className='bg-white/5 h-[1px]' />

          {isAuthenticated ? (
            <>
              <div className='p-1.5'>
                <MenubarItem
                  className='cursor-pointer flex items-center gap-3 text-sm focus:bg-white/5 hover:bg-white/5 rounded-lg px-3 py-2.5 transition-colors'
                  onClick={handleProfileClick}
                >
                  <div className='flex items-center justify-center w-7 h-7 rounded-full bg-white/5'>
                    <MdAccountCircle className='h-4 w-4' />
                  </div>
                  <span>Мой профиль</span>
                </MenubarItem>

                <MenubarItem
                  className='cursor-pointer flex items-center gap-3 text-sm focus:bg-white/5 hover:bg-white/5 rounded-lg px-3 py-2.5 transition-colors'
                  onClick={handleAboutClick}
                >
                  <div className='flex items-center justify-center w-7 h-7 rounded-full bg-white/5'>
                    <MdInfo className='h-4 w-4' />
                  </div>
                  <span>О приложении</span>
                </MenubarItem>
              </div>

              <MenubarSeparator className='bg-white/5 h-[1px]' />

              <div className='p-1.5'>
                <MenubarItem
                  className='cursor-pointer flex items-center gap-3 text-sm focus:bg-white/5 hover:bg-white/5 rounded-lg px-3 py-2.5 transition-colors text-red-400'
                  onClick={handleLogout}
                >
                  <div className='flex items-center justify-center w-7 h-7 rounded-full bg-red-500/10'>
                    <MdLogout className='h-4 w-4' />
                  </div>
                  <span>Выйти</span>
                </MenubarItem>
              </div>
            </>
          ) : (
            <div className='p-1.5'>
              <MenubarItem
                className='cursor-pointer flex items-center justify-center rounded-lg py-2.5 transition-colors bg-white text-[#060606] font-medium hover:bg-white/90'
                onClick={() => router.push('/auth')}
              >
                Войти в аккаунт
              </MenubarItem>
            </div>
          )}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

// Добавляем экспорт по умолчанию для совместимости
export default UserMenu;
