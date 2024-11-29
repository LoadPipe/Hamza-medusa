import create from 'zustand';

type State = {
    isUpdating: boolean;
};

type Action = {
    setIsUpdating: (updating: boolean) => void;
};

export const useCartStore = create<State & Action>((set) => ({
    isUpdating: false,
    setIsUpdating: (updating: boolean) => set({ isUpdating: updating }),
}));
