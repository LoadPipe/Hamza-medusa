import create from 'zustand';

interface OrderTabState {
    orderActiveTab: string;
    setOrderActiveTab: (tab: string) => void;
}

export const useOrderTabStore = create<OrderTabState>((set) => ({
    orderActiveTab: 'ALL', // Default tab
    setOrderActiveTab: (tab) => set({ orderActiveTab: tab }),
}));
