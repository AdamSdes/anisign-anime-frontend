'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { User } from '@/types/user';
import { useAuth } from '@/context/AuthContext';
import { HiCamera } from 'react-icons/hi2';
import {
  getFullAvatarUrl,
  generateUserInitials,
  generateAvatarBgColor,
  AVATAR_SIZE_MAP,
  AvatarSize,
} from '@/utils/avatarUtils';

interface UserAvatarProps {
  user: User | null;
  className?: string;
  size?: AvatarSize;
  showStatus?: boolean;
  isOnline?: boolean;
  fallbackClassName?: string;
  imageClassName?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

/**
 * Компонент аватара пользователя
 * @description Отображает аватар пользователя с возможностью настройки размера, статуса и внешнего вида
 */
export const UserAvatar = React.memo(function UserAvatar({
  user,
  className,
  size = 'md',
  showStatus = false,
  isOnline = false,
  fallbackClassName,
  imageClassName,
  onClick,
}: UserAvatarProps) {
  const [isImageError, setIsImageError] = useState(false);
  // Начальное состояние загрузки зависит от наличия аватара
  const [isImageLoading, setIsImageLoading] = useState(!!(user?.avatar_url || user?.user_avatar));
  const { avatarTimestamp } = useAuth();

  // Преобразуем путь к аватару (используем как avatar_url, так и user_avatar)
  const fullAvatarUrl = useMemo(() => {
    const avatarPath = user?.avatar_url || user?.user_avatar || undefined;
    // Используем метку времени из контекста авторизации
    return getFullAvatarUrl(avatarPath, avatarTimestamp);
  }, [user?.avatar_url, user?.user_avatar, avatarTimestamp]);

  const initials = useMemo(() => {
    return generateUserInitials(user?.username, user?.nickname);
  }, [user?.username, user?.nickname]);

  const avatarSize = AVATAR_SIZE_MAP[size] || AVATAR_SIZE_MAP.md;
  const hasAvatar = fullAvatarUrl && !isImageError;

  // Random background color based on username
  const fallbackBgColor = useMemo(() => {
    return generateAvatarBgColor();
  }, []);

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageError = () => {
    console.error('Ошибка загрузки аватара:', fullAvatarUrl);
    setIsImageError(true);
    setIsImageLoading(false);
  };

  const prevUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (prevUrlRef.current !== fullAvatarUrl) {
      if (fullAvatarUrl) {
        setIsImageLoading(true);
        setIsImageError(false);
      } else {
        // Если аватара нет, не показываем состояние загрузки
        setIsImageLoading(false);
        setIsImageError(false);
      }
    }
    prevUrlRef.current = fullAvatarUrl;
  }, [fullAvatarUrl]);

  return (
    <div
      className={cn('relative', className)}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      aria-label={
        onClick ? 'Изменить аватар' : `Аватар пользователя ${user?.username || 'Неизвестный'}`
      }
      tabIndex={onClick ? 0 : undefined}
    >
      <Avatar
        className={cn(
          avatarSize,
          'border border-white/5',
          onClick && 'cursor-pointer hover:ring-2 hover:ring-white/10 transition-all duration-300'
        )}
      >
        {hasAvatar && (
          <>
            {isImageLoading && (
              <div className='absolute inset-0 flex items-center justify-center bg-white/5 rounded-full'>
                <div className='w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin' />
              </div>
            )}
            <AvatarImage
              src={fullAvatarUrl}
              className={cn(
                'object-cover',
                isImageLoading && 'opacity-0',
                !isImageLoading && 'opacity-100 transition-opacity duration-300',
                imageClassName
              )}
              onLoad={handleImageLoad}
              onError={handleImageError}
              alt={`Аватар ${user?.username || 'пользователя'}`}
              loading='eager'
              decoding='async'
            />
          </>
        )}
        <AvatarFallback
          className={cn(fallbackBgColor, 'text-black', fallbackClassName)}
          delayMs={hasAvatar ? 600 : 0}
        >
          {initials}
        </AvatarFallback>
      </Avatar>

      {showStatus && isOnline && (
        <div
          className='absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-background bg-green-500 size-2.5'
          aria-label='Пользователь онлайн'
        />
      )}

      {onClick && (
        <div className='absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 overflow-hidden'>
          <div className='absolute inset-0 bg-black/60 rounded-full' />
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/90 z-10'>
            <HiCamera className='w-5 h-5' />
          </div>
        </div>
      )}
    </div>
  );
});

// Добавляем displayName для отладки в React DevTools
UserAvatar.displayName = 'UserAvatar';

// Экспорт по умолчанию для совместимости
export default UserAvatar;
