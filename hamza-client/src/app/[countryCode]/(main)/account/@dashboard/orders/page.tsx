import { Metadata } from 'next';
import OrderOverview from '@modules/account/components/order-overview';
import { getHamzaCustomer, getOrderBucket } from '@/lib/server';
import { notFound } from 'next/navigation';
import { Flex } from '@chakra-ui/react';
import getQueryClient from '@/app/query-utils/getQueryClient';
import { dehydrate } from '@tanstack/react-query';

export const metadata: Metadata = {
    title: 'Orders',
    description: 'Overview of your previous orders.',
};

export default async function Orders() {
    const customer = await getHamzaCustomer();

    const queryClient = getQueryClient();
    await queryClient.prefetchQuery({
        queryKey: ['batchOrders'],
        queryFn: () => {
            return getOrderBucket(customer.id);
        },
    });

    const dehydratedOrders = dehydrate(queryClient);

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
            p={'1.5rem'}
            rounded="lg"
        >
            <OrderOverview
                customer={customer}
                dehydratedState={dehydratedOrders}
            />
        </Flex>
    );
}
