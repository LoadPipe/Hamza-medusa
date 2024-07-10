import create from 'zustand';

// Define the state and associated actions in an interface
interface FilterState {
    categoryFilterSelect: string | null;
    categoryTypeFilterSelect: string | null;
    currencyFilterSelect: string | null;
    reviewFilterSelect: string | null;
    setCategoryFilterSelect: (item: string | null) => void;
    setCategoryTypeFilterSelect: (item: string | null) => void;
    setCurrencyFilterSelect: (item: string | null) => void;
    setReviewFilterSelect: (stars: string | null) => void;
}

// Create the Zustand store
const useSideFilter = create<FilterState>((set) => ({
    categoryFilterSelect: null,
    currencyFilterSelect: null,
    reviewFilterSelect: null,
    categoryTypeFilterSelect: null,
    setCurrencyFilterSelect: (item: string | null) =>
        set({ currencyFilterSelect: item }),
    setCategoryFilterSelect: (item: string | null) =>
        set({ categoryFilterSelect: item }),
    setCategoryTypeFilterSelect: (item: string | null) =>
        set({ categoryTypeFilterSelect: item }),
    setReviewFilterSelect: (stars: string | null) =>
        set({ reviewFilterSelect: stars }),
}));

export default useSideFilter;
