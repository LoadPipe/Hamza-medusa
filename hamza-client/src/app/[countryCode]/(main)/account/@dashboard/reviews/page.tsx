import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Text, Box } from '@chakra-ui/react';
import { getHamzaCustomer, listRegions } from '@lib/data';
import ReviewPage from 'modules/account/components/reviews';

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
        <Box>
            <Box dir={'col'} mb={'8'} gap={'4'}>
                <Text
                    mb={'4'}
                    className="text-2xl-semi"
                    color={'primary.indigo.900'}
                >
                    My Reviews
                </Text>
                <ReviewPage customer={customer} />
            </Box>
        </Box>
    );
}
