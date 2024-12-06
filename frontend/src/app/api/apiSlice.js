import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setToken, logOut } from '../../features/auth/authSlice';


const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.accessToken;
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    }
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 401) {
        // відправка рефреш токену для отримання нового аксес токену
        const refreshResult = await baseQuery('/auth/refresh-token', api, extraOptions);
        if (refreshResult?.data) {
            // збереження нового токену
            api.dispatch(setToken({ ...refreshResult.data }));
            // повтор запиту з новим токеном
            result = await baseQuery(args, api, extraOptions);
        } else {
            //логаут, якщо не вийшло
            console.log('Token refresh request failed, logging out');
            await baseQuery('/auth/logout', api, extraOptions);
            api.dispatch(logOut());
        }
    }

    return result;
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({})
})