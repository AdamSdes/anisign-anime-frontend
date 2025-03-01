import { User } from '@/shared/types/user';
import { apiRequest } from '@/lib/api';

export const userService = {
    /**
     * Получает данные пользователя
     * @returns 
     */
    getCurrentUser: async (): Promise<User> => {
        const response = await apiRequest({
            url: '/user/me',
            method: 'GET',
            useAuth: true,
        });
        return response.data;
    },

    /**
     * Обновляет данные пользователя
     * @param data Данные для обновления
     * @returns
     */
    updateUser: async (data: Partial<User>): Promise<User> => {
        const response = await apiRequest({
            url: '/user/me',
            method: 'PATCH',
            data,
            useAuth: true,
        });
        return response.data;
    },

    /**
     * Удаляет текущего пользователя
     * @returns
     */
    deleteUser: async (): Promise<void> => {
        const response = await apiRequest({
            url: '/user/me',
            method: 'DELETE',
            useAuth: true,
        });
        return response.data;
    },
};