import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import useWishlistStore, {
    WishlistProduct,
} from '@/zustand/wishlist/wishlist-store';
import { getClientCookie } from '@lib/util/get-client-cookies';

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

export function useWishlistMutations() {
    const { addWishlistProduct, removeWishlistProduct } = useWishlistStore(
        (state) => state
    );

    // Accessing state safely
    const customerState = useCustomerAuthStore((state) => ({
        customer_id: state.authData.customer_id,
    }));
    const customer_id = customerState?.customer_id;

    const addWishlistItemMutation = useMutation({
        mutationFn: async (product: WishlistProduct) => {
            console.log(
                'PASSING CUSTOMER_ID',
                customer_id,
                'AND PRODUCT ID',
                product.id
            );

            // Add product to Zustand store
            addWishlistProduct(product);

            // Make API request to add item to the wishlist
            return axios.post(
                `${BACKEND_URL}/custom/wishlist/item`,
                {
                    customer_id: customer_id, // Ensure customer_id is handled when null
                    variant_id: product.productVariantId,
                },
                {
                    headers: {
                        authorization: getClientCookie('_medusa_jwt'),
                    },
                }
            );
        },
        onSuccess: (data, product) => {
            console.log('Added Wishlist item in DB:', product.productVariantId);
        },
        onError: (error, product) => {
            // Rollback state in case of failure
            removeWishlistProduct(product.id ?? '');
            console.error('Error adding item to wishlist:', error);
        },
    });


    const removeWishlistItemMutation = useMutation({
        mutationFn: async (product: WishlistProduct) => { // ✅ Define the argument type
            console.log('removeWishlistProduct', product.id);
            removeWishlistProduct(product.id ?? '');

            console.log('variant to remove is ', product.productVariantId);

            return axios.delete(`${BACKEND_URL}/custom/wishlist/item`, {
                data: {
                    customer_id: customer_id, // Ensure customer_id is handled when null
                    variant_id: product.productVariantId,
                },
                headers: {
                    authorization: getClientCookie('_medusa_jwt'),
                },
            });
        },
        onSuccess: (data, product) => {
            console.log('Removed Wish List item in DB', product.id);
        },
        onError: (error, product) => {
            addWishlistProduct(product);
            console.error('Error removing item from wishlist-dropdown', error);
        },
    });


    return { addWishlistItemMutation, removeWishlistItemMutation };
}
