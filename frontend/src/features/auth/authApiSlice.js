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

                // попросити романа прибрати ці поля за можливості
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
        // попросити романа поміняти цю залупу на форму у вигляді рядка
        register: builder.mutation({
            query: credentials => {
                const body = {
                    username: credentials.username,
                    password: credentials.password,
                    user_description: 'string',
                    user_avatar: 'string',
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
                method: 'GET',
            })
        }),
    })
})

//санки для actions
const loginThunk = authApiSlice.endpoints.login.initiate;
const registerThunk = authApiSlice.endpoints.register.initiate;
const logoutThunk = authApiSlice.endpoints.logout.initiate;

export { loginThunk, registerThunk, logoutThunk }




// очікуваний формат для реєстрації
    // register: builder.mutation({
    //     query: credentials => {
    //         const formData = new URLSearchParams();
    //         formData.append('username', credentials.username);
    //         formData.append('password', credentials.password);
    //         // formData.append('repeatPassword', credentials.confirmPassword);

    //         // попросити романа прибрати ці поля за можливості
    //         formData.append('user_description', 'string');
    //         formData.append('user_avatar', 'string');

    //         return {
    //             url: '/user/create-user',
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/x-www-form-urlencoded',
    //             },
    //             body: formData.toString(),
    //         };
    //     }
    // }),