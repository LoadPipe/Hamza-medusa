import { create } from 'zustand';

interface CategoryItem {
    categoryName: string;
    urlLink: string;
}

// Define the state and associated actions in an interface
interface ShopFilterState {
    priceHi: number;
    priceLo: number;
    selectCategoryShopFilter: string[];
    categoryItemShopFilter: CategoryItem[];
    reviewStarsSelect: string | null;
    setPriceHi: (price: number) => void;
    setPriceLo: (price: number) => void;
    setSelectCategoryShopFilter: (
        items: string[] | ((prev: string[]) => string[])
    ) => void;
    setCategoryItemShopFilter: (
        items: CategoryItem[] | ((prev: CategoryItem[]) => CategoryItem[])
    ) => void;
    setReviewStarsSelect: (stars: string | null) => void;
}

// Create the Zustand store
const useShopFilter = create<ShopFilterState>((set) => ({
    priceHi: 0,
    priceLo: 0,
    selectCategoryShopFilter: [], // Initialized to a default array
    categoryItemShopFilter: [], // Initialized to an empty array
    reviewStarsSelect: null, // Remains nullable since it's a single value
    setPriceHi: (price: number) => set({ priceHi: price }),
    setPriceLo: (price: number) => set({ priceLo: price }),
    setSelectCategoryShopFilter: (
        items: string[] | ((prev: string[]) => string[])
    ) =>
        set((state) => ({
            selectCategoryShopFilter:
                typeof items === 'function'
                    ? items(state.selectCategoryShopFilter)
                    : items,
        })),
    setCategoryItemShopFilter: (
        items: CategoryItem[] | ((prev: CategoryItem[]) => CategoryItem[])
    ) =>
        set((state) => ({
            categoryItemShopFilter:
                typeof items === 'function'
                    ? items(state.categoryItemShopFilter)
                    : items,
        })),
    setReviewStarsSelect: (stars: string | null) =>
        set({ reviewStarsSelect: stars }),
}));

export default useShopFilter;
