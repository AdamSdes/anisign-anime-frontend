'use client';

import React from 'react';
import { Play, Activity, ImageIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

/**
 * Пропсы компонента ProfileInfo
 * @interface ProfileInfoProps
 */
interface ProfileInfoProps {
  username: string;
  nickname?: string;
  isLoading?: boolean;
  isOwnProfile?: boolean;
  onChangeBannerClick?: () => void;
}

/**
 * Компонент информации о профиле
 * @description Отображает информацию о пользователе, включая ник, статус и текущую активность
 * @param {ProfileInfoProps} props - Пропсы компонента
 * @returns {JSX.Element}
 */
export const ProfileInfo: React.FC<ProfileInfoProps> = React.memo(
  ({ isLoading = false, isOwnProfile = false, onChangeBannerClick }) => {
    if (isLoading) {
      return (
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-7 w-48 bg-white/5 rounded animate-pulse' />
          <Skeleton className='h-5 w-32 bg-white/5 rounded animate-pulse' />
        </div>
      );
    }

    // Mock data для текущего аниме и статуса пользователя
    const currentAnime = 'Магическая битва 2';
    const userLevel = 'Новичок';
    const userStatus = 'PRO';

    return (
      <div className='flex flex-col gap-4'>
        {/* Текущая активность */}
        <div className='flex items-center gap-2 text-sm'>
          <div className='flex items-center gap-2 py-1.5 rounded-lg'>
            <Play className='w-4 h-4 text-[#CCBAE4]' />
            <span className='text-white'>Смотрит: <span className='text-[#CCBAE4]'>{currentAnime}</span></span>
          </div>
        </div>

        {/* Статус пользователя */}
        <div className='flex items-center gap-5 text-sm mt-1'>
          <div className='flex items-center gap-2'>
            <span className='text-white/60'>Статус:</span>
            <span className='text-white font-medium'>{userStatus}</span>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-white/60'>Уровень:</span>
            <span className='text-white font-medium'>{userLevel}</span>
          </div>
          {/* Кнопка изменения баннера вместо достижений */}
          {isOwnProfile && onChangeBannerClick ? (
            <Button 
              onClick={onChangeBannerClick}
              variant='secondary'
              size='sm'
              className='bg-[#CCBAE4]/10 hover:bg-[#CCBAE4]/20 text-[#CCBAE4]'
            >
              <ImageIcon className='w-4 h-4 mr-2' />
              Изменить баннер
            </Button>
          ) : (
            <div className='flex items-center gap-2'>
              <Activity className='w-4 h-4 text-[#CCBAE4]' />
              <span className='text-white/60'>Достижения: 5</span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

ProfileInfo.displayName = 'ProfileInfo';
export default ProfileInfo;
