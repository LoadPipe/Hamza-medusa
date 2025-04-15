import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { getClientCookie } from '@lib/util/get-client-cookies';

const MEDUSA_SERVER_URL =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

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
        mutationFn: async (data: {
            cartId: string;
            chainType: string;
            chainId: string;
        }) => {
            if (!data?.cartId) {
                throw new Error('Cart ID is required for completing checkout.');
            }

            console.log(`Completing cart with ID: ${data.cartId}`);

            const response = await axios.post(
                `${MEDUSA_SERVER_URL}/store/carts/${data.cartId}/complete`,
                {},
                {
                    headers: {
                        authorization: getClientCookie('_medusa_jwt'),
                        chain_id: data.chainId,
                        chain_type: data.chainType,
                        id: data.cartId,
                    },
                }
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
// TODO: This should probably be a mutation, I don't want to implement that until my faucet resets though... to test
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
            }
        );
        return response;
    } catch (e) {
        console.log('error in cancelling order ', e);
        return;
    }
};
