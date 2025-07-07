'use client';

import * as React from 'react';

// Пропсы компонента видеоплеера
interface VideoPlayerProps {
  animeId: string;
  totalEpisodes?: number;
  animeName?: string;
  id: string;
}

/**
 * Компонент видеоплеера для аниме с интеграцией Kodik
 * @param props Пропсы компонента
 */
export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  animeId,
  // Остальные параметры не используются сейчас, но оставлены в интерфейсе для будущего использования
}) => {
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const playerContainerRef = React.useRef<HTMLDivElement>(null);

  // Создание iframe для плеера Kodik
  const createIframe = React.useCallback((src: string) => {
    const iframe = document.createElement('iframe');
    iframe.src = src.startsWith('//') ? `https:${src}` : src;
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.style.border = 'none';
    iframe.setAttribute('allowfullscreen', '');
    iframe.allow = 'fullscreen; autoplay; encrypted-media';
    iframe.setAttribute('referrerpolicy', 'origin');
    iframe.setAttribute(
      'sandbox',
      'allow-forms allow-scripts allow-same-origin allow-presentation'
    );
    return iframe;
  }, []);

  React.useEffect(() => {
    if (!animeId || !playerContainerRef.current) return;

    const container = playerContainerRef.current;
    setError(false);
    setErrorMessage('');

    // Очистка предыдущего iframe
    const cleanup = () => {
      const frame = container.querySelector('iframe');
      if (frame) frame.remove();
    };

    cleanup();

    try {
      // Добавляем меняющийся параметр для избежания кеширования
      const params = new URLSearchParams({
        shikimoriID: animeId,
        hide_selectors: 'false',
        t: Date.now().toString(),
      });

      const iframe = createIframe(`https://kodik.info/find-player?${params}`);

      // Обработчик ошибок iframe
      iframe.onerror = () => {
        setError(true);
        setErrorMessage('Не удалось загрузить плеер');
      };

      container.appendChild(iframe);

      // Обработчик сообщений от плеера
      const handleMessage = (event: MessageEvent) => {
        if (!event.origin.includes('kodik.info')) return;

        try {
          // Проверяем, является ли сообщение строкой и похоже ли оно на JSON
          let data;
          if (typeof event.data === 'object') {
            data = event.data;
          } else if (
            typeof event.data === 'string' &&
            (event.data.startsWith('{') || event.data.startsWith('['))
          ) {
            // Только пытаемся разобрать как JSON, если сообщение похоже на JSON
            try {
              data = JSON.parse(event.data);
            } catch {
              // Нет необходимости логировать ошибку, если это не JSON
              return;
            }
          } else {
            // Если это строка, но не JSON (например, "flow_load") - игнорируем
            return;
          }

          if (data?.type === 'kodik_player_error') {
            setError(true);
            setErrorMessage(data.message || 'Не удалось загрузить видео');
          }
        } catch (err) {
          // Игнорировать ошибки обработки
          console.error('Ошибка обработки сообщения от плеера:', err);
        }
      };

      window.addEventListener('message', handleMessage, false);
      return () => {
        cleanup();
        window.removeEventListener('message', handleMessage);
      };
    } catch (err) {
      console.error('Ошибка при инициализации плеера:', err);
      setError(true);
      setErrorMessage('Не удалось инициализировать плеер');
    }
  }, [animeId, createIframe]);

  // Открытие ссылки для сообщения об ошибке
  const handleReportError = React.useCallback(() => {
    window.open('https://t.me/anisignru', '_blank');
  }, []);

  const handleRetry = React.useCallback(() => {
    if (!playerContainerRef.current) return;

    const container = playerContainerRef.current;
    const frame = container.querySelector('iframe');
    if (frame) frame.remove();

    setError(false);
    setErrorMessage('');

    // Небольшая задержка перед повторной попыткой
    setTimeout(() => {
      const params = new URLSearchParams({
        shikimoriID: animeId,
        hide_selectors: 'false',
        t: Date.now().toString(), // Добавляем параметр для предотвращения кеширования
      });

      const iframe = createIframe(`https://kodik.info/find-player?${params}`);
      container.appendChild(iframe);
    }, 500);
  }, [animeId, createIframe]);

  if (error) {
    return (
      <div className='w-full aspect-video rounded-[14px] overflow-hidden bg-gray-900 flex items-center justify-center'>
        <div className='text-white/80 text-center p-6'>
          <p className='text-lg mb-2'>Плеер временно недоступен</p>
          <p className='text-sm mb-4'>{errorMessage || 'Попробуйте позже или выберите другой контент'}</p>
          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <button
              onClick={handleRetry}
              className='px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors'
            >
              Попробовать снова
            </button>
            <button
              onClick={handleReportError}
              className='px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors'
            >
              Сообщить об ошибке
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className='w-full space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <h3 className='text-[16px] font-semibold'>Смотреть онлайн</h3>
        </div>
        <button
          onClick={handleReportError}
          className='flex items-center gap-2 px-3 py-1.5 text-[#FF9494] hover:text-[#FF9494]/80 hover:bg-[#FF9494]/10 transition-colors z-20 rounded-lg text-sm'
        >
          <svg
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M12 8V13'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M11.9945 16H12.0035'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          <span>Сообщить об ошибке</span>
        </button>
      </div>
      <div className='relative isolate'>
        <div
          className='absolute -inset-4 opacity-5 rounded-[20px] animate-glow'
          style={{
            background: `
              radial-gradient(circle at 50% 50%, 
                rgba(147, 51, 234, 0.2),
                rgba(37, 99, 235, 0.2) 25%,
                rgba(234, 51, 147, 0.2) 50%,
                transparent 70%
              )
            `,
            filter: 'blur(70px)',
            zIndex: -1,
          }}
        />
        <style jsx>{`
          @keyframes glow {
            0% {
              transform: scale(1.1) translate(0, 0);
              opacity: 1;
            }
            25% {
              transform: scale(1.15) translate(130px, -10px);
              opacity: 0.6;
            }
            50% {
              transform: scale(1.1) translate(0, 0);
              opacity: 1;
            }
            75% {
              transform: scale(1.15) translate(-130px, 10px);
              opacity: 0.6;
            }
            100% {
              transform: scale(1.1) translate(0, 0);
              opacity: 1;
            }
          }
        `}</style>
        <div className='flex mb-5 items-center gap-3 p-4 rounded-xl bg-[#FFF4D4]/10 border border-[#FFE4A0]/20'>
          <svg
            className='w-5 h-5 text-[#FFE4A0]'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M12 9V14'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M12.0002 21.41H5.94021C2.47021 21.41 1.02021 18.93 2.70021 15.9L5.82021 10.28L8.76021 5.00003C10.5402 1.79003 13.4602 1.79003 15.2402 5.00003L18.1802 10.29L21.3002 15.91C22.9802 18.94 21.5202 21.42 18.0602 21.42H12.0002V21.41Z'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M11.9945 17H12.0035'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          <p className='text-[#FFE4A0]/90 text-sm'>
            Если видео долго загружается, попробуйте перемотать немного вперёд с помощью ползунка
          </p>
        </div>
        <div
          ref={playerContainerRef}
          id='kodik-player'
          className='w-full aspect-video rounded-[14px] h-[500px] sm:h-[500px] lg:h-[700px] overflow-hidden bg-black/80 relative'
        />
      </div>
    </section>
  );
};

VideoPlayer.displayName = 'VideoPlayer';
