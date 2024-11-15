import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setToken, logOut } from '../../features/auth/authSlice'

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:8000',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.accessToken
        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if (result?.error?.status === 401) {
        console.log('sending refresh token')
        // відправка рефреш токену для отримання нового аксес токену
        const refreshResult = await baseQuery('/user/refresh-token', api, extraOptions)
        console.log(refreshResult)
        if (refreshResult?.data) {
            const user = api.getState().auth.user
            // збереження нового токену
            api.dispatch(setToken({ ...refreshResult.data, user }))
            // повтор запиту з новим токеном
            result = await baseQuery(args, api, extraOptions)
        } else {
            //логаут, якщо не вийшло
            api.dispatch(logOut())
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({})
})