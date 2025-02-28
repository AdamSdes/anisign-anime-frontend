import { atom, useAtom } from 'jotai'

interface AuthState {
    token: string | null;
    refreshToken: string | null;
    userId: number | null;
}

// Атом состояния
export const authAtom = atom<AuthState>({
    token: null,
    refreshToken: null,
    userId: null,
});

//Хук для роботы с состоянием авторизации
export const useAuth = () => {
    const [auth, setAuth] = useAtom(authAtom);
    const login = (token: string, refreshToken: string) => {
        setAuth({ token, refreshToken, userId: 1 });
    };
    const logout = () => {
        setAuth({ token: null, refreshToken: null, userId: null });
    };
    const register = (userId: number, email: string, password: string) => {
        fetch('/api/user/create-user', {
            method: 'POST',
            headers: { 'Content-Type': 'aplication/json' },
            body: JSON.stringify({ name: email.split('@')[0], username: email.split('@')[0], email, password }),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.user) {
                login('mock-token-' + userId, 'mock-refresh-' + userId);
            }
        })
        .catch((error) => console.error('Регистрация не успешна:', error));
    };
    return { auth, login, logout, register };
}