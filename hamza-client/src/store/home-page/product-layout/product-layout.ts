import { create } from 'zustand';

// Define the state and associated actions in an interface
interface StoreState {
    categorySelect: string[] | null;
    categoryTypeSelect: string[] | null;
    currencySelect: string | null;
    reviewStarsSelect: string | null;
    setCategorySelect: (item: string[] | null) => void;
    setCategoryTypeSelect: (item: string[] | null) => void;
    setCurrencySelect: (item: string | null) => void;
    setReviewStarsSelect: (stars: string | null) => void;
}

// Create the Zustand store
const useHomeProductsPage = create<StoreState>((set) => ({
    categorySelect: ['All'], // Allow for multi-category selection
    categoryTypeSelect: null,
    currencySelect: null,
    reviewStarsSelect: null,
    setCurrencySelect: (item: string | null) => set({ currencySelect: item }),
    setCategorySelect: (items: string[] | null) =>
        set({ categorySelect: items }),
    setCategoryTypeSelect: (items: string[] | null) =>
        set({ categoryTypeSelect: items }),
    setReviewStarsSelect: (stars: string | null) =>
        set({ reviewStarsSelect: stars }),
}));

export default useHomeProductsPage;
