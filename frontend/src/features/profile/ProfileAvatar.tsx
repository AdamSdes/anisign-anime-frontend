'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { UserAvatar } from '@/components/user/UserAvatar';
import { User } from '@/types/user';
import { getFullAvatarUrl } from '@/utils/avatarUtils';

/**
 * Пропсы компонента ProfileAvatar
 * @interface ProfileAvatarProps
 */
interface ProfileAvatarProps {
  username: string;
  avatar?: string;
  nickname?: string;
  isOwnProfile: boolean;
  isLoading?: boolean;
  onUploadClick?: () => void; // Добавляем функцию для открытия диалога загрузки
}

/**
 * Компонент аватара профиля
 * @description Отображает аватар пользователя с возможностью загрузки нового изображения для владельца профиля
 * @param {ProfileAvatarProps} props - Пропсы компонента
 * @returns {JSX.Element}
 */
export const ProfileAvatar: React.FC<ProfileAvatarProps> = React.memo(
  ({ username, avatar, nickname, isOwnProfile, isLoading = false, onUploadClick }) => {
    const { avatarTimestamp } = useAuth();

    // Создаем объект пользователя для UserAvatar
    const userObject: User = useMemo(
      () => ({
        id: '0', // Не имеет значения для отображения аватара, но должен быть строкой
        username,
        nickname: nickname || username,
        avatar_url: avatar,
        created_at: '', // Не имеет значения для отображения аватара
        updated_at: '', // Не имеет значения для отображения аватара
      }),
      [username, nickname, avatar]
    );

    // Преобразуем путь к аватару в полный URL для фонового изображения
    const fullBackgroundUrl = useMemo(() => {
      if (!avatar) return '';
      // Используем метку времени из контекста авторизации для собственного профиля
      // или текущее время для чужого профиля
      return getFullAvatarUrl(avatar, isOwnProfile ? avatarTimestamp : Date.now());
    }, [avatar, isOwnProfile, avatarTimestamp]);

    if (isLoading) {
      return (
        <div className='relative flex flex-col items-center justify-center w-[185px] h-[247px] gap-3 rounded-[14px] border border-white/5 overflow-hidden'>
          <div className='relative'>
            <div className='h-[120px] w-[120px] rounded-full bg-[#060606]/80 flex items-center justify-center'>
              <svg
                className='animate-spin h-8 w-8 text-white/40'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                />
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                />
              </svg>
            </div>
          </div>
          <div className='flex flex-col items-center gap-1'>
            <div className='h-6 w-32 bg-[#060606]/80 rounded animate-pulse'></div>
            {nickname && <div className='h-4 w-24 bg-[#060606]/80 rounded animate-pulse'></div>}
          </div>
        </div>
      );
    }

    return (
      <>
        <div className='relative flex flex-col items-center justify-center w-[185px] h-[247px] gap-3 rounded-[14px] overflow-hidden'>
          <div className='absolute inset-0 z-0'>
            {fullBackgroundUrl && (
              <>
                <div className='relative w-full h-full'>
                  <Image
                    src={fullBackgroundUrl}
                    alt=''
                    fill
                    unoptimized={true}
                    loading='eager'
                    className='w-full h-full object-cover scale-105 blur-[2px]'
                    onError={() => {
                      console.error('Ошибка загрузки фона аватара:', avatar);
                    }}
                  />
                </div>
                <div className='absolute inset-0 bg-black/70 rounded-[12px] border border-white/5 backdrop-blur-[2px]' />
              </>
            )}
            <div className='absolute inset-0 bg-[#060606]/80 backdrop-blur-[5px]' />
          </div>

          <div className='relative z-10 flex flex-col items-center gap-3'>
            <div className='relative'>
              {/* Используем обновленный компонент UserAvatar */}
              <UserAvatar
                user={userObject}
                size='xl'
                className={isOwnProfile ? 'cursor-pointer' : ''}
                onClick={isOwnProfile ? onUploadClick : undefined}
              />
            </div>

            <div className='flex flex-col items-center mt-3 gap-1'>
              <h2 className='text-white text-sm font-medium opacity-90 leading-tight'>
                @{nickname || username}
              </h2>
              {nickname && nickname !== username && (
                <span className='text-sm text-white/40'>@{username}</span>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
);

ProfileAvatar.displayName = 'ProfileAvatar';
export default ProfileAvatar;
