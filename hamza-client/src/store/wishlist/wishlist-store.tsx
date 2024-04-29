import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import wishlist from '@/components/wishlist-dropdown/icon/wishlist-icon';

type WishlistProduct = {
    id: string;
    product_id: string;
};

type Wishlist = {
    id?: string;
    products: WishlistProduct[];
};

// TODO: clean up this any cast after mutations work
type WishlistType = {
    wishlist: Wishlist;
    loadWishlist: (customer_id: string) => Promise<void>;
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
                const { wishlist } = get();
                console.log('Wishlist product', wishlist);
                if (wishlist.products.some((p) => p.id === product.id)) {
                    console.log(
                        'Product already in wishlist-dropdown:',
                        product.product_id
                    );
                    return;
                }
                set((state) => ({
                    wishlist: {
                        ...state.wishlist,
                        products: [...state.wishlist.products, product],
                    },
                }));
            },
            removeWishlistProduct: async (product_id) => {
                console.log(
                    'Attempting to remove product with ID:',
                    product_id
                );
                const { wishlist } = get();
                console.log('Current items:', wishlist);
                set((state) => {
                    const filteredItems = wishlist.products.filter(
                        (p) => p.id !== product_id // Corrected to filter by product_id
                    );
                    console.log('Filtered items:', filteredItems);
                    return {
                        wishlist: {
                            ...state.wishlist,
                            products: filteredItems,
                        },
                    };
                });
            },
            loadWishlist: async (customer_id) => {
                console.log('Loading wishlist-dropdown');
                try {
                    const response = await axios.get(
                        `http://localhost:9000/custom/wishlist?customer_id=${customer_id}`
                    );
                    const items = response.data.items;
                    const products = items.map((item) => item.product);
                    console.log('Wishlist products:', products);
                    if (Array.isArray(items)) {
                        set({ wishlist: { products } });
                    } else {
                        console.error(
                            'Failed to load wishlist-dropdown: Invalid data format'
                        );
                    }
                } catch (error) {
                    console.error('Failed to load wishlist-dropdown:', error);
                }
            },
        }),
        {
            name: 'wishlist-storage',
            storage: createJSONStorage(() => localStorage),
            // Optional: You can trigger loadWishlist after the store has been rehydrated from localStorage
            onRehydrateStorage: () => (state, error) => {
                console.log('Rehydration working');
                if (error) {
                    console.error('Failed to rehydrate:', error);
                    return;
                }
                const customerData = localStorage.getItem('__hamza_customer');
                console.log('Customer__DATA', customerData);
                try {
                    if (customerData) {
                        const parsedData = JSON.parse(customerData);
                        const customer_id = parsedData.state.customer_id;

                        // console.log('Customer ID:', customer_id);
                        if (customer_id) {
                            // console.log('Run loadwishlist?');
                            state?.loadWishlist(customer_id);
                        }
                    }
                } catch (parseError) {
                    console.error('Error parsing customer data:', parseError);
                }
            },
        }
    )
);

export default useWishlistStore;
