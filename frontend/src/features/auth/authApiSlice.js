'use client';

import { apiSlice } from "@/app/api/apiSlice";

//налаштування запитів
export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => {
                const formData = new URLSearchParams();
                formData.append('grant_type', '');
                formData.append('scope', '');
                formData.append('client_id', '');
                formData.append('client_secret', '');
                formData.append('username', credentials.username);
                formData.append('password', credentials.password);

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
        getUserByUsername: builder.query({
            query: (username) => ({
                url: `/user/get-user-by-username/${username}`,
                method: 'GET',
            })
        }),
    })
})

//хуки для виклику запитів
export const {
    useLoginMutation, 
    useGetUserByUsernameQuery
} = authApiSlice

//санки для actions
const loginThunk = authApiSlice.endpoints.login.initiate;
const getUserByUsernameThunk = authApiSlice.endpoints.getUserByUsername.initiate;
//registerThunk


export {loginThunk, getUserByUsernameThunk}


