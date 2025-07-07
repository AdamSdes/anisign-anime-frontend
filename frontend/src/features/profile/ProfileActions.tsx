'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Trophy, Settings, Share2, Flag, MessageSquare } from 'lucide-react';

/**
 * Пропсы компонента ProfileActions
 * @interface ProfileActionsProps
 */
interface ProfileActionsProps {
  isOwnProfile?: boolean;
  username?: string;
}

/**
 * Компонент действий профиля
 * @description Отображает кнопки действий в зависимости от принадлежности профиля
 * @param {ProfileActionsProps} props - Пропсы компонента
 * @returns {JSX.Element}
 */
export const ProfileActions: React.FC<ProfileActionsProps> = React.memo(
  ({ isOwnProfile = false, username }) => {
    return (
      <div className='flex flex-wrap items-center gap-3'>
        {/* Действия для владельца профиля */}
        {isOwnProfile && (
          <>
            <div>
              <Link href='/achievements'>
                <Button
                  className='h-[45px] px-4 bg-[#CCBAE4]/10 hover:bg-[#CCBAE4]/20 text-[#CCBAE4] rounded-full flex items-center gap-2'
                >
                  <Trophy className='h-4 w-4' />
                  Достижения
                </Button>
              </Link>
            </div>
            <div>
              <Link href='/settings'>
                <Button
                  className='h-[45px] px-4 bg-white/[0.02] hover:bg-white/[0.04] text-white/90 hover:text-white rounded-full flex items-center gap-2'
                >
                  <Settings className='h-4 w-4' />
                  Настройки профиля
                </Button>
              </Link>
            </div>
          </>
        )}

        {/* Действия для чужого профиля */}
        {!isOwnProfile && username && (
          <>
            <div>
              <Button
                className='h-[45px] px-4 bg-[#DEDEDF] hover:bg-[#DEDEDF]/60 text-black font-medium rounded-full flex items-center gap-2'
                asChild
              >
                <Link href={`/messages?user=${username}`}>
                  <MessageSquare className='h-4 w-4' />
                  Написать сообщение
                </Link>
              </Button>
            </div>

            {/* Вторичные действия */}
            <div className='flex items-center gap-2'>
              <div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='w-[45px] h-[45px] rounded-full bg-white/[0.02] hover:bg-white/[0.04] text-white/60 hover:text-white'
                >
                  <Share2 className='h-4 w-4' />
                </Button>
              </div>
              <div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='w-[45px] h-[45px] rounded-full bg-white/[0.02] hover:bg-white/[0.04] text-white/60 hover:text-white'
                >
                  <Flag className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
);

ProfileActions.displayName = 'ProfileActions';
export default ProfileActions;
