import { Metadata } from 'next';

import OrderOverview from '@modules/account/components/order-overview';
import { getHamzaCustomer, getOrderBucket } from '@lib/data';
import { notFound } from 'next/navigation';
import { Box, Flex } from '@chakra-ui/react';
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
        <Flex
            maxW={'927px'}
            width="100%"
            backgroundColor={'#121212'}
            flexDirection={'column'}
            color="white"
            p={6}
        >
            <OrderOverview customer={customer} ordersExist={ordersExist} />
        </Flex>
    );
}
