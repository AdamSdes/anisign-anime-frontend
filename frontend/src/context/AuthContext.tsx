'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from '@/services/authService';
import userService from '@/services/userService';
import { User } from '@/types/user';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { checkApiAvailability } from '@/lib/mockServer';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string, rememberMe: boolean) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
  updateUserData: () => Promise<void>;
  refreshAvatarTimestamp: () => void;
  avatarTimestamp: number;
  refreshBannerTimestamp: () => void;
  bannerTimestamp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [avatarTimestamp, setAvatarTimestamp] = useState<number>(Date.now());
  const [bannerTimestamp, setBannerTimestamp] = useState<number>(Date.now());
  const router = useRouter();

  // Функция обновления пользовательских данных
  const updateUserData = async () => {
    if (!isAuthenticated) return;

    try {
      const userData = await userService.getCurrentUser();
      setUser(userData);
      // Обновляем timestamp для аватара
      refreshAvatarTimestamp();
    } catch (error) {
      console.error('Ошибка при обновлении данных пользователя:', error);
      toast.error('Не удалось обновить данные профиля');

      // Автоматический разлогин при сетевых ошибках или ошибках 401/404
      if (
        axios.isAxiosError(error) &&
        (error.code === 'ERR_NETWORK' ||
          error.response?.status === 401 ||
          error.response?.status === 404)
      ) {
        console.log('Автоматический разлогин из-за сетевой ошибки или отсутствия пользователя');
        authService.setAccessToken(null);
        setIsAuthenticated(false);
        setUser(null);
        toast.error('Выполняется вход в анонимном режиме');
      }

      throw error;
    }
  };

  // Обновление метки времени аватара для принудительного обновления кеша
  const refreshAvatarTimestamp = () => {
    setAvatarTimestamp(Date.now());
  };

  // Обновление метки времени баннера для принудительного обновления кеша
  const refreshBannerTimestamp = () => {
    setBannerTimestamp(Date.now());
  };

  // Проверка авторизации при загрузке
  useEffect(() => {
    let isComponentMounted = true;
    let timeoutId: NodeJS.Timeout | null = null;

    // Функция для безопасного завершения сессии
    const clearAuthState = async () => {
      try {
        console.log('Очистка состояния авторизации');
        // Принудительно очищаем все данные авторизации
        await authService.forceLogout();

        if (isComponentMounted) {
          setIsAuthenticated(false);
          setUser(null);
          setLoading(false);

          // Временно отключаем автоматическое перенаправление для отладки
          console.log('Авторизация сброшена, текущий путь:', window.location.pathname);

          // Не перенаправляем на главную немедленно, чтобы избежать
          // неожиданных переходов если пользователь уже на странице авторизации
          // Проверяем, что мы не на странице авторизации
          // if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth')) {
          //   router.push('/');
          // }
        }
      } catch (error) {
        console.error('Ошибка при очистке данных авторизации:', error);
      }
    };

    const checkAuth = async () => {
      // Устанавливаем таймаут с адаптивным временем
      // Начинаем с 5 секунд для первой загрузки
      timeoutId = setTimeout(() => {
        if (isComponentMounted) {
          console.log('Сервер не ответил вовремя, сбрасываем авторизацию');
          toast.error('Сервер недоступен. Выполняется вход в анонимном режиме.');
          clearAuthState();
        }
      }, 5000);

      try {
        if (!isComponentMounted) return;

        // Сначала проверяем наличие сохраненного токена в localStorage
        const hasSavedToken = authService.hasSavedToken();
        const savedToken = authService.getAccessToken();

        console.log('Проверка авторизации:', {
          hasSavedToken,
          savedToken: !!savedToken,
          memoryToken: !!authService.getAccessToken(),
        });

        if (hasSavedToken && savedToken) {
          console.log('Найден сохраненный токен, проверяем его валидность');

          try {
            // Проверяем валидность сохраненного токена, пытаясь получить данные пользователя
            const userData = await userService.getCurrentUser();

            // Отменяем таймаут, так как токен валиден
            if (timeoutId) {
              clearTimeout(timeoutId);
              timeoutId = null;
            }

            if (isComponentMounted) {
              setIsAuthenticated(true);
              setUser(userData);
              setLoading(false);
              console.log('Авторизация восстановлена из сохраненного токена');
              return; // Выходим из функции, так как авторизация успешна
            }
          } catch (error) {
            console.log(
              'Сохраненный токен недействителен, пытаемся обновить через refresh token:',
              error
            );
            // Токен недействителен, продолжаем с проверкой cookies
          }
        } else {
          console.log('Сохраненный токен не найден, проверяем cookies');
        }

        // Проверяем наличие cookies и доступность сервера в одном запросе
        try {
          // Сначала проверяем доступность API
          const isApiAvailable = await checkApiAvailability(API_BASE_URL);

          if (!isApiAvailable) {
            console.log('API недоступен, переходим в анонимный режим');
            if (timeoutId) {
              clearTimeout(timeoutId);
              timeoutId = null;
            }
            if (isComponentMounted) {
              setIsAuthenticated(false);
              setUser(null);
              setLoading(false);
              toast.info('Работаем в автономном режиме');
            }
            return;
          }

          // Проверяем наличие refresh_token в cookies на стороне клиента
          const getCookie = (name: string): string | null => {
            if (typeof window !== 'undefined') {
              const nameEQ = name + '=';
              const ca = document.cookie.split(';');
              for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
              }
            }
            return null;
          };

          const refreshTokenFromCookie = getCookie('refresh_token');

          // Отменяем таймаут, так как проверили cookies
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }

          // Проверяем наличие refresh_token в cookies
          if (refreshTokenFromCookie) {
            try {
              // Пытаемся обновить токен через authService
              const rememberMe = authService.getRememberMe();
              const refreshResponse = await authService.refreshToken(rememberMe);

              // Проверяем успешность обновления токена
              if (refreshResponse && refreshResponse.access_token) {
                // Токен уже установлен в authService.refreshToken()
                if (isComponentMounted) {
                  setIsAuthenticated(true);

                  try {
                    // Получаем данные пользователя
                    const userData = await userService.getCurrentUser();
                    if (isComponentMounted) {
                      setUser(userData);
                      setLoading(false);

                      // Перенаправляем на сохраненный путь, если есть
                      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
                      if (redirectPath && typeof window !== 'undefined') {
                        sessionStorage.removeItem('redirectAfterLogin');
                        // Избегаем перенаправления обратно на страницу авторизации
                        if (!redirectPath.includes('/auth')) {
                          router.push(redirectPath);
                        }
                      }
                    }
                  } catch (error) {
                    console.error('Ошибка при получении данных пользователя:', error);

                    // Всегда очищаем состояние авторизации при ошибке получения пользователя
                    await clearAuthState();

                    if (axios.isAxiosError(error)) {
                      if (error.code === 'ERR_NETWORK') {
                        toast.error('Сервер недоступен. Выполняется вход в анонимном режиме.');
                      } else if (error.response?.status === 401 || error.response?.status === 404) {
                        toast.error('Аккаунт не найден или был удален. Сессия завершена');
                      } else {
                        toast.error('Не удалось загрузить данные профиля');
                      }
                    } else {
                      toast.error('Не удалось загрузить данные профиля');
                    }
                  }
                }
              } else {
                // Если не получили токен, очищаем данные авторизации
                await clearAuthState();
              }
            } catch (error) {
              console.error('Ошибка при обновлении токена:', error);
              await clearAuthState();

              if (axios.isAxiosError(error) && error.code === 'ERR_NETWORK') {
                toast.error('Сервер недоступен. Выполняется вход в анонимном режиме.');
              }
            }
          } else {
            // Куки отсутствуют - пользователь не авторизован
            // Просто устанавливаем loading = false, не показываем ошибку
            if (isComponentMounted) {
              setLoading(false);
            }
          }
        } catch (error) {
          // Отменяем таймаут, если он еще активен
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }

          console.error('Ошибка при проверке авторизации на сервере:', error);
          await clearAuthState();

          if (axios.isAxiosError(error) && error.code === 'ERR_NETWORK') {
            toast.error('Сервер недоступен. Выполняется вход в анонимном режиме.');
          }
        }
      } catch (error) {
        // Отменяем таймаут, если он еще активен
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }

        console.error('Общая ошибка проверки аутентификации:', error);
        await clearAuthState();
      }
    };

    // Запускаем проверку авторизации
    checkAuth();

    return () => {
      isComponentMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [router]);

  // Функция авторизации
  const login = async (username: string, password: string, rememberMe: boolean) => {
    setLoading(true);
    setError(null);

    // Устанавливаем таймаут для обнаружения недоступности сервера
    const loginTimeout = setTimeout(() => {
      setLoading(false);
      setError('Сервер недоступен. Пожалуйста, попробуйте позже.');
      toast.error('Сервер недоступен. Авторизация невозможна.');
    }, 5000);

    try {
      const authData = await authService.login(username, password, rememberMe);

      // Отменяем таймаут, так как получили ответ
      clearTimeout(loginTimeout);

      if (authData && authData.access_token) {
        setIsAuthenticated(true);

        // Получаем данные пользователя после авторизации
        try {
          const userData = await userService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Ошибка при получении данных пользователя после авторизации:', error);

          // Проверяем тип ошибки для определения дальнейших действий
          if (
            axios.isAxiosError(error) &&
            (error.code === 'ERR_NETWORK' ||
              error.response?.status === 401 ||
              error.response?.status === 404)
          ) {
            // Если сервер недоступен или пользователь не найден - полный разлогин
            authService.forceLogout();
            setIsAuthenticated(false);
            setUser(null);

            if (error.code === 'ERR_NETWORK') {
              toast.error('Сервер недоступен. Выполняется вход в анонимном режиме.');
            } else {
              toast.error('Не удалось загрузить данные профиля. Пожалуйста, повторите вход.');
            }
            throw error;
          } else {
            // Если другая ошибка, но авторизация прошла успешно,
            // оставляем пользователя авторизованным
            toast.error('Не удалось загрузить данные профиля, но вы авторизованы.');
          }
        }
      } else {
        throw new Error('Токен не получен');
      }
    } catch (error) {
      // Отменяем таймаут, так как получили ответ (хотя и с ошибкой)
      clearTimeout(loginTimeout);

      console.error('Ошибка авторизации:', error);

      // Для сетевых ошибок показываем специальное сообщение
      if (axios.isAxiosError(error) && error.code === 'ERR_NETWORK') {
        setError('Сервер недоступен. Пожалуйста, попробуйте позже.');
        toast.error('Сервер недоступен. Авторизация невозможна.');
      } else {
        setError('Ошибка при авторизации');
        throw new Error('Ошибка при авторизации');
      }
    } finally {
      setLoading(false);
    }
  };

  // Функция регистрации
  const register = async (
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      await authService.register(username, email, password, confirmPassword);
      // После успешной регистрации автоматически авторизуем пользователя
      const authData = await authService.login(username, password, false);
      if (authData && authData.access_token) {
        setIsAuthenticated(true);

        // Получаем данные пользователя после авторизации
        try {
          const userData = await userService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Ошибка при получении данных пользователя после регистрации:', error);
          toast.error(
            'Не удалось загрузить данные профиля, но вы зарегистрированы и авторизованы.'
          );
        }
      } else {
        throw new Error('Токен не получен после регистрации');
      }
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      setError('Ошибка при регистрации');
      throw new Error('Ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  // Функция выхода
  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      setError('Ошибка при выходе');
      throw new Error('Ошибка при выходе');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    user,
    login,
    register,
    logout,
    loading,
    error,
    updateUserData,
    refreshAvatarTimestamp,
    avatarTimestamp,
    refreshBannerTimestamp,
    bannerTimestamp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
