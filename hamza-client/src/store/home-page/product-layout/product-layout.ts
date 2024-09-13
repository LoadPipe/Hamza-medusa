import { create } from 'zustand';

// Define the state and associated actions in an interface
interface StoreState {
    categorySelect: string[] | null;
    categoryTypeSelect: string[] | null;
    currencySelect: string | null;
    reviewStarsSelect: string | null;

    // Update the setter types to accept a function or a direct value
    setCategorySelect: (
        items: string[] | ((prev: string[] | null) => string[] | null)
    ) => void;
    setCategoryTypeSelect: (
        items: string[] | ((prev: string[] | null) => string[] | null)
    ) => void;
    setCurrencySelect: (item: string | null) => void;
    setReviewStarsSelect: (stars: string | null) => void;
}

// Create the Zustand store
const useHomeProductsPage = create<StoreState>((set) => ({
    categorySelect: ['all'], // Allow for multi-category selection
    categoryTypeSelect: null,
    currencySelect: null,
    reviewStarsSelect: null,
    setCurrencySelect: (item: string | null) => set({ currencySelect: item }),

    // Allow functional updates for categorySelect
    setCategorySelect: (
        items: string[] | ((prev: string[] | null) => string[] | null)
    ) =>
        set((state) => ({
            categorySelect:
                typeof items === 'function'
                    ? items(state.categorySelect)
                    : items,
        })),

    // Allow functional updates for categoryTypeSelect
    setCategoryTypeSelect: (
        items: string[] | ((prev: string[] | null) => string[] | null)
    ) =>
        set((state) => ({
            categoryTypeSelect:
                typeof items === 'function'
                    ? items(state.categoryTypeSelect)
                    : items,
        })),

    setReviewStarsSelect: (stars: string | null) =>
        set({ reviewStarsSelect: stars }),
}));

export default useHomeProductsPage;
