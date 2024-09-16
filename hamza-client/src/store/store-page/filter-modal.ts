import { create } from 'zustand';

// Define the state and associated actions in an interface
interface CategoryItem {
    categoryName: string;
    urlLink: string;
}

interface ModalFilterState {
    selectCategoryStoreModalFilter: string[] | null;
    categoryItemStoreModalFilter: CategoryItem[] | null;
    modalReviewFilterSelect: string | null;
    setSelectCategoryModalFilter: (
        items: string[] | ((prev: string[] | null) => string[] | null)
    ) => void;
    setCategoryItemStoreModalFilter: (
        items:
            | CategoryItem[]
            | ((prev: CategoryItem[] | null) => CategoryItem[] | null)
    ) => void;

    setModalReviewFilterSelect: (stars: string | null) => void;
}

// Create the Zustand store
const useModalFilter = create<ModalFilterState>((set) => ({
    selectCategoryStoreModalFilter: ['All'], // Allow for multi-category selection
    categoryItemStoreModalFilter: null, // Initial state for category name and URL link
    modalReviewFilterSelect: null,
    setSelectCategoryModalFilter: (
        items: string[] | ((prev: string[] | null) => string[] | null)
    ) =>
        set((state) => ({
            selectCategoryStoreModalFilter:
                typeof items === 'function'
                    ? items(state.selectCategoryStoreModalFilter)
                    : items,
        })),
    setCategoryItemStoreModalFilter: (
        items:
            | CategoryItem[]
            | ((prev: CategoryItem[] | null) => CategoryItem[] | null)
    ) =>
        set((state) => ({
            categoryItemStoreModalFilter:
                typeof items === 'function'
                    ? items(state.categoryItemStoreModalFilter)
                    : items,
        })),

    setModalReviewFilterSelect: (stars: string | null) =>
        set({ modalReviewFilterSelect: stars }),
}));

export default useModalFilter;
