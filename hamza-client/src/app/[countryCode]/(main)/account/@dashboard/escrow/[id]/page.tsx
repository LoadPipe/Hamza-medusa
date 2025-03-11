import { Metadata } from 'next';
import { Flex } from '@chakra-ui/react';

import { Escrow } from '@/modules/order/templates/escrow';
import { headers } from 'next/headers';
import { getCustomerOrder, getHamzaCustomer } from '@/lib/server';
import { getRegion } from '@/app/actions';
import { notFound } from 'next/navigation';
import { getEscrowPayment } from '@/lib/util/order-escrow';
import { Order, PaymentDefinition } from '@/web3/contracts/escrow';

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
    const nextHeaders = headers();

    // const countryCode = process.env.NEXT_PUBLIC_FORCE_COUNTRY
    //     ? process.env.NEXT_PUBLIC_FORCE_COUNTRY
    //     : nextHeaders.get('next-url')?.split('/')[1] || '';

    // const region = await getRegion(countryCode);

    const customer: Customer | {} = await getHamzaCustomer();

    const order: Order | null =
        Object.keys(customer).length > 0
            ? await getCustomerOrder((customer as Customer).id, params.id)
            : null;

    if (!customer || !order) {
        notFound();
    }

    // TODO: move the customer / order check here, pass as props

    return (
        <>
            <Escrow id={params.id} customer={customer} order={order} />
        </>
    );
}
