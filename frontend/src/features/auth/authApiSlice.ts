import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { useAuthStore } from '@/hooks/useAuth';

interface User {
  id: string;
  username: string;
  nickname: string;
  user_avatar: string | null;
  user_banner: string | null;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
}

interface LoginCredentials {
  username: string;
  password: string;
  remember_me?: boolean;
}

interface RegisterCredentials {
  username: string;
  password: string;
  confirm_password: string;
}

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
        credentials: 'include',
        prepareHeaders: (headers) => {
            // Получаем токен из Zustand store
            const token = useAuthStore.getState().token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, LoginCredentials>({
            query: (credentials) => ({
                url: '/auth/token',
                method: 'POST',
                body: credentials,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }),
        }),
        register: builder.mutation<User, RegisterCredentials>({
            query: (credentials) => ({
                url: '/user/create-user',
                method: 'POST',
                body: credentials,
            }),
        }),
        getUserByUsername: builder.query<User, string>({
            query: (username) => `/user/get-user-by-username/${username}`,
        }),
        getUserAvatar: builder.query<Blob, void>({
            query: () => ({
                url: '/user/get-my-avatar',
                responseHandler: async (response) => response.blob(),
            }),
            transformErrorResponse: (response: { status: number }) => {
                if (response.status === 404) {
                    return null;
                }
                throw new Error('Ошибка при загрузке аватара');
            },
            providesTags: ['Avatar'],
        }),
        uploadAvatar: builder.mutation<{ message: string }, File>({
            query: (file) => {
                const formData = new FormData();
                formData.append('file', file);
                return {
                    url: '/user/update-my-avatar',
                    method: 'PUT',
                    body: formData
                };
            },
            transformErrorResponse: (response: { status: number, data: any }) => {
                console.error('Upload avatar error:', response);
                if (response.status === 404) {
                    throw new Error('Эндпоинт для загрузки аватара не найден');
                }
                if (response.status === 413) {
                    throw new Error('Файл слишком большой');
                }
                throw new Error(response.data?.detail || 'Ошибка при загрузке аватара');
            },
            invalidatesTags: ['Avatar', 'User']
        }),
        getUserBanner: builder.query<Blob, void>({
            query: () => ({
                url: '/user/get-my-banner',
                responseHandler: async (response) => response.blob(),
            }),
            transformErrorResponse: (response: { status: number }) => {
                if (response.status === 404) {
                    return null;
                }
                throw new Error('Ошибка при загрузке баннера');
            },
            providesTags: ['Banner'],
        }),
        uploadBanner: builder.mutation<{ message: string }, File>({
            query: (file) => {
                const formData = new FormData();
                formData.append('file', file);
                return {
                    url: '/user/update-my-banner',
                    method: 'PUT',
                    body: formData,
                };
            },
            invalidatesTags: ['Banner'],
        }),
    }),
    tagTypes: ['Avatar', 'User', 'Banner']
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useGetUserByUsernameQuery,
    useLazyGetUserByUsernameQuery,
    useGetUserAvatarQuery,
    useUploadAvatarMutation,
    useGetUserBannerQuery,
    useUploadBannerMutation,
} = authApi;