import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Error from '../../../../../error';
import { Text, Flex } from '@chakra-ui/react';
import {
    getHamzaCustomer,
    listRegions,
    getVerificationStatus,
} from '@lib/data';
import ReviewPage from 'modules/account/components/reviews';
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

    return (
        <Flex
            maxW={'927px'}
            width="100%"
            backgroundColor={'#121212'}
            flexDirection={'column'}
            rounded={'lg'}
        >
            <ReviewPage customer={customer} />
        </Flex>
    );
}
