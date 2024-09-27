import { create } from 'zustand';

interface CategoryItem {
    categoryName: string;
    urlLink: string;
}

// Define the state and associated actions in an interface
interface ModalFilterState {
    selectCategoryStoreModalFilter: string[];
    categoryItemStoreModalFilter: CategoryItem[];
    modalReviewFilterSelect: string | null;
    setSelectCategoryModalFilter: (
        items: string[] | ((prev: string[]) => string[])
    ) => void;
    setCategoryItemStoreModalFilter: (
        items: CategoryItem[] | ((prev: CategoryItem[]) => CategoryItem[])
    ) => void;
    setModalReviewFilterSelect: (stars: string | null) => void;
}

// Create the Zustand store
const useModalFilter = create<ModalFilterState>((set) => ({
    selectCategoryStoreModalFilter: [], // Initialized to an empty array
    categoryItemStoreModalFilter: [], // Initialized to an empty array
    modalReviewFilterSelect: null, // Remains nullable since it's a single value

    setSelectCategoryModalFilter: (
        items: string[] | ((prev: string[]) => string[])
    ) =>
        set((state) => ({
            selectCategoryStoreModalFilter:
                typeof items === 'function'
                    ? items(state.selectCategoryStoreModalFilter)
                    : items,
        })),

    setCategoryItemStoreModalFilter: (
        items: CategoryItem[] | ((prev: CategoryItem[]) => CategoryItem[])
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
