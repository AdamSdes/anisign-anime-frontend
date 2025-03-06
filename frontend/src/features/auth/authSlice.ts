import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/shared/types/auth';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        /**
         * Установка текущего пользователя
         * @param state Текущее состояние
         * @param action Данные пользователя или null
         */
        setUser(state: AuthState, action: PayloadAction<User | null>) {
            state.user = action.payload;
            state.isAuthenticated = action.payload !== null;
        },
    },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;