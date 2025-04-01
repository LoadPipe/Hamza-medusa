import { Metadata } from 'next';
import {
    QueryClient,
    dehydrate,
    HydrationBoundary,
} from '@tanstack/react-query';

import { Escrow } from '@/modules/order/templates/escrow';
import { getCustomerOrder, getHamzaCustomer } from '@/lib/server';
import { notFound } from 'next/navigation';
import { Order } from '@/web3/contracts/escrow';

type Props = {
    params: { id: string };
};

export interface Customer {
    id: string;
    // ... other properties
}

export const metadata: Metadata = {
    title: 'Order Escrow',
    description: 'View your Order Escrow',
};

export default async function EscrowPage({ params }: Props) {
    const customer: Customer | {} = await getHamzaCustomer();

    if (!customer || !('id' in customer)) {
        notFound();
    }

    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey: ['customer', params.id],
        queryFn: () => getHamzaCustomer(),
        staleTime: 30000,
    });

    await queryClient.prefetchQuery({
        queryKey: ['order', params.id],
        queryFn: () => getCustomerOrder(customer.id, params.id),
        staleTime: 30000,
    });

    const order: Order | null = await getCustomerOrder(customer.id, params.id);

    if (!order) {
        notFound();
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Escrow id={params.id} customer={customer} order={order} />
        </HydrationBoundary>
    );
}
