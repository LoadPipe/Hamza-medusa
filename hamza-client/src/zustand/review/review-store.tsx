// store/itemStore.ts (or .js if you prefer, but .ts is recommended for TypeScript)
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Define the item interface as before
export interface Item {
    currency_code: string;
    id: string;
    created_at: string;
    updated_at: string;
    cart_id: string;
    order_id: string | null;
    swap_id: string | null;
    claim_order_id: string | null;
    original_item_id: string | null;
    order_edit_id: string | null;
    title: string;
    description: string;
    thumbnail: string;
    is_return: boolean;
    is_giftcard: boolean;
    should_merge: boolean;
    allow_discounts: boolean;
    has_shipping: boolean;
    unit_price: number;
    variant_id: string;
    quantity: number;
    fulfilled_quantity: number | null;
    returned_quantity: number | null;
    shipped_quantity: number | null;
    metadata: Record<string, unknown>;
    customer_id: string;
}

// Define a new interface for your store state
interface ItemState {
    item: Item | null; // Item can be null if not set
    setItem: (item: Item | null) => void; // Action to set the item
}

// Create the store using the defined types
const useItemStore = create<ItemState>()(
    persist(
        (set) => ({
            item: null, // Initial state
            setItem: (item) => set({ item }), // Action to update the item
        }),
        {
            name: 'item-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useItemStore;
