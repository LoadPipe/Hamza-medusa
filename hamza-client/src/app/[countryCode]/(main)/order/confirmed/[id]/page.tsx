import { Metadata } from 'next';

import { getCart, retrieveOrder } from '@/lib/server';
import { Cart, LineItem, Order } from '@medusajs/medusa';
import { enrichLineItems } from '@modules/cart/actions';
import OrderCompletedTemplate from '@modules/order/templates/order-completed-template';
import { notFound } from 'next/navigation';

type Props = {
    params: { id: string };
    searchParams: { [key: string]: string | string[] | undefined };
};

async function getOrder(id: string) {
    const order = await retrieveOrder(id);

    if (!order) {
        console.log('order', id, ' not found');
        return notFound();
    }

    // console.log(`ORDERS ${JSON.stringify(order)}`);

    const enrichedItems = await enrichLineItems(order.items, order.region_id);

    return {
        order: {
            ...order,
            items: enrichedItems as LineItem[],
        } as Order,
    };
}

async function retrieveCart(id: string) {
    const cart = await getCart(id);

    if (!cart) {
        console.log('cart', id, ' not found');
        return notFound();
    }

    const enrichedItems = await enrichLineItems(cart.items, cart.region_id);

    return {
        cart: {
            ...cart,
            items: enrichedItems as LineItem[],
        } as Cart,
    };
}

export const metadata: Metadata = {
    title: 'Order Confirmed',
    description: 'You purchase was successful',
};

export default async function OrderConfirmedPage({
    params,
    searchParams,
}: Props) {
    const { order } = await getOrder(params.id);
    const cartId = searchParams['cart'];
    const { cart } = await retrieveCart(cartId?.toString() ?? '');

    return <OrderCompletedTemplate order={order} cart={cart} />;
}
