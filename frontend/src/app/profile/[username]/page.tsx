'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { ProfileHeader } from '@/features/profile/ProfileHeader';
import Header from '@/features/header/Header';
import Report from '@/features/report/Report';
import Footer from '@/features/footer/Footer';
import Link from 'next/link'; // Добавляем импорт Link из Next.js
import { useAuth } from '@/context/AuthContext';
import AnimeSaveListSection from '@/features/profile/AnimeSaveListSection';

/**
 * Интерфейс данных профиля
 * @interface ProfileData
 */
interface ProfileData {
  username: string;
  nickname?: string;
  avatar?: string;
  user_banner?: string;
  joinedDate?: string;
  email?: string;
  user_id: string;
}

/**
 * Страница профиля пользователя
 * @description Отображает профиль пользователя с его данными и активностью
 * @returns {JSX.Element}
 */
export default function ProfilePage() {
  const params = useParams();
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOwnProfile, setIsOwnProfile] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  // Функция для обновления данных профиля
  const fetchData = useCallback(async () => {
    try {
      // В Next.js 15 параметры маршрута стали асинхронными
      const resolvedParams = await params;
      const usernameParam = resolvedParams.username as string;

      // Проверка, является ли профиль собственным
      const ownProfile = Boolean(isAuthenticated && user && user.username === usernameParam);
      setIsOwnProfile(ownProfile);

      // Логирование для отладки
      console.log('Информация о пользователе из контекста:', user);

      // Если это собственный профиль и у нас есть данные пользователя из контекста
      if (ownProfile && user) {
        console.log('Установка данных собственного профиля');

        // Используем правильные имена полей из API
        setProfileData({
          username: user.username,
          nickname: user.nickname || user.username,
          avatar: user.user_avatar || '', // Используем user_avatar вместо avatar_url
          user_banner: user.user_banner || '', // Используем user_banner вместо banner_url
          joinedDate: user.created_at || '',
          email: user.email || '',
          user_id: user.id || '', // Добавляем ID пользователя
        });

        console.log('Установленные данные профиля:', {
          username: user.username,
          avatar: user.user_avatar,
          user_banner: user.user_banner,
          user_id: user.id,
        });
      } else {
        // Если это чужой профиль, запрашиваем данные с сервера
        console.log('Установка данных чужого профиля');

        try {
          // Запрос данных пользователя по имени
          const response = await fetch(`http://localhost:8000/user/name/${usernameParam}`, {
            method: 'GET',
            headers: {
              accept: 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Не удалось получить данные пользователя');
          }

          const data = await response.json();

          if (data.total_count > 0 && data.user_list && data.user_list.length > 0) {
            const userData = data.user_list[0];
            console.log('Получены данные пользователя:', userData);

            setProfileData({
              username: userData.username,
              nickname: userData.nickname || userData.username,
              avatar: userData.user_avatar || '', // Используем user_avatar из API
              user_banner: userData.user_banner || '',
              joinedDate: userData.created_at || '',
              user_id: userData.id || '', // Добавляем ID пользователя
            });
          } else {
            // Пользователь не найден
            console.log('Пользователь не найден:', usernameParam);
            setProfileData(null); // Устанавливаем null вместо создания фиктивного профиля
          }
        } catch (error) {
          console.error('Ошибка при получении данных пользователя:', error);
          // В случае ошибки устанавливаем null
          setProfileData(null);
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setIsLoading(false);
    }
  }, [params, user, isAuthenticated]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className='min-h-screen flex flex-col bg-[#060606]'>
      <Header />
      <Report />
      <main className='flex-grow'>
        {isLoading ? (
          <div className='container mx-auto px-4 py-8'>
            <div className='h-[350px] w-full rounded-xl bg-[#060606]/80 relative overflow-hidden'>
              {/* Градиентные переходы для анимации загрузки */}
              <div className='absolute inset-0 bg-gradient-to-t from-[#060606] via-[#06060680] to-[#06060620]' />
              <div className='absolute inset-0 bg-gradient-to-b from-[#06060640] via-transparent to-transparent' />
              <div className='absolute inset-0 bg-gradient-to-r from-[#06060620] via-transparent to-[#06060620]' />

              {/* Эффект пульсации */}
              <div className='' style={{ animationDuration: '2s' }} />
            </div>
          </div>
        ) : profileData ? (
          <>
            <ProfileHeader
              username={profileData.username}
              avatar={profileData.avatar}
              user_banner={profileData.user_banner}
              nickname={profileData.nickname}
              isOwnProfile={isOwnProfile}
              isLoading={isLoading}
              refetchUser={fetchData}
            />

            {/* Секция со списками сохраненных аниме */}
            <div className='container mx-auto px-4 sm:px-8 pb-8 max-w-[1450px] mt-6'>
              <AnimeSaveListSection userId={profileData.user_id} isOwnProfile={isOwnProfile} />
            </div>
          </>
        ) : (
          <div className='container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]'>
            <div className='p-6 max-w-lg w-full text-center'>
              <div className='w-16 h-16 bg-red-500/10 rounded-full mx-auto flex items-center justify-center mb-4'>
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z'
                    stroke='#EF4444'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
              <h2 className='text-xl font-medium text-white/90 mb-2'>Пользователь не найден</h2>
              <p className='text-white/60 mb-6'>
                Пользователя с именем &quot;{params.username}&quot; не существует
              </p>
              <Link
                href='/'
                className='text-white bg-white/5 hover:bg-white/15 transition-colors py-3 px-5 rounded-xl inline-block'
              >
                Вернуться на главную
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
