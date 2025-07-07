import axios from 'axios';
import axiosInstance from '@/lib/axiosInterceptor';
import { API_BASE_URL, API_ENDPOINTS } from '@/config/api';

// Переменная для хранения текущего токена в памяти (memory state)
let memoryToken: string | null = null;

// Ключи для localStorage
const ACCESS_TOKEN_KEY = 'access_token';
const REMEMBER_ME_KEY = 'rememberMe';

/**
 * Функции для работы с cookies
 */
const setCookie = (name: string, value: string, days: number = 30) => {
  if (typeof window !== 'undefined') {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  }
};

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

const deleteCookie = (name: string) => {
  if (typeof window !== 'undefined') {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }
};

/**
 * Инициализация токена из localStorage при загрузке
 */
const initializeToken = () => {
  if (typeof window !== 'undefined') {
    const savedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
    
    console.log('Инициализация токена:', { savedToken: !!savedToken, rememberMe });
    
    if (savedToken && rememberMe) {
      memoryToken = savedToken;
      console.log('Токен восстановлен из localStorage');
    } else {
      console.log('Токен не найден или rememberMe отключен');
    }
  }
};

// Инициализируем токен при загрузке модуля
initializeToken();

/**
 * Сохранение токена в localStorage (только если включен rememberMe)
 */
const saveTokenToStorage = (token: string, rememberMe: boolean) => {
  if (typeof window !== 'undefined') {
    if (rememberMe) {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
      localStorage.setItem(REMEMBER_ME_KEY, 'true');
    } else {
      // Если rememberMe отключен, удаляем токен из localStorage
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.setItem(REMEMBER_ME_KEY, 'false');
    }
  }
};

/**
 * Очистка токена из localStorage
 */
const clearTokenFromStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REMEMBER_ME_KEY);
  }
};

/**
 * Сервис для работы с API авторизации
 */
const authService = {
  /**
   * Авторизация пользователя
   * @param username Имя пользователя
   * @param password Пароль
   * @param rememberMe Запомнить пользователя
   * @returns Токен авторизации
   */
  async login(username: string, password: string, rememberMe: boolean = false) {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.TOKEN}?remember_me=${rememberMe}`,
        formData,
        {
          withCredentials: true, // Важно для сохранения cookies
        }
      );

      // Сохраняем токен в памяти (memory state) для использования в запросах
      if (response.data.access_token) {
        memoryToken = response.data.access_token;
        saveTokenToStorage(response.data.access_token, rememberMe);
      }

      // Сохраняем refresh_token в cookies для последующего использования
      if (response.data.refresh_token) {
        // Устанавливаем refresh_token в cookies на 30 дней
        setCookie('refresh_token', response.data.refresh_token, 30);
        console.log('Refresh token сохранен в cookies');
      }

      return response.data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },

  /**
   * Регистрация нового пользователя
   * @param username Имя пользователя
   * @param email Email пользователя
   * @param password Пароль
   * @param confirmPassword Подтверждение пароля
   * @returns Данные созданного пользователя
   */
  async register(username: string, email: string, password: string, confirmPassword: string) {
    try {
      const response = await axiosInstance.post(`/user/create-user`, {
        username,
        email,
        password,
        confirm_password: confirmPassword,
      });
      return response.data;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  },

  /**
   * Обновление токена доступа
   * @param rememberMe Запомнить пользователя
   * @returns Новый токен доступа
   */
  async refreshToken(rememberMe: boolean = false) {
    try {
      // Получаем refresh_token из cookies
      const refreshTokenFromCookie = getCookie('refresh_token');
      
      if (!refreshTokenFromCookie) {
        throw new Error('Refresh token не найден в cookies');
      }

      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}?remember_me=${rememberMe}&refresh_token=${refreshTokenFromCookie}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.access_token) {
        memoryToken = response.data.access_token;
        saveTokenToStorage(response.data.access_token, rememberMe);
      }

      // Обновляем refresh_token в cookies, если он пришел в ответе
      if (response.data.refresh_token) {
        setCookie('refresh_token', response.data.refresh_token, 30);
        console.log('Refresh token обновлен в cookies');
      }

      return response.data;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  },

  /**
   * Выход из системы
   */
  async logout() {
    try {
      await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGOUT}`,
        {},
        {
          withCredentials: true,
        }
      );
      memoryToken = null;
      clearTokenFromStorage();
      deleteCookie('refresh_token');
    } catch (error) {
      console.error('Error during logout:', error);
      // Даже при ошибке выхода очищаем локальные данные
      memoryToken = null;
      clearTokenFromStorage();
      deleteCookie('refresh_token');
      throw error;
    }
  },

  /**
   * Принудительный сброс всех данных авторизации
   * Используется при сетевых ошибках и других ситуациях, требующих немедленного выхода
   */
  async forceLogout() {
    try {
      // Очищаем токен из памяти
      memoryToken = null;

      // Очищаем localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REMEMBER_ME_KEY);
      }

      // Очищаем cookies
      deleteCookie('refresh_token');

      // Очищаем sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
      }

      // Очищаем различные куки с разными путями для надежности
      if (typeof window !== 'undefined') {
        const cookiesToClear = [
          'access_token',
          'refresh_token',
          'auth-token',
          'session',
          'user_session',
          'dle_user_id',
          'dle_password',
          'dle_hash'
        ];

        cookiesToClear.forEach(cookieName => {
          // Очищаем с разными путями
          document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
          document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=${window.location.hostname};`;
          document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=.${window.location.hostname};`;
        });
      }

      // В режиме разработки не делаем запрос на сервер для избежания циклических обновлений
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      if (!isDevelopment) {
        try {
          // Попытка выполнить logout на сервере
          await axios.post(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGOUT}`, {}, {
            withCredentials: true,
            timeout: 3000, // Короткий таймаут, чтобы не блокировать UI
          });
        } catch (error) {
          // Игнорируем ошибки logout на сервере, так как главное - очистить клиентскую сторону
          console.log('Logout на сервере не удался, но локальные данные очищены:', error);
        }
      }

      console.log('Принудительный logout выполнен');
    } catch (error) {
      console.error('Ошибка при принудительном logout:', error);
      // Даже если произошла ошибка, очищаем локальные данные
      memoryToken = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REMEMBER_ME_KEY);
        sessionStorage.clear();
      }
      deleteCookie('refresh_token');
    }
  },

  /**
   * Проверка авторизации пользователя
   * @returns true, если пользователь авторизован
   */
  isAuthenticated() {
    return !!memoryToken;
  },

  /**
   * Получение токена доступа
   * @returns Токен доступа
   */
  getAccessToken() {
    return memoryToken;
  },

  /**
   * Получение значения "запомнить меня"
   * @returns true, если пользователь выбрал "запомнить меня"
   */
  getRememberMe() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(REMEMBER_ME_KEY) === 'true';
    }
    return false;
  },

  /**
   * Установка токена доступа в память
   * @param token Токен доступа
   */
  setAccessToken(token: string | null) {
    memoryToken = token;
    if (token && this.getRememberMe()) {
      saveTokenToStorage(token, true);
    } else if (!token) {
      clearTokenFromStorage();
    }
  },

  /**
   * Проверка наличия сохраненного токена при загрузке приложения
   * @returns true, если есть сохраненный токен
   */
  hasSavedToken() {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
      return !!(savedToken && rememberMe);
    }
    return false;
  },
};

export default authService;
