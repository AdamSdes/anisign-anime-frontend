'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button/Button';
import { useAuthState } from '@/lib/stores/authStore';
import useSWR, { mutate } from 'swr';
import { User, ViewHistory } from '@/shared/types/user';
import { ViewHistory as ViewHistoryIcon } from '@/shared/icons';

interface UserProfileProps {
  className?: string;
}

export function UserProfile({ className }: UserProfileProps) {
  const t = useTranslations('common');
  const { user, logout } = useAuthState();
  const [isEditing, setIsEditing] = useState(false);

  // Использование SWR для кэширования данных профиля
  const { data: fullUser, error, isLoading } = useSWR<User, Error>(
    user?.id ? `/api/users/me` : null,
    () => fetchUserProfile(user!.id),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // Функция для получения данных профиля
  const fetchUserProfile = useCallback(async (userId: string) => {
    const response = await fetch(`/api/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      },
    });
    if (!response.ok) throw new Error(t('errorLoadingProfile'));
    return response.json() as Promise<User>;
  }, [t]);

  // Обработка выхода
  const handleLogout = useCallback(() => {
    logout();
    mutate('/api/users/me');
  }, [logout]);

  // Безопасная обработка данных пользователя с useMemo
  const userData = useMemo(() => {
    if (!fullUser && !user) return null;
    return fullUser || user;
  }, [fullUser, user]) as User | null; 

  if (isLoading) {
    return (
      <div className={className || 'flex justify-center py-8 text-white/40'}>
        {t('loading')}
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className={className || 'flex flex-col items-center justify-center py-16 px-4'}>
        <h3 className="text-lg font-medium text-white/80 mb-2">
          {error?.message || t('errorLoadingProfile')}
        </h3>
        <p className="text-sm text-white/40 text-center max-w-md">
          {t('tryAgain')}
        </p>
      </div>
    );
  }

  return (
    <div className={className || 'space-y-8 p-4 bg-black/90 backdrop-blur-md rounded-xl border border-white/5 shadow-lg'}>
      <div className="flex flex-col items-center gap-4">
        <Image
          src={userData.avatar_url || '/placeholder-user.png'}
          alt={userData.username}
          width={100}
          height={100}
          className="rounded-full object-cover w-24 h-24"
        />
        <h2 className="text-2xl font-bold text-white/90">
          {userData.username}
        </h2>
        <p className="text-sm text-white/60">
          {t('email')}: {userData.email}
        </p>
        <p className="text-sm text-white/60">
          {t('joined')}: {new Date(userData.created_at).toLocaleDateString()}
        </p>
        <Button
          variant="outline"
          className="bg-black border-white/5 text-white/60 hover:bg-white/[0.04] rounded-xl"
          onClick={handleLogout}
        >
          {t('logout')}
        </Button>
        <Button
          variant="default"
          className="bg-gray-200 text-black hover:bg-gray-300 rounded-xl"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? t('cancel') : t('editProfile')}
        </Button>
      </div>

      {/* Секция истории просмотров */}
      {userData.view_history && userData.view_history.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white/90 flex items-center gap-2">
            <ViewHistoryIcon className="text-white/60" />
            {t('viewHistory')}
          </h3>
          <div className="space-y-2">
            {userData.view_history.map((history: ViewHistory) => (
              <motion.div
                key={history.id || history.anime_id + history.episode_id}
                className="bg-white/[0.02] border border-white/5 rounded-xl p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm text-white/70">
                  {t('anime')}: {history.anime_title || history.anime_id}
                </p>
                <p className="text-sm text-white/60">
                  {t('episode')}: {history.episode_id || history.episode_id}
                </p>
                <p className="text-xs text-white/40">
                  {t('watchedAt')}: {new Date(history.watched_at).toLocaleString()}
                </p>
                <p className="text-xs text-white/40">
                  {t('progress')}: {history.duration ? `${Math.round((history.progress / history.duration) * 100)}%` : `${history.progress}%`}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Секция друзей  */}
      {userData.friends && userData.friends.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white/90">
            {t('friends')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {userData.friends.map((friend: User) => (
              <motion.div
                key={friend.id}
                className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={friend.avatar_url || '/placeholder-user.png'}
                  alt={friend.username}
                  width={40}
                  height={40}
                  className="rounded-full object-cover w-10 h-10"
                />
                <span className="text-sm text-white/70">
                  {friend.username}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}