'use client';

import jwtDecode from "@/functions/jwtDecode";
import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
    name: 'auth',
    initialState: { user: null, accessToken: null, refreshToken: null },
    reducers: {
        setToken(state, action){
            const { access_token, refresh_token} = action.payload;
            const { sub } = jwtDecode(access_token);

            state.user         = sub;
            state.accessToken  = access_token;
            state.refreshToken = refresh_token;
        },
        logOut(state, action){
            state.user  = null;
            state.token = null;
        },
    }
});

export const { setToken, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;