'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import Header from '@/features/header/Header';
import Report from '@/features/report/Report';
import Footer from '@/features/footer/Footer';
import AnimeCarousel from '@/components/anime/AnimeCarousel';
import LatestComments from '@/components/common/LatestComments';
import LatestNews from '@/components/news/LatestNews';
import { ProfileBanner } from '@/features/profile/ProfileBanner';
import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL, API_ENDPOINTS } from '@/config/api';
import { checkApiAvailability, mockApi } from '@/lib/mockServer';

export default function Home() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [bannerData, setBannerData] = useState<{
    username?: string;
    user_banner?: string;
  }>({
    username: 'homepage',
  });
  const [isLoading, setIsLoading] = useState(true);

  // Мемоизируем функцию получения баннера, чтобы избежать ненужных пересозданий
  const fetchBannerData = useCallback(async () => {
    try {
      // Если пользователь авторизован, используем его баннер
      if (isAuthenticated && user) {
        console.log('Используем баннер авторизованного пользователя:', user.username);

        // Проверяем, изменился ли баннер, чтобы избежать лишних обновлений состояния
        if (
          bannerData.username !== user.username ||
          bannerData.user_banner !== (user.user_banner || '')
        ) {
          setBannerData({
            username: user.username,
            user_banner: user.user_banner || '',
          });
        }
      } else {
        // Если не авторизован и еще не было загрузки данных
        if (isLoading) {
          try {
            // Проверяем доступность API
            const isApiAvailable = await checkApiAvailability(API_BASE_URL);

            if (isApiAvailable) {
              // Если пользователь не авторизован, получаем баннер по умолчанию
              const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USER.BY_NAME}/admin`, {
                method: 'GET',
                headers: {
                  accept: 'application/json',
                },
              });

              if (!response.ok) {
                throw new Error('Не удалось получить данные для баннера');
              }

              const data = await response.json();

              if (data.total_count > 0 && data.user_list && data.user_list.length > 0) {
                const userData = data.user_list[0];

                // Проверяем, изменился ли баннер
                if (
                  bannerData.username !== userData.username ||
                  bannerData.user_banner !== (userData.user_banner || '')
                ) {
                  setBannerData({
                    username: userData.username,
                    user_banner: userData.user_banner || '',
                  });
                }
              }
            } else {
              // Используем mock данные
              const userData = await mockApi.getUserByName('admin');
              if (userData.total_count > 0 && userData.user_list.length > 0) {
                const user = userData.user_list[0];
                setBannerData({
                  username: user.username,
                  user_banner: user.user_banner || '',
                });
              }
            }
          } catch (error) {
            console.error('Ошибка при получении данных для баннера:', error);
            // В случае ошибки оставляем дефолтные значения
          }
        }
      }
    } catch (error) {
      console.error('Ошибка при получении данных для баннера:', error);
    } finally {
      // Устанавливаем isLoading в false только если он еще true
      if (isLoading) {
        setIsLoading(false);
      }
    }
  }, [user, isAuthenticated, bannerData, isLoading]);

  // Получаем данные баннера от авторизованного пользователя
  useEffect(() => {
    // Если контекст авторизации ещё загружается, ждём
    if (authLoading) {
      return;
    }

    // Запускаем загрузку баннера
    fetchBannerData();
  }, [authLoading, fetchBannerData]); // Удаляем user и isAuthenticated из зависимостей, они уже в fetchBannerData

  // Полное состояние загрузки: ждём и загрузку контекста авторизации, и загрузку данных баннера
  const isFullyLoading = authLoading || isLoading;

  return (
    <div className='min-h-screen flex flex-col bg-[#060606]'>
      <Suspense fallback={<div className='h-[100px] border-b border-white/5'></div>}>
        <Header />
      </Suspense>
      <Report />

      {/* Главный контент с баннером и каруселью */}
      <div className='relative'>
        {/* Баннер */}
        <div className='absolute inset-x-0 top-0 w-full h-[500px]'>
          <ProfileBanner
            size='lg'
            className='w-full h-full'
            isOwnProfile={isAuthenticated}
            username={bannerData.username}
            user_banner={bannerData.user_banner}
            isLoading={isFullyLoading}
          />
          {/* Затемняющий оверлей для баннера */}
          <div className='absolute inset-0 bg-[#060606]/70'></div>
        </div>

        {/* Контент, который накладывается на баннер */}
        <main className='flex-grow relative pt-[60px] pb-8'>
          <div className='container mx-auto px-4'>
            {/* Карусель накладывается на баннер */}
            <AnimeCarousel
              title='Популярные онгоинги'
              limit={15}
              filters={{
                status: 'ongoing',
                sort_by: 'score',
                filter_by_score: true,
              }}
            />
          </div>
        </main>
      </div>

      <div className='container pb-10'>
        <LatestNews />
      </div>

      <div className='container pb-10'>
        <LatestComments />
      </div>

      <Footer />
    </div>
  );
}
