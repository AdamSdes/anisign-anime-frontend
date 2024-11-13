'use client';

import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import authReducer from "../../features/auth/authSlice"
import localStorageReducer from "@/functions/localStorage";

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: localStorageReducer(authReducer)
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    //devTools:false для проду
    devTools: true
})

store.subscribe(() => console.log(store.getState()))