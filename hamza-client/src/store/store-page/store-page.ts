import { create } from 'zustand';

// Define the state and associated actions in an interface
interface StoreState {
    categorySelect: string[] | null;
    currencySelect: string | null;
    reviewStarsSelect: string | null;

    // Update the setter types to accept a function or a direct value
    setCategorySelect: (
        items: string[] | ((prev: string[] | null) => string[] | null)
    ) => void;

    setCurrencySelect: (item: string | null) => void;
    setReviewStarsSelect: (stars: string | null) => void;
}

// Create the Zustand store
const useStorePage = create<StoreState>((set) => ({
    categorySelect: ['All'], // Allow for multi-category selection

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

    setReviewStarsSelect: (stars: string | null) =>
        set({ reviewStarsSelect: stars }),
}));

export default useStorePage;
