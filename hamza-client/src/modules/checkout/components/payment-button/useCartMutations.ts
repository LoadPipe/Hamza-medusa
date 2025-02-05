import { useMutation } from "@tanstack/react-query";
import { useUpdateCart, useCompleteCart } from "medusa-react";
import axios from "axios";
import { getClientCookie } from "@lib/util/get-client-cookies";

const MEDUSA_SERVER_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

/**
 * Custom Tanstack v5 mutation wrapper for updating a cart.
 */
export const useUpdateCartCustom = (cartId: string) => {
    const updateCart = useUpdateCart(cartId);

    return useMutation({
        mutationFn: async () => {
            return new Promise((resolve, reject) => {
                if (!updateCart.mutate) {
                    reject(new Error("Mutation function not found for useUpdateCart"));
                    return;
                }

                updateCart.mutate({ context: {} }, {
                    onSuccess: (data) => {
                        console.log("updateCart Success", data);
                        resolve(data);
                    },
                    onError: (error) => {
                        console.error("updateCart Error", error);
                        reject(error);
                    }
                });
            });
        },
    });
};


/**
 * Custom Tanstack v5 mutation wrapper for completing a cart.
 */
export const useCompleteCartCustom = () => {
    return useMutation({
        mutationFn: async (cartId: string) => {
            const response = await axios.post(
                `${MEDUSA_SERVER_URL}/store/carts/${cartId}/complete`, // FIXED URL Interpolation
                {},
                {
                    headers: {
                        authorization: getClientCookie("_medusa_jwt"),
                    },
                }
            );
            return response.data;
        },
    });
};

/**
 * Custom Tanstack v5 mutation wrapper for canceling an order.
 */
export const useCancelOrderCustom = () => {
    return useMutation({
        mutationFn: async (cartId: string) => {
            const response = await axios.post(
                `${MEDUSA_SERVER_URL}/custom/cart/cancel`,
                { cart_id: cartId },
                {
                    headers: {
                        authorization: getClientCookie("_medusa_jwt"),
                    },
                }
            );
            return response.data;
        },
    });
};
