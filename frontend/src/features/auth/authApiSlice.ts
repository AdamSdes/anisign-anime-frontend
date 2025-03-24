import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LoginData, LoginResponse, User } from '@/shared/types/auth';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
      baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
      credentials: 'include',
    }),
    endpoints: (builder) => ({
      login: builder.mutation<LoginResponse, LoginData>({
        query: (data) => ({
          url: '/auth/token',
          method: 'POST',
          body: new URLSearchParams({
            username: data.username,
            password: data.password,
            grant_type: 'password',
            scope: '',
            client_id: '',
            client_secret: '',
          }),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }),
      }),
      getCurrentUser: builder.query<User, void>({
        query: () => '/auth/get-cookies',
      }),
    }),
  });
  
  export const { useLoginMutation, useGetCurrentUserQuery } = authApi;