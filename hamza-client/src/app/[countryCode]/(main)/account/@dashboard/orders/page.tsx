import { Metadata } from 'next';

import OrderOverview from '@modules/account/components/order-overview';
import { listCustomerOrders } from '@lib/data';
import { notFound } from 'next/navigation';
import { Box, Text } from '@chakra-ui/react';
export const metadata: Metadata = {
    title: 'Orders',
    description: 'Overview of your previous orders.',
};

export default async function Orders() {
    const orders = await listCustomerOrders();

    if (!orders) {
        notFound();
    }
    // 121212
    return (
        <Box width="full" bg="#121212" color="white">
            <Box display="flex" flexDirection="column">
                {/*<Text fontWeight={'bold'} fontSize="lg">*/}
                {/*    Orders*/}
                {/*</Text>*/}
                {/*<p className="text-base-regular">*/}
                {/*    View your previous orders and their status. You can also*/}
                {/*    create returns or exchanges for your orders if needed.*/}
                {/*</p>*/}
                <OrderOverview orders={orders} />
            </Box>
        </Box>
    );
}
