import { Metadata } from 'next';

import OrderOverview from '@modules/account/components/order-overview';
import { getHamzaCustomer, getOrderBucket } from '@lib/data';
import { notFound } from 'next/navigation';
import { Box } from '@chakra-ui/react';
export const metadata: Metadata = {
    title: 'Orders',
    description: 'Overview of your previous orders.',
};

export default async function Orders() {
    const customer = await getHamzaCustomer();
    const ordersExist = await getOrderBucket(customer.id, true);

    if (!customer) {
        notFound();
    }
    return (
        <Box width="full" bg="#121212" color="white" rounded={'lg'}>
            <Box display="flex" flexDirection="column">
                <OrderOverview customer={customer} ordersExist={ordersExist} />
            </Box>
        </Box>
    );
}
