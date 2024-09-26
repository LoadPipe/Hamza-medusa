import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Error from '../../../../../error';
import { Text, Box } from '@chakra-ui/react';
import {
    getHamzaCustomer,
    listRegions,
    getVerificationStatus,
} from '@lib/data';
import ReviewPage from 'modules/account/components/reviews';

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
