import { create } from 'zustand';

interface CategoryItem {
    categoryName: string;
    urlLink: string;
}

// Define the state and associated actions in an interface
interface StoreFilterState {
    priceHi: number;
    priceLo: number;
    selectCategoryStoreFilter: string[];
    categoryItemSideFilter: CategoryItem[];
    reviewStarsSelect: string | null;
    setPriceHi: (price: number) => void;
    setPriceLo: (price: number) => void;
    setSelectCategoryStoreFilter: (
        items: string[] | ((prev: string[]) => string[])
    ) => void;
    setCategoryItemSideFilter: (
        items: CategoryItem[] | ((prev: CategoryItem[]) => CategoryItem[])
    ) => void;
    setReviewStarsSelect: (stars: string | null) => void;
}

// Create the Zustand store
const useSideFilter = create<StoreFilterState>((set) => ({
    priceHi: 0,
    priceLo: 0,
    selectCategoryStoreFilter: [], // Initialized to a default array
    categoryItemSideFilter: [], // Initialized to an empty array
    reviewStarsSelect: null, // Remains nullable since it's a single value
    setPriceHi: (price: number) => set({ priceHi: price }),
    setPriceLo: (price: number) => set({ priceLo: price }),
    setSelectCategoryStoreFilter: (
        items: string[] | ((prev: string[]) => string[])
    ) =>
        set((state) => ({
            selectCategoryStoreFilter:
                typeof items === 'function'
                    ? items(state.selectCategoryStoreFilter)
                    : items,
        })),
    setCategoryItemSideFilter: (
        items: CategoryItem[] | ((prev: CategoryItem[]) => CategoryItem[])
    ) =>
        set((state) => ({
            categoryItemSideFilter:
                typeof items === 'function'
                    ? items(state.categoryItemSideFilter)
                    : items,
        })),
    setReviewStarsSelect: (stars: string | null) =>
        set({ reviewStarsSelect: stars }),
}));

export default useSideFilter;
