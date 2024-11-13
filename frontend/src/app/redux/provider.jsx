'use client';

//Provider component працює лише на клієнтський стороні
//для цього потрібен кастомний компонент

import { Provider } from 'react-redux';
import { store } from './store'

export function Providers({ children }) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}