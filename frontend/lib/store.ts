import { create } from "zustand";

interface GameStore {
  userId: string | null;
  setUserId: (id: string) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  userId: null,
  setUserId: (id) => set({ userId: id }),
  soundEnabled: true,
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
}));
