import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type WishlistProduct = {
    id: string;
    product_id: string;
};

type Wishlist = {
    id?: string;
    products: WishlistItem[];
};

// TODO: clean up this any cast after mutations work
type WishlistType = {
    wishlist: Wishlist;
    addWishlistProduct: (product: WishlistProduct) => Promise<void>;
    removeWishlistProduct: (product: WishlistProduct) => Promise<void>;
};

const useWishlistStore = create<WishlistType>()(
    persist(
        (set, get) => ({
            wishlist: {
                products: [],
            },
            addWishlistProduct: async (product) => {
                const { wishlist } = get(); // Retrieve the current state
                if (!wishlist || !Array.isArray(wishlist.products)) {
                    console.error(
                        'Initial state not set or corrupted. Resetting to default.'
                    );
                    set({ wishlist: { products: [] } }); // Reset state if corrupted
                }

                // Check if the product is already in the wishlist
                const productExists = wishlist.products.some(
                    (p) => p.product_id === product.product_id
                );
                if (productExists) {
                    console.log(
                        'Product already in wishlist:',
                        product.product_id
                    );
                    return; // Exit the function if product already exists
                }

                // If the product does not exist, add it to the list
                set((state) => ({
                    wishlist: {
                        ...state.wishlist,
                        products: [...state.wishlist.products, product],
                    },
                }));
            },

            removeWishlistProduct: async (product) => {
                console.log('Removing Wish List product', product);
                set((state) => ({
                    wishlist: {
                        ...state.wishlist,
                        products: state.wishlist.products.filter(
                            (p) => p.id !== product.id
                        ),
                    },
                }));
            },
        }),
        {
            name: 'wishlist-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useWishlistStore;
