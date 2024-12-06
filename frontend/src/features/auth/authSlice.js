'use client';

import jwtDecode from "@/functions/jwtDecode";
import { avatar } from "@nextui-org/theme";
import { createSlice } from "@reduxjs/toolkit";

// const initialState = { 
//     accessToken: null,
//     user: {
//         username: null,
//         avatar: null,
//         nickname: null,
//         id: null,
//     },
// };

const authSlice = createSlice({
    name: 'auth',
    initialState: { 
        accessToken: null,
        user: {
            username: null,
            avatar: null,
            nickname: null,
            id: null,
        },
    },
    _reducers: {
        setToken(state, action) {
            const { access_token } = action.payload;
            // const { sub } = jwtDecode(access_token);

            // state.user = sub;
            state.accessToken = access_token;
        },
        logOut(state, action) {
            state.user = {
                username: null,
                avatar: null,
                nickname: null,
                id: null,
            },
            state.accessToken = null;
            // return initialState;
        },
        setAvatar(state, action) {
            const { avatar } = action.payload;
            state.avatar = avatar;
        },
        setUserInfo(state, action) {
            const { username, user_avatar, nickname, id } = action.payload;

            state.user.username = username;
            state.user.avatar = user_avatar;
            state.user.nickname = nickname;
            state.user.id = id;
        }
    },
    get reducers() {
        return this._reducers;
    },
    set reducers(value) {
        this._reducers = value;
    },
});

export const { setToken, setUserInfo, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;