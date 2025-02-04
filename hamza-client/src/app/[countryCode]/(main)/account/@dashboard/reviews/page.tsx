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
import { dehydrate } from '@tanstack/react-query';
import ReviewTemplate from '@modules/account/components/reviews/reviews-template';
import { getAllProductReviews, getNotReviewedOrders } from '@/lib/server';
import React from 'react';

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

    // if customer is found, check if the customer is verified
    const verificationStatus = await getVerificationStatus(customer.id);
    if (!verificationStatus.data) {
        return <Error error={'Verify your email to access this page.'} />;
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

    const dehydrateReviews = dehydrate(queryClient);

    return (
        <Flex
            maxW={{ md: '600px', lg: '927px' }}
            width="100%"
            backgroundColor={'#121212'}
            flexDirection={'column'}
            color="white"
            p={'24px'}
            rounded="lg"
        >
            <ReviewTemplate
                customer={customer}
                dehydratedState={dehydrateReviews}
            />
        </Flex>
    );
}
