'use server';

import {
    ProductCategory,
    ProductCollection,
    Region,
    StoreGetProductsParams,
    StorePostCartsCartReq,
    StorePostAuthReq,
    StorePostCustomersCustomerAddressesAddressReq,
    StorePostCustomersCustomerAddressesReq,
    StorePostCustomersCustomerReq,
} from '@medusajs/medusa';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { cache } from 'react';
import { decode } from 'jsonwebtoken';

import sortProducts from '@lib/util/sort-products';
import transformProductPreview from '@lib/util/transform-product-preview';
import { SortOptions } from '@modules/store/components/refinement-list/sort-products';
import { ProductCategoryWithChildren, ProductPreviewType } from 'types/global';
import { medusaClient } from '../config';
import medusaError from '@lib/util/medusa-error';
import axios from 'axios';

import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

declare class StorePostAuthReqCustom {
    email: string;
    password: string;
    wallet_address: string;
}

const emptyResponse = {
    response: { products: [], count: 0 },
    nextPage: null,
};

/**
 * Function for getting custom headers for Medusa API requests, including the JWT token and cache revalidation tags.
 *
 * @param tags
 * @returns custom headers for Medusa API requests
 */
const getMedusaHeaders = (tags: string[] = []) => {
    const headers = {
        next: {
            tags,
        },
    } as Record<string, any>;

    //TODO: is the following commented out code needed? (JK)
    // Not a good idea to reset
    const token = cookies().get('_medusa_jwt')?.value;

    if (token) {
        headers.authorization = `Bearer ${token}`;
    }

    return headers;
};

// Get Vendors
export async function getStores() {
    try {
        const response = await axios.get(`${BACKEND_URL}/custom/store`);
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// Get Vendor Store by slug
export async function getVendorStoreBySlug(store_name: string) {
    try {
        const response = await axios.get(`${BACKEND_URL}/custom/store`, {
            params: {
                store_name,
            },
        });
        return response.data;
    } catch (error) {
        console.error('API error:', error);
        return null;
    }
}

//

// Set a review
export async function createReview(data: any) {
    try {
        const response = await axios.post(
            `${BACKEND_URL}/custom/review`,
            data,
            {
                headers: {
                    authorization: cookies().get('_medusa_jwt')?.value,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// Get Wishlist
export async function getWishlist(customer_id: string) {
    try {
        const response = await axios.get(`${BACKEND_URL}/custom/wishlist`, {
            params: {
                customer_id,
            },
            headers: {
                authorization: cookies().get('_medusa_jwt')?.value,
            },
        });
        return response.data;
    } catch (e) {
        console.log(`Error occurred instead of returning wishlist ${e}`);
        throw e;
    }
}

// DELETE Wishlist Item
export async function deleteWishlistItem(
    customer_id: string,
    product_id: string
) {
    try {
        console.log(`Passing customer_id ${customer_id} and ${product_id}`);
        const response = await axios.delete(
            `${BACKEND_URL}/custom/wishlist/item`,
            {
                data: {
                    customer_id: customer_id, // Ensure customer_id is handled when null
                    product_id: product_id,
                },
                headers: {
                    authorization: cookies().get('_medusa_jwt')?.value,
                },
            }
        );
        return response;
    } catch (e) {
        console.log(`Error occurred instead of deleting wishlist item ${e}`);
        throw e;
    }
}

// Get Vendor Products
export async function getProductsByStoreName(storeName: string) {
    try {
        const response = await axios.get(
            `${BACKEND_URL}/custom/store/products`,
            {
                params: {
                    store_name: storeName,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.error(`Failed to return products for ${storeName}: ${e}`);
        throw e;
    }
}

// Get All Vendor Products
export async function getAllVendorProducts() {
    try {
        const response = await axios.get(`${BACKEND_URL}/store/products`);
        return response.data;
    } catch (e) {
        console.log(`Failed to return all vendor products: ${e}`);
    }
}

// Get All Store Names
export async function getAllStoreNames() {
    try {
        const response = await axios.get(`${BACKEND_URL}/custom/store/name`);
        return response.data;
    } catch (e) {
        console.error(`Error fetching store names ${e}`);
    }
}

// Get All Product reviews
export async function getAllProductReviews(customer_id: string) {
    try {
        const response = await axios.get(`${BACKEND_URL}/custom/review`, {
            params: {
                customer_id: customer_id,
            },
            headers: {
                authorization: cookies().get('_medusa_jwt')?.value,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
}

export async function checkReviewsExistence(order_id: string) {
    try {
        const response = await axios.get(
            `${BACKEND_URL}/custom/review/exists`,
            {
                params: { order_id: order_id },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
}

export async function checkCustomerReviewExistence(
    order_id: string,
    variant_id: string
) {
    try {
        const response = await axios.get(
            `${BACKEND_URL}/custom/review/existing`,
            {
                params: {
                    order_id: order_id,
                    variant_id: variant_id,
                },
                headers: {
                    authorization: cookies().get('_medusa_jwt')?.value,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
}

export async function getStoreCategories(vendorName: string) {
    try {
        const response = await axios.get(
            `${BACKEND_URL}/custom/store/categories`,
            {
                params: {
                    vendorName,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.log(`Can't Retrieve Store Category ${e}`);
    }
}

export async function verifyToken(token: string) {
    try {
        const response = await axios.get(
            `${BACKEND_URL}/custom/confirmation-token/verify`,
            {
                params: {
                    token,
                },
            }
        );
        return response.data.status;
    } catch (e) {
        console.log(`Failed to verify token ${e}`);
    }
}

//TODO: rename? cause it's not really clear what this does
export async function getOrderSummary(cart_id: string) {
    try {
        const response = await axios.get(
            `${BACKEND_URL}/custom/order/complete-template`,
            {
                params: {
                    cart_id,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.log(`Can't Retrieve cart templatr ${e}`);
    }
}

export async function getNotReviewed(customer_id: string) {
    try {
        const response = await axios.get(
            `${BACKEND_URL}/custom/review/not-reviewed`,
            {
                params: {
                    customer_id: customer_id,
                },
                headers: {
                    authorization: cookies().get('_medusa_jwt')?.value,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
}

export async function allReviews(product_id: string) {
    try {
        const response = await axios.get(`${BACKEND_URL}/custom/review`, {
            params: {
                product_id: product_id,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
}

export async function getNotifications(customer_id: string) {
    try {
        const response = await axios.get(
            `${BACKEND_URL}/custom/customer/notification?customer_id=${customer_id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: cookies().get('_medusa_jwt')?.value,
                },
            }
        );
        return response.data.types;
    } catch (error) {
        console.error('Error fetching notification preferences:', error);
    }
}

export async function checkoutMode() {
    try {
        const response = await axios.get(`${BACKEND_URL}/custom/config`);
        return response.data;
    } catch (e) {
        console.log(`Failed to return checkoutMode data ${e}`);
    }
}

export async function removeNotifications(customer_id: string) {
    try {
        const response = await axios.delete(
            `${BACKEND_URL}/custom/customer/notification`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: cookies().get('_medusa_jwt')?.value,
                },
                data: JSON.stringify({
                    customer_id: customer_id,
                    notification_type: 'none',
                }),
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error removing notification preferences:', error);
    }
}

export async function cancelOrderCart(cart_id: string) {
    try {
        const response = await axios.post(`${BACKEND_URL}/custom/cart/cancel`, {
            cart_id,
        }, {
            headers: {
                authorization: cookies().get('_medusa_jwt')?.value,
            },
        });
        return response;
    } catch (e) {
        console.log(`Error Cancelling order ${e}`);
    }
}

export async function verifyEmail(customer_id: string, email: string) {
    try {
        const response = await axios.post(
            `${BACKEND_URL}/custom/confirmation-token/generate`,
            {
                customer_id,
                email,
            }
        );
        return response.data.status;
    } catch (e) {
        console.log(`Failed to verify email ${e}`);
    }
}

export async function addNotifications(
    customer_id: string,
    notification_type: string
) {
    try {
        const response = await axios.post(
            `${BACKEND_URL}/custom/customer/notification`,
            {
                customer_id: customer_id,
                notification_type: notification_type,
            },
            {
                headers: {
                    authorization: cookies().get('_medusa_jwt')?.value,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error adding notification preferences:', error);
    }
}

export async function getOrderInformation(cart_id: string) {
    try {
        const response = await axios.get(`${BACKEND_URL}/custom/order`, {
            params: {
                cart_id: cart_id,
            },
            headers: {
                authorization: cookies().get('_medusa_jwt')?.value,
            },
        });
        return response;
    } catch (error) {
        console.error('Error fetching order information:', error);
    }
}

export async function getOrderDetails(customer_id: string) {
    try {
        const response = await axios.get(
            `${BACKEND_URL}/custom/order/customer-orders`,
            {
                params: { customer_id: customer_id },
                headers: {
                    authorization: cookies().get('_medusa_jwt')?.value,
                },
            }
        );
        return response.data.orders.orders;
    } catch (error) {
        console.error('Error fetching order details:', error);
    }
}

export async function getOrderBucket(customer_id: string) {
    try {
        const response = await axios.get(
            `${BACKEND_URL}/custom/order/customer-orders`,
            {
                params: {
                    customer_id: customer_id,
                    buckets: true,
                },
                headers: {
                    authorization: cookies().get('_medusa_jwt')?.value,
                },
            }
        );
        return response.data.orders;
    } catch (error) {
        console.error('Error fetching order bucket:', error);
    }
}

export async function getSingleBucket(customer_id: string, bucket: number) {
    try {
        const response = await axios.get(
            `${BACKEND_URL}/custom/order/customer-order`,
            {
                params: {
                    customer_id: customer_id,
                    bucket: bucket,
                },
                headers: {
                    authorization: cookies().get('_medusa_jwt')?.value,
                },
            }
        );
        return response.data.orders;
    } catch (error) {
        console.error('Error fetching single bucket:', error);
    }
}

export async function getNotReviewedOrders(customer_id: string) {
    try {
        const response = await axios.get(
            `${BACKEND_URL}/custom/review/not-reviewed`,
            {
                params: {
                    customer_id: customer_id,
                },
                headers: {
                    authorization: cookies().get('_medusa_jwt')?.value,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.error(`Error fetching all non reviewed orders ${e}`);
    }
}

export async function getOrderStatus(order_id: string) {
    try {
        const response = await axios.get(`${BACKEND_URL}/custom/order/status`, {
            params: {
                order_id: order_id,
            },
            headers: {
                authorization: cookies().get('_medusa_jwt')?.value,
            },
        });
        return response.data;
    } catch (error) {
        //console.error('Error fetching order status:', error);
        return [];
    }
}

export async function cancelOrder(order_id: string) {
    try {
        await axios.put(
            `${BACKEND_URL}/custom/order/cancel`,
            {
                order_id,
            },
            {
                headers: {
                    authorization: cookies().get('_medusa_jwt')?.value,
                },
            }
        );
    } catch (error) {
        console.error('Error cancelling order:', error);
    }
}

export async function getVerificationStatus(customer_id: string) {
    try {
        const response = await axios.get(
            `${BACKEND_URL}/custom/customer/verification-status`,
            {
                params: {
                    customer_id,
                },
                headers: {
                    authorization: cookies().get('_medusa_jwt')?.value,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error getting verification status:', error);
    }
}

export async function getAverageRatings(product_id: string) {
    try {
        const response = await axios.get(
            `${BACKEND_URL}/custom/review/average`,
            {
                params: {
                    product_id: product_id,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching average rating:', error);
    }
}

export async function getReviewCount(product_id: string) {
    try {
        const response = await axios.get(`${BACKEND_URL}/custom/review/count`, {
            params: { product_id: product_id },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching review count:', error);
    }
}

export async function updateProductReview(
    product_id: string,
    review: string,
    rating: number,
    customer_id: string,
    order_id: string
) {
    try {
        const response = await axios.put(
            `${BACKEND_URL}/custom/review`,
            {
                product_id: product_id,
                review_updates: review,
                rating_updates: rating,
                customer_id: customer_id,
                order_id: order_id,
            },
            {
                headers: {
                    authorization: cookies().get('_medusa_jwt')?.value,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating product review:', error);
    }
}

export async function getInventoryCount(variant_id: string) {
    try {
        const response = await axios.post(
            `${BACKEND_URL}/custom/variant/count`,
            {
                variant_id: variant_id,
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching inventory count:', error);
    }
}

export async function getStore(product_id: string) {
    try {
        const response = await axios.get(`${BACKEND_URL}/custom/store`, {
            params: {
                product_id,
            },
            headers: {
                authorization: cookies().get('_medusa_jwt')?.value,
            },

            maxContentLength: 50 * 1024 * 500,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching store:', error);
    }
}

export async function getStoreIdByName(store_name: string) {
    try {
        const response = await axios.get(`${BACKEND_URL}/custom/store/id`, {
            params: { store_name },
        });

        if (response.data && response.data.id) {
            return response.data.id;
        } else {
            console.error(`No store found with the name ${store_name}`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching store ID for ${store_name}:`, error);
        return null;
    }
}

export async function setCurrency(newCurrency: string, customer_id: string) {
    try {
        await axios.put(
            `${BACKEND_URL}/custom/customer/preferred-currency`,
            {
                customer_id: customer_id,
                preferred_currency: newCurrency,
            },
            {
                headers: {
                    authorization: cookies().get('_medusa_jwt')?.value,
                },
            }
        );
    } catch (error) {
        console.error('Error updating currency', error);
    }
}

export async function getStoreProducts(store_id: string) {
    try {
        const response = await axios.get(
            `${BACKEND_URL}/custom/store/products`,
            {
                params: { store_id: store_id },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching vendor products:', error);
    }
}

export async function getStoreReviews(store_id: string) {
    try {
        const response = await axios.get(
            `${BACKEND_URL}/custom/store/reviews`,
            {
                params: { store_id: store_id },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching vendor reviews:', error);
    }
}

export async function getCheckoutData(cart_id: string) {
    const response = await axios.get(`${BACKEND_URL}/custom/checkout`, {
        params: {
            cart_id,
        },
        headers: {
            authorization: cookies().get('_medusa_jwt')?.value,
        },
    });
    return response.status == 200 && response.data ? response.data : {};
}

export async function finalizeCheckout(
    cart_id: string,
    transaction_id: string,
    payer_address: string,
    escrow_contract_address: string
    //cart_products: any
) {
    const response = await axios.post(
        `${BACKEND_URL}/custom/checkout`,
        {
            //cart_products: JSON.stringify(cart_products ?? {}),
            cart_id,
            transaction_id,
            payer_address,
            escrow_contract_address,
        },
        {
            headers: {
                authorization: cookies().get('_medusa_jwt')?.value,
            },
        }
    );

    return response?.data;
}

// Cart actions
export async function createCart(data = {}) {
    const headers = getMedusaHeaders(['cart']);

    return medusaClient.carts
        .create(data, headers)
        .then(({ cart }) => cart)
        .catch((err) => {
            console.log(err);
            return null;
        });
}

export async function updateCart(cartId: string, data: StorePostCartsCartReq) {
    const headers = getMedusaHeaders(['cart']);

    return medusaClient.carts
        .update(cartId, data, headers)
        .then(({ cart }) => cart)
        .catch((error) => medusaError(error));
}

export async function getCart(cartId: string) {
    const headers = getMedusaHeaders(['cart']);

    return medusaClient.carts
        .retrieve(cartId, headers)
        .then(({ cart }) => cart)
        .catch((err) => {
            console.log(err);
            return null;
        });
}

export async function addItem({
    cartId,
    variantId,
    quantity,
    currencyCode,
}: {
    cartId: string;
    variantId: string;
    quantity: number;
    currencyCode: string;
}) {
    const headers = getMedusaHeaders(['cart']);

    return medusaClient.carts.lineItems
        .create(
            cartId,
            { variant_id: variantId, quantity /*currency_code: currencyCode*/ },
            headers
        )
        .then(({ cart }) => cart)
        .catch((err) => {
            console.log(err);
            return null;
        });
}

export async function updateItem({
    cartId,
    lineId,
    quantity,
}: {
    cartId: string;
    lineId: string;
    quantity: number;
}) {
    const headers = getMedusaHeaders(['cart']);

    return medusaClient.carts.lineItems
        .update(cartId, lineId, { quantity }, headers)
        .then(({ cart }) => cart)
        .catch((err) => medusaError(err));
}

export async function removeItem({
    cartId,
    lineId,
}: {
    cartId: string;
    lineId: string;
}) {
    const headers = getMedusaHeaders(['cart']);

    return medusaClient.carts.lineItems
        .delete(cartId, lineId, headers)
        .then(({ cart }) => cart)
        .catch((err) => {
            console.log(err);
            return null;
        });
}

export async function deleteDiscount(cartId: string, code: string) {
    const headers = getMedusaHeaders(['cart']);

    return medusaClient.carts
        .deleteDiscount(cartId, code, headers)
        .then(({ cart }) => cart)
        .catch((err) => {
            console.log(err);
            return null;
        });
}

export async function updatePaymentSession(
    cartId: string,
    paymentSessionId: string | undefined,
    providerId: string
) {
    console.log(
        `updatePaymentSession(${cartId}, ${paymentSessionId}, ${providerId})`
    );
    if (paymentSessionId) {
        try {
            const response = await axios.put(
                `${BACKEND_URL}/custom/payment-session`,
                {
                    cart_id: cartId,
                    payment_session_id: paymentSessionId,
                },
                {
                    headers: {
                        authorization: cookies().get('_medusa_jwt')?.value,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}

export async function createPaymentSessions(
    cartId: string,
    providerId: string = 'crypto'
) {
    console.log(`createPaymentSessions(${cartId})`);
    const headers = getMedusaHeaders(['cart']);
    return medusaClient.carts
        .createPaymentSessions(cartId, headers)
        .then(({ cart }) => {
            updatePaymentSession(cartId, cart?.payment_session?.id, providerId);
            return cart;
        })
        .catch((err) => {
            console.log(err);
            return null;
        });
}

export async function setPaymentSession({
    cartId,
    providerId,
}: {
    cartId: string;
    providerId: string;
}) {
    const headers = getMedusaHeaders(['cart']);
    return (
        medusaClient.carts
            .setPaymentSession(cartId, { provider_id: providerId }, headers)
            //.createPaymentSessions(cartId, { provider_id: providerId })
            .then(({ cart }) => cart)
            .catch((err) => {
                medusaError(err);
            })
    );
}

export async function addDefaultShippingMethod(cart_id: string) {
    try {
        const response = await axios.put(
            `${BACKEND_URL}/custom/cart/shipping`,
            {
                cart_id,
            },
            {
                headers: {
                    authorization: cookies().get('_medusa_jwt')?.value,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating cart shipping:', error);
    }
}

export async function completeCart(cartId: string) {
    const headers = getMedusaHeaders(['cart']);

    return medusaClient.carts
        .complete(cartId, headers)
        .then((res) => res)
        .catch((err) => medusaError(err));
}

export async function clearCart() {
    cookies().delete('_medusa_cart_id');
}

// Order actions
export async function retrieveOrder(id: string) {
    const headers = getMedusaHeaders(['order']);

    return medusaClient.orders
        .retrieve(id, headers)
        .then(({ order }) => order)
        .catch((err) => medusaError(err));
}

// Shipping actions
export async function listShippingMethods(
    regionId: string,
    productIds?: string[]
) {
    const headers = getMedusaHeaders(['shipping']);

    const product_ids = productIds?.join(',');

    return medusaClient.shippingOptions
        .list(
            {
                region_id: regionId,
                product_ids,
            },
            headers
        )
        .then(({ shipping_options }) => shipping_options)
        .catch((err) => {
            console.log(err);
            return null;
        });
}

export async function addShippingMethod({
    cartId,
    shippingMethodId,
}: {
    cartId: string;
    shippingMethodId: string;
}) {
    const headers = getMedusaHeaders(['cart']);

    return medusaClient.carts
        .addShippingMethod(cartId, { option_id: shippingMethodId }, headers)
        .then(({ cart }) => cart)
        .catch((err) => medusaError(err));
}

export async function getToken(credentials: StorePostAuthReqCustom) {
    //set email & password automatically if not provided
    if (!credentials.email || !credentials.email.length)
        credentials.email = `${credentials.wallet_address}@evm.blockchain`;
    if (!credentials.password || !credentials.password.length)
        credentials.password = 'password'; //TODO: (JK) store this default value someplace

    return medusaClient.auth
        .getToken(credentials, {
            next: {
                tags: ['auth'],
            },
        })
        .then(({ access_token }) => {
            //TODO: is the following commented out code needed? (JK)access_token && cookies().set('_medusa_jwt', access_token);
            return access_token;
        })
        .catch((err) => {
            throw new Error('Wrong email or password.');
        });
}

//TODO: (CLEANUP) is this ever called?
export async function authenticate(credentials: StorePostAuthReq) {
    const headers = getMedusaHeaders(['auth']);
    console.log('calling medusa authenticate...');

    return medusaClient.auth
        .authenticate(credentials, headers)
        .then(({ customer }) => customer)
        .catch((err) => medusaError(err));
}

export async function getSession() {
    const headers = getMedusaHeaders(['auth']);

    return medusaClient.auth
        .getSession(headers)
        .then(({ customer }) => customer)
        .catch((err) => medusaError(err));
}

// Customer actions
export async function getHamzaCustomer(includeAddresses: boolean = true) {
    const headers = getMedusaHeaders(['customer']);
    const token: any = decode(cookies().get('_medusa_jwt')?.value ?? '') ?? {
        customer_id: '',
    };
    const customer_id: string = token?.customer_id ?? '';
    console.log(headers);

    try {
        const response = await axios.get(`${BACKEND_URL}/custom/customer`, {
            params: {
                customer_id: customer_id,
                include_addresses: includeAddresses ? 'true' : 'false',
            },
            headers: {
                authorization: cookies().get('_medusa_jwt')?.value,
            },
        });

        console.log('AUTH CUSTOMER RESPONSE STATUS IS ', response.status);
        return response.status == 200 && response.data ? response.data : {};
    } catch (e) {
        try {
            cookies().set('_medusa_jwt', '', {
                maxAge: -1,
            });
        } catch (e) {
            console.error(e);
        }
        console.log(e);
        return null;
    }
}

// Customer actions
export async function getCustomer() {
    const headers = getMedusaHeaders(['customer']);

    return medusaClient.customers
        .retrieve(headers)
        .then(({ customer }) => customer)
        .catch((err) => {
            try {
                cookies().set('_medusa_jwt', '', {
                    maxAge: -1,
                });
            } catch (e) {
                console.error(e);
            }
            return null;
        });
}

declare class StorePostCustomersReqCustom {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone?: string;
    wallet_address: string;
}

export async function createCustomer(data: StorePostCustomersReqCustom) {
    const headers = getMedusaHeaders(['customer']);

    return medusaClient.customers
        .create(data, headers)
        .then(({ customer }) => customer)
        .catch((err) => medusaError(err));
}

export async function updateCustomer(data: StorePostCustomersCustomerReq) {
    const headers = getMedusaHeaders(['customer']);

    return medusaClient.customers
        .update(data, headers)
        .then(({ customer }) => customer)
        .catch((err) => medusaError(err));
}

export async function addShippingAddress(
    data: StorePostCustomersCustomerAddressesReq
) {
    const headers = getMedusaHeaders(['customer']);

    return medusaClient.customers.addresses
        .addAddress(data, headers)
        .then(({ customer }) => customer)
        .catch((err) => medusaError(err));
}

export async function deleteShippingAddress(addressId: string) {
    const headers = getMedusaHeaders(['customer']);

    return medusaClient.customers.addresses
        .deleteAddress(addressId, headers)
        .then(({ customer }) => customer)
        .catch((err) => medusaError(err));
}

export async function updateShippingAddress(
    addressId: string,
    data: StorePostCustomersCustomerAddressesAddressReq
) {
    const headers = getMedusaHeaders(['customer']);

    return medusaClient.customers.addresses
        .updateAddress(addressId, data, headers)
        .then(({ customer }) => customer)
        .catch((err) => medusaError(err));
}

export async function listCustomerOrders(
    limit: number = 10,
    offset: number = 0
) {
    const headers = getMedusaHeaders(['customer']);

    return medusaClient.customers
        .listOrders({ limit, offset }, headers)
        .then(({ orders }) => orders)
        .catch((err) => medusaError(err));
}

// Region actions
export async function listRegions() {
    return medusaClient.regions
        .list()
        .then(({ regions }) => regions)
        .catch((err) => {
            console.log(err);
            return null;
        });
}

export async function retrieveRegion(id: string) {
    const headers = getMedusaHeaders(['regions']);

    return medusaClient.regions
        .retrieve(id, headers)
        .then(({ region }) => region)
        .catch((err) => medusaError(err));
}

const regionMap = new Map<string, Region>();

export const getRegion = cache(async function (countryCode: string) {
    try {
        if (regionMap.has(countryCode)) {
            return regionMap.get(countryCode);
        }

        const regions = await listRegions();

        if (!regions) {
            return null;
        }

        regions.forEach((region) => {
            region.countries.forEach((c) => {
                regionMap.set(c.iso_2, region);
            });
        });

        const region = countryCode
            ? regionMap.get(countryCode)
            : regionMap.get('us');

        return region;
    } catch (e: any) {
        console.log(e.toString());
        return null;
    }
});

// Product actions
export async function getProductsById({
    ids,
    regionId,
}: {
    ids: string[];
    regionId: string;
}) {
    const headers = getMedusaHeaders(['products']);

    return medusaClient.products
        .list({ id: ids, region_id: regionId }, headers)
        .then(({ products }) => products)
        .catch((err) => {
            console.log(err);
            return null;
        });
}

export async function retrievePricedProductById({
    id,
    regionId,
}: {
    id: string;
    regionId: string;
}) {
    const headers = getMedusaHeaders(['products']);

    return medusaClient.products
        .retrieve(`${id}`, headers)
        .then(({ product }) => product)
        .catch((err) => {
            console.log(err);
            return null;
        });
}

export async function getProductByHandle(
    handle: string
): Promise<{ product: PricedProduct }> {
    const headers = getMedusaHeaders(['products']);

    const product = await medusaClient.products
        .list({ handle }, headers)
        .then(({ products }) => products[0])
        .catch((err) => {
            throw err;
        });

    return { product };
}

export async function getProductsList({
    pageParam = 0,
    queryParams,
    countryCode,
}: {
    pageParam?: number;
    queryParams?: StoreGetProductsParams;
    countryCode: string;
}): Promise<{
    response: { products: ProductPreviewType[]; count: number };
    nextPage: number | null;
    queryParams?: StoreGetProductsParams;
}> {
    const limit = queryParams?.limit || 12;

    const region = await getRegion(countryCode);

    if (!region) {
        return emptyResponse;
    }

    const { products, count } = await medusaClient.products
        .list(
            {
                limit,
                offset: pageParam,
                // region_id: region.id,
                ...queryParams,
            },
            { next: { tags: ['products'] } }
        )
        .then((res) => res)
        .catch((err) => {
            throw err;
        });

    const transformedProducts = products.map((product) => {
        return transformProductPreview(product, region!);
    });

    const nextPage = count > pageParam + 1 ? pageParam + 1 : null;

    return {
        response: { products: transformedProducts, count },
        nextPage,
        queryParams,
    };
}

export async function getProductsListWithSort({
    page = 0,
    queryParams,
    sortBy = 'created_at',
    countryCode,
}: {
    page?: number;
    queryParams?: StoreGetProductsParams;
    sortBy?: SortOptions;
    countryCode: string;
}): Promise<{
    response: { products: ProductPreviewType[]; count: number };
    nextPage: number | null;
    queryParams?: StoreGetProductsParams;
}> {
    const limit = queryParams?.limit || 12;

    const {
        response: { products, count },
    } = await getProductsList({
        pageParam: 0,
        queryParams: {
            ...queryParams,
            limit: 100,
        },
        countryCode,
    });

    const sortedProducts = sortProducts(products, sortBy);

    const pageParam = (page - 1) * limit;

    const nextPage = count > pageParam + limit ? pageParam + limit : null;

    const paginatedProducts = sortedProducts.slice(
        pageParam,
        pageParam + limit
    );

    return {
        response: {
            products: paginatedProducts,
            count,
        },
        nextPage,
        queryParams,
    };
}

export async function getHomepageProducts({
    collectionHandles,
    currencyCode,
    countryCode,
}: {
    collectionHandles?: string[];
    currencyCode: string;
    countryCode: string;
}) {
    const collectionProductsMap = new Map<string, ProductPreviewType[]>();

    const { collections } = await getCollectionsList(0, 3);

    if (!collectionHandles) {
        collectionHandles = collections.map((collection) => collection.handle);
    }

    for (const handle of collectionHandles) {
        const products = await getProductsByCollectionHandle({
            handle,
            currencyCode,
            countryCode,
            limit: 3,
        });
        collectionProductsMap.set(handle, products.response.products);
    }

    return collectionProductsMap;
}

// Collection actions
export async function retrieveCollection(id: string) {
    return medusaClient.collections
        .retrieve(id, {
            next: {
                tags: ['collections'],
            },
        })
        .then(({ collection }) => collection)
        .catch((err) => {
            throw err;
        });
}

export async function getCollectionsList(
    offset: number = 0,
    limit: number = 100
): Promise<{ collections: ProductCollection[]; count: number }> {
    const collections = await medusaClient.collections
        .list({ limit, offset }, { next: { tags: ['collections'] } })
        .then(({ collections }) => collections)
        .catch((err) => {
            throw err;
        });

    const count = collections.length;

    return {
        collections,
        count,
    };
}

export async function getCollectionByHandle(
    handle: string
): Promise<ProductCollection> {
    const collection = await medusaClient.collections
        .list({ handle: [handle] }, { next: { tags: ['collections'] } })
        .then(({ collections }) => collections[0])
        .catch((err) => {
            throw err;
        });

    return collection;
}

export async function getProductsByCollectionHandle({
    pageParam = 0,
    limit = 100,
    handle,
    countryCode,
}: {
    pageParam?: number;
    handle: string;
    limit?: number;
    countryCode: string;
    currencyCode?: string;
}): Promise<{
    response: { products: ProductPreviewType[]; count: number };
    nextPage: number | null;
}> {
    const { id } = await getCollectionByHandle(handle).then(
        (collection) => collection
    );

    const { response, nextPage } = await getProductsList({
        pageParam,
        queryParams: { collection_id: [id], limit },
        countryCode,
    })
        .then((res) => res)
        .catch((err) => {
            throw err;
        });

    return {
        response,
        nextPage,
    };
}

// Category actions
export async function listCategories() {
    const headers = {
        next: {
            tags: ['collections'],
        },
    } as Record<string, any>;

    return medusaClient.productCategories
        .list({ expand: 'category_children' }, headers)
        .then(({ product_categories }) => product_categories)
        .catch((err) => {
            throw err;
        });
}

export async function getCategoriesList(
    offset: number = 0,
    limit: number = 100
): Promise<{
    product_categories: ProductCategoryWithChildren[];
    count: number;
}> {
    const { product_categories, count } = await medusaClient.productCategories
        .list({ limit, offset }, { next: { tags: ['categories'] } })
        .catch((err) => {
            throw err;
        });

    return {
        product_categories,
        count,
    };
}

export async function getCategoryByHandle(categoryHandle: string[]): Promise<{
    product_categories: ProductCategoryWithChildren[];
}> {
    const handles = categoryHandle.map((handle: string, index: number) =>
        categoryHandle.slice(0, index + 1).join('/')
    );

    const product_categories = [] as ProductCategoryWithChildren[];

    for (const handle of handles) {
        const category = await medusaClient.productCategories
            .list(
                {
                    handle: handle,
                },
                {
                    next: {
                        tags: ['categories'],
                    },
                }
            )
            .then(({ product_categories: { [0]: category } }) => category)
            .catch((err) => {
                return {} as ProductCategory;
            });

        product_categories.push(category);
    }

    return {
        product_categories,
    };
}

export async function getProductsByCategoryHandle({
    pageParam = 0,
    handle,
    countryCode,
}: {
    pageParam?: number;
    handle: string;
    countryCode: string;
    currencyCode?: string;
}): Promise<{
    response: { products: ProductPreviewType[]; count: number };
    nextPage: number | null;
}> {
    const { id } = await getCategoryByHandle([handle]).then(
        (res) => res.product_categories[0]
    );

    const { response, nextPage } = await getProductsList({
        pageParam,
        queryParams: { category_id: [id] },
        countryCode,
    })
        .then((res) => res)
        .catch((err) => {
            throw err;
        });

    return {
        response,
        nextPage,
    };
}
