import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import wishlist from '@/components/wishlist-dropdown/icon/wishlist-icon';
import { getWishlist } from '@lib/data/index';

export type PriceDictionary = {
    eth?: string;
    usdc?: string;
    usdt?: string;
};

export type WishlistProduct = {
    id: string;
    thumbnail: string;
    title: string;
    handle: string;
    description: string;
    price: PriceDictionary; // Dictionary type for price...
    productVariantId: string;
};

type Wishlist = {
    id?: string;
    products: WishlistProduct[];
};

type WishlistType = {
    wishlist: Wishlist;
    loadWishlist: (customer_id: string) => Promise<void>;
    addWishlistProduct: (product: WishlistProduct) => Promise<void>;
    removeWishlistProduct: (productVariantId: string) => Promise<void>;
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
                if (
                    wishlist.products.some(
                        (p) => p.productVariantId === product.productVariantId
                    )
                ) {
                    return;
                }
                set((state) => ({
                    wishlist: {
                        ...state.wishlist,
                        products: [...state.wishlist.products, product],
                    },
                }));
            },
            removeWishlistProduct: async (productVariantId) => {
                console.log(
                    'Attempting to remove product variant with ID:',
                    productVariantId
                );
                const { wishlist } = get();
                set((state) => {
                    const filteredItems = wishlist.products.filter(
                        (p) => p.productVariantId !== productVariantId
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
                try {
                    const response = await getWishlist(customer_id);
                    const items = response.items;
                    console.log('WISHLIST ITEMS');
                    console.log(items);
                    const products = items.map((item: any) => {
                        // Correctly declare priceDictionary without the extra =
                        const priceDictionary: PriceDictionary =
                            item.variant.prices.reduce(
                                (acc: PriceDictionary, price: any) => {
                                    acc[
                                        price.currency_code as keyof PriceDictionary
                                    ] = price.amount; // Use currency_code instead of currency
                                    return acc;
                                },
                                {} // Init value for accumulator to an empty object
                            );

                        // Return the product object
                        return {
                            id: item.variant.product.id,
                            thumbnail: item.variant.product.thumbnail,
                            title: item.variant.product.title,
                            handle: item.variant.product.handle,
                            description: item.variant.product.description,
                            productVariantId: item.variant.id,
                            price: priceDictionary, // Price dictionary with all currencies
                        };
                    });

                    if (Array.isArray(items)) {
                        set({ wishlist: { products } });
                    } else {
                        console.error(
                            'Failed to load wishlist: Invalid data format'
                        );
                    }
                } catch (error) {
                    console.error('Failed to load wishlist:', error);
                }
            },
        }),
        {
            name: 'wishlist-storage',
            storage: createJSONStorage(() => localStorage),
            // Optional: You can trigger loadWishlist after the store has been rehydrated from localStorage
            onRehydrateStorage: () => (state, error) => {
                console.log('Rehydration process triggered');
                /*
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
                */
            },
        }
    )
);

export default useWishlistStore;
