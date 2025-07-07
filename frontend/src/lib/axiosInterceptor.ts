import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import authService from '@/services/authService';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/config/api';

// Очередь запросов, ожидающих обновления токена
let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

// Функция, которая выполняет отложенные запросы с новым токеном
const processQueue = (token: string | null, error: Error | null = null) => {
  refreshQueue.forEach((callback) => {
    if (error) {
      // Если произошла ошибка, все ожидающие запросы должны быть отклонены
      return;
    }
    if (token) {
      callback(token);
    }
  });

  // Очищаем очередь после выполнения
  refreshQueue = [];
};

// Функция безопасного перенаправления
const safeRedirect = (path: string) => {
  // Используем Next.js router для плавного перехода без полной перезагрузки страницы
  // Это более плавно, чем window.location.href
  if (typeof window !== 'undefined') {
    // Сохраняем текущий путь для возможного возврата после авторизации
    sessionStorage.setItem('redirectAfterLogin', window.location.pathname);

    // Перенаправляем на страницу авторизации
    window.location.href = path;
  }
};

// Создаем инстанс axios с базовым URL
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000, // Увеличиваем таймаут до 10 секунд
});

// Интерцептор запросов для добавления токена авторизации
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = authService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Интерцептор ответов для обработки ошибок аутентификации и обновления токена
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
      _retryCount?: number;
    };

    // Увеличиваем счетчик повторов
    originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

    // Если ошибка сетевая (ERR_NETWORK), делаем до 3 повторов
    if (error.code === 'ERR_NETWORK' && (originalRequest._retryCount || 0) <= 3) {
      console.log(
        `Повтор запроса после сетевой ошибки (попытка ${originalRequest._retryCount || 0}/3)`
      );

      // Ждем перед повтором (увеличивая задержку с каждой попыткой)
      await new Promise((resolve) =>
        setTimeout(resolve, (originalRequest._retryCount || 0) * 1000)
      );

      return axiosInstance(originalRequest);
    }

    // Если после 3 попыток все равно ошибка, выполняем выход из системы
    if (error.code === 'ERR_NETWORK' && (originalRequest._retryCount || 0) > 3) {
      console.error('Критическая сетевая ошибка после нескольких попыток:', error);

      // Показываем пользователю уведомление
      toast.error('Не удается подключиться к серверу. Проверьте подключение к интернету.');

      // Выполняем выход из системы только если мы были авторизованы
      if (authService.isAuthenticated()) {
        await authService.forceLogout();
        safeRedirect('/auth');
      }

      return Promise.reject(error);
    }

    // Если ошибка 404 (Not Found), это может означать, что пользователь был удален
    // Но только если это запрос к текущему пользователю, а не к другим пользователям
    if (error.response?.status === 404 && originalRequest.url?.includes('/user/me')) {
      console.error('Текущий пользователь не найден (возможно удален):', error);
      console.log('URL запроса:', originalRequest.url);

      toast.error('Ваш аккаунт не найден или был удален администратором.');

      await authService.forceLogout();
      safeRedirect('/auth');

      return Promise.reject(error);
    }

    // Логируем 404 ошибки для других пользователей, но не выходим из системы
    if (error.response?.status === 404 && originalRequest.url?.includes('/user/get-user/')) {
      console.log('Пользователь не найден (404):', originalRequest.url);
      // Не выходим из системы, просто возвращаем ошибку
      return Promise.reject(error);
    }

    // Обработка других ошибок сервера (500, 503, etc.)
    if (error.response?.status && error.response.status >= 500) {
      toast.error('Сервер временно недоступен. Пожалуйста, попробуйте позже.');
    }

    // Если ошибка 401 (Unauthorized) и запрос еще не был повторен в процессе обновления токена
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('Получена 401 ошибка для запроса:', originalRequest.url);
      // Помечаем запрос, чтобы избежать зацикливания
      originalRequest._retry = true;

      // Если процесс обновления токена еще не запущен
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // Пробуем обновить токен
          const rememberMe = authService.getRememberMe();
          const refreshResponse = await authService.refreshToken(rememberMe);

          const newToken = refreshResponse.access_token;

          // Обновляем все запросы в очереди
          processQueue(newToken);

          // Обновляем заголовок в оригинальном запросе
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          // Завершаем процесс обновления
          isRefreshing = false;

          // Повторяем оригинальный запрос с новым токеном
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Если не удалось обновить токен, отклоняем все запросы в очереди
          processQueue(null, refreshError as Error);

          // Если ошибка при обновлении токена
          console.error('Ошибка при обновлении токена:', refreshError);

          toast.error('Ваша сессия истекла. Пожалуйста, войдите снова.');

          // Выполняем выход из системы
          await authService.forceLogout();
          safeRedirect('/auth');

          // Завершаем процесс обновления
          isRefreshing = false;

          return Promise.reject(refreshError);
        }
      } else {
        // Если процесс обновления токена уже запущен, добавляем запрос в очередь
        return new Promise((resolve) => {
          refreshQueue.push((token: string) => {
            // Обновляем заголовок в оригинальном запросе
            originalRequest.headers.Authorization = `Bearer ${token}`;

            // Повторяем запрос с новым токеном
            resolve(axiosInstance(originalRequest));
          });
        });
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
