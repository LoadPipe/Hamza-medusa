import { create } from 'zustand';

// Define the state and associated actions in an interface
interface CategoryItem {
    categoryName: string;
    urlLink: string;
}

interface ProductState {
    categorySelect: string[] | null;
    categoryItem: CategoryItem[] | null;
    categoryTypeSelect: string[] | null;
    currencySelect: string | null;
    reviewStarsSelect: string | null;

    // Update the setter types to accept a function or a direct value
    setCategoryItem: (
        items:
            | CategoryItem[]
            | ((prev: CategoryItem[] | null) => CategoryItem[] | null)
    ) => void;
    setCategorySelect: (
        items: string[] | ((prev: string[] | null) => string[] | null)
    ) => void;
    setCategoryTypeSelect: (
        items: string[] | ((prev: string[] | null) => string[] | null)
    ) => void;
    setCurrencySelect: (item: string | null) => void;
    setReviewStarsSelect: (stars: string | null) => void;
}

// Create the Zustand store
const useProductGroup = create<ProductState>((set) => ({
    categorySelect: ['all'], // Allow for multi-category selection
    categoryItem: null, // Initial state for category name and URL link
    categoryTypeSelect: null,
    currencySelect: null,
    reviewStarsSelect: null,
    setCurrencySelect: (item: string | null) => set({ currencySelect: item }),

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

    // Allow functional updates for categoryTypeSelect
    setCategoryTypeSelect: (
        items: string[] | ((prev: string[] | null) => string[] | null)
    ) =>
        set((state) => ({
            categoryTypeSelect:
                typeof items === 'function'
                    ? items(state.categoryTypeSelect)
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

export default useProductGroup;
