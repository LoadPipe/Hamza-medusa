import { create } from 'zustand';

// Define the state and associated actions in an interface
interface ModalFilterState {
    homeModalFilterSelected: boolean;
    homeModalCategoryFilterSelect: string[] | null;
    homeModalCategoryTypeFilterSelect: string[] | null;
    homeModalCurrencyFilterSelect: string | null;
    homeModalReviewFilterSelect: string | null;
    homeModalLowerPriceFilterSelect: number | null;
    homeModalUpperPriceFilterSelect: number | null;
    setHomeModalCategoryFilterSelect: (item: string[] | null) => void;
    setHomeModalCategoryTypeFilterSelect: (item: string[] | null) => void;
    setHomeModalCurrencyFilterSelect: (item: string | null) => void;
    setHomeModalReviewFilterSelect: (stars: string | null) => void;
    setHomeModalFilterSelected: (selected: boolean) => void;
    setHomeModalLowerPriceFilterSelect: (price: number | null) => void;
    setHomeModalUpperPriceFilterSelect: (price: number | null) => void;
}

// Create the Zustand store
const useHomeModalFilter = create<ModalFilterState>((set) => ({
    homeModalFilterSelected: false,
    homeModalCategoryFilterSelect: ['All'],
    homeModalCategoryTypeFilterSelect: null,
    homeModalCurrencyFilterSelect: null,
    homeModalReviewFilterSelect: null,
    homeModalLowerPriceFilterSelect: 0,
    homeModalUpperPriceFilterSelect: 0,
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
    setHomeModalLowerPriceFilterSelect: (price: number | null) =>
        set({ homeModalLowerPriceFilterSelect: price }),
    setHomeModalUpperPriceFilterSelect: (price: number | null) =>
        set({ homeModalUpperPriceFilterSelect: price }),
}));

export default useHomeModalFilter;
