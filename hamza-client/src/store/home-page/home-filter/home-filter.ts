import { create } from 'zustand';

interface CategoryItem {
    categoryName: string;
    urlLink: string;
}

type RangeType = [number, number];
// Define the state and associated actions in an interface
interface ShopFilterState {
    range: RangeType;
    rangeUpper: number;
    rangeLower: number;
    selectCategoryFilter: string[];
    selectReviewStarsFilter: string | null;
    categoryItemFilter: CategoryItem[];
    setRangeUpper: (price: number) => void;
    setRangeLower: (price: number) => void;
    setRange: (range: RangeType) => void; // Action to set the range
    setSelectCategoryFilter: (
        items: string[] | ((prev: string[]) => string[])
    ) => void;
    setCategoryItemFilter: (
        items: CategoryItem[] | ((prev: CategoryItem[]) => CategoryItem[])
    ) => void;
    setSelectReviewStarsFilter: (stars: string | null) => void;
}

// Create the Zustand store
const useHomeModalFilter = create<ShopFilterState>((set) => ({
    range: [0, 350],
    rangeUpper: 0,
    rangeLower: 0,
    selectCategoryFilter: [], // Initialized to a default array
    selectReviewStarsFilter: null, // Remains nullable since it's a single value
    categoryItemFilter: [], // Initialized to an empty array
    setRangeUpper: (price: number) => set({ rangeUpper: price }),
    setRangeLower: (price: number) => set({ rangeLower: price }),
    setRange: (range: RangeType) => set({ range }),
    setSelectCategoryFilter: (
        items: string[] | ((prev: string[]) => string[])
    ) =>
        set((state) => ({
            selectCategoryFilter:
                typeof items === 'function'
                    ? items(state.selectCategoryFilter)
                    : items,
        })),
    setCategoryItemFilter: (
        items: CategoryItem[] | ((prev: CategoryItem[]) => CategoryItem[])
    ) =>
        set((state) => ({
            categoryItemFilter:
                typeof items === 'function'
                    ? items(state.categoryItemFilter)
                    : items,
        })),
    setSelectReviewStarsFilter: (stars: string | null) =>
        set({ selectReviewStarsFilter: stars }),
}));

export default useHomeModalFilter;
