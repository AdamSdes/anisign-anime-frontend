'use client';

import jwtDecode from "@/functions/jwtDecode";
import { avatar } from "@nextui-org/theme";
import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
    name: 'auth',
    initialState: { 
        user: null,
        accessToken: null,
        avatar: null,
    },
    _reducers: {
        setToken(state, action) {
            const { access_token } = action.payload;
            const { sub } = jwtDecode(access_token);

            state.user = sub;
            state.accessToken = access_token;
        },
        logOut(state, action) {
            state.user = null;
            state.accessToken = null;

            console.log('USER LOGGED OUT');
        },
        setAvatar(state, action) {
            const { avatar } = action.payload;
            state.avatar = avatar;
        },
    },
    get reducers() {
        return this._reducers;
    },
    set reducers(value) {
        this._reducers = value;
    },
});

export const { setToken, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;