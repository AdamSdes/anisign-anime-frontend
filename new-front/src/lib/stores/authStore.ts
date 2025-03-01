import { atom, useAtom } from 'jotai';
import { login, register, socialLogin } from '../api';

interface User {
  id: string;
  username: string;
  email: string | undefined;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

const authAtom = atom<AuthState>({
  isAuthenticated: false,
  user: null,
  token: null,
});

export function useAuthState() {
  const [auth, setAuth] = useAtom(authAtom);

  const setAuthLogin = (token: string, user: User) => {
    const safeUser: User = {
      ...user,
      email: user.email || '',
    };
    setAuth({
      isAuthenticated: true,
      user: safeUser,
      token,
    });
    localStorage.setItem('token', token);
  };

  const setAuthRegister = (token: string, user: User) => {
    const safeUser: User = {
      ...user,
      email: user.email || '',
    };
    setAuth({
      isAuthenticated: true,
      user: safeUser,
      token,
    });
    localStorage.setItem('token', token);
  };

  const handleSocialLogin = async (provider: 'google' | 'discord', code?: string) => {
    try {
      if (!code) {
        throw new Error('Authorization code is required for social login');
      }
      const response = await socialLogin(provider, code); 
      const { token, user } = response.data;
      const safeUser: User = {
        ...user,
        email: user.email || '',
      };
      setAuth({
        isAuthenticated: true,
        user: safeUser,
        token,
      });
      localStorage.setItem('token', token);
    } catch (error) {
      throw new Error('Social login failed');
    }
  };

  const logout = () => {
    setAuth({
      isAuthenticated: false,
      user: null,
      token: null,
    });
    localStorage.removeItem('token');
  };

  return { ...auth, setAuthLogin, setAuthRegister, socialLogin: handleSocialLogin, logout };
}