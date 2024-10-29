import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getWishlist } from '@lib/data/index';

export type PriceDictionary = {
    eth?: string;
    usdc?: string;
    usdt?: string;
};

export type WishlistProduct = {
    id: string;
    thumbnail: string;
    variantThumbnail: string | null;
    title: string;
    handle: string;
    description: string;
    price?: PriceDictionary; // Dictionary type for price...
    productVariantId: string | null;
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
            removeWishlistProduct: async (productId) => {
                console.log('Attempting to remove product with ID:', productId);
                const { wishlist } = get();
                set((state) => {
                    const filteredItems = wishlist.products.filter(
                        (p) => p.id !== productId
                    );
                    console.log('All items:', wishlist.products);
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
                    const items = response?.items ?? [];
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
                            variantThumbnail: item.variant?.metadata?.imgUrl,
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
            },
        }
    )
);

export default useWishlistStore;
