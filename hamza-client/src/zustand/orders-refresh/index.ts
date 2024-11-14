import create from 'zustand';

interface OrdersStore {
    ordersVersion: number;
    incrementOrdersVersion: () => void;
}

export const useOrdersStore = create<OrdersStore>((set) => ({
    ordersVersion: 0,
    incrementOrdersVersion: () =>
        set((state) => ({ ordersVersion: state.ordersVersion + 1 })),
}));
