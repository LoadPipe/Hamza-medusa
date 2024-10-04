import {
    getHamzaCustomer,
    getRegion,
    listRegions,
    updateCustomer,
} from '@lib/data';
import { notFound } from 'next/navigation';
import { Flex, Button, Text, Box } from '@chakra-ui/react';
import { Metadata } from 'next';
import VerifyEmail from '@modules/account/components/verify';
import AccountWishList from '@modules/account/components/wishlist';
import { headers } from 'next/headers';

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

    const nextHeaders = headers();
    const countryCode = process.env.NEXT_PUBLIC_FORCE_COUNTRY
        ? process.env.NEXT_PUBLIC_FORCE_COUNTRY
        : nextHeaders.get('next-url')?.split('/')[1] || '';

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

            <AccountWishList countryCode={countryCode} />
        </Flex>
    );
}
