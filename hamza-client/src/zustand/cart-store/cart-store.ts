import { create } from 'zustand';

type State = {
    isUpdatingCart: boolean;
    isProcessingOrder: boolean;
};

type Action = {
    setIsUpdatingCart: (updating: boolean) => void;
    setIsProcessingOrder: (processing: boolean) => void;
};

export const useCartStore = create<State & Action>((set) => ({
    isUpdatingCart: false,
    isProcessingOrder: false,
    setIsUpdatingCart: (updating: boolean) => set({ isUpdatingCart: updating }),
    setIsProcessingOrder: (processing: boolean) =>
        set({ isProcessingOrder: processing }),
}));
