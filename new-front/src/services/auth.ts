import { User } from '@/shared/types/user';
import { apiRequest } from '@/lib/api';

export const authService = {
    /**
     * Выполняет вход пользователя
     * @param credentials Данные для входа
     * @returns 
     */
    login: async (credentials: { identifier: string; password: string }): Promise<{ token: string, user: User }> => {
        const response = await apiRequest({
            url: '/auth/login',
            method: 'POST',
            data: credentials,
            useAuth: false,
        });
        return response.data;
    },

    /**
     * Регистрирует нового пользователя
     * @param credentials Данные для регистрации
     * @returns 
     */
    register: async (credentials: { username: string; email: string; password: string }): Promise<{ token: string; user: User }> => {
        const response = await apiRequest({
            url: '/auth/register',
            method: 'POST',
            data: credentials,
            useAuth: false,
        });
        return response.data;
    },

    /**
     * Выполняет вход через социальные сети (Google, Discord) с использованием OAuth-кода. *
     * @param provider - Провайдер социального входа ('google' | 'discord').
     * @param code - Код авторизации, полученный от провайдера.
     * @returns Promise с ответом API.
     */
    socialLogin: async (provider: 'google' | 'discord', code: string): Promise<{ token: string; user: User }> => {
        const response = await apiRequest({
          url: `/auth/${provider}/callback?code=${encodeURIComponent(code)}`,
          method: 'get',
          useAuth: false,
        });
        return response.data;
    },

    /**
     * Выполняет выход пользователя
     * @returns
     */
    logout: async (): Promise<void> => {
        const response = await apiRequest({
            url: '/auth/logout',
            method: 'POST', 
            useAuth: true,
        });
        return response.data;
    },
};