import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AddressBook from '@modules/account/components/address-book';
import { getHamzaCustomer } from '@lib/data';
import { getRegion } from '@/app/actions';
import { headers } from 'next/headers';

import { Flex, Text, Box } from '@chakra-ui/react';

export const metadata: Metadata = {
    title: 'Addresses',
    description: 'View your addresses',
};

export default async function Addresses() {
    const nextHeaders = headers();
    const countryCode = process.env.NEXT_PUBLIC_FORCE_COUNTRY
        ? process.env.NEXT_PUBLIC_FORCE_COUNTRY
        : nextHeaders.get('next-url')?.split('/')[1] || '';
    const customer = await getHamzaCustomer();
    const region = await getRegion(countryCode);

    if (!customer || !region) {
        notFound();
    }

    return (
        <div
            className="w-full bg-[#121212] text-white p-8"
            style={{ borderRadius: '16px' }}
        >
            <div className="mb-8 flex flex-col gap-y-4">
                <Text color={'primary.indigo.900'} className="text-2xl-semi">
                    Shipping Addresses
                </Text>
                <p style={{ color: '#555555' }} className="text-base-regular">
                    View and update your shipping addresses, you can add as many
                    as you like. Saving your addresses will make them available
                    during checkout.
                </p>
            </div>
            <AddressBook customer={customer} region={region} />
        </div>
    );
}
