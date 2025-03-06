import { atom } from "jotai";

interface UserState {
    avatar?: string;
}

/**
 * Атом для хранения состояния пользователя
 */
export const userAtom = atom<UserState>({ avatar: undefined });

/**
 * Атом для установки аватара пользователя
 */
export const setAvatarAtom = atom(null, (get, set, avatar: string) => {
  set(userAtom, { ...get(userAtom), avatar });
});