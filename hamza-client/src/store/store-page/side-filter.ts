import { create } from 'zustand';

// Define the state and associated actions in an interface
interface StoreFilterState {
    selectCategoryStoreFilter: string[] | null;
    selectTypeStoreFilter: string[] | null;
    currencySelect: string | null;
    reviewStarsSelect: string | null;

    // Update the setter types to accept a function or a direct value
    setSelectCategoryStoreFilter: (
        items: string[] | ((prev: string[] | null) => string[] | null)
    ) => void;
    setSelectTypeStoreFilter: (
        items: string[] | ((prev: string[] | null) => string[] | null)
    ) => void;
    setCurrencySelect: (item: string | null) => void;
    setReviewStarsSelect: (stars: string | null) => void;
}

// Create the Zustand store
const useSideFilter = create<StoreFilterState>((set) => ({
    selectCategoryStoreFilter: ['All'], // Allow for multi-category selection
    selectTypeStoreFilter: null,
    currencySelect: null,
    reviewStarsSelect: null,
    setCurrencySelect: (item: string | null) => set({ currencySelect: item }),

    // Allow functional updates for categorySelect
    setSelectCategoryStoreFilter: (
        items: string[] | ((prev: string[] | null) => string[] | null)
    ) =>
        set((state) => ({
            selectCategoryStoreFilter:
                typeof items === 'function'
                    ? items(state.selectCategoryStoreFilter)
                    : items,
        })),

    // Allow functional updates for categoryTypeSelect
    setSelectTypeStoreFilter: (
        items: string[] | ((prev: string[] | null) => string[] | null)
    ) =>
        set((state) => ({
            selectTypeStoreFilter:
                typeof items === 'function'
                    ? items(state.selectTypeStoreFilter)
                    : items,
        })),

    setReviewStarsSelect: (stars: string | null) =>
        set({ reviewStarsSelect: stars }),
}));

export default useSideFilter;
