import { create } from 'zustand';

// Define the state and associated actions in an interface
interface ModalFilterState {
    modalFilterSelected: boolean;
    modalCategoryFilterSelect: string | null;
    modalCategoryTypeFilterSelect: string | null;
    modalCurrencyFilterSelect: string | null;
    modalReviewFilterSelect: string | null;
    setModalCategoryFilterSelect: (item: string | null) => void;
    setModalCategoryTypeFilterSelect: (item: string | null) => void;
    setModalCurrencyFilterSelect: (item: string | null) => void;
    setModalReviewFilterSelect: (stars: string | null) => void;
    setModalFilterSelected: (selected: boolean) => void;
}

// Create the Zustand store
const useModalFilter = create<ModalFilterState>((set) => ({
    modalFilterSelected: false,
    modalCategoryFilterSelect: null,
    modalCategoryTypeFilterSelect: null,
    modalCurrencyFilterSelect: null,
    modalReviewFilterSelect: null,
    setModalCategoryFilterSelect: (item: string | null) =>
        set({ modalCategoryFilterSelect: item }),
    setModalCategoryTypeFilterSelect: (item: string | null) =>
        set({ modalCategoryTypeFilterSelect: item }),
    setModalCurrencyFilterSelect: (item: string | null) =>
        set({ modalCurrencyFilterSelect: item }),
    setModalReviewFilterSelect: (stars: string | null) =>
        set({ modalReviewFilterSelect: stars }),
    setModalFilterSelected: (selected: boolean) =>
        set({ modalFilterSelected: selected }),
}));

export default useModalFilter;
