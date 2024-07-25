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

import sortProducts from '@lib/util/sort-products';
import transformProductPreview from '@lib/util/transform-product-preview';
import { SortOptions } from '@modules/store/components/refinement-list/sort-products';
import { ProductCategoryWithChildren, ProductPreviewType } from 'types/global';
import { medusaClient } from '../config';
import medusaError from '@lib/util/medusa-error';
import axios from 'axios';

//TODO: is the following commented out code needed? (JK)
// We need this or it changes the whole architecture
import { cookies } from 'next/headers';
import { signOut } from '@modules/account/actions';

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
export async function getVendors() {
    try {
        const response = await axios.get(`${BACKEND_URL}/custom/vendors`);
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// Get Vendor Store by slug
export async function getVendorStoreBySlug(store_name: string) {
    try {
        const response = await axios.post(
            `${BACKEND_URL}/custom/vendors/vendor-store`,
            {
                params: {
                    store_name: store_name,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// Set a review
export async function createReview(data: any) {
    try {
        const response = await axios.post(`${BACKEND_URL}/custom/review`, data);
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// Get Vendor Products
export async function getProductsByVendor(vendorName: string) {
    try {
        const response = await axios.get(
            `${BACKEND_URL}/custom/store/products?store_name=${vendorName}`
        );
        return response.data.products;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// Get All Product reviews
export async function getAllProductReviews(customer_id: string) {
    try {
        const response = await axios.post(
            `${BACKEND_URL}/custom/review/all-customer-reviews`,
            { customer_id: customer_id },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
}

export async function checkReviewsExistence(order_id: string) {
    try {
        const response = await axios.post(
            `${BACKEND_URL}/custom/review/exists`,
            {
                order_id: order_id,
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
}

export async function allReviews(product_id: string) {
    try {
        const response = await axios.post(
            `${BACKEND_URL}/custom/review/all-reviews`,
            {
                product_id: product_id,
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
}

export async function getNotifications(customer_id: string) {
    try {
        const response = await axios.post(
            `${BACKEND_URL}/custom/notification/get`,
            { customer_id: customer_id },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data.types;
    } catch (error) {
        console.error('Error fetching notification preferences:', error);
    }
}

export async function removeNotifications(customer_id: string) {
    try {
        const response = await axios.delete(
            `${BACKEND_URL}/custom/notification/remove`,
            {
                headers: {
                    'Content-Type': 'application/json',
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

export async function addNotifications(
    customer_id: string,
    notification_type: string
) {
    try {
        const response = await axios.post(
            `${BACKEND_URL}/custom/notification/add`,
            {
                customer_id: customer_id,
                notification_type: notification_type,
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error adding notification preferences:', error);
    }
}

export async function orderInformation(cart_id: string) {
    try {
        const response = await axios.post(`${BACKEND_URL}/custom/order`, {
            cart_id: cart_id,
        });
        return response;
    } catch (error) {
        console.error('Error fetching order information:', error);
    }
}

export async function orderDetails(customer_id: string) {
    try {
        const response = await axios.post(
            `${BACKEND_URL}/custom/order/customer-orders`,
            {
                customer_id: customer_id,
            }
        );
        return response.data.orders.orders;
    } catch (error) {
        console.error('Error fetching order details:', error);
    }
}

export async function orderBucket(customer_id: string) {
    try {
        const response = await axios.get(
            `${BACKEND_URL}/custom/order/customer-orders`,
            {
                params: {
                    customer_id: customer_id,
                    buckets: true,
                },
            }
        );
        return response.data.orders;
    } catch (error) {
        console.error('Error fetching order bucket:', error);
    }
}

export async function orderStatus(order_id: string) {
    try {
        const response = await axios.post(
            `${BACKEND_URL}/custom/order/status`,
            {
                order_id: order_id,
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching order status:', error);
        return [];
    }
}

export async function cancelOrder(order_id: string) {
    try {
        const response = await axios.delete(
            `${BACKEND_URL}/custom/order/cancel`,
            {
                params: {
                    order_id: order_id,
                },
            }
        );
        return response;
    } catch (error) {
        console.error('Error cancelling order:', error);
    }
}

export async function averageRatings(product_id: string) {
    try {
        const response = await axios.post(
            `${BACKEND_URL}/custom/review/average`,
            {
                product_id: product_id,
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching average rating:', error);
    }
}

export async function reviewCounter(product_id: string) {
    try {
        const response = await axios.post(
            `${BACKEND_URL}/custom/review/count`,
            {
                product_id: product_id,
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching review count:', error);
    }
}

export async function reviewResponse(product_id: string) {
    try {
        const response = await axios.post(
            `${BACKEND_URL}/custom/review/all-reviews`,
            {
                product_id: product_id,
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching review response:', error);
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
        const response = await axios.post(`${BACKEND_URL}/custom/get-store`, {
            product_id: product_id,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching store name:', error);
    }
}

export async function setCurrency(newCurrency: string, customer_id: string) {
    try {
        await axios.post(`${BACKEND_URL}/custom/update-currency`, {
            customer_id: customer_id,
            preferred_currency: newCurrency,
        });
    } catch (error) {
        console.error('Error updating currency', error);
    }
}

export async function vendorProducts(store_id: string) {
    try {
        const response = await axios.post(
            `${BACKEND_URL}/custom/vendors/vendor-products`,
            {
                store_id: store_id,
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching vendor products:', error);
    }
}

export async function vendorReviews(store_id: string) {
    try {
        const response = await axios.post(
            `${BACKEND_URL}/custom/vendors/vendor-reviews`,
            {
                store_id: store_id,
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching vendor reviews:', error);
    }
}

export async function getStoreName(product_id: string) {
    try {
        const response = await axios.post(`${BACKEND_URL}/custom/get-store`, {
            product_id: product_id,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching store name:', error);
    }
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

export async function createPaymentSessions(cartId: string) {
    const headers = getMedusaHeaders(['cart']);

    return medusaClient.carts
        .createPaymentSessions(cartId, headers)
        .then(({ cart }) => cart)
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

    return medusaClient.carts
        .setPaymentSession(cartId, { provider_id: providerId }, headers)
        .then(({ cart }) => cart)
        .catch((err) => medusaError(err));
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
