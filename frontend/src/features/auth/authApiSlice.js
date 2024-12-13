'use client';

import { apiSlice } from "@/app/api/apiSlice";

//налаштування запитів
export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => {
                const formData = new URLSearchParams();
                formData.append('username', credentials.username);
                formData.append('password', credentials.password);
                formData.append('grant_type', '');
                formData.append('scope', '');
                formData.append('client_id', '');
                formData.append('client_secret', '');
                return {
                    url: '/auth/token',
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
        
                return {
                    url: '/user/create-user',
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
            })
        }),
        updateAvatar: builder.mutation({
            query: (file) => {
                const formData = new FormData();
                formData.append("file", file);

                return {
                    url: "/user/update-my-avatar",
                    method: "PUT",
                    body: formData,
                };
            },
        }),
        updateNickname: builder.mutation({
            query: (nickname) => ({
                url: `/user/update-my-nickname?nickname=${encodeURIComponent(nickname)}`,
                method: "PUT",
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

export const { useLazyGetUserByUsernameQuery, useUpdateAvatarMutation, useUpdateNicknameMutation } = authApiSlice;