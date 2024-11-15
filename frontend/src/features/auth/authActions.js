'use client'

import { setToken } from "./authSlice";
import { loginThunk, getUserByUsernameThunk } from "./authApiSlice";

const actionFullLogin = ({ username, password }) =>
    async (dispatch) => {
        try {
            const userData = await dispatch(loginThunk({ username, password }));

            if (userData?.data?.access_token) {
                dispatch(setToken({ ...userData.data }));

                // const userInfo = await dispatch(getUserByUsernameThunk(username));
                // console.log('userInfo', userInfo)

            } else {
                if (userData?.error) {
                    console.error('Помилка при авторизації:', userData.error);
                    throw new Error(userData.error);
                }
            }
        } catch (error) {
            console.error('Помилка при виконанні actionFullLogin:', error);
            throw error;
        }
    }

export { actionFullLogin }
