import PaymentStatus from '@/modules/order-processing';
import { Container } from '@chakra-ui/react';
import {
    LineItem as MedusaLineItem,
    Order as MedusaOrder,
    Store as MedusaStore,
} from '@medusajs/medusa';
import { Metadata } from 'next';
import { buildPaymentsData } from '@/modules/order-processing/utils';
import { QueryClient } from '@tanstack/react-query';

export const metadata: Metadata = {
    title: 'Order Processing',
    description: 'You purchase is being processed',
};

type Props = {
    params: { id: string };
};

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

export interface Order extends MedusaOrder {
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

export default async function ProcessingPage({ params }: Props) {
    const cartId = params.id;

    const paymentsData = await buildPaymentsData(cartId);

    return (
        <Container maxW="container.lg" py={8}>
            <PaymentStatus
                startTimestamp={paymentsData.startTimestamp}
                endTimestamp={paymentsData.endTimestamp}
                paymentsData={paymentsData.paymentsData}
                cartId={cartId}
            />
        </Container>
    );
}
