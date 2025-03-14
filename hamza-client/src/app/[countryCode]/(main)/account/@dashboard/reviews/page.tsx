import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Error from '../../../../../error';
import { Text, Flex, Box } from '@chakra-ui/react';
import {
    getHamzaCustomer,
    listRegions,
    getVerificationStatus,
} from '@/lib/server';
import getQueryClient from '@/app/query-utils/getQueryClient';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getAllProductReviews, getNotReviewedOrders } from '@/lib/server';
import React from 'react';
import ReviewPage from '@/modules/account/components/reviews';

export const metadata: Metadata = {
    title: 'Reviews',
    description: 'View your Reviews',
};

export default async function Reviews() {
    const customer = await getHamzaCustomer();
    const regions = await listRegions();

    if (!customer || !regions) {
        notFound();
    }

    const queryClient = getQueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['pendingReviewsQuery'],
        queryFn: () => getNotReviewedOrders(customer.id),
    });

    await queryClient.prefetchQuery({
        queryKey: ['reviewQuery'],
        queryFn: () => getAllProductReviews(customer.id),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Flex
                maxW={{ md: '600px', lg: '927px' }}
                width="100%"
                backgroundColor={'#121212'}
                flexDirection={'column'}
                color="white"
                p={'24px'}
                rounded="lg"
            >
                <ReviewPage customer={customer} />
            </Flex>
        </HydrationBoundary>
    );
}
