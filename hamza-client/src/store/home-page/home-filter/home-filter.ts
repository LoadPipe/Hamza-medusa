import { create } from 'zustand';

// Define the state and associated actions in an interface

type RangeType = [number, number];

interface ModalFilterState {
    homeModalFilterSelected: boolean;
    homeModalCategoryFilterSelect: string[];
    priceHi: number;
    priceLo: number;
    range: RangeType;
    homeModalReviewFilterSelect: string | null;
    homeModalLowerPriceFilterSelect: number;
    homeModalUpperPriceFilterSelect: number;
    setHomeModalCategoryFilterSelect: (items: string[]) => void;
    setHomeModalReviewFilterSelect: (stars: string | null) => void;
    setHomeModalFilterSelected: (selected: boolean) => void;
    setHomeModalLowerPriceFilterSelect: (price: number) => void;
    setHomeModalUpperPriceFilterSelect: (price: number) => void;
    setPriceHi: (price: number) => void;
    setPriceLo: (price: number) => void;
    setRange: (range: RangeType) => void; // Action to set the range
}

// Create the Zustand store
const useHomeModalFilter = create<ModalFilterState>((set) => ({
    homeModalFilterSelected: false,
    homeModalCategoryFilterSelect: [],
    homeModalCategoryTypeFilterSelect: [],
    priceHi: 0,
    priceLo: 0,
    range: [0, 350],
    homeModalReviewFilterSelect: null,
    homeModalLowerPriceFilterSelect: 0,
    homeModalUpperPriceFilterSelect: 10000,
    setPriceHi: (price: number) => set({ priceHi: price }),
    setPriceLo: (price: number) => set({ priceLo: price }),
    setRange: (range: RangeType) => set({ range }),
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
