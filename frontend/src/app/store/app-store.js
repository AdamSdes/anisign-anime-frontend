import { create } from 'zustand';
import { getJWT, setJWT, removeJWT, getMe } from '@/shared/api/api-utils';
import { endpoints } from '@/shared/api/config';

export const useAppStore = create((set) => ({
  isAuth: false,
  user: null,
  token: null,
  currAnimeList:null,
  setNewCurrAnimeList:(arr)=>set((state)=>({currAnimeList:arr})),
  login: (user, token) => {
    set({ isAuth: true, user, token });
    setJWT(token);
  },
  logout: () => {
    set({ isAuth: false, user: null, token: null });
    removeJWT();
  },
  checkAuth: async () => {
    const jwt = getJWT();
    if (jwt) {
      const user = await getMe(endpoints.me, jwt);
      if (user) {
        set({ isAuth: true, user: { ...user, id: user._id }, token: jwt });
        setJWT(jwt);
      } else {
        set({ isAuth: false, user: null, token: null });
        removeJWT();
      }
    } else {
      set({ isAuth: false, user: null, token: null });
    }
  },
}));