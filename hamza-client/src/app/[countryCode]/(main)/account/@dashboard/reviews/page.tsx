import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Review from '@modules/account/components/reviews';
import { Text, Box } from '@chakra-ui/react';
import { getHamzaCustomer } from '@lib/data';

import { getRegion } from 'app/actions';
import { headers } from 'next/headers';

export const metadata: Metadata = {
    title: 'Reviews',
    description: 'View your Reviews',
};

export default async function Reviews() {
    const nextHeaders = headers();
    const countryCode = process.env.NEXT_PUBLIC_FORCE_US_COUNTRY
        ? 'us'
        : nextHeaders.get('next-url')?.split('/')[1] || '';
    const customer = await getHamzaCustomer();
    const region = await getRegion(countryCode);

    if (!customer || !region) {
        notFound();
    }

    return (
        <Box>
            <Box dir={'col'} mb={'8'} gap={'4'}>
                <Text
                    mb={'4'}
                    className="text-2xl-semi"
                    color={'primary.indigo.900'}
                >
                    My Reviews
                </Text>
                <Review customer={customer} region={region} />
            </Box>
        </Box>
    );
}
