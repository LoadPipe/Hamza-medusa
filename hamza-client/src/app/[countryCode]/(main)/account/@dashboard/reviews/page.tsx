import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Text, Box, Flex } from '@chakra-ui/react';
import { getHamzaCustomer, listRegions } from '@lib/data';
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
