import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Error from '../../../../../error';
import { Text, Box, Flex } from '@chakra-ui/react';
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

// TODO - Lets call the getServerSideAuth check here and if that fails after the if (!customer || !regions)
// we can redirect to the AuthRequired Error
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
            borderRadius={'12px'}
            p={'1.5rem'}
        >
            <Text
                mb={'4'}
                className="text-2xl-semi"
                color={'primary.indigo.900'}
            >
                My Reviews
            </Text>
            <ReviewPage customer={customer} />
        </Flex>
    );
}
