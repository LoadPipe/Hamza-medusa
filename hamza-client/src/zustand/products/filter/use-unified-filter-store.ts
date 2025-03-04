import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CategoryItem {
    categoryName: string;
    urlLink: string;
}

type RangeType = [number, number];

interface UnifiedFilterState {
    // Category filtering
    selectedCategories: string[];
    setSelectedCategories: (categories: string[]) => void;
    clearCategories: () => void;

    // Price range filtering
    range: RangeType;
    rangeUpper: number;
    rangeLower: number;
    setRange: (range: RangeType) => void;
    setRangeUpper: (price: number) => void;
    setRangeLower: (price: number) => void;

    // Review stars filtering
    selectedReviewStars: string | null;
    setSelectedReviewStars: (stars: string | null) => void;

    //Category items
    categoryItems: CategoryItem[];
    setCategoryItems: (
        items: CategoryItem[] | ((prev: CategoryItem[]) => CategoryItem[])
    ) => void;

    // Keep track of the last connected address
    lastAddress: string | null;
    setLastAddress: (addr: string | null) => void;

    // Has persisted store rehydrated?
    hasHydrated: boolean;
    setHasHydrated: (value: boolean) => void;

    clearFilters: () => void;
}

const useUnifiedFilterStore = create<UnifiedFilterState>()(
    persist(
        (set) => ({
            // Category filtering state
            selectedCategories: ['all'],
            setSelectedCategories: (categories: string[]) =>
                set({ selectedCategories: categories.map((cat) => cat.toLowerCase()) }),
            clearCategories: () => set({ selectedCategories: ['all'] }),

            // Price range state
            range: [0, 350],
            rangeUpper: 0,
            rangeLower: 0,
            setRange: (range: RangeType) => set({ range }),
            setRangeUpper: (price: number) => set({ rangeUpper: price }),
            setRangeLower: (price: number) => set({ rangeLower: price }),

            // Review stars state
            selectedReviewStars: null,
            setSelectedReviewStars: (stars: string | null) =>
                set({ selectedReviewStars: stars }),

            // Category items state (if needed)
            categoryItems: [],
            setCategoryItems: (
                items: CategoryItem[] | ((prev: CategoryItem[]) => CategoryItem[])
            ) =>
                set((state) => ({
                    categoryItems:
                        typeof items === 'function' ? items(state.categoryItems) : items,
                })),

            lastAddress: null,
            setLastAddress: (addr: string | null) => set({ lastAddress: addr }),

            hasHydrated: false,
            setHasHydrated: (value: boolean) => set({ hasHydrated: value }),

            // Clear all filters (categories, range, review stars, and category items)
            clearFilters: () =>
                set({
                    selectedCategories: ['all'],
                    range: [0, 350],
                    rangeUpper: 350,
                    rangeLower: 0,
                    selectedReviewStars: null,
                    categoryItems: [],
                }),
        }),
        {
            name: 'unifiedFilterStore',
            onRehydrateStorage: () => (state, error) => {
                if (error) {
                    console.error('Error rehydrating filter store', error);
                } else {
                    state?.setHasHydrated(true);
                }
            },
        }
    )
);

export default useUnifiedFilterStore;
