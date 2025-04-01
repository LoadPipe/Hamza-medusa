import PaymentStatus from '@/modules/order-processing';
import { getPaymentData, retrieveOrder } from '@/lib/server';
import { enrichLineItems } from '@/modules/cart/actions';
import { Container } from '@chakra-ui/react';
import {
    LineItem as MedusaLineItem,
    Order as MedusaOrder,
    Store as MedusaStore,
} from '@medusajs/medusa';
import { notFound } from 'next/navigation';

type Props = {
    params: { id: string };
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

interface BlockchainData {
    chain_id: number;
    escrow_address: string;
    payer_address: string;
    receiver_address: string;
    transaction_id: string;
}

interface Payment {
    id: string;
    amount: number;
    amount_refunded: number;
    blockchain_data: BlockchainData;
    canceled_at: string;
    captured_at: string;
    currency_code: 'eth' | 'usdc' | 'usdt';
    idempotency_key: string;
    metadata: Record<string, string>;
    order_id: string;
    provider_id: string;
    swap_id: string;
    updated_at: string;
    status:
        | 'waiting'
        | 'initiated'
        | 'pending'
        | 'received'
        | 'in_escrow'
        | 'complete';
    expiresInSeconds: number;
    paymentAddress: string;
    totalAmount: number;
}

interface Store extends MedusaStore {
    icon: string;
}

export interface LineItem extends MedusaLineItem {
    thumbnail: string;
    currency_code: string;
    total: number;
}

interface orderDetail extends MedusaOrder {
    items: LineItem[];
}

interface Order extends MedusaOrder {
    store: Store;
    payments: Payment[];
    detail: orderDetail;
}

export interface PaymentsDataProps {
    status:
        | 'created'
        | 'waiting'
        | 'partial'
        | 'received'
        | 'in_escrow'
        | 'expired';
    totalAmount: number;
    paymentAddress: string;
    expiresInSeconds: number; // ms
    startTimestamp: number; // ms
    endTimestamp: number; // ms
    orders: Order[];
}

const buildPaymentsData = async (cartId: string) => {
    const paymentsData = await getPaymentData(cartId);

    const startTimestamp =
        paymentsData[0].startTimestamp > 0
            ? paymentsData[0].startTimestamp
            : new Date(paymentsData[0].orders[0].created_at).getTime();

    const endTimestamp =
        paymentsData[0].startTimestamp > 0
            ? paymentsData[0].startTimestamp
            : Date.now() + Number(paymentsData[0].expiresInSeconds) * 1000;

    await Promise.all(
        paymentsData.map(async (paymentData: PaymentsDataProps) => {
            await Promise.all(
                paymentData.orders.map(async (order: Order) => {
                    const enrichedOrder = await getOrder(order.id);
                    order.items = enrichedOrder.order.items;
                    order.detail = enrichedOrder.order;
                })
            );
        })
    );

    return { paymentsData, startTimestamp, endTimestamp };
};

export default async function ProcessingPage({ params }: Props) {
    const cartId = params.id;

    const { paymentsData, startTimestamp, endTimestamp } =
        await buildPaymentsData(cartId);

    return (
        <Container maxW="container.lg" py={8}>
            <PaymentStatus
                startTimestamp={startTimestamp}
                endTimestamp={endTimestamp}
                paymentsData={paymentsData}
                cartId={cartId}
            />
        </Container>
    );
}
