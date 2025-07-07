import React, { useState } from 'react';
import Image from 'next/image';

interface ScreenshotGalleryProps {
  screenshots: string[];
  maxToShow?: number;
}

const ScreenshotGallery: React.FC<ScreenshotGalleryProps> = ({ screenshots, maxToShow = 5 }) => {
  // Ограничиваем количество отображаемых скриншотов
  const displayedScreenshots = screenshots?.slice(0, maxToShow) || [];
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [galleryModalVisible, setGalleryModalVisible] = useState(false);

  if (!displayedScreenshots.length) return null;

  // Обработчики для модального окна с полным изображением
  const handleOpenScreenshot = (screenshot: string) => {
    setSelectedScreenshot(screenshot);
    setTimeout(() => setModalVisible(true), 50);
  };

  const handleCloseScreenshot = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedScreenshot(null), 300); // Задержка для завершения анимации
  };

  // Обработчики для модального окна галереи
  const handleOpenGallery = () => {
    setShowGalleryModal(true);
    setTimeout(() => setGalleryModalVisible(true), 50);
  };

  const handleCloseGallery = () => {
    setGalleryModalVisible(false);
    setTimeout(() => setShowGalleryModal(false), 300); // Задержка для завершения анимации
  };

  // Открыть полное изображение из галереи
  const handleOpenFromGallery = (screenshot: string) => {
    handleCloseGallery();
    setTimeout(() => handleOpenScreenshot(screenshot), 300);
  };

  return (
    <div className='mt-16'>
      <div className='flex justify-between items-center mb-6'>
        <h3 className='text-[16px] font-medium text-white/90'>Скриншоты</h3>
        <button
          onClick={handleOpenGallery}
          className='text-[14px] text-white/60 hover:text-white/90 transition-colors duration-200 flex items-center'
        >
          Открыть галерею
          <svg
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='ml-1'
          >
            <path
              d='M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z'
              fill='currentColor'
            />
          </svg>
        </button>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'>
        {displayedScreenshots.map((screenshot, index) => (
          <div
            key={index}
            className='relative overflow-hidden rounded-lg aspect-video group cursor-pointer'
            onClick={() => handleOpenScreenshot(screenshot)}
          >
            <Image
              src={screenshot}
              alt={`Скриншот ${index + 1}`}
              width={400}
              height={225}
              className='w-full h-full object-cover transition-transform duration-500 scale-105 group-hover:scale-110'
              unoptimized={true}
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
            <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
              <div className='bg-black/40 p-2 rounded-full'>
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M21 9L21 3L15 3'
                    stroke='white'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M15 9L21 3'
                    stroke='white'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M3 15L3 21L9 21'
                    stroke='white'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M9 15L3 21'
                    stroke='white'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Модальное окно для просмотра полной галереи */}
      {showGalleryModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
            galleryModalVisible ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleCloseGallery}
        >
          <div className='absolute inset-0 bg-black/95 backdrop-blur-xl' />
          <div
            className='container relative mx-auto max-w-7xl h-[80vh] bg-[#121212]/90 backdrop-blur-md rounded-2xl flex flex-col'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Заголовок */}
            <div className='sticky top-0 z-20 flex justify-between items-center p-6 bg-gradient-to-b from-[#121212] to-transparent'>
              <h2 className='text-xl font-medium text-white/90'>Галерея скриншотов</h2>
              <button
                className='group flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm text-white/60 transition-all hover:bg-white/10 hover:text-white'
                onClick={handleCloseGallery}
              >
                Закрыть
                <svg
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  className='transition-transform duration-300 group-hover:rotate-90'
                >
                  <path
                    fill='currentColor'
                    d='M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z'
                  />
                </svg>
              </button>
            </div>

            {/* Контейнер для скриншотов */}
            <div className='flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20'>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 auto-rows-min'>
                {screenshots.map((screenshot, index) => (
                  <div
                    key={index}
                    className='group relative aspect-video overflow-hidden rounded-xl bg-white/5'
                    onClick={() => handleOpenFromGallery(screenshot)}
                  >
                    <Image
                      src={screenshot}
                      alt={`Скриншот ${index + 1}`}
                      width={400}
                      height={225}
                      className='size-full object-cover transition duration-500 group-hover:scale-110'
                      unoptimized={true}
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
                    <div className='absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                      <div className='rounded-xl bg-white/10 px-4 py-2 backdrop-blur-md'>
                        <svg width='24' height='24' viewBox='0 0 24 24' className='text-white'>
                          <path fill='currentColor' d='M19 8l-7 7-7-7V6.5l7 7 7-7V8z' />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно для просмотра скриншота */}
      {selectedScreenshot && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-6 transition-all duration-300 ${
            modalVisible ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleCloseScreenshot}
        >
          <div className='absolute inset-0 bg-black/95 backdrop-blur-xl' />
          <div className='relative w-full max-w-[90vw] max-h-[85vh]'>
            <div className='relative rounded-2xl overflow-hidden bg-black/20 backdrop-blur-md'>
              {/* Кнопки управления внутри контейнера с изображением */}
              <div className='absolute top-4 left-4 right-4 flex items-center justify-between z-10'>
                <button
                  className='flex items-center gap-2 rounded-xl bg-black/50 backdrop-blur-md px-4 py-2 text-sm text-white/60 transition-all hover:bg-black/70 hover:text-white border border-white/5'
                  onClick={handleCloseScreenshot}
                >
                  <svg width='20' height='20' viewBox='0 0 24 24' className='rotate-180'>
                    <path
                      fill='currentColor'
                      d='M20 11H7.83l5.59-5.59L12 4l-8 8l8 8l1.41-1.41L7.83 13H20v-2z'
                    />
                  </svg>
                  Вернуться к галерее
                </button>
                <div className='text-sm text-white/40 px-4 py-2 rounded-xl bg-black/50 backdrop-blur-md border border-white/5'>
                  ESC для выхода
                </div>
              </div>

              {/* Контейнер для изображения */}
              <div className='flex items-center justify-center'>
                <Image
                  src={selectedScreenshot}
                  alt='Скриншот в полном размере'
                  className='max-h-[85vh] w-auto object-contain rounded-2xl'
                  width={1920}
                  height={1080}
                  unoptimized={true}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenshotGallery;
