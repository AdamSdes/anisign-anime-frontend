'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import characterService from '@/services/characterService';
import { CharacterListResponse, CharacterSearchResponse } from '@/types/character';
import CharacterGrid from '@/components/characters/CharacterGrid';
import CharacterSearch from '@/components/characters/CharacterSearch';
import Header from '@/features/header/Header';
import Footer from '@/features/footer/Footer';
import Report from '@/features/report/Report';
import { ProfileBanner } from '@/features/profile/ProfileBanner';
import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL, API_ENDPOINTS } from '@/config/api';

function CharactersPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const initialPage = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
  const initialQuery = searchParams.get('query') || '';
  const limit = 24;

  const [page, setPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [bannerData, setBannerData] = useState<{
    username?: string;
    user_banner?: string;
  }>({
    username: 'characters',
  });
  const [isLoading, setIsLoading] = useState(true);

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

  // Обновляем URL при изменении параметров
  useEffect(() => {
    const params = new URLSearchParams();

    if (page > 1) {
      params.set('page', page.toString());
    }

    if (searchQuery.trim()) {
      params.set('query', searchQuery.trim());
    }

    const newUrl = `/characters${params.toString() ? `?${params.toString()}` : ''}`;

    if (window.location.pathname + window.location.search !== newUrl) {
      router.push(newUrl, { scroll: false });
    }
  }, [page, searchQuery, router]);

  // Простой обработчик поиска
  const handleSearch = useCallback((query: string) => {
    const trimmedQuery = query.trim();
    setSearchQuery(trimmedQuery);
    setPage(1);
  }, []);

  // Обработчик изменения страницы
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Запрос данных - убираю флаг shouldSearch, всегда выполняем запрос
  const {
    data,
    isLoading: queryLoading,
    error,
  } = useQuery<CharacterListResponse | CharacterSearchResponse>({
    queryKey: ['characters', page, searchQuery],
    queryFn: async () => {
      if (searchQuery && searchQuery.length >= 3) {
        return await characterService.searchCharacterByName(searchQuery);
      }

      // Всегда показываем общий список если нет поискового запроса
      return await characterService.getCharacterList(page, limit);
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
    retryDelay: 1000,
  });

  // Получаем персонажей из ответа (API возвращает разные поля)
  const characters = data 
    ? ('character_list' in data ? data.character_list : data.characters) || []
    : [];
  const totalCount = data?.total_count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  const isFullyLoading = authLoading || isLoading || queryLoading;

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
        <main className='flex-grow relative z-10 pt-[60px] pb-12'>
          <div className='container mx-auto px-4'>
            <div className='space-y-8'>
              {/* Заголовок */}
              <div className='pb-6 pt-4'>
                <h1 className='text-2xl font-medium mb-2'>Персонажи аниме</h1>
                <p className='text-white/60 text-sm max-w-2xl'>
                  Найдите информацию о ваших любимых персонажах из аниме
                </p>
              </div>

              {/* Поиск */}
              <div className='max-w-md'>
                <CharacterSearch
                  onSearch={handleSearch}
                  initialQuery={searchQuery}
                  isSearching={isLoading}
                />
              </div>

              {/* Результаты */}
              <div className='space-y-6'>
                {/* Сетка персонажей */}
                {!error && (
                  <CharacterGrid
                    characters={characters}
                    isLoading={isLoading}
                    showPagination={!searchQuery.trim() && totalPages > 1}
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}

                {/* Обработка ошибок */}
                {error && !isLoading && (
                  <div className='flex flex-col items-center justify-center py-12 text-center'>
                    <div className='w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4'>
                      <svg
                        width='24'
                        height='24'
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
                    <h3 className='text-white text-xl font-medium mb-2'>Ошибка при загрузке</h3>
                    <p className='text-white/60 mb-4'>
                      Не удалось загрузить список персонажей. Попробуйте обновить страницу.
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className='px-4 py-2 bg-[#CCBAE4]/20 hover:bg-[#CCBAE4]/30 text-[#CCBAE4] rounded-lg transition-colors'
                    >
                      Обновить страницу
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default function CharactersPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex flex-col bg-[#060606]'>
          <div className='h-[100px] border-b border-white/5'></div>
          <div className='flex-grow container mx-auto px-4 py-8'>
            <div className='animate-pulse space-y-8'>
              <div className='text-center space-y-4'>
                <div className='h-8 bg-white/5 rounded w-1/3 mx-auto'></div>
                <div className='h-4 bg-white/5 rounded w-2/3 mx-auto'></div>
              </div>
              <div className='max-w-2xl mx-auto h-12 bg-white/5 rounded-xl'></div>
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
      <CharactersPageContent />
    </Suspense>
  );
}
