'use client';

import { apiSlice } from "@/app/api/apiSlice";

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
                    url: '/user/token',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formData.toString(),
                };
            }
        }),
        getUserInfo: builder.query({
            query: (userId) => ({
                url: `/user/get-user/${userId}`,
                method: 'GET',
            })
        }),
    })
})

export const {
    useLoginMutation, 
    useGetUserInfoQuery
} = authApiSlice