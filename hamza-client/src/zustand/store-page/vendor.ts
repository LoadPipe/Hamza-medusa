import { create } from 'zustand';

// Define the state and associated actions in an interface
interface StoreState {
    categorySelect: string[] | null;
    storeId: string | null;
    setStoreId: (item: string | null) => void;
    setCategorySelect: (
        items: string[] | ((prev: string[] | null) => string[] | null)
    ) => void;
}

// Create the Zustand store
const useVendor = create<StoreState>((set) => ({
    storeId: null,
    categorySelect: ['All'],
    setStoreId: (item: string | null) => set({ storeId: item }),
    setCategorySelect: (
        items: string[] | ((prev: string[] | null) => string[] | null)
    ) =>
        set((state) => ({
            categorySelect:
                typeof items === 'function'
                    ? items(state.categorySelect)
                    : items,
        })),
}));

export default useVendor;
