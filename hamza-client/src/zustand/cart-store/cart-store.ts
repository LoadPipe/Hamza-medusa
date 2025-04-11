import { create } from 'zustand';

type State = {
    isUpdatingCart: boolean;
};

type Action = {
    setIsUpdatingCart: (updating: boolean) => void;
};

export const useCartStore = create<State & Action>((set) => ({
    isUpdatingCart: false,
    setIsUpdatingCart: (updating: boolean) => set({ isUpdatingCart: updating }),
}));
