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
} from '@lib/data';
import { GiftCard, StorePostCartsCartReq } from '@medusajs/medusa';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { medusaClient } from '@lib/config';
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
        await applyDiscount(code).catch(async (err) => {
            await applyGiftCard(code);
        });
        return null;
    } catch (error: any) {
        return error.toString();
    }
}

export async function setAddresses(currentState: unknown, formData: FormData) {
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
        await addDefaultShippingMethod(cartId);
    } catch (error: any) {
        return error.toString();
    }

    try {
        await setPaymentMethod('crypto');
    } catch (error: any) {
        return error.toString();
    }

    redirect(
        `/${process.env.NEXT_PUBLIC_FORCE_COUNTRY
            ? process.env.NEXT_PUBLIC_FORCE_COUNTRY
            : formData.get('shipping_address.country_code')
        }/checkout?step=review&cart=${cartId}`
    );
}

export async function setAddresses2(formData: FormData) {
    console.log(
        'setAddresses2 called with formData:',
        Array.from(formData.entries())
    );

    if (!formData) {
        console.error('No form data received');
        return 'No form data received';
    }

    const cartId = cookies().get('_medusa_cart_id')?.value;
    console.log('Retrieved cartId:', cartId);

    if (!cartId) {
        console.error('No cartId cookie found');
        return { message: 'No cartId cookie found' };
    }

    const email = formData.get('email') as string;
    console.log('Retrieved email:', email);

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

    console.log('Constructed data object:', data);

    if (email && email.trim() !== '') {
        data.email = email;
        console.log('Email added to data:', data.email);
    }

    data.billing_address = data.shipping_address;
    console.log(
        'Billing address set to shipping address:',
        data.billing_address
    );

    try {
        console.log('Updating cart with cartId and data:', cartId, data);
        await updateCart(cartId, data);
        console.log('Cart updated successfully');

        if (data.email) {
            console.log('Setting cart email with cartId:', cartId);
            await setCartEmail(cartId, data.email);
            console.log('Cart email set successfully');
        }

        console.log('Revalidating cart tag');
        revalidateTag('cart');
    } catch (error: any) {
        console.error(
            'Error during cart update or email setting:',
            error.toString()
        );
        return error.toString();
    }

    try {
        console.log('Adding default shipping method for cartId:', cartId);
        await addDefaultShippingMethod(cartId);
        console.log('Default shipping method added successfully');
    } catch (error: any) {
        console.error(
            'Error during adding default shipping method:',
            error.toString()
        );
        return error.toString();
    }

    try {
        console.log('Setting payment method to crypto for cartId:', cartId);
        await setPaymentMethod('crypto');
        console.log('Payment method set successfully');
    } catch (error: any) {
        console.error('Error during setting payment method:', error.toString());
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
