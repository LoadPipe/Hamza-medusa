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
        <Box
            maxW={'927px'}
            width="100%"
            backgroundColor={'#121212'}
            flexDirection={'column'}
            color="white"
            rounded={'lg'}
            justifyContent="center"
            alignItems="center"
        >
            <Box display="flex" flexDirection="column">
                <OrderOverview customer={customer} ordersExist={ordersExist} />
            </Box>
        </Box>
    );
}
