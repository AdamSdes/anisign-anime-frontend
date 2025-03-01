import { atom, useAtom } from 'jotai';
import { apiRequest } from '../api';

interface UserState {
  user: { id: string; username: string; email: string } | null;
  loading: boolean;
  error: string | null;
}

const userAtom = atom<UserState>({
  user: null,
  loading: false,
  error: null,
});

export function useUserStore() {
  const [state, setState] = useAtom(userAtom);

  const fetchUser = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await apiRequest({
        url: '/user/me',
        method: 'get',
        useAuth: true,
      });
      setState({
        user: response.data,
        loading: false,
        error: null,
      });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
    }
  };

  const updateUser = async (data: Partial<{ username: string; email: string }>) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await apiRequest({
        url: '/user/me',
        method: 'patch',
        data,
        useAuth: true,
      });
      setState((prev) => ({
        ...prev,
        user: response.data,
        loading: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
    }
  };

  return { ...state, fetchUser, updateUser };
}