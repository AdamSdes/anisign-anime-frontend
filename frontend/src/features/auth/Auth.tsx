'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, ArrowLeft, User, Check, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { GoogleIcon, DiscordIcon } from '@/components/icons/icons';
import { Toaster } from 'sonner';

// Варианты анимации для социальных кнопок
const socialButtonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
};

// Варианты анимации для формы
const formVariants = {
  enter: (isLogin: boolean) => ({
    x: isLogin ? -20 : 20,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (isLogin: boolean) => ({
    x: isLogin ? 20 : -20,
    opacity: 0,
  }),
};

// Варианты анимации для полей формы
const formFieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.3,
      ease: 'easeOut',
    },
  }),
};

/**
 * Интерфейс для пропсов компонента Auth
 */
interface AuthProps {
  isLogin?: boolean;
  isRecovery?: boolean;
  loading?: boolean;
  onLoginSubmit?: (username: string, password: string, rememberMe: boolean) => void;
  onRegisterSubmit?: (username: string, email: string, password: string, confirmPassword: string) => void;
  onRecoverySubmit?: (email: string) => void;
  onToggleForm?: () => void;
  onBackToLogin?: () => void;
  oauthUrls?: { google?: string; discord?: string };
}

/**
 * Компонент страницы авторизации/регистрации
 * @description Отображает форму входа, регистрации или восстановления пароля с фоновым видео
 * @returns {JSX.Element}
 */
const Auth: React.FC<AuthProps> = ({
  isLogin = true,
  isRecovery = false,
  loading = false,
  onLoginSubmit,
  onRegisterSubmit,
  onRecoverySubmit,
  onToggleForm,
  onBackToLogin,
  oauthUrls,
}) => {
  // Состояние для UI компонента
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [hasAgreedToToS, setHasAgreedToToS] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [volume, setVolume] = React.useState(50);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // Массив цитат из аниме
  const animeQuotes = [
    {
      quote: 'Настоящая сила приходит изнутри',
      character: 'Гоку',
      anime: 'Dragon Ball',
    },
    {
      quote: 'Люди не равны от рождения. Это жестокая правда жизни',
      character: 'Айзава Шота',
      anime: 'My Hero Academia',
    },
    {
      quote: 'Если ты не рискуешь, то не можешь создать будущее',
      character: 'Монки Д. Луффи',
      anime: 'One Piece',
    },
    {
      quote: 'Боль позволяет человеку расти. Как преодолеешь боль, станешь еще сильнее',
      character: 'Пейн',
      anime: 'Naruto',
    },
    {
      quote: 'Тот, кто не ценит жизнь, не заслуживает её',
      character: 'Канеки Кен',
      anime: 'Tokyo Ghoul',
    },
  ];

  // Эффект для смены цитат
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) =>
        prevIndex === animeQuotes.length - 1 ? 0 : prevIndex + 1
      );
    }, 8000); // Смена каждые 8 секунд

    return () => clearInterval(interval);
  }, [animeQuotes.length]);

  // Эффект для установки начальной громкости
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Эффект для установки начальной позиции видео (отдельный useEffect)
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // Функция для установки времени
    const setStartTime = () => {
      // Проверяем, что видео готово для установки времени
      if (videoElement) {
        console.log('Устанавливаем начальное время видео: 15 секунд');
        videoElement.currentTime = 15;

        // Убедимся, что видео воспроизводится после установки времени
        // Установка времени может привести к автоматической паузе в некоторых браузерах
        if (videoElement.paused) {
          console.log('Возобновляем воспроизведение видео');
          videoElement.play().catch((error) => {
            console.warn('Ошибка при запуске видео:', error);
          });
        }
      }
    };

    // Если метаданные уже загружены (readyState >= 1)
    if (videoElement.readyState >= 1) {
      setStartTime();
    }

    // Добавляем обработчик для случая, когда метаданные загрузятся позже
    videoElement.addEventListener('loadedmetadata', setStartTime);

    // Добавляем обработчик на случай, если видео остановится
    const handlePause = () => {
      // Проверяем, не поставил ли пользователь видео на паузу намеренно
      // Если нет, то возобновляем воспроизведение
      if (!isMuted) {
        videoElement.play().catch((err) => console.warn('Не удалось возобновить видео:', err));
      }
    };

    videoElement.addEventListener('pause', handlePause);

    // Очистка при размонтировании
    return () => {
      videoElement.removeEventListener('loadedmetadata', setStartTime);
      videoElement.removeEventListener('pause', handlePause);
    };
  }, [isMuted]); // Добавляем isMuted как зависимость

  // Обработчик для остановки звука при возврате на главную
  const handleBackToHome = () => {
    // Останавливаем звук перед возвратом
    if (videoRef.current && !videoRef.current.muted) {
      videoRef.current.muted = true;
    }
  };

  // Обработчики форм (заглушки для передачи данных в родительские компоненты)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Останавливаем звук перед авторизацией
    if (videoRef.current && !videoRef.current.muted) {
      videoRef.current.muted = true;
    }

    onLoginSubmit?.(username, password, rememberMe);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    // Останавливаем звук перед регистрацией
    if (videoRef.current && !videoRef.current.muted) {
      videoRef.current.muted = true;
    }

    onRegisterSubmit?.(username, email, password, confirmPassword);
  };

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();

    // Останавливаем звук перед отправкой запроса на восстановление
    if (videoRef.current && !videoRef.current.muted) {
      videoRef.current.muted = true;
    }

    onRecoverySubmit?.(username);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;

      // Если громкость установлена в 0, мутируем видео
      if (newVolume === 0 && !isMuted) {
        setIsMuted(true);
        videoRef.current.muted = true;
      }
      // Если громкость больше 0 и видео замучено, размучиваем
      else if (newVolume > 0 && isMuted) {
        setIsMuted(false);
        videoRef.current.muted = false;
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <>
      <Toaster richColors position='top-center' />
      <div className='relative overflow-hidden'>
        {/* Фоновое видео */}
        <div className='absolute inset-0 w-full h-full overflow-hidden'>
          <video
            ref={videoRef}
            src='https://res.cloudinary.com/dxuqf9iln/video/upload/v1743011003/qbbxljn6pmtkuw0egzib.webm'
            className='absolute w-[100vw] h-[100vh] z-0'
            autoPlay
            loop
            muted={isMuted}
            playsInline
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
              minWidth: '100%',
              minHeight: '100%',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
          <div className='absolute inset-0 bg-black/50 z-10' />
        </div>

        {/* Логотип в верхнем левом углу */}
        <div className='absolute top-5 left-5 z-30'>
          <Link href='/' onClick={handleBackToHome}>
            <Image src='/LogoAuth.png' alt='Anisign Logo' width={129} height={54} />
          </Link>
        </div>

        {/* Карусель цитат из аниме */}
        <div className='absolute bottom-7 left-5 z-30'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentQuoteIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              <p className='text-white/90 text-xl font-semibold mb-2'>
                {animeQuotes[currentQuoteIndex].quote}
              </p>
              <p className='text-white/70 text-sm'>
                {animeQuotes[currentQuoteIndex].character} («{animeQuotes[currentQuoteIndex].anime}
                »)
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className='relative flex items-center justify-center md:justify-end w-full min-h-screen p-4 z-20'>
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className='bg-[#060606]/95 backdrop-blur-xl mx-auto md:mx-0 md:mr-[175px] p-6 md:p-[50px] rounded-[24px] w-full max-w-[490px] border border-white/5'
          >
            <motion.div
              variants={containerVariants}
              initial='hidden'
              animate='visible'
              className='flex flex-col gap-8'
            >
              {/* Заголовок */}
              <motion.div
                variants={itemVariants}
                className='flex justify-between items-center w-full'
              >
                <motion.p className='text-white/90 font-semibold'>
                  {isRecovery ? 'Восстановление пароля' : isLogin ? 'Добро пожаловать ✌️' : ''}
                </motion.p>
                <Link
                  href='/'
                  onClick={handleBackToHome}
                  className='h-[33px] w-[33px] rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center hover:bg-white/[0.04] transition-colors'
                >
                  <ArrowLeft className='h-4 w-4 text-white/60' />
                </Link>
              </motion.div>

              {/* Контент */}
              <AnimatePresence mode='wait'>
                {isRecovery ? (
                  <motion.div
                    key='recovery'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className='flex flex-col gap-8'
                  >
                    {/* Иконка восстановления */}
                    <div className='flex justify-center'>
                      <div className='w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center'>
                        <Mail className='w-7 h-7 text-[#CCBAE4]' />
                      </div>
                    </div>

                    {/* Описание восстановления */}
                    <div className='text-center space-y-2'>
                      <h3 className='text-white/90 text-lg font-medium'>Забыли пароль?</h3>
                      <p className='text-white/40 text-sm'>
                        Введите email, указанный при регистрации. Мы отправим инструкции по
                        восстановлению пароля.
                      </p>
                    </div>

                    {/* Форма восстановления */}
                    <form onSubmit={handleRecovery} className='space-y-4'>
                      <div className='relative'>
                        <Input
                          type='email'
                          placeholder='Email'
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          disabled={loading}
                          className='h-[58px] bg-white/[0.02] border-white/5 rounded-xl text-white/90 placeholder:text-white/40 pl-12 [&:not(:placeholder-shown)]:text-white/90 focus:text-white/90 focus:border-[#CCBAE4]/50 focus:ring-1 focus:ring-[#CCBAE4]/20 disabled:opacity-50 disabled:cursor-not-allowed'
                        />
                        <Mail className='w-5 h-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none' />
                      </div>

                      <Button
                        type='submit'
                        disabled={loading}
                        className='w-full h-[58px] bg-[#E4E4E4] hover:bg-[#DEDEDF]/90 text-black font-medium rounded-xl'
                      >
                        {loading ? (
                          <Loader2 className='w-5 h-5 animate-spin text-black' />
                        ) : (
                          'Отправить инструкции'
                        )}
                      </Button>

                      <button
                        type='button'
                        disabled={loading}
                        onClick={() => {
                          // Останавливаем звук перед возвратом к входу
                          if (videoRef.current && !videoRef.current.muted) {
                            videoRef.current.muted = true;
                          }
                          onBackToLogin?.();
                        }}
                        className='w-full text-[14px] text-white/60 hover:text-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        Вернуться к входу
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key='main-content'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className='flex flex-col gap-8'
                  >
                    {/* Социальные кнопки */}
                    <div className='flex flex-col gap-8'>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='flex gap-2'
                      >
                        <motion.div
                          variants={socialButtonVariants}
                          initial='hidden'
                          animate='visible'
                          custom={0}
                          className='w-full'
                        >
                          <Button
                            variant='ghost'
                            onClick={() =>
                              oauthUrls?.google && window.location.assign(oauthUrls.google)
                            }
                            className='w-full h-[58px] bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-xl group transition-colors'
                          >
                            <GoogleIcon className='w-6 h-6 mr-2 transition-transform group-hover:scale-110 duration-300' />
                            <span className='text-white/80'>Google</span>
                          </Button>
                        </motion.div>
                        <motion.div
                          variants={socialButtonVariants}
                          initial='hidden'
                          animate='visible'
                          custom={1}
                          className='w-full'
                        >
                          <Button
                            variant='ghost'
                            onClick={() =>
                              oauthUrls?.discord && window.location.assign(oauthUrls.discord)
                            }
                            className='w-full h-[58px] bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-xl group transition-colors'
                          >
                            <DiscordIcon className='w-6 h-6 mr-2 transition-transform group-hover:scale-110 duration-300' />
                            <span className='text-white/80'>Discord</span>
                          </Button>
                        </motion.div>
                      </motion.div>

                      {/* Разделитель */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='relative'
                      >
                        <div className='absolute inset-0 flex items-center'>
                          <div className='w-full h-[1px] bg-white/5' />
                        </div>
                      </motion.div>
                    </div>

                    {/* Форма входа/регистрации */}
                    <AnimatePresence mode='wait' custom={isLogin}>
                      <motion.form
                        key={isLogin ? 'login' : 'register'}
                        custom={isLogin}
                        variants={formVariants}
                        initial='enter'
                        animate='center'
                        exit='exit'
                        className='flex flex-col gap-6'
                        onSubmit={isLogin ? handleLogin : handleRegister}
                      >
                        <div className='space-y-3'>
                          <motion.div
                            custom={0}
                            variants={formFieldVariants}
                            initial='hidden'
                            animate='visible'
                            className='relative'
                          >
                            <Input
                              type='text'
                              placeholder='Логин'
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              disabled={loading}
                              className='h-[58px] bg-white/[0.02] border-white/5 rounded-xl text-white/90 placeholder:text-white/40 pl-12 [&:not(:placeholder-shown)]:text-white/90 focus:text-white/90 focus:border-[#CCBAE4]/50 focus:ring-1 focus:ring-[#CCBAE4]/20 disabled:opacity-50 disabled:cursor-not-allowed'
                              style={{ colorScheme: 'dark' }}
                            />
                            <User className='w-5 h-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none' />
                          </motion.div>
                          <AnimatePresence>
                            {!isLogin && (
                              <motion.div
                                initial={{ opacity: 0, height: 0, y: -20 }}
                                animate={{ opacity: 1, height: 'auto', y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className='relative'
                              >
                                <Input
                                  type='email'
                                  placeholder='Email'
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  disabled={loading}
                                  className='h-[58px] bg-white/[0.02] border-white/5 rounded-xl text-white/90 placeholder:text-white/40 pl-12 [&:not(:placeholder-shown)]:text-white/90 focus:text-white/90 focus:border-[#CCBAE4]/50 focus:ring-1 focus:ring-[#CCBAE4]/20 disabled:opacity-50 disabled:cursor-not-allowed'
                                  style={{ colorScheme: 'dark' }}
                                />
                                <Mail className='w-5 h-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none' />
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <motion.div
                            custom={1}
                            variants={formFieldVariants}
                            initial='hidden'
                            animate='visible'
                            className='relative'
                          >
                            <Input
                              type='password'
                              placeholder='Пароль'
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              disabled={loading}
                              className='h-[58px] bg-white/[0.02] border-white/5 rounded-xl text-white/90 placeholder:text-white/40 pl-12 [&:not(:placeholder-shown)]:text-white/90 focus:text-white/90 focus:border-[#CCBAE4]/50 focus:ring-1 focus:ring-[#CCBAE4]/20 disabled:opacity-50 disabled:cursor-not-allowed'
                              style={{ colorScheme: 'dark' }}
                            />
                            <Lock className='w-5 h-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none' />
                          </motion.div>
                          <AnimatePresence>
                            {!isLogin && (
                              <motion.div
                                initial={{ opacity: 0, height: 0, y: -20 }}
                                animate={{ opacity: 1, height: 'auto', y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className='relative'
                              >
                                <Input
                                  type='password'
                                  placeholder='Повторите Пароль'
                                  value={confirmPassword}
                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                  disabled={loading}
                                  className='h-[58px] bg-white/[0.02] border-white/5 rounded-xl text-white/90 placeholder:text-white/40 pl-12 [&:not(:placeholder-shown)]:text-white/90 focus:text-white/90 focus:border-[#CCBAE4]/50 focus:ring-1 focus:ring-[#CCBAE4]/20 disabled:opacity-50 disabled:cursor-not-allowed'
                                  style={{ colorScheme: 'dark' }}
                                />
                                <Lock className='w-5 h-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none' />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className='space-y-6'>
                          <motion.div
                            key={isLogin ? 'login' : 'register'}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                          >
                            {isLogin ? (
                              <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-3'>
                                  <Checkbox
                                    id='remember'
                                    checked={rememberMe}
                                    onCheckedChange={() => setRememberMe(!rememberMe)}
                                    disabled={loading}
                                    className='w-5 h-5 border-2 border-white/20 rounded-md data-[state=checked]:bg-[#CCBAE4] data-[state=checked]:border-[#CCBAE4] transition-colors'
                                  >
                                    <Check
                                      className={`h-3.5 w-3.5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black pointer-events-none transition-opacity duration-200 ${
                                        rememberMe ? 'opacity-100' : 'opacity-0'
                                      }`}
                                    />
                                  </Checkbox>
                                  <Label
                                    htmlFor='remember'
                                    className='text-white/60 hover:text-white/80 transition-colors cursor-pointer select-none'
                                  >
                                    Запомнить меня
                                  </Label>
                                </div>
                                <button
                                  type='button'
                                  onClick={() => {
                                    // Останавливаем звук перед возвратом к входу
                                    if (videoRef.current && !videoRef.current.muted) {
                                      videoRef.current.muted = true;
                                    }
                                    onBackToLogin?.();
                                  }}
                                  className='text-sm text-[#CCBAE4] hover:text-[#CCBAE4]/80 transition-colors'
                                >
                                  Забыли пароль?
                                </button>
                              </div>
                            ) : (
                              <div className='flex items-center gap-3'>
                                <div className='flex items-center space-x-2'>
                                  <Switch
                                    id='tos'
                                    checked={hasAgreedToToS}
                                    onCheckedChange={setHasAgreedToToS}
                                    disabled={loading}
                                  />
                                  <Label
                                    htmlFor='tos'
                                    className='text-white/60 hover:text-white/80 transition-colors cursor-pointer select-none'
                                  >
                                    Согласен с{' '}
                                    <a
                                      href='#'
                                      className='text-[#CCBAE4] hover:text-[#CCBAE4]/80 transition-colors'
                                    >
                                      правилами
                                    </a>{' '}
                                    сайта
                                  </Label>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        </div>

                        <div className='flex flex-row gap-2 pt-2'>
                          <Button
                            type='submit'
                            className='flex-1 h-[58px] bg-[#E4E4E4] hover:bg-[#DEDEDF]/90 text-black font-medium rounded-xl'
                            disabled={loading}
                          >
                            {loading ? (
                              <Loader2 className='w-5 h-5 animate-spin text-black' />
                            ) : isLogin ? (
                              'Войти'
                            ) : (
                              'Создать'
                            )}
                          </Button>
                          <Button
                            type='button'
                            variant='ghost'
                            onClick={onToggleForm}
                            disabled={loading}
                            className='h-[58px] px-4 bg-white/[0.02] hover:bg-white/[0.04] text-white/90 hover:text-white/70 border border-white/5 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed'
                          >
                            {!isLogin ? 'Вернуться' : 'Регистрация'}
                          </Button>
                        </div>
                      </motion.form>
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Управление звуком */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className='w-full flex flex-col gap-4 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 text-white/60 hover:text-white/90 transition-all duration-300'
              >
                <div className='flex items-center justify-between w-full'>
                  <div className='flex items-center gap-3 cursor-pointer' onClick={toggleMute}>
                    <div className='w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center group-hover:bg-white/[0.08] transition-colors'>
                      {isMuted ? <VolumeX className='w-5 h-5' /> : <Volume2 className='w-5 h-5' />}
                    </div>
                    <div className='flex items-start flex-col gap-0.5'>
                      <span className='text-sm font-medium'>
                        {isMuted ? 'Хотите скрасить регистрацию?' : 'Управление звуком'}
                      </span>
                      <span className='text-xs text-white/40'>
                        {isMuted ? 'Нажмите чтобы включить звук' : `Громкость: ${volume}%`}
                      </span>
                    </div>
                  </div>
                  {!isMuted && (
                    <div
                      className='w-[100px] flex items-center gap-2'
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Slider
                        defaultValue={[volume]}
                        value={[volume]}
                        max={100}
                        step={1}
                        onValueChange={handleVolumeChange}
                        className='cursor-pointer'
                      />
                    </div>
                  )}
                </div>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Auth;
