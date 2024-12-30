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
                method: 'GET',
                responseHandler: async (response) => {
                    const blob = await response.blob();
                    return URL.createObjectURL(blob);
                },
            }),
            providesTags: ['Avatar'],
            keepUnusedDataFor: 0,
        }),
        uploadAvatar: builder.mutation({
            query: (file) => {
                const formData = new FormData();
                formData.append('file', file);
                return {
                    url: '/user/update-my-avatar',
                    method: 'PUT',
                    body: formData,
                };
            },
            invalidatesTags: ['Avatar'],
        }),
    })
})

//санки для actions
const loginThunk = authApiSlice.endpoints.login.initiate;
const registerThunk = authApiSlice.endpoints.register.initiate;
const logoutThunk = authApiSlice.endpoints.logout.initiate;
const getUserByUsernameThunk = authApiSlice.endpoints.getUserByUsername.initiate;

export { loginThunk, registerThunk, logoutThunk, getUserByUsernameThunk }

export const { useLazyGetUserByUsernameQuery, useUploadAvatarMutation, useGetUserAvatarQuery } = authApiSlice;