import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    user: string | null;
    accessToken: string | null;
}

const initialState: AuthState = {
    user: null,
    accessToken: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ access_token: string; token_type: string }>) => {
            const { access_token } = action.payload;
            state.accessToken = access_token;
            // refresh_token хранится в HttpOnly cookie, поэтому нам не нужно его сохранять
        },
        setUser: (state, action: PayloadAction<string>) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
        },
    },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;