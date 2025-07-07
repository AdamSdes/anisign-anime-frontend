'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { User } from '@/types/user';
import { Anime } from '@/types/anime';
import axios from 'axios';
import Link from 'next/link';
import UserAvatar from '@/components/user/UserAvatar';
import animeService from '@/services/animeService';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'users' | 'anime'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [anime, setAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Функция поиска с мемоизацией, чтобы не создавать новую функцию при каждом рендеринге
  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) {
      setUsers([]);
      setAnime([]);
      setNoResults(false);
      return;
    }

    // Проверка на минимальную длину запроса
    if (searchTerm.trim().length < 2) {
      return;
    }

    setLoading(true);
    setNoResults(false);

    try {
      if (searchType === 'users') {
        // Поиск пользователей
        const response = await axios.get(`http://localhost:8000/user/name/${searchTerm}`);
        const data = response.data;

        if (data.user_list && data.user_list.length > 0) {
          setUsers(data.user_list);
          setNoResults(false);
        } else {
          setUsers([]);
          setNoResults(true);
        }
        // Сбрасываем результаты поиска аниме при поиске пользователей
        setAnime([]);
      } else {
        // Поиск аниме
        try {
          const response = await animeService.searchAnime(searchTerm);
          if (response.anime_list && response.anime_list.length > 0) {
            setAnime(response.anime_list);
            setNoResults(false);
          } else {
            setAnime([]);
            setNoResults(true);
          }
          // Сбрасываем результаты поиска пользователей при поиске аниме
          setUsers([]);
        } catch (error) {
          console.error('Ошибка при поиске аниме:', error);
          setAnime([]);
          setNoResults(true);
        }
      }
    } catch (error) {
      console.error('Ошибка при поиске:', error);
      setUsers([]);
      setAnime([]);
      setNoResults(true);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, searchType]);

  // Эффект для запуска поиска при изменении строки поиска с дебаунсом
  useEffect(() => {
    // Очищаем предыдущий таймаут, если ввод продолжается
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Если строка поиска пустая, очищаем результаты
    if (!searchTerm.trim()) {
      setUsers([]);
      setAnime([]);
      setNoResults(false);
      return;
    }

    // Не делаем запрос, если длина меньше 2 символов
    if (searchTerm.trim().length < 2) {
      return;
    }

    // Устанавливаем таймаут для дебаунса (300мс)
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch();
    }, 300);

    // Очистка таймаута при размонтировании
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, handleSearch]);

  // Функция для обработки изменения типа поиска
  const handleSearchTypeChange = (type: 'users' | 'anime') => {
    setSearchType(type);
    // Запускаем поиск только если есть поисковый запрос
    if (searchTerm.trim()) {
      // Очищаем предыдущий таймаут
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      // Запускаем поиск немедленно
      handleSearch();
    }
  };

  // Обработчик клика на результат поиска пользователя
  const handleUserClick = (username: string) => {
    onClose(); // Закрыть модальное окно

    // Перейти на страницу профиля, если пользователь авторизован
    if (isAuthenticated) {
      router.push(`/profile/${username}`);
    } else {
      // Иначе перейти на страницу авторизации
      router.push('/auth');
    }
  };

  // Фокус на поле ввода при открытии модального окна
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Закрытие модального окна при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Закрытие модального окна при нажатии ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 transition-opacity backdrop-blur-sm'
      >
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className='w-full max-w-3xl bg-[#060606] border border-white/5 rounded-xl overflow-hidden shadow-2xl flex flex-col relative'
          style={{ maxHeight: '80vh' }}
        >
          {/* Заголовок и кнопка закрытия */}
          <div className='flex items-center justify-between p-5 border-b border-white/5'>
            <h2 className='text-xl font-medium text-white/90'>Поиск</h2>
            <button
              onClick={onClose}
              className='text-white/40 hover:text-white/90 transition-colors'
            >
              <X size={24} />
            </button>
          </div>

          {/* Поле поиска */}
          <div className='p-5 border-b border-white/5'>
            <div className='flex flex-col md:flex-row items-stretch md:items-center gap-3'>
              <div className='flex-1 relative'>
                <input
                  ref={inputRef}
                  type='text'
                  placeholder='Введите запрос...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full py-3 px-4 pr-10 bg-white/[0.02] border border-white/10 rounded-xl text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/20'
                />
                <div className='absolute right-3 top-1/2 -translate-y-1/2'>
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      className='w-12 h-12 border-2 border-white/5 border-t-white/20 rounded-full'
                    />
                  ) : (
                    <Search
                      size={20}
                      className='text-white/40 hover:text-white/90 transition-colors'
                    />
                  )}
                </div>
                {searchTerm.trim().length === 1 && (
                  <div className='absolute top-full left-0 mt-1 bg-amber-500/20 text-amber-500 text-xs px-2 py-1 rounded'>
                    Минимум 2 символа для поиска
                  </div>
                )}
              </div>
              <div className='flex items-center p-1 bg-white/[0.02] border border-white/10 rounded-xl'>
                <button
                  onClick={() => handleSearchTypeChange('users')}
                  className={`px-4 py-2.5 rounded-lg transition-colors ${
                    searchType === 'users'
                      ? 'bg-white/10 text-white/90'
                      : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  Пользователи
                </button>
                <button
                  onClick={() => handleSearchTypeChange('anime')}
                  className={`px-4 py-2.5 rounded-lg transition-colors ${
                    searchType === 'anime'
                      ? 'bg-white/10 text-white/90'
                      : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  Аниме
                </button>
              </div>
            </div>
          </div>

          {/* Результаты поиска */}
          <div
            className='p-5 overflow-y-auto relative custom-scrollbar'
            style={{
              minHeight: '300px',
              height: 'calc(100% - 170px)',
            }}
          >
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='absolute inset-0 flex items-center justify-center bg-[#060606]'
              >
                <div className='flex flex-col items-center justify-center space-y-3'>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    className='w-12 h-12 border-2 border-white/5 border-t-white/20 rounded-full'
                  />
                  <p className='text-white/40 text-sm'>Поиск...</p>
                </div>
              </motion.div>
            ) : noResults ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className='h-full flex flex-col items-center justify-center text-white/40'
              >
                <AlertCircle size={48} />
                <p className='mt-3'>Ничего не найдено</p>
              </motion.div>
            ) : (
              <AnimatePresence mode='wait'>
                <motion.div
                  key={searchType}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className='h-full'
                >
                  {searchType === 'users' && (
                    <div
                      className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${
                        users.length === 0 ? 'h-full' : ''
                      }`}
                    >
                      {users.length > 0
                        ? users.map((user, index) => (
                            <motion.div
                              key={user.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05, duration: 0.2 }}
                            >
                              <div
                                onClick={() => handleUserClick(user.nickname || user.username)}
                                className='cursor-pointer'
                              >
                                <motion.div
                                  className='flex items-center gap-3 p-4 bg-white/[0.02] hover:bg-white/[0.05] transition-all rounded-xl border border-white/5'
                                  transition={{ duration: 0.15 }}
                                >
                                  <UserAvatar user={user} size='md' className='flex-shrink-0' />
                                  <div>
                                    <p className='text-white/90 font-medium'>
                                      {user.nickname || user.username}
                                    </p>
                                    <p className='text-white/40 text-sm'>@{user.username}</p>
                                  </div>
                                </motion.div>
                              </div>
                            </motion.div>
                          ))
                        : !searchTerm && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.1 }}
                              className='col-span-2 h-full flex flex-col items-center justify-center text-white/40'
                            >
                              <Search size={48} />
                              <p className='mt-3'>Введите запрос для поиска</p>
                            </motion.div>
                          )}
                    </div>
                  )}

                  {searchType === 'anime' && (
                    <div className='h-full'>
                      {anime.length > 0 ? (
                        <div className='flex flex-col gap-3'>
                          {anime.map((animeItem, index) => (
                            <motion.div
                              key={animeItem.anime_id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05, duration: 0.2 }}
                            >
                              <Link href={`/anime/${animeItem.anime_id}`} onClick={onClose}>
                                <motion.div
                                  className='bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-xl overflow-hidden transition-all p-4 flex'
                                  transition={{ duration: 0.15 }}
                                >
                                  <div className='relative h-24 w-16 flex-shrink-0'>
                                    {animeItem.poster_url ? (
                                      <Image
                                        src={animeItem.poster_url}
                                        alt={animeItem.russian || animeItem.english}
                                        fill
                                        className='object-cover rounded-lg'
                                        unoptimized={true}
                                      />
                                    ) : (
                                      <div className='absolute inset-0 bg-white/[0.02] flex items-center justify-center rounded-lg'>
                                        <Info className='w-8 h-8 text-white/20' />
                                      </div>
                                    )}
                                  </div>
                                  <div className='ml-3 flex-1 flex flex-col justify-between'>
                                    <div>
                                      <h3 className='text-white/90 font-medium line-clamp-1'>
                                        {animeItem.russian || animeItem.english}
                                      </h3>
                                      <p className='text-white/40 text-xs line-clamp-1 mt-1'>
                                        {animeItem.english !== animeItem.russian &&
                                          animeItem.english}
                                      </p>
                                    </div>
                                    <div className='flex items-center justify-between mt-2'>
                                      <div className='flex items-center gap-2 text-xs text-white/40'>
                                        <span className='capitalize'>{animeItem.kind}</span>
                                        {animeItem.aired_on && (
                                          <span>{new Date(animeItem.aired_on).getFullYear()}</span>
                                        )}
                                      </div>
                                      {animeItem.score > 0 && (
                                        <motion.div
                                          className='bg-black/70 text-white/90 text-xs font-medium px-2 py-1 rounded-lg'
                                          whileHover={{ scale: 1.1 }}
                                          transition={{ duration: 0.15 }}
                                        >
                                          {animeItem.score.toFixed(1)}
                                        </motion.div>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        !searchTerm && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className='h-full flex flex-col items-center justify-center text-white/40'
                          >
                            <Search size={48} />
                            <p className='mt-3'>Введите запрос для поиска</p>
                          </motion.div>
                        )
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </motion.div>

        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.02);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.15);
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchModal;
