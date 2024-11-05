import { create } from 'zustand';

// Define the state and associated actions in an interface
interface CategoryItem {
    categoryName: string;
    urlLink: string;
}

interface StoreState {
    categorySelect: string[] | null;
    categoryItem: CategoryItem[] | null;
    reviewStarsSelect: string | null;
    setCategorySelect: (
        items: string[] | ((prev: string[] | null) => string[] | null)
    ) => void;
    setCategoryItem: (
        items:
            | CategoryItem[]
            | ((prev: CategoryItem[] | null) => CategoryItem[] | null)
    ) => void;
    setReviewStarsSelect: (stars: string | null) => void;
}

// Create the Zustand store
const useStorePage = create<StoreState>((set) => ({
    categorySelect: ['all'], // Allow for multi-category selection
    categoryItem: null, // Initial state for category name and URL link
    reviewStarsSelect: null,
    setCategorySelect: (
        items: string[] | ((prev: string[] | null) => string[] | null)
    ) =>
        set((state) => ({
            categorySelect:
                typeof items === 'function'
                    ? items(state.categorySelect)
                    : items,
        })),
    setCategoryItem: (
        items:
            | CategoryItem[]
            | ((prev: CategoryItem[] | null) => CategoryItem[] | null)
    ) =>
        set((state) => ({
            categoryItem:
                typeof items === 'function' ? items(state.categoryItem) : items,
        })),
    setReviewStarsSelect: (stars: string | null) =>
        set({ reviewStarsSelect: stars }),
}));
export default useStorePage;
