import { atom } from 'jotai';
import { User, LoginResponse } from '@/shared/types/auth';
import { axiosInstance } from '@/lib/axios/axiosConfig';
import { jwtDecode } from 'jwt-decode';

const CACHE_DURATION = 5 * 60 * 1000;
const userCache = new Map<string, { data: User; timestamp: number }>();

const decodeToken = (token: string) => {
  try {
    return jwtDecode<{ sub: string; exp: number }>(token);
  } catch {
    return null;
  }
};

export const isAuthenticatedAtom = atom(false);
export const tokenAtom = atom<string | null>(null);
export const userAtom = atom<User | null>(null);
export const hydratedAtom = atom(false);
export const isRefreshingAtom = atom(false);

export const loginAtom = atom(null, async (get, set, token: string) => {
  set(tokenAtom, token);
  set(isAuthenticatedAtom, true);

  const decoded = decodeToken(token);
  if (decoded?.sub) {
    const cached = userCache.get(decoded.sub);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      set(userAtom, cached.data);
    } else {
      const user = await axiosInstance.get<User>(`/user/get-user-by-username/${decoded.sub}`);
      set(userAtom, user.data);
      userCache.set(decoded.sub, { data: user.data, timestamp: Date.now() });
    }
  }
});

export const logoutAtom = atom(null, async (get, set) => {
  try {
    await axiosInstance.post('/auth/logout', {}, { withCredentials: true });
  } finally {
    userCache.clear();
    set(isAuthenticatedAtom, false);
    set(tokenAtom, null);
    set(userAtom, null);
  }
});

export const refreshTokenAtom = atom(null, async (get, set) => {
  const token = get(tokenAtom);
  if (!token || get(isRefreshingAtom)) return;

  set(isRefreshingAtom, true);
  try {
    const response = await axiosInstance.get<LoginResponse>('/auth/refresh-token', {
      params: { remember_me: true },
    });
    set(tokenAtom, response.data.access_token);
    await set(loginAtom, response.data.access_token);
  } catch {
    await set(logoutAtom);
  } finally {
    set(isRefreshingAtom, false);
  }
});

export const checkSessionAtom = atom(null, async (get, set) => {
  const token = get(tokenAtom);
  if (!token) return false;

  try {
    const response = await axiosInstance.get<User>('/auth/me');
    set(userAtom, response.data);
    set(isAuthenticatedAtom, true);
    return true;
  } catch {
    set(isAuthenticatedAtom, false);
    set(userAtom, null);
    return false;
  }
});

export const initAuthAtom = atom(null, async (get, set) => {
  const token = get(tokenAtom);
  if (!token) {
    set(hydratedAtom, true);
    return;
  }

  const decoded = decodeToken(token);
  const exp = decoded?.exp ? decoded.exp * 1000 : 0;
  if (Date.now() >= exp) {
    try {
      const response = await axiosInstance.get<LoginResponse>('/auth/refresh-token', {
        params: { remember_me: true },
      });
      await set(loginAtom, response.data.access_token);
    } catch {
      await set(logoutAtom);
    }
  } else {
    await set(loginAtom, token);
  }
  set(hydratedAtom, true);
});