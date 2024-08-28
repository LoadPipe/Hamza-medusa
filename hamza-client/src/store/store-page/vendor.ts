import { create } from 'zustand';

// Define the state and associated actions in an interface
interface StoreState {
    storeId: string | null;
    setStoreId: (item: string | null) => void;
}

// Create the Zustand store
const useVendor = create<StoreState>((set) => ({
    storeId: null,
    setStoreId: (item: string | null) => set({ storeId: item }),
}));

export default useVendor;
