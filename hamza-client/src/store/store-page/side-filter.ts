import { create } from 'zustand';

interface CategoryItem {
    categoryName: string;
    urlLink: string;
}

// Define the state and associated actions in an interface
interface StoreFilterState {
    selectCategoryStoreFilter: string[];
    categoryItemSideFilter: CategoryItem[];
    reviewStarsSelect: string | null;
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
    selectCategoryStoreFilter: [], // Initialized to a default array
    categoryItemSideFilter: [], // Initialized to an empty array
    reviewStarsSelect: null, // Remains nullable since it's a single value
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
