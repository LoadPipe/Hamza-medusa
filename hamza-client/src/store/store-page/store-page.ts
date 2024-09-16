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
    // Update the setter types to accept a function or a direct value
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
    categorySelect: ['All'], // Allow for multi-category selection
    reviewStarsSelect: null,
    categoryItem: null, // Initial state for category name and URL link
    // Allow functional updates for categorySelect
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

    // Setter for categoryItem to handle category name and URL link
}));
export default useStorePage;
