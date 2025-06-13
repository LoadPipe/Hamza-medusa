'use server';

import { cookies } from 'next/headers';
import {
    addDefaultShippingMethod,
    addShippingMethod,
    completeCart,
    deleteDiscount,
    getCart,
    setCartEmail,
    setPaymentSession,
    updateCart,
    validateDiscountUsage,
} from '@/lib/server';
import { GiftCard, StorePostCartsCartReq } from '@medusajs/medusa';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { medusaClient } from '@/lib/config/config';
import axios from 'axios';

export async function cartUpdate(data: StorePostCartsCartReq) {
    const cartId = cookies().get('_medusa_cart_id')?.value;

    if (!cartId) return 'No cartId cookie found';

    try {
        await updateCart(cartId, data);
        revalidateTag('cart');
    } catch (error: any) {
        return error.toString();
    }
}

export async function applyDiscount(code: string) {
    const cartId = cookies().get('_medusa_cart_id')?.value;

    if (!cartId) return 'No cartId cookie found';

    try {
        // Validate discount usage limit before applying
        const validationResult = await validateDiscountUsage(code);

        if (validationResult) {
            if (!validationResult.valid) {
                throw new Error(
                    validationResult.message || 'Discount code is invalid'
                );
            }

            // Check usage limit if it exists
            if (
                validationResult.usage_limit !== null &&
                validationResult.usage_count >= validationResult.usage_limit
            ) {
                throw new Error(
                    'This discount code has reached its usage limit and cannot be applied'
                );
            }
        }

        await updateCart(cartId, { discounts: [{ code }] }).then(() => {
            revalidateTag('cart');
        });
    } catch (error: any) {
        throw error;
    }
}

export async function applyGiftCard(code: string) {
    const cartId = cookies().get('_medusa_cart_id')?.value;
    console.log(code);
    if (!cartId) return 'No cartId cookie found';

    try {
        await updateCart(cartId, { gift_cards: [{ code }] }).then(() => {
            revalidateTag('cart');
        });
    } catch (error: any) {
        throw error;
    }
}

export async function removeDiscount(code: string) {
    const cartId = cookies().get('_medusa_cart_id')?.value;

    if (!cartId) return 'No cartId cookie found';

    try {
        await deleteDiscount(cartId, code);
        revalidateTag('cart');
    } catch (error: any) {
        throw error;
    }
}

export async function removeGiftCard(
    codeToRemove: string,
    giftCards: GiftCard[]
) {
    const cartId = cookies().get('_medusa_cart_id')?.value;

    if (!cartId) return 'No cartId cookie found';

    try {
        await updateCart(cartId, {
            gift_cards: [...giftCards]
                .filter((gc) => gc.code !== codeToRemove)
                .map((gc) => ({ code: gc.code })),
        }).then(() => {
            revalidateTag('cart');
        });
    } catch (error: any) {
        throw error;
    }
}

export async function submitDiscountForm(
    currentState: unknown,
    formData: FormData
) {
    const code = formData.get('code') as string;

    try {
        await applyDiscount(code);
        return null;
    } catch (error: any) {
        console.log('Discount application error:', error);
        return error.message || error.toString();
    }
}

export async function setAddresses(formData: FormData) {
    if (!formData) return 'No form data received';

    const cartId = cookies().get('_medusa_cart_id')?.value;

    if (!cartId) return { message: 'No cartId cookie found' };

    const email = formData.get('email') as string;

    const data = {
        shipping_address: {
            first_name: formData.get('shipping_address.first_name'),
            last_name: formData.get('shipping_address.last_name'),
            address_1: formData.get('shipping_address.address_1'),
            address_2: formData.get('shipping_address.address_2'),
            company: formData.get('shipping_address.company'),
            postal_code: formData.get('shipping_address.postal_code'),
            city: formData.get('shipping_address.city'),
            country_code: formData.get('shipping_address.country_code'),
            province: formData.get('shipping_address.province'),
            phone: formData.get('shipping_address.phone'),
        },
    } as StorePostCartsCartReq;

    if (email && email.trim() !== '') {
        data.email = email;
    }

    data.billing_address = data.shipping_address;

    try {
        await updateCart(cartId, data);
        if (data.email) await setCartEmail(cartId, data.email);
        revalidateTag('cart');
    } catch (error: any) {
        return error.toString();
    }

    try {
        await setPaymentMethod('crypto');
    } catch (error: any) {
        return error.toString();
    }
}

export async function setShippingMethod(shippingMethodId: string) {
    const cartId = cookies().get('_medusa_cart_id')?.value;

    if (!cartId) throw new Error('No cartId cookie found');

    try {
        console.log('set shipping method to ', shippingMethodId);
        await addShippingMethod({ cartId, shippingMethodId });
        revalidateTag('cart');
    } catch (error: any) {
        throw error;
    }
}

export async function setPaymentMethod(providerId: string) {
    const cartId = cookies().get('_medusa_cart_id')?.value;

    if (!cartId) throw new Error('No cartId cookie found');
    if (!providerId) throw new Error('No providerId provided');

    console.log(`ProviderID is ${providerId} && cartId is ${cartId}`);
    try {
        const cart = await setPaymentSession({ cartId, providerId });
        revalidateTag('cart');
        return cart;
    } catch (error: any) {
        console.log(error);
        throw error;
    }
}
