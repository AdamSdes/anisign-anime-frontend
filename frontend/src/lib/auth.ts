import { axiosInstance } from '@/lib/api/axiosConfig';
import { LoginData, LoginResponse, RegisterData } from './types/auth';
import { useAuthStore } from '@/hooks/useAuth';

export const login = async (data: LoginData): Promise<LoginResponse> => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.append('password', data.password);
    formData.append('grant_type', 'password');
    formData.append('scope', '');
    formData.append('client_id', '');
    formData.append('client_secret', '');

    const response = await axiosInstance.post<LoginResponse>(
      `/auth/token?remember_me=${data.remember_me}`,
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        withCredentials: true
      }
    );

    if (response.data.access_token) {
      useAuthStore.getState().login(response.data.access_token);
    }

    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    if (error.response?.data?.detail) {
      const detail = error.response.data.detail;
      if (Array.isArray(detail)) {
        throw new Error(detail.map(err => err.msg).join(', '));
      }
      throw new Error(detail);
    }
    throw error;
  }
};

export const register = async (data: RegisterData): Promise<void> => {
  try {
    const response = await axiosInstance.post(
      '/user/create-user',
      {
        username: data.username,
        password: data.password,
        confirm_password: data.confirm_password
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    if (!response.data) {
      throw new Error('Ошибка при регистрации: нет ответа от сервера');
    }

    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    
    // Обработка ошибок от сервера
    if (error.response?.data) {
      const { data } = error.response;
      
      // Если ошибка содержит detail
      if (data.detail) {
        if (Array.isArray(data.detail)) {
          throw new Error(data.detail.map(err => err.msg).join(', '));
        }
        throw new Error(data.detail);
      }
      
      // Если ошибка содержит message
      if (data.message) {
        throw new Error(data.message);
      }

      // Если есть ошибки валидации
      if (data.errors) {
        const errorMessages = Object.values(data.errors).flat();
        throw new Error(errorMessages.join(', '));
      }
    }

    // Общая ошибка
    throw new Error('Произошла ошибка при регистрации. Пожалуйста, попробуйте позже.');
  }
};

export const updateAvatar = async (file: File): Promise<string> => {
  try {
    // Валидация файла
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    
    if (file.size > maxSize) {
      throw new Error('Размер файла не должен превышать 10MB');
    }
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Поддерживаются только форматы: JPEG, PNG, WebP, GIF');
    }

    const formData = new FormData();
    formData.append('file', file);

    const token = useAuthStore.getState().token;
    if (!token) {
      throw new Error('Необходима авторизация');
    }

    console.log('[Auth] Uploading avatar:', { fileName: file.name });
    
    const response = await axiosInstance.put(
      '/user/update-my-avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        timeout: 30000, // 30 секунд таймаут
      }
    );

    console.log('[Auth] Avatar upload response:', response.data);

    // После успешной загрузки получаем актуальный URL аватара
    const avatarResponse = await axiosInstance.get('/user/get-my-avatar');
    const avatarUrl = avatarResponse.data.avatar_url;

    if (!avatarUrl) {
      throw new Error('Не удалось получить URL аватара');
    }

    // Обновляем информацию о пользователе в хранилище
    const currentUser = useAuthStore.getState().user;
    if (currentUser) {
      useAuthStore.getState().setUser({
        ...currentUser,
        avatar: avatarUrl
      });
    }

    return avatarUrl;
  } catch (error: any) {
    console.error('[Auth] Avatar upload error:', error);
    console.error('[Auth] Error details:', {
      response: error.response?.data,
      status: error.response?.status,
      message: error.message
    });
    
    const errorMessage = error.response?.data?.detail 
      || error.response?.data?.message 
      || error.message 
      || 'Неизвестная ошибка при обновлении аватара';
      
    throw new Error(errorMessage);
  }
};

export const getBanner = async (): Promise<string> => {
  try {
    const token = useAuthStore.getState().token;
    if (!token) {
      throw new Error('Необходима авторизация');
    }

    const response = await axiosInstance.get('/user/get-my-banner');
    return response.data.banner_url;
  } catch (error: any) {
    console.error('[Auth] Get banner error:', error);
    throw new Error('Не удалось получить баннер');
  }
};

export const updateBanner = async (file: File): Promise<string> => {
  try {
    console.log('[Auth] Starting banner upload');
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.put('/user/update-my-banner', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });

    console.log('[Auth] Banner upload response:', response.data);
    console.log('[Auth] Full response:', response);

    // После успешной загрузки получаем актуальный URL баннера
    const bannerResponse = await axiosInstance.get('/user/get-my-banner');
    const bannerUrl = bannerResponse.data.banner_url;
    console.log('[Auth] Received banner URL:', bannerUrl);
    
    // Обновляем информацию о пользователе в хранилище
    const currentUser = useAuthStore.getState().user;
    if (currentUser) {
      useAuthStore.getState().setUser({
        ...currentUser,
        user_banner: bannerUrl
      });
    }

    return bannerUrl;
  } catch (error: any) {
    console.error('[Auth] Banner upload error:', error);
    console.error('[Auth] Error details:', {
      response: error.response?.data,
      status: error.response?.status,
      message: error.message
    });
    
    const errorMessage = error.response?.data?.detail 
      || error.response?.data?.message 
      || error.message 
      || 'Неизвестная ошибка при обновлении баннера';
      
    throw new Error(errorMessage);
  }
};

export const logout = async (): Promise<void> => {
  try {
    await axiosInstance.post('/auth/logout', {}, { 
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${useAuthStore.getState().token}`
      }
    });

    // Очищаем все хранилища
    if (typeof window !== 'undefined') {
      // Очищаем localStorage
      localStorage.removeItem('user_avatar');
      localStorage.removeItem('user_banner');
      
      // Очищаем sessionStorage
      sessionStorage.removeItem('avatarSessionKey');
      sessionStorage.removeItem('bannerSessionKey');
      
      // Сбрасываем CSS переменную баннера
      document.documentElement.style.setProperty('--profile-banner', 'none');
      
      // Очищаем все кеши изображений через Service Worker если он есть
      if ('caches' in window) {
        try {
          const keys = await caches.keys();
          await Promise.all(
            keys.map(key => {
              if (key.includes('avatar') || key.includes('banner')) {
                return caches.delete(key);
              }
              return Promise.resolve();
            })
          );
        } catch (e) {
          console.error('Failed to clear image caches:', e);
        }
      }
    }

    // Очищаем состояние
    useAuthStore.getState().logout();
  } catch (error) {
    console.error('Logout error:', error);
    // Даже если запрос на сервер не удался, все равно очищаем локальное состояние
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_avatar');
      localStorage.removeItem('user_banner');
      sessionStorage.removeItem('avatarSessionKey');
      sessionStorage.removeItem('bannerSessionKey');
      document.documentElement.style.setProperty('--profile-banner', 'none');
    }
    useAuthStore.getState().logout();
    throw error;
  }
};