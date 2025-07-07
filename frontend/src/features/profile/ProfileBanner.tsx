'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  generateBannerGradient,
  getCachedBannerUrl,
  BannerSize,
  BANNER_SIZE_MAP,
} from '@/utils/bannerUtils';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

/**
 * Пропсы компонента ProfileBanner
 * @interface ProfileBannerProps
 */
interface ProfileBannerProps {
  user_banner?: string;
  username?: string;
  isOwnProfile: boolean;
  isLoading?: boolean;
  size?: BannerSize;
  className?: string;
}

/**
 * Компонент баннера профиля
 * @description Отображает баннер профиля с возможностью загрузки нового изображения для владельца профиля
 * @param {ProfileBannerProps} props - Пропсы компонента
 * @returns {JSX.Element}
 */
export const ProfileBanner: React.FC<ProfileBannerProps> = React.memo(
  ({ user_banner, username, isOwnProfile, isLoading = false, size = 'full', className }) => {
    const { bannerTimestamp } = useAuth();
    const [isImageError, setIsImageError] = useState(false);
    // Начальное состояние загрузки зависит от наличия баннера
    const [isImageLoading, setIsImageLoading] = useState(!!user_banner);
    const prevFullBannerUrl = useRef('');

    // Используем кешированную версию URL баннера
    const fullBannerUrl = React.useMemo(() => {
      // Принудительно обновляем кеш, если это баннер пользователя и обновился timestamp
      const forceRefresh = isOwnProfile && bannerTimestamp > 0;
      return getCachedBannerUrl(user_banner, forceRefresh);
    }, [user_banner, isOwnProfile, bannerTimestamp]);

    // Сбрасываем состояние ошибки при изменении URL баннера
    useEffect(() => {
      if (fullBannerUrl && fullBannerUrl !== prevFullBannerUrl.current) {
        setIsImageError(false);
        setIsImageLoading(true);
        prevFullBannerUrl.current = fullBannerUrl;
      } else if (!fullBannerUrl) {
        // Если баннера нет, не показываем состояние загрузки
        setIsImageLoading(false);
        setIsImageError(false);
      }
    }, [fullBannerUrl]);

    // Генерируем градиент на основе имени пользователя, если баннер отсутствует
    const bannerGradient = React.useMemo(() => {
      return generateBannerGradient(username);
    }, [username]);

    const bannerSize = BANNER_SIZE_MAP[size] || BANNER_SIZE_MAP.full;
    const hasBanner = fullBannerUrl && !isImageError && fullBannerUrl.trim() !== '';

    const handleImageLoad = () => {
      setIsImageLoading(false);
    };

    const handleImageError = () => {
      console.error('Ошибка загрузки баннера:', fullBannerUrl);
      setIsImageError(true);
      setIsImageLoading(false);
    };

    if (isLoading) {
      return (
        <div className={cn('w-full relative', bannerSize, className)}>
          <div className='w-full h-full bg-[#060606]/80'>
            {/* Градиентные переходы для анимации загрузки */}
            <div className='absolute inset-0 bg-gradient-to-t from-[#060606] via-[#06060680] to-[#06060620]' />
            <div className='absolute inset-0 bg-gradient-to-b from-[#06060640] via-transparent to-transparent' />
            <div className='absolute inset-0 bg-gradient-to-r from-[#06060620] via-transparent to-[#06060620]' />

            {/* Эффект пульсации */}
            <div className='' style={{ animationDuration: '2s' }} />
          </div>
        </div>
      );
    }

    return (
      <div className={cn('relative w-full overflow-hidden', bannerSize, className)}>
        {hasBanner ? (
          <div className='relative w-full h-full'>
            {/* Проверка fullBannerUrl перед использованием Image */}
            <Image
              key={fullBannerUrl} // Принудительно перемонтируем Image при изменении URL
              src={fullBannerUrl}
              alt='Profile Banner'
              fill
              priority
              unoptimized={true}
              loading='eager'
              className={cn(
                'object-cover',
                isImageLoading && 'opacity-0',
                !isImageLoading && 'opacity-100 transition-opacity duration-500'
              )}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />

            {/* Восстановление оригинальных градиентных переходов для баннера */}
            <div className='absolute inset-0 bg-gradient-to-t from-[#060606] via-[#06060640] to-transparent' />
            <div className='absolute inset-0 bg-gradient-to-b from-[#06060640] via-transparent to-transparent' />
            <div className='absolute inset-0 bg-gradient-to-r from-[#06060620] via-transparent to-[#06060620]' />
          </div>
        ) : (
          <div className='w-full h-full' style={{ background: bannerGradient }}>
            {/* Градиентные переходы для фона */}
            <div className='absolute inset-0 bg-gradient-to-t from-[#060606] via-transparent to-transparent' />
            <div className='absolute inset-0 bg-gradient-to-b from-[#06060640] via-transparent to-transparent' />
            <div className='absolute inset-0 bg-gradient-to-r from-[#06060620] via-transparent to-[#06060620]' />
          </div>
        )}
      </div>
    );
  }
);

ProfileBanner.displayName = 'ProfileBanner';
export default ProfileBanner;
