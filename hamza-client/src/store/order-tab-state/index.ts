import create from 'zustand';

interface OrderTabState {
    orderActiveTab: string;
    setOrderActiveTab: (tab: string) => void;
}

export const useOrderTabStore = create<OrderTabState>((set) => {
    console.log('Initializing store with ALL');
    return {
        orderActiveTab: 'ALL', // Default tab
        setOrderActiveTab: (tab: any) => set({ orderActiveTab: tab }),
    };
});
