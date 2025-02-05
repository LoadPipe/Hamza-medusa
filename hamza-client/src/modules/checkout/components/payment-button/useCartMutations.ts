import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { getClientCookie } from '@lib/util/get-client-cookies';

const MEDUSA_SERVER_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

/**
 * Custom Tanstack v5 mutation for completing a cart
 * @function: updateCart
 * @What: Finalize a cart and creates the corresponding order in the Backend
 * @params: Provide it a cart_id
 * @returns: Order
 */
// Custom mutations for useCompleteCart
export const useCompleteCartCustom = () => {
    return useMutation({
        mutationFn: async (cartId: string) => {
            if (!cartId) {
                throw new Error('Cart ID is required for completing checkout.');
            }

            console.log(`Completing cart with ID: ${cartId}`);

            const response = await axios.post(
                `${MEDUSA_SERVER_URL}/store/carts/${cartId}/complete`,
                {},
                {
                    headers: {
                        authorization: getClientCookie('_medusa_jwt'),
                    },
                },
            );
            return response.data;
        },
    });
};

/**
 * Custom Tanstack v5 mutation for creating a cart
 * @function: createCart
 * @What: Creates a new cart in the backend
 * @params: Provide it a region_id
 * @returns: Cart
 */

export const cancelOrderFromCart = async (cartId: string) => {
    try {
        const response = await axios.post(
            `${MEDUSA_SERVER_URL}/custom/cart/cancel`,
            {
                cart_id: cartId,
            },
            {
                headers: {
                    authorization: getClientCookie('_medusa_jwt'),
                },
            },
        );
        return response;
    } catch (e) {
        console.log('error in cancelling order ', e);
        return;
    }
};
