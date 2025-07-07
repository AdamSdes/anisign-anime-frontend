'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import characterService from '@/services/characterService';
import Header from '@/features/header/Header';
import Footer from '@/features/footer/Footer';
import Report from '@/features/report/Report';
import CharacterDescription from '@/components/characters/CharacterDescription';
import CharacterAnimeList from '@/components/characters/CharacterAnimeList';
import { ProfileBanner } from '@/features/profile/ProfileBanner';
import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL, API_ENDPOINTS } from '@/config/api';
import Image from 'next/image';
import { useState, Suspense, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function CharacterPageContent() {
  const params = useParams();
  const characterId = params.id as string;
  const [imageLoaded, setImageLoaded] = useState(false);
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [bannerData, setBannerData] = useState<{
    username?: string;
    user_banner?: string;
  }>({
    username: 'character',
  });
  const [isLoading, setIsLoading] = useState(true);

  const {
    data: character,
    isLoading: characterLoading,
    error,
  } = useQuery({
    queryKey: ['character', characterId],
    queryFn: () => characterService.getCharacterById(characterId),
    staleTime: 1000 * 60 * 10, // 10 минут
    enabled: !!characterId,
  });

  // Получаем данные баннера
  useEffect(() => {
    if (authLoading) return;

    const fetchBannerData = async () => {
      try {
        if (isAuthenticated && user) {
          setBannerData({
            username: user.username,
            user_banner: user.user_banner || '',
          });
        } else {
          const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USER.BY_NAME}/admin`);
          if (response.ok) {
            const data = await response.json();
            if (data.total_count > 0 && data.user_list?.length > 0) {
              const userData = data.user_list[0];
              setBannerData({
                username: userData.username,
                user_banner: userData.user_banner || '',
              });
            }
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

  const isFullyLoading = authLoading || isLoading || characterLoading;

  if (characterLoading) {
    return (
      <div className='min-h-screen flex flex-col bg-[#060606]'>
        <Header />
        <Report />

        {/* Баннер */}
        <div className='relative'>
          <div className='absolute inset-x-0 top-0 w-full h-[300px]'>
            <ProfileBanner
              size='lg'
              className='w-full h-full'
              isOwnProfile={isAuthenticated}
              username={bannerData.username}
              user_banner={bannerData.user_banner}
              isLoading={isFullyLoading}
            />
            <div className='absolute inset-0 bg-[#060606]/70'></div>
          </div>

          <main className='flex-grow relative z-10 pt-[60px] pb-12'>
            <div className='container mx-auto px-4'>
              <div className='animate-pulse space-y-8'>
                <div className='w-32 h-10 bg-white/5 rounded-lg'></div>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6'>
                  {Array(24)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className='space-y-3'>
                        <div
                          className='bg-white/5 rounded-xl'
                          style={{ paddingBottom: '133.33%' }}
                        ></div>
                        <div className='space-y-2'>
                          <div className='h-4 bg-white/5 rounded w-3/4'></div>
                          <div className='h-3 bg-white/5 rounded w-1/2'></div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </main>
        </div>

        <Footer />
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className='min-h-screen flex flex-col bg-[#060606]'>
        <Header />
        <Report />

        {/* Баннер */}
        <div className='relative'>
          <div className='absolute inset-x-0 top-0 w-full h-[300px]'>
            <ProfileBanner
              size='lg'
              className='w-full h-full'
              isOwnProfile={isAuthenticated}
              username={bannerData.username}
              user_banner={bannerData.user_banner}
              isLoading={isFullyLoading}
            />
            <div className='absolute inset-0 bg-[#060606]/70'></div>
          </div>

          <main className='flex-grow relative z-10 pt-[60px] pb-12'>
            <div className='container mx-auto px-4'>
              <div className='flex flex-col items-center justify-center py-20 text-center'>
                <div className='w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6'>
                  <svg
                    width='32'
                    height='32'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    className='text-red-400'
                  >
                    <path
                      d='M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M12 8V13'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M12 17H12.01'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
                <h1 className='text-2xl font-bold text-white/90 mb-3'>Персонаж не найден</h1>
                <p className='text-white/60 mb-6 max-w-md'>
                  Персонаж с указанным ID не существует или произошла ошибка при загрузке.
                </p>
                <Link
                  href='/characters'
                  className='px-6 py-3 bg-white/5 hover:bg-white/10 text-white/80 rounded-lg transition-colors'
                >
                  Вернуться к списку персонажей
                </Link>
              </div>
            </div>
          </main>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className='min-h-screen flex flex-col bg-[#060606]'>
      <Header />
      <Report />

      {/* Главный контент с баннером */}
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
          <div className='absolute inset-0 bg-[#060606]/70'></div>
        </div>

        {/* Контент, накладывающийся на баннер */}
        <main className='flex-grow relative z-10 pt-[60px] pb-6'>
          <div className='container mx-auto px-4'>
            <div className='space-y-8'>
              {/* Навигация */}
              <div className=''>
                <Link
                  href='/characters'
                  className='inline-flex items-center gap-2 px-3 py-2 text-white/60 hover:text-white/90 transition-colors text-sm'
                >
                  <ArrowLeft className='w-4 h-4' />
                  Назад к персонажам
                </Link>
              </div>

              {/* Основной контент */}
              <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
                {/* Левая колонка - изображение персонажа */}
                <div className='lg:col-span-1'>
                  <div className='relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-[#0A0A0A] border border-white/[0.08]'>
                    {character.poster_url ? (
                      <>
                        <Image
                          src={character.poster_url}
                          alt={character.russian || character.name}
                          fill
                          className={`object-cover transition-opacity duration-300 ${
                            imageLoaded ? 'opacity-100' : 'opacity-0'
                          }`}
                          onLoad={() => setImageLoaded(true)}
                          unoptimized={true}
                          priority
                        />
                        {!imageLoaded && (
                          <div className='absolute inset-0 bg-white/5 animate-pulse'></div>
                        )}
                      </>
                    ) : (
                      <div className='w-full h-full flex items-center justify-center text-white/40'>
                        <div className='text-center space-y-3'>
                          <svg
                            width='48'
                            height='48'
                            viewBox='0 0 24 24'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                            className='mx-auto'
                          >
                            <path
                              d='M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z'
                              stroke='currentColor'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                            <path
                              d='M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22'
                              stroke='currentColor'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                          <p className='text-sm'>Изображение недоступно</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Правая колонка - информация о персонаже */}
                <div className='lg:col-span-3 space-y-6'>
                  {/* Заголовок и имена */}
                  <div className='space-y-2'>
                    <h1 className='text-2xl font-medium text-white/90 leading-tight'>
                      {character.russian || character.name}
                    </h1>
                    {character.name && character.name !== character.russian && (
                      <p className='text-sm text-white/60'>{character.name}</p>
                    )}
                    {character.japanese && (
                      <p className='text-xs text-white/50'>{character.japanese}</p>
                    )}
                  </div>

                  {/* Описание */}
                  <div className='space-y-3'>
                    <h2 className='text-lg font-medium text-white/90'>Описание</h2>
                    <div className='text-white/70 text-sm leading-relaxed'>
                      <CharacterDescription description={character.description || ''} />
                    </div>
                  </div>

                  {/* Аниме с этим персонажем */}
                  <div className='space-y-4'>
                    <h2 className='text-lg font-medium text-white/90'>Аниме</h2>
                    <CharacterAnimeList characterId={character.character_id} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default function CharacterPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex flex-col bg-[#060606]'>
          <div className='h-[100px] border-b border-white/5'></div>
          <div className='flex-grow container mx-auto px-4 py-8'>
            <div className='animate-pulse space-y-8'>
              <div className='w-32 h-10 bg-white/5 rounded-lg'></div>
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6'>
                {Array(24)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className='space-y-3'>
                      <div
                        className='bg-white/5 rounded-xl'
                        style={{ paddingBottom: '133.33%' }}
                      ></div>
                      <div className='space-y-2'>
                        <div className='h-4 bg-white/5 rounded w-3/4'></div>
                        <div className='h-3 bg-white/5 rounded w-1/2'></div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <CharacterPageContent />
    </Suspense>
  );
}
