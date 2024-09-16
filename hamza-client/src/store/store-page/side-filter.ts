import { create } from 'zustand';

interface CategoryItem {
    categoryName: string;
    urlLink: string;
}

// Define the state and associated actions in an interface
interface StoreFilterState {
    selectCategoryStoreFilter: string[] | null;
    categoryItemSideFilter: CategoryItem[] | null;
    reviewStarsSelect: string | null;
    setSelectCategoryStoreFilter: (
        items: string[] | ((prev: string[] | null) => string[] | null)
    ) => void;
    setCategoryItemSideFilter: (
        items:
            | CategoryItem[]
            | ((prev: CategoryItem[] | null) => CategoryItem[] | null)
    ) => void;
    setReviewStarsSelect: (stars: string | null) => void;
}

// Create the Zustand store
const useSideFilter = create<StoreFilterState>((set) => ({
    selectCategoryStoreFilter: ['All'], // Allow for multi-category selection
    categoryItemSideFilter: null, // Initial state for category name and URL link
    reviewStarsSelect: null,
    setSelectCategoryStoreFilter: (
        items: string[] | ((prev: string[] | null) => string[] | null)
    ) =>
        set((state) => ({
            selectCategoryStoreFilter:
                typeof items === 'function'
                    ? items(state.selectCategoryStoreFilter)
                    : items,
        })),
    setCategoryItemSideFilter: (
        items:
            | CategoryItem[]
            | ((prev: CategoryItem[] | null) => CategoryItem[] | null)
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
