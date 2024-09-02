import { getHamzaCustomer, listRegions, updateCustomer } from '@lib/data';
import { notFound } from 'next/navigation';
import { Flex, Button, Text, Box } from '@chakra-ui/react';
import { Metadata } from 'next';
import VerifyEmail from '@modules/account/components/verify';
import AccountWishList from '@modules/account/components/wishlist';

export const metadata: Metadata = {
    title: 'Wishlist',
    description: 'View and edit your Medusa Store profile.',
};

export default async function Wishlist() {
    const customer = await getHamzaCustomer();
    const regions = await listRegions();

    if (!customer || !regions) {
        notFound();
    } else {
        console.log(customer);
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
            {/* Profile Form */}

            <AccountWishList />
        </Flex>
    );
}
