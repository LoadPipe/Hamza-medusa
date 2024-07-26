import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Review from '@modules/account/components/reviews';
import { Text } from '@chakra-ui/react';
import { getCustomer } from '@lib/data';

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
    const customer = await getCustomer();
    const region = await getRegion(countryCode);

    if (!customer || !region) {
        notFound();
    }

    return (
        <div className="w-full bg-black text-white p-8">
            <div className="mb-8 flex flex-col gap-y-4">
                <Text className="text-2xl-semi" color={'primary.indigo.900'}>
                    My Reviews
                </Text>
            </div>
            <Review customer={customer} region={region} />
        </div>
    );
}
