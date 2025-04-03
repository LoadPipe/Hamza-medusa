import { Metadata } from 'next';
import { Container } from '@chakra-ui/react';
import { getCartCompletedOrders } from '@/lib/server';
import { notFound } from 'next/navigation';
import OrderConfirmed from '@/modules/order-confirmed';

type Props = {
    params: { id: string };
    searchParams: { [key: string]: string | string[] | undefined };
};

export const metadata: Metadata = {
    title: 'Order Confirmed',
    description: 'Your purchase was successful',
};

export default async function OrderConfirmedPage({
    params,
    searchParams,
}: Props) {
    const cartId = searchParams['cart'];
    if (!cartId) {
        return notFound();
    }

    const orders = await getCartCompletedOrders(cartId?.toString() ?? '');
    if (!orders || orders.length === 0) {
        return notFound();
    }

    return (
        <Container maxW="1280px" py={8}>
            <OrderConfirmed orders={orders} params={params} />
        </Container>
    );
}
