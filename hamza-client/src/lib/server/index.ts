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
    Order,
    Cart,
    Address,
} from '@medusajs/medusa';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { cache } from 'react';
import { decode } from 'jsonwebtoken';
import sortProducts from '@lib/util/sort-products';
import transformProductPreview from '@lib/util/transform-product-preview';
import { SortOptions } from '@modules/shop/components/refinement-list/sort-products';
import {
    ProductCategoryWithChildren,
    ProductPreviewType,
    DiscountValidationResult,
    FeaturedStoresResponse,
} from '@/types/global';
import { medusaClient } from '../config/config';
import medusaError from '@lib/util/medusa-error';
import axios from 'axios';
import { cookies } from 'next/headers';
import { EscrowStatus } from './enums';

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

async function axiosCall(
    verb: 'get' | 'post' | 'patch' | 'put' | 'delete',
    path: string,
    payload: any,
    requiresSecurity: boolean = false,
    returnRaw: boolean = false
): Promise<any> {
    try {
        console.log(
            `calling ${verb.toUpperCase()} ${path} ${payload ? JSON.stringify(payload) : ''}`
        );
        let url = path;
        if (!url.startsWith('/')) url = '/' + url;
        url = `${BACKEND_URL}${url}`;

        let config: any = {
            cache: false,
            headers: { 'Cache-Control': 'no-cache, no-store' },
        };
        if (requiresSecurity) {
            config.headers.authorization = cookies().get('_medusa_jwt')?.value;
        }

        let response = { data: undefined };
        switch (verb) {
            case 'get':
                {
                    const input: any = {};
                    if (payload) input.params = payload;
                    if (requiresSecurity) input.headers = config?.headers;
                    if (!input.cache) {
                        input.cache = false;
                    }

                    response = await axios.get(url, input);
                }
                break;
            case 'delete':
                {
                    const input: any = {};
                    if (payload) input.data = payload;
                    if (requiresSecurity) input.headers = config?.headers;
                    if (!input.cache) {
                        input.cache = false;
                    }

                    response = await axios.delete(url, input);
                }
                break;
            case 'put':
                response = await axios.put(url, payload, config);
                break;
            case 'post':
                response = await axios.post(url, payload, config);
                break;
            case 'patch':
                response = await axios.patch(url, payload, config);
                break;
        }

        if (returnRaw) {
            console.log(response);
        }
        return returnRaw ? response : response.data;
    } catch (error: any) {
        console.error(
            `${verb.toUpperCase()} ${path} ${JSON.stringify(payload) ?? ''} error: `,
            error
        );
        //return returnRaw ? error : error.data;
    }
}

export async function get(
    url: string,
    params: any = null,
    requiresSecurity: boolean = false,
    returnRaw: boolean = false
): Promise<any> {
    return axiosCall('get', url, params, requiresSecurity, returnRaw);
}

async function post(
    url: string,
    payload: any,
    requiresSecurity: boolean = false,
    returnRaw: boolean = false
): Promise<any> {
    return axiosCall('post', url, payload, requiresSecurity, returnRaw);
}

async function put(
    url: string,
    payload: any,
    requiresSecurity: boolean = false,
    returnRaw: boolean = false
): Promise<any> {
    return axiosCall('put', url, payload, requiresSecurity, returnRaw);
}

async function del(
    url: string,
    payload: any,
    requiresSecurity: boolean = false,
    returnRaw: boolean = false
): Promise<any> {
    return axiosCall('delete', url, payload, requiresSecurity, returnRaw);
}

async function patch(
    url: string,
    payload: any,
    requiresSecurity: boolean = false,
    returnRaw: boolean = false
): Promise<any> {
    return axiosCall('patch', url, payload, requiresSecurity, returnRaw);
}

async function getSecure(url: string, params: any, returnRaw: boolean = false) {
    return get(url, params, true, returnRaw);
}

async function postSecure(
    url: string,
    payload: any,
    returnRaw: boolean = false
) {
    return post(url, payload, true, returnRaw);
}

async function putSecure(
    url: string,
    payload: any,
    returnRaw: boolean = false
) {
    return put(url, payload, true, returnRaw);
}

async function delSecure(
    url: string,
    payload: any,
    returnRaw: boolean = false
) {
    return del(url, payload, true, returnRaw);
}

async function patchSecure(
    url: string,
    payload: any,
    returnRaw: boolean = false
) {
    return patch(url, payload, true, returnRaw);
}

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
    //headers.cache = false;
    headers['Cache-Control'] = 'no-cache, no-store';

    return headers;
};

// Get Vendors
export async function getStores() {
    return get('/custom/store');
}

// Get Vendor Store by slug
export async function getStoreBySlug(store_handle: string) {
    return get('/custom/store', {
        store_handle,
    });
}

//

// Set a review
export async function createReview(data: any) {
    return postSecure('/custom/review', data);
}

// Get Wishlist
export async function getWishlist(customer_id: string) {
    return getSecure('/custom/wishlist', {
        customer_id,
    });
}

// Get all home products by default
export async function getAllProducts(
    categorySelect: string[] | null = ['all'],
    priceHigh: number = 5000000,
    priceLow: number = 0,
    currencyCode: string = 'usdc',
    limit: number = 24,
    offset: number = 0
) {
    const categoryString =
        categorySelect && categorySelect.length > 0
            ? categorySelect.length === 1
                ? categorySelect[0]
                : categorySelect.join(',')
            : '';

    return getSecure('/custom/product/filter', {
        category_handles: categoryString,
        price_hi: priceHigh,
        price_lo: priceLow,
        currency_code: currencyCode,
        limit,
        offset,
    });
}

// DELETE Wishlist Item
export async function deleteWishlistItem(
    customer_id: string,
    product_id: string
) {
    return delSecure('/custom/wishlist/item', {
        customer_id,
        product_id,
    });
}

// get product terms
export async function getProductTermsByProductHandle(handle: string) {
    const product_terms = await get('/custom/product/terms', {
        handle: handle,
    });

    return product_terms;
}

// Get Vendor Products
export async function getProductsByStoreName(storeName: string) {
    return get('/custom/store/products', {
        store_name: storeName,
    });
}

// Get All Vendor Products
export async function getAllVendorProducts() {
    return get('/store/products');
}

//Get product collection for hero slider
export async function getProductCollection() {
    return get('/custom/product/hero-collection');
}

// Get All Store Names
export async function getAllStoreNames() {
    return get('/custom/store/name');
}

// Get All Product reviews
// TODO: There's no reason to await getSecure, we're returning a promise anyways and we're adding more things
// to the event loop for no reason
export async function getAllProductReviews(customer_id: string) {
    return getSecure('/custom/review', { customer_id });
}

export async function checkReviewsExistence(order_id: string) {
    return get('/custom/review', { order_id: order_id });
}

export async function checkCustomerReviewExistence(
    order_id: string,
    variant_id: string
) {
    return getSecure('/custom/review/existing', {
        order_id: order_id,
        variant_id: variant_id,
    });
}

export async function getStoreCategories(store_name: string) {
    return get('/custom/store/categories', { store_name });
}

export async function verifyToken(token: string) {
    return getSecure('/custom/confirmation-token/verify', { token });
}

//TODO: rename? cause it's not really clear what this does
export async function getOrderSummary(cart_id: string) {
    return get('/custom/order/order-summary', { cart_id });
}

export async function allReviews(product_id: string) {
    return getSecure('/custom/review', { product_id });
}

export async function getNotifications(customer_id: string) {
    const response: any = getSecure('/custom/customer/notification', {
        customer_id,
    });
    return response;
}

export async function getServerConfig() {
    return get('/custom/config');
}

export async function deleteNotifications(customer_id: string) {
    return delSecure('/custom/customer/notification', {
        customer_id: customer_id,
        notification_type: 'none',
    });
}

export async function cancelOrderCart(cart_id: string) {
    return postSecure('/custom/cart/cancel', { cart_id });
}

export async function verifyEmail(
    customer_id: string,
    email: string,
    returnRaw: boolean = false
) {
    return postSecure(
        '/custom/confirmation-token/generate',
        {
            customer_id,
            email,
        },
        returnRaw
    );
}

export async function addNotifications(
    customer_id: string,
    notification_type: string
) {
    return postSecure('/custom/customer/notification', {
        customer_id: customer_id,
        notification_type: notification_type,
    });
}

export async function getOrderInformation(cart_id: string) {
    return getSecure('/custom/order', {
        cart_id,
    });
}

export async function getOrderBuckets(customer_id: string) {
    const response = await getSecure('/custom/order/customer-orders', {
        customer_id,
        buckets: true,
    });
    return response.orders;
}

//TODO: why is bucket a number?
export async function getSingleBucket(
    customer_id: string,
    bucket: number,
    cart_id?: string
) {
    const response = await getSecure('/custom/order/customer-order', {
        customer_id,
        bucket,
        cart_id,
    });
    return response.orders;
}

export async function getNotReviewedOrders(customer_id: string) {
    return getSecure('/custom/review/not-reviewed', {
        customer_id: customer_id,
    });
}

export async function getOrderStatus(order_id: string) {
    return getSecure('/custom/order/status', {
        order_id: order_id,
    });
}

export async function updateOrderEscrowStatus(
    order_id: string,
    escrow_status: EscrowStatus,
    metadata: any
): Promise<Order> {
    return putSecure('/custom/order/status', {
        order_id: order_id,
        escrow_status: escrow_status,
        metadata: metadata,
    });
}

export async function getEscrowPaymentData(order_id: string) {
    return getSecure('/custom/order/escrow', { order_id });
}

export async function releaseOrderEscrow(order_id: string) {
    return putSecure('/custom/order/escrow', { order_id });
}

export async function cancelOrder(order_id: string, cancel_reason: string) {
    return putSecure('/custom/order/cancel', { order_id, cancel_reason });
}

export async function putOAuth(code: string, type: string) {
    return putSecure('/custom/oauth', { code, type });
}

export async function getVerificationStatus(customer_id: string) {
    return getSecure('/custom/customer/verification-status', {
        customer_id,
    });
}

export async function getAverageRatings(product_id: string) {
    return get('/custom/review/average', { product_id });
}

export async function getReviewCount(product_id: string) {
    return get('/custom/review/count', { product_id });
}

export async function updateProductReview(
    product_id: string,
    review: string,
    rating: number,
    customer_id: string,
    order_id: string
) {
    return putSecure('/custom/review', {
        product_id: product_id,
        review_updates: review,
        rating_updates: rating,
        customer_id: customer_id,
        order_id: order_id,
    });
}

export async function getInventoryCount(variant_id: string) {
    return get('/custom/variant/count', { variant_id });
}

export async function getStore(product_id: string) {
    return getSecure('/custom/store', { product_id });
}

export async function getStoreIdByName(store_name: string) {
    const response = await get('/custom/store/id', { store_name });
    return response.id;
}

export async function setCurrency(
    preferred_currency: string,
    customer_id: string
) {
    return putSecure('/custom/customer/preferred-currency', {
        customer_id,
        preferred_currency,
    });
}

export async function getStoreProducts(store_id: string) {
    return get('/custom/store/products', {
        store_id,
    });
}

export async function getStoreReviews(store_id: string) {
    return get('/custom/store/reviews', {
        store_id,
    });
}

export async function getPaymentData(cart_id: string) {
    return getSecure('/custom/checkout/payment', {
        cart_id,
    });
}

export async function getCheckoutData(cart_id: string) {
    return getSecure('/custom/checkout', {
        cart_id,
    });
}

export async function finalizeCheckout(
    cart_id: string,
    transaction_id: string,
    payer_address: string,
    chain_id: number,
    returnRaw: boolean = false
) {
    return postSecure(
        '/custom/checkout',
        {
            cart_id,
            transaction_id,
            payer_address,
            chain_id,
        },
        returnRaw
    );
}

export async function getCartEmail(cart_id: string) {
    return getSecure('/custom/cart/email', { cart_id });
}

export async function setCartEmail(cart_id: string, email_address: string) {
    return putSecure('/custom/cart/email', { cart_id, email_address });
}

export async function recoverCart(customer_id: string) {
    const cart_id = cookies().get('_medusa_cart_id')?.value;
    const output = await getSecure('/custom/cart/recover', {
        customer_id,
        cart_id,
    });
    if (output?.cart) {
        cookies().set('_medusa_cart_id', output.cart.id);
    }
    return output?.cart;
}

// Cart actions
export async function createCart(data = {}) {
    const headers = getMedusaHeaders(['cart']);

    return postSecure('/custom/cart', { data });
}

export async function updateCart(cartId: string, data: StorePostCartsCartReq) {
    const headers = getMedusaHeaders(['cart']);

    return medusaClient.carts
        .update(cartId, data, headers)
        .then(({ cart }) => cart)
        .catch((error) => medusaError(error));
}

export async function getCart(cart_id: string) {
    const token = cookies().get('_medusa_jwt')?.value;

    //if we have a token, it's safe to get the possibly-cached cart
    if (token?.length) {
        const headers = getMedusaHeaders(['cart']);
        return medusaClient.carts
            .retrieve(cart_id, headers)
            .then(({ cart }) => cart)
            .catch((err) => {
                console.log(err);
                return null;
            });
    }

    //otherwise, play it safe and get the definitely non-cached
    return getSecure('/custom/cart', { cart_id });
}

export async function addItem({
    cartId,
    variantId,
    quantity,
}: {
    cartId: string;
    variantId: string;
    quantity: number;
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

export async function updateShippingCost(cart_id: string) {
    console.log(`TRIGGER update shipping cost`);
    try {
        const response = await getSecure('/custom/cart/shipping', {
            cart_id,
        });
        const shippingCost = response?.amount ?? 0;
        return {
            cost: shippingCost, // Return shipping cost for further use if needed
            cart: response.cart,
        };
    } catch (error) {
        console.error('Error updating shipping cost:', error);
        return 0; // Return a default value or handle the error as needed
    }
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
    if (paymentSessionId) {
        return putSecure('/custom/payment-session', {
            cart_id: cartId,
            payment_session_id: paymentSessionId,
        });
    }
}

export async function addDefaultShippingMethod(
    cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>
) {
    // Return early if cart is missing required data
    if (!cart?.customer_id || !cart?.shipping_address) {
        return null;
    }

    // Return early if cart already has shipping methods
    if (cart?.shipping_methods && cart?.shipping_methods.length > 0) {
        return null;
    }

    // Add default shipping method
    return putSecure('/custom/cart/shipping', {
        cart_id: cart.id,
    });
}

export async function getShippingMethods(cart_id: string) {
    const cart = await getCart(cart_id);
    if (!cart) return null;
    if (!cart.shipping_methods) return null;
    return cart.shipping_methods;
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

export async function getCartShippingCost() {
    const cart_id = cookies().get('_medusa_cart_id')?.value;
    return getSecure('/custom/cart/shipping', {
        cart_id,
    });
}

export async function getCartCompletedOrders(cart_id: string) {
    return getSecure('/custom/cart/complete', {
        cart_id,
    });
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
    let response = null;

    if (customer_id?.length) {
        response = await getSecure('/custom/customer', {
            customer_id,
            include_addresses: includeAddresses ? 'true' : 'false',
        });
    }

    return response ?? {};
}

export async function getNonSecureCustomer(includedAddresses: boolean = true) {
    const token: any = decode(cookies().get('_medusa_jwt')?.value ?? '') ?? {
        customer_id: '',
    };
    const customer_id: string = token?.customer_id ?? '';
    return get('/custom/customer', {
        customer_id,
        include_addresses: includedAddresses ? 'true' : 'false',
    });
}

export async function clearAuthCookie() {
    try {
        cookies().set('_medusa_jwt', '', {
            maxAge: -1,
        });
    } catch (e) {
        console.error(e);
    }
}

export async function clearCartCookie() {
    try {
        cookies().set('_medusa_cart_id', '', {
            maxAge: -1,
        });
    } catch (e) {
        console.error(e);
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

export async function getCustomerOrder(customer_id: string, order_id: string) {
    const orders = await postSecure('/custom/order', {
        customer_id: customer_id,
        order_id: order_id,
    });
    return orders[0];
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
            : regionMap.get('en');

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
        .then(async ({ products }) => {
            // Fetch store data for each product
            const productsWithStores = await Promise.all(
                products.map(async (product) => {
                    try {
                        if (product.id) {
                            const storeData = await getStore(product.id);
                            return {
                                ...product,
                                store: storeData,
                            };
                        } else {
                            return {
                                ...product,
                                store: null,
                            };
                        }
                    } catch (error) {
                        console.log(
                            `Error fetching store for product ${product.id}:`,
                            error
                        );
                        return {
                            ...product,
                            store: null,
                        };
                    }
                })
            );
            return productsWithStores;
        })
        .catch((err) => {
            console.log(err);
            return null;
        });
}

export const getPricedProductByHandle = async (
    handle: string,
    region: Region
) => {
    const { product } = await getProductByHandle(handle).then(
        (product) => product
    );
    if (!product || !product.id) return null;

    const pricedProduct = await retrievePricedProductById({
        id: product.id,
        regionId: region.id,
    });

    return pricedProduct;
};

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
            { next: { revalidate: 300, tags: ['products'] } }
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
        .list(
            { limit, offset },
            { next: { revalidate: 300, tags: ['collections'] } }
        )
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

export async function setBestShippingAddress(
    cart: Cart
): Promise<Address | null> {
    const token = cookies().get('_medusa_jwt')?.value;

    if (!token) {
        return null;
    }

    // updates cart to use the best shipping address if non was set
    const address: Address = await putSecure('/custom/cart/shipping/best', {
        cart_id: cart.id,
    });

    return address ?? null;
}

export async function validateDiscountUsage(code: string): Promise<DiscountValidationResult> {
    try {
        const response = await get('/custom/discount/validate', { code });
        return response;
    } catch (error: any) {
        console.error('Error validating discount usage:', error);
        throw error;
    }
}

export async function cancelPayments(paymentAddress: string, orderIds: string[], cartId: string) {
    return putSecure('/custom/checkout/payment/cancel', {
        payment_address: paymentAddress,
        order_ids: orderIds,
        cart_id: cartId,
    });
}

export async function getFeaturedStores(
    categoryHandles?: string[]
): Promise<FeaturedStoresResponse> {
    try {
        let queryParams = {};

        if (categoryHandles && categoryHandles.length > 0) {
            queryParams = { category: categoryHandles.join(',') };
        }
        const response: FeaturedStoresResponse = await get(
            '/custom/store/featured',
            queryParams
        );
        console.log('Featured stores response:', response);
        return response;
    } catch (error) {
        console.error('Error fetching featured stores:', error);
        return { stores: [] };
    }
}