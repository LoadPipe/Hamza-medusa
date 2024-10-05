import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Define the state and associated actions in an interface
interface ModalFilterState {
    homeModalFilterSelected: boolean;
    homeModalCategoryFilterSelect: string[];

    homeModalReviewFilterSelect: string | null;
    homeModalLowerPriceFilterSelect: number;
    homeModalUpperPriceFilterSelect: number;
    setHomeModalCategoryFilterSelect: (items: string[]) => void;

    setHomeModalReviewFilterSelect: (stars: string | null) => void;
    setHomeModalFilterSelected: (selected: boolean) => void;
    setHomeModalLowerPriceFilterSelect: (price: number) => void;
    setHomeModalUpperPriceFilterSelect: (price: number) => void;
}

// Create the Zustand store
const useHomeModalFilter = create<ModalFilterState>((set) => ({
    homeModalFilterSelected: false,
    homeModalCategoryFilterSelect: [],
    homeModalCategoryTypeFilterSelect: [],

    homeModalReviewFilterSelect: null,
    homeModalLowerPriceFilterSelect: 0,
    homeModalUpperPriceFilterSelect: 10000,

    setHomeModalCategoryFilterSelect: (items: string[]) =>
        set({ homeModalCategoryFilterSelect: items }),

    setHomeModalReviewFilterSelect: (stars: string | null) =>
        set({ homeModalReviewFilterSelect: stars }),

    setHomeModalFilterSelected: (selected: boolean) =>
        set({ homeModalFilterSelected: selected }),

    setHomeModalLowerPriceFilterSelect: (price: number) =>
        set({ homeModalLowerPriceFilterSelect: price }),

    setHomeModalUpperPriceFilterSelect: (price: number) =>
        set({ homeModalUpperPriceFilterSelect: price }),
}));

export default useHomeModalFilter;
