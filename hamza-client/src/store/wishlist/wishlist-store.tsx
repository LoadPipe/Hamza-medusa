import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import wishlist from '@/components/wishlist-dropdown/icon/wishlist-icon';

export type WishlistProduct = {
    id: string;
    thumbnail: string;
    title: string;
    handle: string;
    description: string;
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
    removeWishlistProduct: (product_id: string) => Promise<void>; // Change here
    updateAuthentication: (status: boolean) => void;
    isCustomerAuthenticated: boolean;
};

const BACKEND_URL =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

const useWishlistStore = create<WishlistType>()(
    persist(
        (set, get) => ({
            wishlist: {
                products: [],
            },
            isCustomerAuthenticated: false,
            updateAuthentication: (status) => {
                set({ isCustomerAuthenticated: status });
            },
            addWishlistProduct: async (product) => {
                const { wishlist } = get();
                console.log('Wishlist product', wishlist);
                if (wishlist.products.some((p) => p.id === product.id)) {
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
                // console.log('Current items:', wishlist);
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
                // console.log('Loading wishlist-dropdown');
                try {
                    const response = await axios.get(
                        `${BACKEND_URL}/custom/wishlist?customer_id=${customer_id}`
                    );
                    const items = response.data.items;
                    const products = items.map((item: any) => item.product);
                    // console.log('Wishlist products:', products);
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
                // console.log('Rehydration process triggered');
                if (error) {
                    console.error('Rehydration error:', error);
                    return;
                }
                // console.log(
                //     'Rehydration successful, checking for customer data...'
                // );
                const customerData = localStorage.getItem('__hamza_customer');
                if (customerData) {
                    const parsedData = JSON.parse(customerData);
                    if (parsedData.state.status === 'authenticated') {
                        console.log('Customer now authenticated');
                        try {
                            state?.updateAuthentication(true);
                            const customer_id = parsedData.state.customer_id;
                            if (customer_id) {
                                console.log(
                                    'Customer ID found:',
                                    customer_id,
                                    'Loading wishlist...'
                                );
                                state?.loadWishlist(customer_id);
                            }
                        } catch (parseError) {
                            console.error(
                                'Error parsing customer data:',
                                parseError
                            );
                        }
                    } else if (parsedData.state.status === 'unauthenticated') {
                        try {
                            state?.updateAuthentication(false);
                        } catch (e) {
                            console.log(`Couldn't unauthenticate, ${e}`);
                        }
                        console.log(`Customer is now unauthenticated`);
                    } else {
                        console.log(
                            'No customer data found, possibly new session'
                        );
                    }
                } else {
                    console.log('No customer data found in local storage.');
                }
            },
        }
    )
);

export default useWishlistStore;
