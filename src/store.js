import { configureStore } from '@reduxjs/toolkit';

import testSlice from './slices/testSlice';

export const store = configureStore({
  reducer: {
    test: testSlice,
  },
});