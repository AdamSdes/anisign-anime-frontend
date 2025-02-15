import { create } from 'zustand';

interface UserState {
  avatar?: string;
  setAvatar: (avatar: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  avatar: undefined,
  setAvatar: (avatar) => set({ avatar }),
})); 