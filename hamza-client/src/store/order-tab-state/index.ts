import create from 'zustand';

interface OrderTabState {
    orderActiveTab: string;
    setOrderActiveTab: (tab: string) => void;
}

export const useOrderTabStore = create<OrderTabState>((set) => {
    console.log('Initializing store with ALL');
    return {
        orderActiveTab: 'All Orders', // Default tab, matching TABS.ALL value
        setOrderActiveTab: (tab: any) => set({ orderActiveTab: tab }),
    };
});
