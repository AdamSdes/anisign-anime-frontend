'use client';

import { Suspense, useEffect, useState } from 'react';
import Header from '@/features/header/Header';
import Report from '@/features/report/Report';
import Footer from '@/features/footer/Footer';
import { ProfileBanner } from '@/features/profile/ProfileBanner';
import { useAuth } from '@/context/AuthContext';
import NewsGrid from '@/features/news/NewsGrid';

export default function NewsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [bannerData, setBannerData] = useState<{
    username?: string;
    user_banner?: string;
  }>({
    username: 'news',
  });
  const [isLoading, setIsLoading] = useState(true);

  // Получаем данные баннера
  useEffect(() => {
    if (authLoading) {
      return;
    }

    const fetchBannerData = async () => {
      try {
        if (isAuthenticated && user) {
          setBannerData({
            username: user.username,
            user_banner: user.user_banner || '',
          });
        } else {
          const response = await fetch(`http://localhost:8000/user/name/admin`, {
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
            setBannerData({
              username: userData.username,
              user_banner: userData.user_banner || '',
            });
          }
        }
      } catch (error) {
        console.error('Ошибка при получении данных для баннера:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBannerData();
  }, [user, isAuthenticated, authLoading]);

  const isFullyLoading = authLoading || isLoading;

  return (
    <div className='min-h-screen flex flex-col bg-[#060606]'>
      <Suspense fallback={<div className='h-[100px] border-b border-white/5'></div>}>
        <Header />
      </Suspense>
      <Report />

      {/* Главный контент с баннером и новостями */}
      <div className='relative'>
        {/* Баннер */}
        <div className='absolute inset-x-0 top-0 w-full h-[300px]'>
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

        {/* Контент новостей, накладывающийся на баннер */}
        <main className='flex-grow relative z-10 pt-[60px] pb-12'>
          <div className='container mx-auto px-4'>
            <div className='pb-15 pt-4'>
              <h1 className='text-3xl font-bold mb-2'>Новости аниме</h1>
              <p className='text-white/60 text-sm'>Последние новости из мира аниме</p>
            </div>
            <NewsGrid />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
