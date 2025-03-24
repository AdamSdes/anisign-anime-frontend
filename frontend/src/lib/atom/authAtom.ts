import { atom } from 'jotai';
import { User, LoginResponse } from '@/shared/types/auth';
import { axiosInstance } from '@/lib/axios/axiosConfig';
import { jwtDecode } from 'jwt-decode';

const CACHE_DURATION = 5 * 60 * 1000;
const INACTIVITY_LIMIT = 1 * 60 * 1000;
const CHECK_INTERVAL = 30 * 1000;
const userCache = new Map<string, { data: User; timestamp: number }>();
let lastActivity = Date.now();

const decodeToken = (token: string) => {
  try {
    return jwtDecode<{ sub: string; exp: number }>(token);
  } catch {
    return null;
  }
};

// Глобальные атомы состояния
export const isAuthenticatedAtom = atom<boolean>(false);
export const tokenAtom = atom<string | null>(null);
export const userAtom = atom<User | null>(null);
export const hydratedAtom = atom<boolean>(false);
export const isRefreshingAtom = atom<boolean>(false);

// Проверка неактивности и разлогин
type Getter = (arg: any) => any;
type Setter = (arg: any, value?: any) => void;

const checkInactivity = (get: Getter, set: Setter) => {
  if (Date.now() - lastActivity > INACTIVITY_LIMIT) {
    console.warn("Пользователь неактивен, разлогиниваем...");
    set(logoutAtom);
  }
};

if (typeof document !== 'undefined') {
  document.addEventListener('mousemove', () => (lastActivity = Date.now()));
  document.addEventListener('keydown', () => (lastActivity = Date.now()));

  setInterval(() => {
    const fakeGet = (atomValue: any) => atomValue;
    const fakeSet = (atomValue: any) => atomValue;
    checkInactivity(fakeGet, fakeSet);
  }, CHECK_INTERVAL);
}

// Атом для логина
export const loginAtom = atom(null, async (get: Getter, set: Setter, token: string) => {
  console.log("Вход в систему с токеном:", token);
  set(tokenAtom, token);
  set(isAuthenticatedAtom, true);
  lastActivity = Date.now();

  const decoded = decodeToken(token);
  if (decoded?.sub) {
    const cached = userCache.get(decoded.sub);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log("Используем кэшированного пользователя:", cached.data);
      set(userAtom, cached.data);
    } else {
      console.log("Запрашиваем данные пользователя с сервера...");
      try {
        const user = await axiosInstance.get<User>(`/user/get-user-by-username/${decoded.sub}`);
        set(userAtom, user.data);
        userCache.set(decoded.sub, { data: user.data, timestamp: Date.now() });
      } catch (error) {
        console.error("Ошибка загрузки пользователя:", error);
      }
    }
  }
});

// Атом для логаута
export const logoutAtom = atom(null, async (get: Getter, set: Setter) => {
  console.warn("Выход из системы...");
  try {
    await axiosInstance.post('/auth/logout', {}, { withCredentials: true });
  } catch (error) {
    console.error("Ошибка при логауте:", error);
  } finally {
    userCache.clear();
    set(isAuthenticatedAtom, false);
    set(tokenAtom, null);
    set(userAtom, null);
  }
});

// Атом для обновления токена
export const refreshTokenAtom = atom(null, async (get: Getter, set: Setter) => {
  const token = get(tokenAtom);
  if (!token || get(isRefreshingAtom)) {
    console.warn("Обновление токена не требуется.");
    return;
  }

  set(isRefreshingAtom, true);
  console.log("Обновляем токен...");
  try {
    const response = await axiosInstance.get<LoginResponse>('/auth/refresh-token', {
      params: { remember_me: true },
      withCredentials: true,
    });
    console.log("Новый токен получен:", response.data.access_token);
    set(tokenAtom, response.data.access_token);
    await set(loginAtom, response.data.access_token);
  } catch (error) {
    console.error("Ошибка обновления токена:", error);
    await set(logoutAtom);
  } finally {
    set(isRefreshingAtom, false);
  }
});

// Атом проверки сессии
export const checkSessionAtom = atom(null, async (get: Getter, set: Setter) => {
  checkInactivity(get, set);
  const token = get(tokenAtom);
  if (!token) {
    console.warn("Сессия не найдена.");
    return false;
  }

  try {
    console.log("Проверяем сессию...");
    const response = await axiosInstance.get<User>('/auth/get-cookies', { withCredentials: true });
    console.log("Сессия активна, пользователь:", response.data);
    set(userAtom, response.data);
    set(isAuthenticatedAtom, true);
    return true;
  } catch (error) {
    console.error("Сессия не найдена:", error);
    set(isAuthenticatedAtom, false);
    set(userAtom, null);
    return false;
  }
});

// Инициализация авторизации
export const initAuthAtom = atom(null, async (get, set) => {
  checkInactivity(get, set);
  const token = get(tokenAtom);

  if (!token) {
    console.warn("Нет токена, авторизация не пройдена.");
    set(hydratedAtom, true);
    return;
  }

  console.log("Инициализация авторизации, проверяем токен...");
  const decoded = decodeToken(token);
  const exp = decoded?.exp ? decoded.exp * 1000 : 0;
  if (Date.now() >= exp) {
    console.warn("Токен истёк, пытаемся обновить...");
    try {
      const response = await axiosInstance.get<LoginResponse>('/auth/refresh-token', {
        params: { remember_me: true },
        withCredentials: true,
      });
      console.log("Обновленный токен:", response.data.access_token);
      await set(loginAtom, response.data.access_token);
    } catch (error) {
      console.error("Ошибка обновления токена, разлогиниваем...");
      await set(logoutAtom);
    }
  } else {
    console.log("Токен действителен, авторизация успешна.");
    await set(loginAtom, token);
  }

  set(hydratedAtom, true);
});
