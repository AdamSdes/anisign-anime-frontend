'use client';

import { apiSlice } from "@/app/api/apiSlice";

//налаштування запитів
export const authApiSlice = apiSlice.injectEndpoints({
    tagTypes: ['Avatar'], // Добавляем тип тега
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => {
                const formData = new URLSearchParams();
                formData.append('username', credentials.username);
                formData.append('password', credentials.password);
                formData.append('grant_type', 'password');
                formData.append('scope', '');
                formData.append('client_id', '');
                formData.append('client_secret', '');

                const params = new URLSearchParams();
                params.append('remember_me', credentials.rememberMe === undefined ? false : credentials.rememberMe);

                return {
                    url: `/auth/token?${params.toString()}`,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formData.toString(),
                };
            }
        }),
        register: builder.mutation({
            query: credentials => {
                const body = {
                    username: credentials.username,
                    password: credentials.password,
                    confirm_password: credentials.confirmPassword,
                };

                const params = new URLSearchParams();
                params.append('remember_me', credentials.rememberMe === undefined ? false : credentials.rememberMe);
        
                return {
                    url: `/user/create-user?${params.toString()}`,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                };
            }
        }),
        logout: builder.query({
            query: () => ({
                url: `/auth/logout/`,
                //попросити романа поміняти метод на DELETE
                method: 'POST',
            })
        }),
        getUserByUsername: builder.query({
            query: (username) => ({
                url: `/user/get-user-by-username/${username}`,
                method: 'GET',
            }),
        }),
        getUserAvatar: builder.query({
            query: () => ({
                url: '/user/get-my-avatar',
                responseHandler: async (response) => {
                    if (!response.ok) {
                        throw new Error('Avatar not found');
                    }
                    const blob = await response.blob();
                    // Создаем URL только если получили валидный blob
                    if (blob.size > 0) {
                        return URL.createObjectURL(blob);
                    }
                    throw new Error('Invalid avatar data');
                },
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache'
                }
            }),
            keepUnusedDataFor: 0,
            providesTags: (result) => [{ type: 'Avatar', id: 'CURRENT' }]
        }),
        uploadAvatar: builder.mutation({
            query: (file) => ({
                url: '/user/update-my-avatar',
                method: 'PUT',
                body: (() => {
                    const formData = new FormData();
                    formData.append('file', file);
                    return formData;
                })(),
                // Важно! Не устанавливаем Content-Type, позволяем браузеру установить правильный boundary
            }),
            // Инвалидируем конкретный тег аватара
            invalidatesTags: [{ type: 'Avatar', id: 'CURRENT' }],
            
            // Улучшаем обработку успешной загрузки
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    // После успешной загрузки делаем одну попытку обновления
                    await dispatch(
                        authApiSlice.endpoints.getUserAvatar.initiate(undefined, {
                            forceRefetch: true
                        })
                    );
                } catch {}
            }
        }),
        changePassword: builder.mutation({
            query: ({ password, newPassword, confirmPassword }) => ({
                url: `/user/change-my-password`,
                method: 'POST',
                body: {
                    password,
                    new_password: newPassword,
                    confirm_password: confirmPassword
                }
            }),
        }),
    })
})

//санки для actions
const loginThunk = authApiSlice.endpoints.login.initiate;
const registerThunk = authApiSlice.endpoints.register.initiate;
const logoutThunk = authApiSlice.endpoints.logout.initiate;
const getUserByUsernameThunk = authApiSlice.endpoints.getUserByUsername.initiate;

export { loginThunk, registerThunk, logoutThunk, getUserByUsernameThunk }

export const {
    useLoginMutation,
    useLogoutMutation,
    useSignupMutation,
    useLazyGetUserByUsernameQuery,
    useGetUserAvatarQuery,
    useUploadAvatarMutation,
    useChangePasswordMutation,
} = authApiSlice;