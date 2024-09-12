import { create } from 'zustand';

// Define the state and associated actions in an interface
interface ModalFilterState {
    homeModalFilterSelected: boolean;
    homeModalCategoryFilterSelect: string[] | null;
    homeModalCategoryTypeFilterSelect: string[] | null;
    homeModalCurrencyFilterSelect: string | null;
    homeModalReviewFilterSelect: string | null;
    setHomeModalCategoryFilterSelect: (item: string[] | null) => void;
    setHomeModalCategoryTypeFilterSelect: (item: string[] | null) => void;
    setHomeModalCurrencyFilterSelect: (item: string | null) => void;
    setHomeModalReviewFilterSelect: (stars: string | null) => void;
    setHomeModalFilterSelected: (selected: boolean) => void;
}

// Create the Zustand store
const useHomeModalFilter = create<ModalFilterState>((set) => ({
    homeModalFilterSelected: false,
    homeModalCategoryFilterSelect: ['All'],
    homeModalCategoryTypeFilterSelect: null,
    homeModalCurrencyFilterSelect: null,
    homeModalReviewFilterSelect: null,
    setHomeModalCategoryFilterSelect: (items: string[] | null) =>
        set({ homeModalCategoryFilterSelect: items }),
    setHomeModalCategoryTypeFilterSelect: (items: string[] | null) =>
        set({ homeModalCategoryTypeFilterSelect: items }),
    setHomeModalCurrencyFilterSelect: (item: string | null) =>
        set({ homeModalCurrencyFilterSelect: item }),
    setHomeModalReviewFilterSelect: (stars: string | null) =>
        set({ homeModalReviewFilterSelect: stars }),
    setHomeModalFilterSelected: (selected: boolean) =>
        set({ homeModalFilterSelected: selected }),
}));

export default useHomeModalFilter;
