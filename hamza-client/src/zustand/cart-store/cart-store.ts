import { create } from 'zustand';

type State = {
    isUpdatingCart: boolean;
    isProcessingOrder: boolean;
    cartUpdateEvents: Array<{ timestamp: number; value: boolean }>;
};

type Action = {
    setIsUpdatingCart: (updating: boolean) => void;
    setIsProcessingOrder: (processing: boolean) => void;
    getCartUpdateEvents: () => Array<{ timestamp: number; value: boolean }>;
};

export const useCartStore = create<State & Action>((set, get) => ({
    isUpdatingCart: false,
    isProcessingOrder: false,
    cartUpdateEvents: [],
    setIsUpdatingCart: (updating: boolean) =>
        set((state) => ({
            isUpdatingCart: updating,
            cartUpdateEvents: [
                ...state.cartUpdateEvents,
                { timestamp: Date.now(), value: updating },
            ],
        })),
    setIsProcessingOrder: (processing: boolean) =>
        set({ isProcessingOrder: processing }),
    getCartUpdateEvents: () => get().cartUpdateEvents,
}));
