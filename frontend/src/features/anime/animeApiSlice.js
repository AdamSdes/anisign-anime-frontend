import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const animeApi = createApi({
    reducerPath: 'animeApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: 'http://localhost:8000',
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        getAnimeList: builder.query({
            query: ({ page = 1, limit = 5 } = {}) => ({
                url: `/anime/get-anime-list`,
                params: { page, limit }
            }),
        }),
    }),
});

export const {
    useGetAnimeListQuery,
} = animeApi;
